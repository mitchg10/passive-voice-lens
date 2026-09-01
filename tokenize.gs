/**
 * Offset-preserving tokenization. Every token and sentence carries its
 * absolute index into the source string so findings map back to document
 * ranges for Document.setSelection().
 */

const ABBREVIATIONS = Object.freeze([
  'e.g.', 'i.e.', 'et al.', 'cf.', 'vs.', 'etc.', 'Fig.', 'Eq.', 'No.',
  'Dr.', 'Mr.', 'Mrs.', 'Ms.', 'Prof.', 'St.', 'Jr.', 'Sr.', 'approx.'
])

/**
 * Split text into sentences, preserving absolute offsets.
 * @param {string} text
 * @returns {Array<{text: string, start: number, end: number}>}
 */
function splitSentences (text) {
  if (typeof text !== 'string' || text.length === 0) return []

  const boundary = /[.!?]["')\]]?(?=\s)/g
  const sentences = []
  let cursor = 0
  let match

  while ((match = boundary.exec(text)) !== null) {
    const end = match.index + match[0].length
    const candidate = text.slice(cursor, end)
    if (endsWithAbbreviation(candidate)) continue

    sentences.push(makeSentence(text, cursor, end))
    cursor = skipWhitespace(text, end)
    boundary.lastIndex = cursor
  }

  if (cursor < text.length) {
    sentences.push(makeSentence(text, cursor, text.length))
  }
  return sentences.filter(function (s) { return s.text.length > 0 })
}

function makeSentence (text, start, end) {
  const raw = text.slice(start, end)
  const leadingTrim = raw.length - raw.replace(/^\s+/, '').length
  return Object.freeze({
    text: raw.trim(),
    start: start + leadingTrim,
    end: start + leadingTrim + raw.trim().length
  })
}

function endsWithAbbreviation (candidate) {
  const tail = candidate.slice(-10).toLowerCase()
  return ABBREVIATIONS.some(function (abbr) {
    return tail.endsWith(abbr.toLowerCase())
  })
}

function skipWhitespace (text, index) {
  let i = index
  while (i < text.length && /\s/.test(text[i])) i += 1
  return i
}

/**
 * Word tokens within a sentence, with offsets absolute to the source string.
 * @param {{text: string, start: number}} sentence
 * @returns {Array<{word: string, lower: string, start: number, end: number}>}
 */
function tokenizeWords (sentence) {
  const pattern = /[A-Za-z][A-Za-z'’-]*/g
  const tokens = []
  let match
  let previousEnd = 0

  while ((match = pattern.exec(sentence.text)) !== null) {
    const gap = sentence.text.slice(previousEnd, match.index)
    tokens.push(Object.freeze({
      word: match[0],
      lower: match[0].toLowerCase().replace(/’/g, "'"),
      start: sentence.start + match.index,
      end: sentence.start + match.index + match[0].length,
      // Punctuation before this token ends any noun phrase spanning it.
      breaksPhrase: /[^\s]/.test(gap)
    }))
    previousEnd = match.index + match[0].length
  }
  return tokens
}

/**
 * Text between two absolute offsets, relative to a sentence's own start.
 * @param {{text: string, start: number}} sentence
 * @param {number} absoluteStart
 * @param {number} absoluteEnd
 * @returns {string}
 */
function sliceSentence (sentence, absoluteStart, absoluteEnd) {
  return sentence.text.slice(
    absoluteStart - sentence.start,
    absoluteEnd - sentence.start
  )
}
