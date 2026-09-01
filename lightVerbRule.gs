/**
 * Rule: light verb carrying a nominalization ("performed an analysis").
 * The real verb is trapped inside the noun; freeing it usually removes two
 * or three words. Takes precedence over the of-genitive rule, which skips
 * any nominalization already governed by a light verb.
 */

const MAX_LOOKAHEAD_TOKENS = 3

const LIGHT_VERB_STOPPERS = Object.freeze([
  'of', 'for', 'with', 'to', 'from', 'at', 'by', 'and', 'or', 'that',
  'which', 'is', 'are', 'was', 'were', 'has', 'have', 'had', 'not'
])

const LIGHT_VERB_RULE = Object.freeze({
  id: 'light-verb',
  label: 'Buried verb',
  analyze: analyzeLightVerbs
})

function analyzeLightVerbs (sentence, tokens) {
  const findings = []

  for (let i = 0; i < tokens.length - 1; i += 1) {
    if (LIGHT_VERBS.indexOf(tokens[i].lower) === -1) continue

    const headIndex = findGovernedNominalization(tokens, i)
    if (headIndex === -1) continue

    findings.push(buildLightVerbFinding(sentence, tokens, i, headIndex))
  }
  return findings
}

/** Index of the nominalization this light verb governs, or -1. */
function findGovernedNominalization (tokens, verbIndex) {
  let j = verbIndex + 1
  if (j < tokens.length && LIGHT_VERB_PARTICLES.indexOf(tokens[j].lower) !== -1) {
    j += 1
  }

  let examined = 0
  while (j < tokens.length && examined < MAX_LOOKAHEAD_TOKENS) {
    if (tokens[j].breaksPhrase) return -1
    const lower = tokens[j].lower
    if (LIGHT_VERB_STOPPERS.indexOf(lower) !== -1) return -1
    if (isNominalization(lower) && !isProperNoun(tokens[j], j)) return j
    if (DETERMINERS.indexOf(lower) === -1) examined += 1
    j += 1
  }
  return -1
}

function buildLightVerbFinding (sentence, tokens, verbIndex, headIndex) {
  const phrase = sliceSentence(
    sentence, tokens[verbIndex].start, tokens[headIndex].end
  )
  const verb = NOMINALIZATION_VERBS[tokens[headIndex].lower]

  return {
    start: tokens[verbIndex].start,
    end: tokens[headIndex].end,
    phrase: phrase,
    sentence: sentence.text,
    question: lightVerbQuestion(phrase, verb)
  }
}

function lightVerbQuestion (phrase, verb) {
  if (!verb) {
    return '“' + phrase + '” — the verb is hiding inside the noun. Can it do ' +
      'the work directly?'
  }
  return '“' + phrase + '” — try “' + verb + '”. The real verb is trapped in ' +
    'the noun, and freeing it drops two or three words.'
}

/** True when a light verb governs the nominalization at `headIndex`. */
function hasGoverningLightVerb (tokens, headIndex) {
  const earliest = Math.max(0, headIndex - MAX_LOOKAHEAD_TOKENS - 1)
  for (let j = headIndex - 1; j >= earliest; j -= 1) {
    if (LIGHT_VERBS.indexOf(tokens[j].lower) !== -1) return true
    if (LIGHT_VERB_STOPPERS.indexOf(tokens[j].lower) !== -1) return false
  }
  return false
}
