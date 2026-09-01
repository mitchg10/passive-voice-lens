/**
 * Rules: passive voice, split by whether the actor is recoverable.
 * One scan finds every "be/get + past participle"; the two rules differ only
 * in which half of that set they report.
 */

const MAX_INTERVENING_TOKENS = 3
const AGENT_SEARCH_WINDOW = 6

const PASSIVE_RULE = Object.freeze({
  id: 'passive-agentless',
  label: 'Passive, no actor',
  analyze: function (sentence, tokens) {
    return findPassives(sentence, tokens)
      .filter(function (hit) { return !hit.hasAgent })
      .map(function (hit) { return toFinding(sentence, hit, agentlessQuestion) })
  }
})

const AGENTED_PASSIVE_RULE = Object.freeze({
  id: 'passive-agented',
  label: 'Passive, actor named',
  analyze: function (sentence, tokens) {
    return findPassives(sentence, tokens)
      .filter(function (hit) { return hit.hasAgent })
      .map(function (hit) { return toFinding(sentence, hit, agentedQuestion) })
  }
})

/** Every passive construction in the sentence, flagged for agent presence. */
function findPassives (sentence, tokens) {
  const hits = []
  let i = 0

  while (i < tokens.length) {
    if (!isAuxiliary(tokens[i].lower)) {
      i += 1
      continue
    }

    const participleIndex = findParticiple(tokens, i + 1)
    if (participleIndex === -1) {
      i += 1
      continue
    }

    hits.push(Object.freeze({
      auxiliary: tokens[i],
      participle: tokens[participleIndex],
      hasAgent: hasNamedAgent(tokens, participleIndex)
    }))
    i = participleIndex + 1
  }
  return hits
}

function isAuxiliary (lower) {
  return BE_FORMS.indexOf(lower) !== -1 || GET_FORMS.indexOf(lower) !== -1
}

/** Index of the participle following `from`, or -1 if the chain breaks. */
function findParticiple (tokens, from) {
  let skipped = 0
  for (let j = from; j < tokens.length; j += 1) {
    const lower = tokens[j].lower
    if (isParticiple(lower)) return j
    if (!isSkippable(lower) || skipped >= MAX_INTERVENING_TOKENS) return -1
    skipped += 1
  }
  return -1
}

function isSkippable (lower) {
  return INTERVENERS.indexOf(lower) !== -1 ||
    BE_FORMS.indexOf(lower) !== -1 ||
    /ly$/.test(lower)
}

function isParticiple (lower) {
  if (NON_PARTICIPLE_ED.indexOf(lower) !== -1) return false
  if (ADJECTIVAL_ED.indexOf(lower) !== -1) return false
  if (IRREGULAR_PARTICIPLES.indexOf(lower) !== -1) return true
  return /ed$/.test(lower) && lower.length >= 4
}

function hasNamedAgent (tokens, participleIndex) {
  const limit = Math.min(tokens.length, participleIndex + 1 + AGENT_SEARCH_WINDOW)
  for (let j = participleIndex + 1; j < limit; j += 1) {
    if (tokens[j].lower === 'by') return true
    if (isAuxiliary(tokens[j].lower)) return false
  }
  return false
}

function toFinding (sentence, hit, buildQuestion) {
  const phrase = sliceSentence(sentence, hit.auxiliary.start, hit.participle.end)
  return {
    start: hit.auxiliary.start,
    end: hit.participle.end,
    phrase: phrase,
    sentence: sentence.text,
    question: buildQuestion(phrase)
  }
}

function agentlessQuestion (phrase) {
  return '“' + phrase + '” — by whom? If the actor matters to your ' +
    'argument, name it. If it genuinely does not, this passive may be right.'
}

function agentedQuestion (phrase) {
  return '“' + phrase + '” — you already know who acted. Could they be the ' +
    'subject instead? Active usually reads better once the actor is named.'
}
