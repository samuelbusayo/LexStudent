const STOP_WORDS = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','with','by',
  'from','is','was','are','were','be','been','being','have','has','had','do',
  'does','did','will','would','shall','should','may','might','can','could',
  'this','that','these','those','it','its','i','we','you','he','she','they',
  'me','us','him','her','them','my','our','your','his','their','not','no',
  'as','if','then','than','so','up','out','about','into','over','after',
])

export function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1 && !STOP_WORDS.has(t))
}

export function computeTermFrequencies(text) {
  const tokens = tokenize(text)
  const freq = {}
  for (const t of tokens) {
    freq[t] = (freq[t] || 0) + 1
  }
  return freq
}

export function bm25Search(queryText, chunks, { k1 = 1.5, b = 0.75 } = {}) {
  const queryTerms = tokenize(queryText)
  if (queryTerms.length === 0) return []

  const N = chunks.length
  const avgDl = chunks.reduce((sum, c) => {
    const tf = typeof c.termFrequencies === 'string'
      ? JSON.parse(c.termFrequencies) : (c.termFrequencies || {})
    return sum + Object.values(tf).reduce((a, b) => a + b, 0)
  }, 0) / Math.max(N, 1)

  const docFreq = {}
  for (const term of queryTerms) {
    docFreq[term] = 0
    for (const chunk of chunks) {
      const tf = typeof chunk.termFrequencies === 'string'
        ? JSON.parse(chunk.termFrequencies) : (chunk.termFrequencies || {})
      if (tf[term]) docFreq[term]++
    }
  }

  const scored = chunks.map(chunk => {
    const tf = typeof chunk.termFrequencies === 'string'
      ? JSON.parse(chunk.termFrequencies) : (chunk.termFrequencies || {})
    const dl = Object.values(tf).reduce((a, b) => a + b, 0)

    let score = 0
    for (const term of queryTerms) {
      const termFreq = tf[term] || 0
      if (termFreq === 0) continue

      const df = docFreq[term] || 0
      const idf = Math.log((N - df + 0.5) / (df + 0.5) + 1)
      const tfNorm = (termFreq * (k1 + 1)) / (termFreq + k1 * (1 - b + b * (dl / avgDl)))
      score += idf * tfNorm
    }

    return { ...chunk, bm25Score: score }
  })

  return scored.filter(s => s.bm25Score > 0).sort((a, b) => b.bm25Score - a.bm25Score)
}
