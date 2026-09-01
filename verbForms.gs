/**
 * Nominalization -> the verb it was built from. Too irregular to derive by
 * stripping suffixes, so this is an explicit map of the forms that actually
 * turn up in academic prose. Absent entries simply get no verb suggestion.
 */

const NOMINALIZATION_VERBS = Object.freeze({
  analysis: 'analyze',
  application: 'apply',
  assessment: 'assess',
  assumption: 'assume',
  classification: 'classify',
  collection: 'collect',
  comparison: 'compare',
  conclusion: 'conclude',
  connection: 'connect',
  consideration: 'consider',
  construction: 'construct',
  contribution: 'contribute',
  correction: 'correct',
  decision: 'decide',
  description: 'describe',
  detection: 'detect',
  determination: 'determine',
  development: 'develop',
  difference: 'differ',
  discussion: 'discuss',
  distribution: 'distribute',
  evaluation: 'evaluate',
  examination: 'examine',
  expansion: 'expand',
  explanation: 'explain',
  exploration: 'explore',
  extension: 'extend',
  identification: 'identify',
  implementation: 'implement',
  improvement: 'improve',
  interpretation: 'interpret',
  introduction: 'introduce',
  investigation: 'investigate',
  judgment: 'judge',
  justification: 'justify',
  measurement: 'measure',
  modification: 'modify',
  observation: 'observe',
  prediction: 'predict',
  presentation: 'present',
  production: 'produce',
  provision: 'provide',
  recommendation: 'recommend',
  reduction: 'reduce',
  reference: 'refer',
  reflection: 'reflect',
  resolution: 'resolve',
  revision: 'revise',
  selection: 'select',
  solution: 'solve',
  statement: 'state',
  suggestion: 'suggest',
  validation: 'validate',
  verification: 'verify'
})

/** Verbs that carry no meaning of their own before a nominalization. */
const LIGHT_VERBS = Object.freeze([
  'perform', 'performs', 'performed', 'performing',
  'conduct', 'conducts', 'conducted', 'conducting',
  'make', 'makes', 'made', 'making',
  'provide', 'provides', 'provided', 'providing',
  'give', 'gives', 'gave', 'giving',
  'carry', 'carries', 'carried', 'carrying',
  'undertake', 'undertakes', 'undertook', 'undertaken', 'undertaking',
  'take', 'takes', 'took', 'taken', 'taking',
  'reach', 'reaches', 'reached', 'reaching',
  'offer', 'offers', 'offered', 'offering',
  'obtain', 'obtains', 'obtained', 'obtaining',
  'achieve', 'achieves', 'achieved', 'achieving',
  'engage', 'engages', 'engaged', 'engaging'
])

/** Particles that sit between a light verb and its object. */
const LIGHT_VERB_PARTICLES = Object.freeze(['out', 'into', 'up', 'in', 'forward'])
