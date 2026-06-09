import fs from 'fs'
import path from 'path'

export async function extractText(filePath, mimeType) {
  const ext = (mimeType || path.extname(filePath)).toLowerCase().replace('.', '')

  if (ext === 'pdf' || ext.includes('pdf')) {
    return extractPdf(filePath)
  }
  if (ext === 'docx' || ext.includes('docx') || ext.includes('wordprocessingml')) {
    return extractDocx(filePath)
  }
  if (ext === 'doc' || ext.includes('msword')) {
    return extractDocx(filePath)
  }
  throw new Error(`Unsupported file type for text extraction: ${ext}`)
}

async function extractPdf(filePath) {
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs')
  const buffer = fs.readFileSync(filePath)
  const data = new Uint8Array(buffer)

  const doc = await pdfjsLib.getDocument({ data, verbosity: 0 }).promise
  const pages = []
  let fullText = ''

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i)
    const textContent = await page.getTextContent()
    const text = textContent.items.map(item => item.str).join(' ')
    pages.push({ pageNumber: i, text })
    fullText += text + '\n'
  }

  return { pages, fullText, totalPages: doc.numPages }
}

async function extractDocx(filePath) {
  const mammoth = (await import('mammoth')).default
  const buffer = fs.readFileSync(filePath)
  const result = await mammoth.extractRawText({ buffer })
  return {
    pages: [{ pageNumber: 1, text: result.value }],
    fullText: result.value,
    totalPages: 1,
  }
}
