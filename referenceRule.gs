/**
 * Rule: a sentence opening with a bare "this" and going straight into a verb.
 * The reader has to guess which idea from the previous sentence is meant, and
 * often several would fit.
 */

const REFERENCE_RULE = Object.freeze({
  id: 'unclear-reference',
  label: 'Unclear reference',
  analyze: analyzeUnclearReferences
})

const BARE_DEMONSTRATIVES = Object.freeze(['this', 'these', 'that', 'those'])

function analyzeUnclearReferences (sentence, tokens) {
  if (tokens.length < 2) return []
  if (BARE_DEMONSTRATIVES.indexOf(tokens[0].lower) === -1) return []
  if (isDiscourseMarker(tokens)) return []
  if (!startsVerbPhrase(tokens[1].lower)) return []

  const phrase = sliceSentence(sentence, tokens[0].start, tokens[1].end)
  return [{
    start: tokens[0].start,
    end: tokens[1].end,
    phrase: phrase,
    sentence: sentence.text,
    question: '“' + phrase + '” — this what? Naming the noun (“this pattern”, ' +
      '“this discrepancy”) tells the reader which idea you mean. Several ' +
      'usually fit.'
  }]
}

/** "That is, ..." is a connective, not a dangling reference. */
function isDiscourseMarker (tokens) {
  return tokens[0].lower === 'that' && tokens[1].lower === 'is'
}

function startsVerbPhrase (lower) {
  return BE_FORMS.indexOf(lower) !== -1 ||
    MODALS.indexOf(lower) !== -1 ||
    REPORTING_VERBS.indexOf(lower) !== -1
}
