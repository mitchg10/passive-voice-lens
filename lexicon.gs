/**
 * Word lists backing passive-voice detection.
 * Data only -- no logic. Plain globals for Apps Script compatibility.
 */

const BE_FORMS = Object.freeze([
  'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', "isn't", "aren't",
  "wasn't", "weren't", "ain't"
])

const GET_FORMS = Object.freeze(['get', 'gets', 'got', 'gotten', 'getting'])

/** Adverbs and negators allowed between the be-verb and the participle. */
const INTERVENERS = Object.freeze([
  'not', 'never', 'also', 'already', 'only', 'just', 'still', 'then', 'thus',
  'therefore', 'however', 'again', 'now', 'always', 'sometimes', 'rarely',
  'seldom', 'often', 'usually', 'generally', 'typically', 'widely', 'largely',
  'recently', 'previously', 'subsequently', 'currently', 'clearly', 'simply',
  'further', 'well', 'both', 'all', 'therefore', 'consequently', 'indeed',
  'nevertheless', 'increasingly', 'consistently', 'explicitly', 'implicitly'
])

/** Irregular past participles that do not end in -ed. */
const IRREGULAR_PARTICIPLES = Object.freeze([
  'arisen', 'awoken', 'beaten', 'become', 'begun', 'bent', 'bet', 'bitten',
  'bled', 'blown', 'born', 'borne', 'bought', 'bound', 'bred', 'broadcast',
  'broken', 'brought', 'built', 'burnt', 'burst', 'cast', 'caught', 'chosen',
  'clung', 'come', 'cost', 'cut', 'dealt', 'done', 'drawn', 'driven', 'drunk',
  'eaten', 'fallen', 'fed', 'felt', 'fought', 'found', 'flown', 'forbidden',
  'forgotten', 'forgiven', 'forsaken', 'frozen', 'given', 'gone', 'ground',
  'grown', 'heard', 'held', 'hidden', 'hit', 'hung', 'hurt', 'kept', 'known',
  'laid', 'led', 'left', 'lent', 'let', 'lost', 'made', 'meant', 'met',
  'mistaken', 'overcome', 'overtaken', 'paid', 'proven', 'put', 'read',
  'rebuilt', 'redone', 'rewritten', 'ridden', 'risen', 'run', 'said', 'seen',
  'sent', 'set', 'sewn', 'shaken', 'shed', 'shone', 'shot', 'shown', 'shrunk',
  'shut', 'slain', 'slept', 'slid', 'sold', 'sought', 'sown', 'spent', 'spilt',
  'split', 'spoken', 'spread', 'sprung', 'stolen', 'stood', 'stricken',
  'struck', 'strung', 'stuck', 'sung', 'sunk', 'swept', 'swollen', 'swum',
  'swung', 'taken', 'taught', 'thought', 'thrown', 'told', 'torn', 'trodden',
  'undergone', 'understood', 'undertaken', 'undone', 'upheld', 'upset',
  'withdrawn', 'withheld', 'withstood', 'won', 'worn', 'woven', 'written',
  'wrung'
])

/**
 * -ed words that read as adjectives after a be-verb far more often than as
 * true passives. Suppressing these is the single biggest false-positive win.
 */
const ADJECTIVAL_ED = Object.freeze([
  'aged', 'advanced', 'alleged', 'ashamed', 'based', 'bored', 'closed',
  'committed', 'complicated', 'concerned', 'confused', 'crowded', 'dedicated',
  'delighted', 'detailed', 'disappointed', 'distinguished', 'divided',
  'embarrassed', 'excited', 'experienced', 'frustrated', 'gifted',
  'interested', 'involved', 'limited', 'located', 'married', 'mixed',
  'motivated', 'pleased', 'prepared', 'qualified', 'related', 'retired',
  'satisfied', 'scared', 'situated', 'skilled', 'supposed', 'surprised',
  'talented', 'tired', 'united', 'unlimited', 'unexpected', 'worried'
])

/** Words ending in -ed that are not participles at all. */
const NON_PARTICIPLE_ED = Object.freeze([
  'indeed', 'hundred', 'sacred', 'wicked', 'naked', 'wretched', 'need',
  'feed', 'breed', 'speed', 'deed', 'seed', 'greed', 'creed', 'weed',
  'bleed', 'heed', 'exceed', 'proceed', 'succeed', 'embed'
])

