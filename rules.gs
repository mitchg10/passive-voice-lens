/**
 * Rule registry. Adding a pattern means appending to registeredRules() --
 * nothing else changes.
 */

/**
 * Resolved at call time, not load time: Apps Script concatenates .gs files in
 * an unspecified order and top-level const bindings are not hoisted.
 */
function registeredRules () {
  return [
    PASSIVE_RULE,
    AGENTED_PASSIVE_RULE,
    LIGHT_VERB_RULE,
    NOMINALIZATION_RULE,
    AUTHORITY_RULE,
    REFERENCE_RULE,
    AGREEMENT_RULE,
    INFLATED_RULE,
    PHRASE_RULE
  ]
}

/**
 * Run every registered rule over a block of text.
 * @param {string} text
 * @param {number} baseOffset absolute offset of `text` within the document
 * @returns {Array<Object>} findings, ordered by position, no nested overlaps
 */
function analyzeText (text, baseOffset) {
  const offset = baseOffset || 0
  const sentences = splitSentences(text)

  const findings = sentences.reduce(function (accumulated, sentence) {
    return accumulated.concat(analyzeSentence(sentence))
  }, [])

  return dropContained(findings)
    .map(function (finding) {
      return Object.freeze(Object.assign({}, finding, {
        start: finding.start + offset,
        end: finding.end + offset
      }))
    })
    .sort(function (a, b) { return a.start - b.start })
}

function analyzeSentence (sentence) {
  const tokens = tokenizeWords(sentence)

  return registeredRules().reduce(function (accumulated, rule) {
    return accumulated.concat(runRule(rule, sentence, tokens))
  }, [])
}

function runRule (rule, sentence, tokens) {
  try {
    return (rule.analyze(sentence, tokens) || []).map(function (finding) {
      return Object.assign({}, finding, {
        ruleId: rule.id,
        ruleLabel: rule.label
      })
    })
  } catch (error) {
    throw new Error(
      'Rule "' + rule.id + '" failed on sentence "' +
      sentence.text.slice(0, 60) + '": ' + error.message
    )
  }
}

/**
 * Two rules can cover the same words ("the presence of" is both a padding
 * phrase and a nominalization). Keep the widest span, and one per span.
 */
function dropContained (findings) {
  return findings.filter(function (candidate, index) {
    return !findings.some(function (other, otherIndex) {
      if (index === otherIndex) return false
      const contains = other.start <= candidate.start && other.end >= candidate.end
      const identical = other.start === candidate.start && other.end === candidate.end
      return contains && (!identical || otherIndex < index)
    })
  })
}
