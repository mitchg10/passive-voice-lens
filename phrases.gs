/**
 * Fixed phrases that pad academic prose, paired with what usually replaces
 * them. Matched on lowercased word tokens, so punctuation does not interfere.
 */

const PADDING_PHRASES = Object.freeze([
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
