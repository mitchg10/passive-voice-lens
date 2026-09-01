# Adding your own rules

The tool ships with five rules. You can change what it flags in three ways,
listed here from easiest to hardest. All of them are edits to plain JavaScript
files in the Apps Script editor.

After any change, save, then run `showSidebar` and scan a document again.

## Level 1: tune the word lists

Most false positives and misses come from a word list, not from logic. These
live in `lexicon.gs` and `verbForms.gs`.

| List | What it controls |
|---|---|
| `BE_FORMS`, `GET_FORMS` | Auxiliaries that can start a passive |
| `INTERVENERS` | Words allowed between the auxiliary and the participle |
| `IRREGULAR_PARTICIPLES` | Participles that do not end in `-ed` |
| `ADJECTIVAL_ED` | `-ed` words treated as adjectives, so *not* flagged |
| `NON_PARTICIPLE_ED` | `-ed` words that are not verbs at all |
| `NOMINALIZATION_SUFFIXES` | Endings that mark a verb turned into a noun |
| `NOMINALIZATION_EXTRAS` | Nominalizations the suffix test misses |
| `NOMINALIZATION_STOPLIST` | Concrete nouns that happen to end in one of those suffixes |
| `IRREGULAR_PAST` | Past-tense verbs, used to stop a noun phrase at the verb |
| `NOMINALIZATION_VERBS` | Noun to verb map, used for "try X" suggestions |
| `LIGHT_VERBS` | Verbs that carry no meaning before a nominalization |

Two worked examples:

**Make passive detection stricter.** `the sample was limited to one site` is not
flagged, because `limited` sits in `ADJECTIVAL_ED`. Delete `'limited',` from
that list and it will be.

**Stop a false positive.** If `the committee was concerned` gets flagged in your
field, add `'concerned'` to `ADJECTIVAL_ED`.

## Level 2: add a wordy phrase

Open `phrases.gs` and add an entry to `PADDING_PHRASES`:

```javascript
{ phrase: 'a significant number of', suggestion: 'many, or the actual number' },
```

Write `phrase` in lowercase, words separated by single spaces. Punctuation is
ignored during matching, so do not include any. Longer phrases are matched
first, so `has the ability to` wins over the `the ability to` inside it.

## Level 3: write a new rule

A rule is an object with three properties:

```javascript
const MY_RULE = Object.freeze({
  id: 'my-rule',          // unique, kebab-case
  label: 'My label',      // shown on the sidebar tag
  analyze: myAnalyze      // function (sentence, tokens) -> array of findings
})
```

### What you receive

`sentence` describes one sentence:

```javascript
{ text: 'The data were collected.', start: 42, end: 66 }
```

`tokens` is that sentence's words. Offsets are absolute, matching the document,
not the sentence:

```javascript
{ word: 'Data', lower: 'data', start: 46, end: 50, breaksPhrase: false }
```

`breaksPhrase` is true when punctuation sits immediately before the token. Check
it whenever you scan across several tokens, or your phrase will run through
commas.

### What you return

An array of findings. Return `[]` when nothing matches, never `null`.

```javascript
{
  start: 46,                      // absolute offset
  end: 60,
  phrase: 'were collected',       // exact text at those offsets
  sentence: sentence.text,
  question: 'Ask something here.'
}
```

The registry adds `ruleId` and `ruleLabel` for you. Do not set them yourself.

Use `sliceSentence(sentence, start, end)` to get the phrase text rather than
slicing by hand, so the offsets and the displayed text cannot drift apart.

### A complete example

This rule flags inflated word choices. Create a script file named
`inflatedRule` and paste this in:

```javascript
const INFLATED_WORDS = Object.freeze({
  utilize: 'use', utilizes: 'uses', utilized: 'used', utilizing: 'using',
  commence: 'begin', commenced: 'began', endeavor: 'try',
  facilitate: 'help', ascertain: 'determine', methodology: 'method',
  individuals: 'people', numerous: 'many', additionally: 'also',
  approximately: 'about'
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
        question: '"' + token.word + '" - try "' +
          INFLATED_WORDS[token.lower] + '".'
      }
    })
}
```

### Register it

Open `rules.gs` and add your rule to the array:

```javascript
function registeredRules () {
  return [
    PASSIVE_RULE,
    AGENTED_PASSIVE_RULE,
    LIGHT_VERB_RULE,
    NOMINALIZATION_RULE,
    PHRASE_RULE,
    INFLATED_RULE
  ]
}
```

Nothing else needs to change. To turn a rule off, comment out its line here
rather than deleting the file.

### Give it a colour

Optional. In `Sidebar.html`, next to the other `.tag[data-rule=...]` lines:

```css
.tag[data-rule="inflated-word"] { background: #fff3e0; color: #e65100; }
```

## Testing without any extra tools

Add this to any script file, pick `testRules` from the function dropdown, and
click Run. Results appear in the execution log at the bottom of the editor.

```javascript
function testRules () {
  const samples = [
    'We utilized numerous individuals.',
    'The data were collected over three months.',
    'She analyzed the data carefully.'
  ]

  samples.forEach(function (text) {
    Logger.log('--- ' + text)
    analyzeText(text, 0).forEach(function (finding) {
      Logger.log('    [' + finding.ruleLabel + '] ' + finding.phrase)
    })
  })
}
```

Always include a sentence that should produce nothing. A rule that flags
everything is worse than no rule.

## Gotchas

**Never reference another file's `const` at the top level of your file.** Apps
Script joins all script files into one program in an order it does not promise,
and a top-level `const` is not available before its own line runs. This fails
intermittently:

```javascript
const MY_RULES = [PASSIVE_RULE]   // ReferenceError, depending on file order
```

Put it inside a function instead, which is why `registeredRules()` is a function
and not a constant. Function declarations are safe to call across files.

**Check `breaksPhrase` when scanning forward.** Without it, `the usage of GAI,
we performed` collects `GAI, we` as one noun phrase.

**Overlapping findings.** When two rules cover the same words, the widest span
wins and the other is dropped. If your new rule never appears, check whether an
existing rule already covers a longer span over the same text.

**Capitalised words mid-sentence are usually names.** `The University of
Virginia` is not a nominalization. Use `isProperNoun(token, index)` if your rule
looks at nouns.

**Words ending in `-ed` are rarely nouns.** That heuristic is what stops noun
phrases at the verb, and it is worth reusing.
