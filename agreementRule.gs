/**
 * Rule: number agreement slips that recur in academic prose --
 * "data is", "this data", "amount of students", "less students".
 */

const AGREEMENT_RULE = Object.freeze({
  id: 'agreement',
  label: 'Agreement',
  analyze: analyzeAgreement
})

function analyzeAgreement (sentence, tokens) {
  const findings = []

  for (let i = 0; i < tokens.length - 1; i += 1) {
    const finding = checkPluralNounVerb(sentence, tokens, i) ||
      checkSingularDeterminer(sentence, tokens, i) ||
      checkAmountOf(sentence, tokens, i) ||
      checkLess(sentence, tokens, i)

    if (finding) findings.push(finding)
  }
  return findings
}

/** "data is" -> "data are" */
function checkPluralNounVerb (sentence, tokens, i) {
  if (PLURAL_NOUNS.indexOf(tokens[i].lower) === -1) return null
  const fix = AGREEMENT_FIXES[tokens[i + 1].lower]
  if (!fix) return null

  return agreementFinding(sentence, tokens[i], tokens[i + 1],
    tokens[i].word + ' ' + fix)
}

/** "this data" -> "these data" */
function checkSingularDeterminer (sentence, tokens, i) {
  const swap = { this: 'these', that: 'those' }[tokens[i].lower]
  if (!swap) return null
  if (PLURAL_NOUNS.indexOf(tokens[i + 1].lower) === -1) return null

  return agreementFinding(sentence, tokens[i], tokens[i + 1],
    swap + ' ' + tokens[i + 1].word)
}

/** "amount of students" -> "number of students" */
function checkAmountOf (sentence, tokens, i) {
  if (tokens[i].lower !== 'amount' || tokens[i + 1].lower !== 'of') return null
  if (!headIsPlural(tokens, i + 2)) return null

  return agreementFinding(sentence, tokens[i], tokens[i + 1], 'number of')
}

/** "less students" -> "fewer students" */
function checkLess (sentence, tokens, i) {
  if (tokens[i].lower !== 'less') return null
  if (!headIsPlural(tokens, i + 1)) return null

  return agreementFinding(sentence, tokens[i], tokens[i], 'fewer')
}

/** The first non-determiner token from `from`, tested for plurality. */
function headIsPlural (tokens, from) {
  let j = from
  while (j < tokens.length && DETERMINERS.indexOf(tokens[j].lower) !== -1) j += 1
  return j < tokens.length && isPluralNoun(tokens[j].lower)
}

/**
 * Plural test by suffix. The exclusions carry the weight: -ss (process),
 * -ous (various), -is (analysis), -us (status) and -ics (statistics) all end
 * in s without being plural.
 */
function isPluralNoun (lower) {
  if (lower.length < 4) return false
  if (lower.slice(-1) !== 's') return false
  if (SINGULAR_S_WORDS.indexOf(lower) !== -1) return false
  if (DETERMINERS.indexOf(lower) !== -1) return false
  return !/(ss|ous|is|us|ics)$/.test(lower)
}

function agreementFinding (sentence, first, last, suggestion) {
  const phrase = sliceSentence(sentence, first.start, last.end)
  return {
    start: first.start,
    end: last.end,
    phrase: phrase,
    sentence: sentence.text,
    question: '“' + phrase + '” — try “' + suggestion + '”.'
  }
}
