/**
 * Rule: single words that are longer than the idea requires.
 */

const INFLATED_WORDS = Object.freeze({
  utilize: 'use', utilizes: 'uses', utilized: 'used', utilizing: 'using',
  utilization: 'use',
  commence: 'begin', commences: 'begins', commenced: 'began',
  endeavor: 'try', endeavour: 'try',
  facilitate: 'help', facilitates: 'helps', facilitated: 'helped',
  ascertain: 'determine', ascertained: 'determined',
  methodology: 'method', methodologies: 'methods',
  individuals: 'people', individual: 'person',
  numerous: 'many', additionally: 'also', approximately: 'about',
  subsequent: 'later', initiate: 'start', initiated: 'started',
  terminate: 'end', terminated: 'ended',
  demonstrate: 'show', demonstrates: 'shows', demonstrated: 'showed',
  necessitate: 'require', necessitates: 'requires',
  aforementioned: 'these, or name them', heretofore: 'until now',
  cognizant: 'aware', requisite: 'required', myriad: 'many',
  plethora: 'many', paradigm: 'model', leverage: 'use'
})

const INFLATED_RULE = Object.freeze({
  id: 'inflated-word',
  label: 'Inflated word',
  analyze: analyzeInflatedWords
})

function analyzeInflatedWords (sentence, tokens) {
  return tokens
    .filter(function (token) {
      return Object.prototype.hasOwnProperty.call(INFLATED_WORDS, token.lower)
    })
    .map(function (token) {
      return {
        start: token.start,
        end: token.end,
        phrase: token.word,
        sentence: sentence.text,
        question: '“' + token.word + '” — try “' +
          INFLATED_WORDS[token.lower] + '”.'
      }
    })
}