const DETERMINERS = Object.freeze([
  'the', 'a', 'an', 'this', 'that', 'these', 'those', 'its', 'their',
  'our', 'his', 'her', 'my', 'your', 'such'
])

/** Suffixes that usually mark a verb turned into an abstract noun. */
const NOMINALIZATION_SUFFIXES = Object.freeze([
  'tion', 'sion', 'ment', 'ance', 'ence', 'ity', 'ness', 'ism'
])

/** Nominalizations the suffix test misses. */
const NOMINALIZATION_EXTRAS = Object.freeze([
  'use', 'usage', 'analysis', 'emphasis', 'failure', 'pressure', 'growth',
  'procedure', 'disclosure', 'exposure', 'coverage', 'storage', 'leverage',
  'uptake', 'intake', 'spread', 'reliance', 'oversight'
])

/** Concrete nouns that happen to end in a nominalizing suffix. */
const NOMINALIZATION_STOPLIST = Object.freeze([
  'university', 'community', 'opportunity', 'security', 'majority', 'minority',
  'variety', 'society', 'city', 'entity', 'identity', 'quantity', 'quality',
  'moment', 'element', 'document', 'instrument', 'government', 'department',
  'environment', 'experiment', 'equipment', 'component', 'parliament',
  'distance', 'instance', 'audience', 'science', 'evidence', 'experience',
  'business', 'witness', 'illness', 'wilderness', 'nation', 'station',
  'question', 'section', 'portion', 'fraction', 'version', 'mission'
])

/** Irregular past-tense forms, used to stop a noun phrase at the verb. */
const IRREGULAR_PAST = Object.freeze([
  'took', 'made', 'gave', 'found', 'led', 'came', 'went', 'saw', 'became',
  'said', 'held', 'kept', 'left', 'sent', 'brought', 'thought', 'began',
  'grew', 'drew', 'fell', 'felt', 'met', 'ran', 'rose', 'sold', 'spoke',
  'stood', 'told', 'wrote', 'won', 'put', 'set', 'cut', 'cost', 'hit', 'let',
  'shows', 'show', 'reveals', 'reveal', 'suggests', 'suggest', 'remains'
])

/** Nouns that are already plural, though writers often treat them as singular. */
const PLURAL_NOUNS = Object.freeze([
  'data', 'criteria', 'phenomena', 'media', 'analyses', 'hypotheses',
  'bacteria', 'strata', 'curricula', 'theses', 'indices', 'matrices',
  'alumni', 'foci'
])

/** Singular verb forms and their plural equivalents. */
const AGREEMENT_FIXES = Object.freeze({
  is: 'are', was: 'were', has: 'have', does: 'do', seems: 'seem',
  shows: 'show', suggests: 'suggest', indicates: 'indicate',
  remains: 'remain', appears: 'appear', supports: 'support'
})

/** Words ending in -s that are not plural nouns. */
const SINGULAR_S_WORDS = Object.freeze([
  'series', 'species', 'means', 'news', 'always', 'perhaps', 'whereas',
  'towards', 'besides', 'yes', 'gas', 'lens', 'bias', 'campus', 'census'
])

const MODALS = Object.freeze([
  'can', 'could', 'may', 'might', 'will', 'would', 'shall', 'should', 'must'
])

/** Verbs that commonly follow a bare "this" and leave the referent unnamed. */
const REPORTING_VERBS = Object.freeze([
  'suggests', 'suggest', 'shows', 'show', 'indicates', 'indicate', 'means',
  'mean', 'demonstrates', 'demonstrate', 'implies', 'imply', 'highlights',
  'highlight', 'reveals', 'reveal', 'illustrates', 'illustrate', 'reflects',
  'reflect', 'leads', 'lead', 'results', 'result', 'allows', 'allow',
  'enables', 'enable', 'creates', 'create', 'causes', 'cause', 'explains',
  'explain', 'supports', 'support', 'confirms', 'confirm', 'raises', 'raise',
  'provides', 'provide', 'makes', 'make', 'gives', 'give', 'seems', 'seem',
  'appears', 'appear', 'occurs', 'occur', 'requires', 'require', 'involves',
  'involve', 'includes', 'include', 'points', 'point', 'helps', 'help',
  'tells', 'tell', 'happens', 'happen', 'contributes', 'contribute',
  'presents', 'present', 'offers', 'offer', 'has', 'have', 'had'
])
