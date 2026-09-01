/**
 * Rule: fixed padding phrases with known replacements ("due to", "in order
 * to", "the ability to"). Longest phrases match first so that
 * "has the ability to" wins over the "the ability to" inside it.
 */

const PHRASE_RULE = Object.freeze({
  id: 'padding-phrase',
  label: 'Wordy phrase',
  analyze: analyzePaddingPhrases
})

function analyzePaddingPhrases (sentence, tokens) {
  const consumed = {}
  const findings = []

  orderedPhrases().forEach(function (entry) {
    const words = entry.phrase.split(' ')
    for (let i = 0; i + words.length <= tokens.length; i += 1) {
      if (!matchesAt(tokens, i, words)) continue
      if (anyConsumed(consumed, i, words.length)) continue

      markConsumed(consumed, i, words.length)
      findings.push(buildPhraseFinding(sentence, tokens, i, words.length, entry))
    }
  })

  return findings.sort(function (a, b) { return a.start - b.start })
}

/** Longest phrase first, so nested matches do not both fire. */
function orderedPhrases () {
  return PADDING_PHRASES.slice().sort(function (a, b) {
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

function buildPhraseFinding (sentence, tokens, index, length, entry) {
  const first = tokens[index]
  const last = tokens[index + length - 1]
  const phrase = sliceSentence(sentence, first.start, last.end)

  return {
    start: first.start,
    end: last.end,
    phrase: phrase,
    sentence: sentence.text,
    question: '“' + phrase + '” — try: ' + entry.suggestion + '.'
  }
}
