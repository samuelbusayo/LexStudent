const SENTENCE_ENDINGS = /[.!?]\s/g

export function chunkText(pages, { chunkSize = 500, overlap = 100 } = {}) {
  const pageOffsets = []
  let fullText = ''
  for (const page of pages) {
    pageOffsets.push({ pageNumber: page.pageNumber, start: fullText.length })
    fullText += page.text + '\n'
  }

  if (fullText.trim().length === 0) return []

  const chunks = []
  let pos = 0
  let chunkIndex = 0

  while (pos < fullText.length) {
    let end = Math.min(pos + chunkSize, fullText.length)

    if (end < fullText.length) {
      let bestBreak = -1
      for (let i = end; i > end - 80 && i > pos; i--) {
        if (fullText[i] === '.' || fullText[i] === '!' || fullText[i] === '?') {
          if (i + 1 < fullText.length && /\s/.test(fullText[i + 1])) {
            bestBreak = i + 1
            break
          }
        }
      }
      if (bestBreak === -1) {
        for (let i = end; i > end - 50 && i > pos; i--) {
          if (/\s/.test(fullText[i])) {
            bestBreak = i
            break
          }
        }
      }
      if (bestBreak > pos) end = bestBreak
    }

    const content = fullText.slice(pos, end).trim()
    if (content.length > 0) {
      const pageNumber = resolvePageNumber(pos, pageOffsets)
      chunks.push({
        content,
        pageNumber,
        startChar: pos,
        endChar: end,
        chunkIndex,
      })
      chunkIndex++
    }

    const advance = end - overlap
    if (advance <= pos) {
      pos = end
    } else {
      pos = advance
    }
  }

  return chunks
}

function resolvePageNumber(charPos, pageOffsets) {
  let page = pageOffsets[0]?.pageNumber || 1
  for (const po of pageOffsets) {
    if (po.start <= charPos) page = po.pageNumber
    else break
  }
  return page
}
