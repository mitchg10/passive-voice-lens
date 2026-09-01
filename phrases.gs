/**
 * Fixed phrases that pad academic prose, paired with what usually replaces
 * them. Matched on lowercased word tokens, so punctuation does not interfere.
 */

const BASE_PADDING_PHRASES = Object.freeze([
  { phrase: 'due to', suggestion: 'because of — or name the cause directly' },
  { phrase: 'in order to', suggestion: 'to' },
  { phrase: 'the ability to', suggestion: 'usually deletable: "limits use", not "limits the ability to use"' },
  { phrase: 'has the ability to', suggestion: 'can' },
  { phrase: 'has the potential to', suggestion: 'could, or may' },
  { phrase: 'is able to', suggestion: 'can' },
  { phrase: 'are able to', suggestion: 'can' },
  { phrase: 'the fact that', suggestion: 'that' },
  { phrase: 'in terms of', suggestion: 'usually deletable' },
  { phrase: 'with respect to', suggestion: 'about, or for' },
  { phrase: 'with regard to', suggestion: 'about, or for' },
  { phrase: 'a number of', suggestion: 'several, many — or the actual number' },
  { phrase: 'a majority of', suggestion: 'most' },
  { phrase: 'the presence of', suggestion: 'usually deletable' },
  { phrase: 'it is important to note that', suggestion: 'delete, and state the point' },
  { phrase: 'it should be noted that', suggestion: 'delete, and state the point' },
  { phrase: 'it is worth noting that', suggestion: 'delete, and state the point' },
  { phrase: 'for the purpose of', suggestion: 'to' },
  { phrase: 'in the event that', suggestion: 'if' },
  { phrase: 'prior to', suggestion: 'before' },
  { phrase: 'subsequent to', suggestion: 'after' },
  { phrase: 'at this point in time', suggestion: 'now' },
  { phrase: 'there is', suggestion: 'put the real subject first' },
  { phrase: 'there are', suggestion: 'put the real subject first' },
  { phrase: 'there was', suggestion: 'put the real subject first' },
  { phrase: 'there were', suggestion: 'put the real subject first' }
])

/** Every phrase the wordy-phrase rule matches. */
function paddingPhrases () {
  return BASE_PADDING_PHRASES.concat(REDUNDANT_PAIRS)
}

/** Redundant pairs: one half already means the whole. */
const REDUNDANT_PAIRS = Object.freeze([
  { phrase: 'each and every', suggestion: 'each, or every' },
  { phrase: 'first and foremost', suggestion: 'first' },
  { phrase: 'past history', suggestion: 'history' },
  { phrase: 'future plans', suggestion: 'plans' },
  { phrase: 'end result', suggestion: 'result' },
  { phrase: 'final outcome', suggestion: 'outcome' },
  { phrase: 'final conclusion', suggestion: 'conclusion' },
  { phrase: 'basic fundamentals', suggestion: 'fundamentals' },
  { phrase: 'close proximity', suggestion: 'near' },
  { phrase: 'completely eliminate', suggestion: 'eliminate' },
  { phrase: 'absolutely essential', suggestion: 'essential' },
  { phrase: 'advance planning', suggestion: 'planning' },
  { phrase: 'actual fact', suggestion: 'fact' },
  { phrase: 'added bonus', suggestion: 'bonus' },
  { phrase: 'new innovation', suggestion: 'innovation' },
  { phrase: 'personal opinion', suggestion: 'opinion' },
  { phrase: 'unexpected surprise', suggestion: 'surprise' },
  { phrase: 'brief summary', suggestion: 'summary' },
  { phrase: 'join together', suggestion: 'join' },
  { phrase: 'combine together', suggestion: 'combine' },
  { phrase: 'merge together', suggestion: 'merge' },
  { phrase: 'return back', suggestion: 'return' },
  { phrase: 'revert back', suggestion: 'revert' },
  { phrase: 'repeat again', suggestion: 'repeat' },
  { phrase: 'plan ahead', suggestion: 'plan' }
])

/** Claims with no source attached. */
const AUTHORITY_PHRASES = Object.freeze([
  { phrase: 'studies have shown' }, { phrase: 'studies show' },
  { phrase: 'research has shown' }, { phrase: 'research shows' },
  { phrase: 'research suggests' }, { phrase: 'research indicates' },
  { phrase: 'prior work has shown' }, { phrase: 'the literature suggests' },
  { phrase: 'scholars have argued' }, { phrase: 'researchers have found' },
  { phrase: 'many scholars' }, { phrase: 'many researchers' },
  { phrase: 'some scholars' }, { phrase: 'some researchers' },
  { phrase: 'experts agree' }, { phrase: 'it is widely believed' },
  { phrase: 'it is widely accepted' }, { phrase: 'it is generally accepted' },
  { phrase: 'it is well known' }, { phrase: 'it is often argued' },
  { phrase: 'it has long been' }, { phrase: 'it is commonly assumed' }
])
