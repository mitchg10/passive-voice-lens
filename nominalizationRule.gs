/**
 * Rule: of-genitive built on a nominalization ("the usage of GAI").
 * Collapsing these to a compound ("GAI usage") shortens the sentence and
 * puts the concrete noun first.
 */

const MAX_OBJECT_TOKENS = 2

const OBJECT_STOPPERS = Object.freeze([
  'in', 'on', 'for', 'with', 'to', 'from', 'at', 'by', 'and', 'or', 'but',
  'that', 'which', 'as', 'than', 'because', 'while', 'when', 'is', 'are',
  'was', 'were', 'has', 'have', 'had', 'of'
])

const NOMINALIZATION_RULE = Object.freeze({
  id: 'nominalization-of',
  label: 'Nominalization',
  analyze: analyzeNominalizations
})

function analyzeNominalizations (sentence, tokens) {
  const findings = []

  for (let i = 0; i < tokens.length - 1; i += 1) {
    if (tokens[i + 1].lower !== 'of') continue
    if (!isNominalization(tokens[i].lower)) continue
    if (isProperNoun(tokens[i], i)) continue
    if (hasGoverningLightVerb(tokens, i)) continue

    findings.push(buildNominalizationFinding(sentence, tokens, i))
  }
  return findings
}

function isNominalization (lower) {
  if (NOMINALIZATION_STOPLIST.indexOf(lower) !== -1) return false
  if (NOMINALIZATION_EXTRAS.indexOf(lower) !== -1) return true
  if (lower.length < 6) return false
  return NOMINALIZATION_SUFFIXES.some(function (suffix) {
    return lower.slice(-suffix.length) === suffix
  })
}

/** Mid-sentence capitals are almost always names, not nominalizations. */
function isProperNoun (token, index) {
  return index > 0 && /^[A-Z]/.test(token.word)
}

function buildNominalizationFinding (sentence, tokens, headIndex) {
  const startToken = precedingDeterminer(tokens, headIndex) || tokens[headIndex]
  const object = collectObject(tokens, headIndex + 1)
  const endToken = object.tokens.length > 0
    ? object.tokens[object.tokens.length - 1]
    : tokens[headIndex + 1]

  const phrase = sliceSentence(sentence, startToken.start, endToken.end)
  const suggestion = object.tokens.length > 0
    ? object.tokens.map(function (t) { return t.word }).join(' ') + ' ' +
      tokens[headIndex].word
    : ''

  return {
    start: startToken.start,
    end: endToken.end,
    phrase: phrase,
    sentence: sentence.text,
    question: nominalizationQuestion(phrase, suggestion)
  }
}

function precedingDeterminer (tokens, headIndex) {
  if (headIndex === 0) return null
  const candidate = tokens[headIndex - 1]
  return DETERMINERS.indexOf(candidate.lower) === -1 ? null : candidate
}

/** The noun phrase after "of", minus its own determiner. */
function collectObject (tokens, ofIndex) {
  const collected = []
  let j = ofIndex + 1

  while (j < tokens.length && DETERMINERS.indexOf(tokens[j].lower) !== -1) j += 1

  while (j < tokens.length && collected.length < MAX_OBJECT_TOKENS) {
    if (tokens[j].breaksPhrase) break
    if (endsNounPhrase(tokens[j].lower)) break
    collected.push(tokens[j])
    j += 1
  }
  return { tokens: collected }
}

/** Nouns rarely end in -ed, so an -ed token is the verb, not the object. */
function endsNounPhrase (lower) {
  return OBJECT_STOPPERS.indexOf(lower) !== -1 ||
    IRREGULAR_PAST.indexOf(lower) !== -1 ||
    /ed$/.test(lower)
}

function nominalizationQuestion (phrase, suggestion) {
  if (suggestion.length === 0) {
    return '“' + phrase + '” — this noun hides a verb. Can the sentence say ' +
      'who does what instead?'
  }
  return '“' + phrase + '” — try “' + suggestion + '”. Nominalizations bury ' +
    'the verb, and of-phrases stack up fast.'
}
