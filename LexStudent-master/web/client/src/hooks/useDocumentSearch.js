import { useState, useCallback, useRef, useEffect } from 'react'

export default function useDocumentSearch({ pdfWrapperRef, docxContainerRef, pptxContainerRef, fileType, currentPage }) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [matches, setMatches] = useState([])
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1)
  const marksRef = useRef([])

  const getContainer = useCallback(() => {
    if (fileType?.includes('pdf') || fileType === 'pdf') return pdfWrapperRef?.current
    if (fileType?.includes('docx') || fileType?.includes('doc')) return docxContainerRef?.current
    if (fileType?.includes('pptx')) return pptxContainerRef?.current
    return null
  }, [fileType, pdfWrapperRef, docxContainerRef, pptxContainerRef])

  const clearHighlights = useCallback(() => {
    for (const mark of marksRef.current) {
      const parent = mark.parentNode
      if (parent) {
        const text = document.createTextNode(mark.textContent)
        parent.replaceChild(text, mark)
        parent.normalize()
      }
    }
    marksRef.current = []
    setMatches([])
    setCurrentMatchIndex(-1)
  }, [])

  const applySearch = useCallback((searchQuery) => {
    clearHighlights()
    if (!searchQuery || searchQuery.length < 2) return

    const container = getContainer()
    if (!container) return

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

    marksRef.current = newMarks
    setMatches(newMarks)
    if (newMarks.length > 0) {
      setCurrentMatchIndex(0)
      newMarks[0].classList.add('search-match-current')
      newMarks[0].scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [getContainer, clearHighlights])

  const goNext = useCallback(() => {
    if (matches.length === 0) return
    const prev = matches[currentMatchIndex]
    if (prev) prev.classList.remove('search-match-current')
    const next = (currentMatchIndex + 1) % matches.length
    setCurrentMatchIndex(next)
    matches[next].classList.add('search-match-current')
    matches[next].scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [matches, currentMatchIndex])

  const goPrev = useCallback(() => {
    if (matches.length === 0) return
    const prev = matches[currentMatchIndex]
    if (prev) prev.classList.remove('search-match-current')
    const next = (currentMatchIndex - 1 + matches.length) % matches.length
    setCurrentMatchIndex(next)
    matches[next].classList.add('search-match-current')
    matches[next].scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [matches, currentMatchIndex])

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => {
    setIsOpen(false)
    setQuery('')
    clearHighlights()
  }, [clearHighlights])

  const reapplySearch = useCallback(() => {
    if (isOpen && query.length >= 2) {
      setTimeout(() => applySearch(query), 100)
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

  return {
    isOpen,
    query,
    setQuery,
    matches,
    currentMatchIndex,
    totalMatches: matches.length,
    open,
    close,
    goNext,
    goPrev,
    reapplySearch,
  }
}
