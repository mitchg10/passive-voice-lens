/**
 * Rule: claims attributed to nobody in particular ("studies have shown").
 * Same question the passive rules ask -- who? -- applied to citation rather
 * than to grammar.
 */

const AUTHORITY_RULE = Object.freeze({
  id: 'unattributed-claim',
  label: 'Unattributed claim',
  analyze: analyzeUnattributedClaims
})

function analyzeUnattributedClaims (sentence, tokens) {
  return findPhrases(sentence, tokens, AUTHORITY_PHRASES).map(function (match) {
    return {
      start: match.start,
      end: match.end,
      phrase: match.phrase,
      sentence: sentence.text,
      question: '“' + match.phrase + '” — which ones? A citation or a named ' +
        'author makes the claim checkable; without one it reads as hearsay.'
    }
  })
}
