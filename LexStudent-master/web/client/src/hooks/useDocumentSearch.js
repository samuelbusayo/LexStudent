import { useState, useCallback, useRef, useEffect } from 'react'

export default function useDocumentSearch({ pdfWrapperRef, docxContainerRef, pptxContainerRef, fileType, currentPage }) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [matchRects, setMatchRects] = useState([])
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1)
  const highlightLayerRef = useRef(null)

  const isPdf = fileType?.includes('pdf') || fileType === 'pdf'

  const getContainer = useCallback(() => {
    if (isPdf) return pdfWrapperRef?.current
    if (fileType?.includes('docx') || fileType?.includes('doc')) return docxContainerRef?.current
    if (fileType?.includes('pptx')) return pptxContainerRef?.current
    return null
  }, [fileType, isPdf, pdfWrapperRef, docxContainerRef, pptxContainerRef])

  // Ensure a highlight layer exists between the canvas and text layer (PDF only)
  const ensureHighlightLayer = useCallback(() => {
    const wrapper = pdfWrapperRef?.current
    if (!wrapper || !isPdf) return null

    let layer = highlightLayerRef.current
    if (layer && layer.parentNode === wrapper) return layer

    layer = document.createElement('div')
    layer.className = 'search-highlight-layer'
    // Insert before the textLayer so highlights sit between canvas and text
    const textLayer = wrapper.querySelector('.textLayer')
    if (textLayer) {
      wrapper.insertBefore(layer, textLayer)
    } else {
      wrapper.appendChild(layer)
    }
    highlightLayerRef.current = layer
    return layer
  }, [pdfWrapperRef, isPdf])

  const clearHighlights = useCallback(() => {
    // PDF: remove highlight rectangles
    if (highlightLayerRef.current) {
      highlightLayerRef.current.innerHTML = ''
    }
    // DOCX/PPTX: remove mark wrappers
    const container = getContainer()
    if (container && !isPdf) {
      const marks = container.querySelectorAll('mark.search-match')
      for (const mark of marks) {
        const parent = mark.parentNode
        if (parent) {
          const text = document.createTextNode(mark.textContent)
          parent.replaceChild(text, mark)
          parent.normalize()
        }
      }
    }
    setMatchRects([])
    setCurrentMatchIndex(-1)
  }, [getContainer, isPdf])

  const applySearch = useCallback((searchQuery) => {
    clearHighlights()
    if (!searchQuery || searchQuery.length < 2) return

    const container = getContainer()
    if (!container) return

    if (isPdf) {
      applyPdfSearch(searchQuery, container)
    } else {
      applyDomSearch(searchQuery, container)
    }
  }, [getContainer, clearHighlights, isPdf])

  // PDF search: find matches in textLayer spans, then create positioned highlight rects
  const applyPdfSearch = useCallback((searchQuery, wrapper) => {
    const highlightLayer = ensureHighlightLayer()
    if (!highlightLayer) return

    const textLayer = wrapper.querySelector('.textLayer')
    if (!textLayer) return

    const spans = textLayer.querySelectorAll('span')
    const lowerQuery = searchQuery.toLowerCase()
    const allRects = []

    for (const span of spans) {
      const text = span.textContent
      const lowerText = text.toLowerCase()
      let searchFrom = 0

      while (true) {
        const idx = lowerText.indexOf(lowerQuery, searchFrom)
        if (idx === -1) break

        // Use Range API to get the exact bounding rect of the matched substring
        const textNode = span.firstChild
        if (!textNode || textNode.nodeType !== Node.TEXT_NODE) {
          searchFrom = idx + 1
          continue
        }

        try {
          const range = document.createRange()
          range.setStart(textNode, idx)
          range.setEnd(textNode, Math.min(idx + searchQuery.length, text.length))
          const rect = range.getBoundingClientRect()
          const wrapperRect = wrapper.getBoundingClientRect()

          // Position relative to the wrapper
          const highlightDiv = document.createElement('div')
          highlightDiv.className = 'search-highlight-rect'
          highlightDiv.style.position = 'absolute'
          highlightDiv.style.left = `${rect.left - wrapperRect.left}px`
          highlightDiv.style.top = `${rect.top - wrapperRect.top}px`
          highlightDiv.style.width = `${rect.width}px`
          highlightDiv.style.height = `${rect.height}px`
          highlightDiv.style.pointerEvents = 'none'

          highlightLayer.appendChild(highlightDiv)
          allRects.push(highlightDiv)

          range.detach()
        } catch (e) {
          // Range error — skip this match
        }

        searchFrom = idx + 1
      }
    }

    setMatchRects(allRects)
    if (allRects.length > 0) {
      setCurrentMatchIndex(0)
      allRects[0].classList.add('search-highlight-current')
      allRects[0].scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [ensureHighlightLayer])

  // DOCX/PPTX search: wrap matches in <mark> elements (unchanged approach)
  const applyDomSearch = useCallback((searchQuery, container) => {
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        if (node.parentElement?.closest('.search-match')) return NodeFilter.FILTER_REJECT
        if (node.parentElement?.tagName === 'STYLE' || node.parentElement?.tagName === 'SCRIPT') return NodeFilter.FILTER_REJECT
        return NodeFilter.FILTER_ACCEPT
      }
    })

    const textNodes = []
    let node
    while ((node = walker.nextNode())) {
      textNodes.push(node)
    }

    const newMarks = []
    const lowerQuery = searchQuery.toLowerCase()

    for (const textNode of textNodes) {
      const text = textNode.textContent
      const lowerText = text.toLowerCase()
      const indices = []
      let searchFrom = 0
      while (true) {
        const idx = lowerText.indexOf(lowerQuery, searchFrom)
        if (idx === -1) break
        indices.push(idx)
        searchFrom = idx + 1
      }

      if (indices.length === 0) continue

      const parent = textNode.parentNode
      const frag = document.createDocumentFragment()
      let lastEnd = 0

      for (const idx of indices) {
        if (idx > lastEnd) {
          frag.appendChild(document.createTextNode(text.slice(lastEnd, idx)))
        }
        const mark = document.createElement('mark')
        mark.className = 'search-match'
        mark.textContent = text.slice(idx, idx + searchQuery.length)
        frag.appendChild(mark)
        newMarks.push(mark)
        lastEnd = idx + searchQuery.length
      }

      if (lastEnd < text.length) {
        frag.appendChild(document.createTextNode(text.slice(lastEnd)))
      }

      parent.replaceChild(frag, textNode)
    }

    setMatchRects(newMarks)
    if (newMarks.length > 0) {
      setCurrentMatchIndex(0)
      newMarks[0].classList.add('search-match-current')
      newMarks[0].scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [])

  const goNext = useCallback(() => {
    if (matchRects.length === 0) return
    const prev = matchRects[currentMatchIndex]
    if (prev) prev.classList.remove(isPdf ? 'search-highlight-current' : 'search-match-current')
    const next = (currentMatchIndex + 1) % matchRects.length
    setCurrentMatchIndex(next)
    matchRects[next].classList.add(isPdf ? 'search-highlight-current' : 'search-match-current')
    matchRects[next].scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [matchRects, currentMatchIndex, isPdf])

  const goPrev = useCallback(() => {
    if (matchRects.length === 0) return
    const prev = matchRects[currentMatchIndex]
    if (prev) prev.classList.remove(isPdf ? 'search-highlight-current' : 'search-match-current')
    const next = (currentMatchIndex - 1 + matchRects.length) % matchRects.length
    setCurrentMatchIndex(next)
    matchRects[next].classList.add(isPdf ? 'search-highlight-current' : 'search-match-current')
    matchRects[next].scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [matchRects, currentMatchIndex, isPdf])

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => {
    setIsOpen(false)
    setQuery('')
    clearHighlights()
  }, [clearHighlights])

  const reapplySearch = useCallback(() => {
    if (isOpen && query.length >= 2) {
      // For PDF, the highlight layer is recreated on page render, so delay slightly
      setTimeout(() => applySearch(query), 150)
    }
  }, [isOpen, query, applySearch])

  useEffect(() => {
    if (isOpen && query.length >= 2) {
      const timer = setTimeout(() => applySearch(query), 200)
      return () => clearTimeout(timer)
    } else {
      clearHighlights()
    }
  }, [query])

  useEffect(() => {
    reapplySearch()
  }, [currentPage])

  // Cleanup highlight layer on unmount
  useEffect(() => {
    return () => {
      if (highlightLayerRef.current && highlightLayerRef.current.parentNode) {
        highlightLayerRef.current.parentNode.removeChild(highlightLayerRef.current)
      }
    }
  }, [])

  return {
    isOpen,
    query,
    setQuery,
    matchRects,
    currentMatchIndex,
    totalMatches: matchRects.length,
    open,
    close,
    goNext,
    goPrev,
    reapplySearch,
  }
}
