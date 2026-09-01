/**
 * Rule: fixed padding phrases with known replacements ("due to", "in order
 * to", "the ability to"), plus redundant pairs ("past history").
 */

const PHRASE_RULE = Object.freeze({
  id: 'padding-phrase',
  label: 'Wordy phrase',
  analyze: analyzePaddingPhrases
})

function analyzePaddingPhrases (sentence, tokens) {
  return findPhrases(sentence, tokens, paddingPhrases()).map(function (match) {
    return {
      start: match.start,
      end: match.end,
      phrase: match.phrase,
      sentence: sentence.text,
      question: '“' + match.phrase + '” — try: ' + match.entry.suggestion + '.'
    }
  })
}
