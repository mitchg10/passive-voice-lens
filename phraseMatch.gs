/**
 * Shared multi-word phrase matching. Used by any rule whose detection is a
 * fixed list of phrases rather than a grammatical pattern.
 */

/**
 * Find every listed phrase in a sentence, longest first so that nested
 * phrases do not both fire.
 * @param {{text: string, start: number}} sentence
 * @param {Array<Object>} tokens
 * @param {Array<{phrase: string}>} entries
 * @returns {Array<{start: number, end: number, phrase: string, entry: Object}>}
 */
function findPhrases (sentence, tokens, entries) {
  const consumed = {}
  const matches = []

  byDescendingLength(entries).forEach(function (entry) {
    const words = entry.phrase.split(' ')
    for (let i = 0; i + words.length <= tokens.length; i += 1) {
      if (!matchesAt(tokens, i, words)) continue
      if (anyConsumed(consumed, i, words.length)) continue

      markConsumed(consumed, i, words.length)
      const first = tokens[i]
      const last = tokens[i + words.length - 1]
      matches.push({
        start: first.start,
        end: last.end,
        phrase: sliceSentence(sentence, first.start, last.end),
        entry: entry
      })
    }
  })

  return matches.sort(function (a, b) { return a.start - b.start })
}

function byDescendingLength (entries) {
  return entries.slice().sort(function (a, b) {
    return b.phrase.split(' ').length - a.phrase.split(' ').length
  })
}

function matchesAt (tokens, index, words) {
  return words.every(function (word, offset) {
    return tokens[index + offset].lower === word
  })
}

function anyConsumed (consumed, index, length) {
  for (let k = index; k < index + length; k += 1) {
    if (consumed[k]) return true
  }
  return false
}

function markConsumed (consumed, index, length) {
  for (let k = index; k < index + length; k += 1) consumed[k] = true
}
