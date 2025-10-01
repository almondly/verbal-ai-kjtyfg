
/**
 * Word Variations and Tense Handler
 * Provides comprehensive word variation generation including:
 * - Verb tenses (present, past, future, continuous)
 * - Noun plurals and possessives
 * - Adjective comparatives and superlatives
 * - Australian English variations
 */

// Irregular verb conjugations (Australian English)
const irregularVerbs: { [key: string]: { past: string; pastParticiple: string; present3rd: string; continuous: string } } = {
  'be': { past: 'was', pastParticiple: 'been', present3rd: 'is', continuous: 'being' },
  'have': { past: 'had', pastParticiple: 'had', present3rd: 'has', continuous: 'having' },
  'do': { past: 'did', pastParticiple: 'done', present3rd: 'does', continuous: 'doing' },
  'go': { past: 'went', pastParticiple: 'gone', present3rd: 'goes', continuous: 'going' },
  'get': { past: 'got', pastParticiple: 'got', present3rd: 'gets', continuous: 'getting' },
  'make': { past: 'made', pastParticiple: 'made', present3rd: 'makes', continuous: 'making' },
  'take': { past: 'took', pastParticiple: 'taken', present3rd: 'takes', continuous: 'taking' },
  'come': { past: 'came', pastParticiple: 'come', present3rd: 'comes', continuous: 'coming' },
  'see': { past: 'saw', pastParticiple: 'seen', present3rd: 'sees', continuous: 'seeing' },
  'know': { past: 'knew', pastParticiple: 'known', present3rd: 'knows', continuous: 'knowing' },
  'think': { past: 'thought', pastParticiple: 'thought', present3rd: 'thinks', continuous: 'thinking' },
  'feel': { past: 'felt', pastParticiple: 'felt', present3rd: 'feels', continuous: 'feeling' },
  'give': { past: 'gave', pastParticiple: 'given', present3rd: 'gives', continuous: 'giving' },
  'find': { past: 'found', pastParticiple: 'found', present3rd: 'finds', continuous: 'finding' },
  'tell': { past: 'told', pastParticiple: 'told', present3rd: 'tells', continuous: 'telling' },
  'become': { past: 'became', pastParticiple: 'become', present3rd: 'becomes', continuous: 'becoming' },
  'leave': { past: 'left', pastParticiple: 'left', present3rd: 'leaves', continuous: 'leaving' },
  'bring': { past: 'brought', pastParticiple: 'brought', present3rd: 'brings', continuous: 'bringing' },
  'begin': { past: 'began', pastParticiple: 'begun', present3rd: 'begins', continuous: 'beginning' },
  'keep': { past: 'kept', pastParticiple: 'kept', present3rd: 'keeps', continuous: 'keeping' },
  'hold': { past: 'held', pastParticiple: 'held', present3rd: 'holds', continuous: 'holding' },
  'write': { past: 'wrote', pastParticiple: 'written', present3rd: 'writes', continuous: 'writing' },
  'stand': { past: 'stood', pastParticiple: 'stood', present3rd: 'stands', continuous: 'standing' },
  'hear': { past: 'heard', pastParticiple: 'heard', present3rd: 'hears', continuous: 'hearing' },
  'let': { past: 'let', pastParticiple: 'let', present3rd: 'lets', continuous: 'letting' },
  'mean': { past: 'meant', pastParticiple: 'meant', present3rd: 'means', continuous: 'meaning' },
  'set': { past: 'set', pastParticiple: 'set', present3rd: 'sets', continuous: 'setting' },
  'meet': { past: 'met', pastParticiple: 'met', present3rd: 'meets', continuous: 'meeting' },
  'run': { past: 'ran', pastParticiple: 'run', present3rd: 'runs', continuous: 'running' },
  'pay': { past: 'paid', pastParticiple: 'paid', present3rd: 'pays', continuous: 'paying' },
  'sit': { past: 'sat', pastParticiple: 'sat', present3rd: 'sits', continuous: 'sitting' },
  'speak': { past: 'spoke', pastParticiple: 'spoken', present3rd: 'speaks', continuous: 'speaking' },
  'lie': { past: 'lay', pastParticiple: 'lain', present3rd: 'lies', continuous: 'lying' },
  'lead': { past: 'led', pastParticiple: 'led', present3rd: 'leads', continuous: 'leading' },
  'read': { past: 'read', pastParticiple: 'read', present3rd: 'reads', continuous: 'reading' },
  'grow': { past: 'grew', pastParticiple: 'grown', present3rd: 'grows', continuous: 'growing' },
  'lose': { past: 'lost', pastParticiple: 'lost', present3rd: 'loses', continuous: 'losing' },
  'fall': { past: 'fell', pastParticiple: 'fallen', present3rd: 'falls', continuous: 'falling' },
  'send': { past: 'sent', pastParticiple: 'sent', present3rd: 'sends', continuous: 'sending' },
  'build': { past: 'built', pastParticiple: 'built', present3rd: 'builds', continuous: 'building' },
  'understand': { past: 'understood', pastParticiple: 'understood', present3rd: 'understands', continuous: 'understanding' },
  'draw': { past: 'drew', pastParticiple: 'drawn', present3rd: 'draws', continuous: 'drawing' },
  'break': { past: 'broke', pastParticiple: 'broken', present3rd: 'breaks', continuous: 'breaking' },
  'spend': { past: 'spent', pastParticiple: 'spent', present3rd: 'spends', continuous: 'spending' },
  'cut': { past: 'cut', pastParticiple: 'cut', present3rd: 'cuts', continuous: 'cutting' },
  'rise': { past: 'rose', pastParticiple: 'risen', present3rd: 'rises', continuous: 'rising' },
  'drive': { past: 'drove', pastParticiple: 'driven', present3rd: 'drives', continuous: 'driving' },
  'buy': { past: 'bought', pastParticiple: 'bought', present3rd: 'buys', continuous: 'buying' },
  'wear': { past: 'wore', pastParticiple: 'worn', present3rd: 'wears', continuous: 'wearing' },
  'choose': { past: 'chose', pastParticiple: 'chosen', present3rd: 'chooses', continuous: 'choosing' },
  'seek': { past: 'sought', pastParticiple: 'sought', present3rd: 'seeks', continuous: 'seeking' },
  'throw': { past: 'threw', pastParticiple: 'thrown', present3rd: 'throws', continuous: 'throwing' },
  'catch': { past: 'caught', pastParticiple: 'caught', present3rd: 'catches', continuous: 'catching' },
  'teach': { past: 'taught', pastParticiple: 'taught', present3rd: 'teaches', continuous: 'teaching' },
  'eat': { past: 'ate', pastParticiple: 'eaten', present3rd: 'eats', continuous: 'eating' },
  'drink': { past: 'drank', pastParticiple: 'drunk', present3rd: 'drinks', continuous: 'drinking' },
  'sleep': { past: 'slept', pastParticiple: 'slept', present3rd: 'sleeps', continuous: 'sleeping' },
  'swim': { past: 'swam', pastParticiple: 'swum', present3rd: 'swims', continuous: 'swimming' },
  'sing': { past: 'sang', pastParticiple: 'sung', present3rd: 'sings', continuous: 'singing' },
  'ring': { past: 'rang', pastParticiple: 'rung', present3rd: 'rings', continuous: 'ringing' },
  'fly': { past: 'flew', pastParticiple: 'flown', present3rd: 'flies', continuous: 'flying' },
  'fight': { past: 'fought', pastParticiple: 'fought', present3rd: 'fights', continuous: 'fighting' },
  'win': { past: 'won', pastParticiple: 'won', present3rd: 'wins', continuous: 'winning' },
  'forget': { past: 'forgot', pastParticiple: 'forgotten', present3rd: 'forgets', continuous: 'forgetting' },
  'hide': { past: 'hid', pastParticiple: 'hidden', present3rd: 'hides', continuous: 'hiding' },
  'shake': { past: 'shook', pastParticiple: 'shaken', present3rd: 'shakes', continuous: 'shaking' },
  'ride': { past: 'rode', pastParticiple: 'ridden', present3rd: 'rides', continuous: 'riding' },
};

// Irregular noun plurals
const irregularNouns: { [key: string]: string } = {
  'child': 'children',
  'person': 'people',
  'man': 'men',
  'woman': 'women',
  'tooth': 'teeth',
  'foot': 'feet',
  'mouse': 'mice',
  'goose': 'geese',
  'sheep': 'sheep',
  'deer': 'deer',
  'fish': 'fish',
  'moose': 'moose',
  'series': 'series',
  'species': 'species',
  'ox': 'oxen',
  'knife': 'knives',
  'life': 'lives',
  'wife': 'wives',
  'leaf': 'leaves',
  'loaf': 'loaves',
  'potato': 'potatoes',
  'tomato': 'tomatoes',
  'cactus': 'cacti',
  'focus': 'foci',
  'fungus': 'fungi',
  'nucleus': 'nuclei',
  'syllabus': 'syllabi',
  'analysis': 'analyses',
  'diagnosis': 'diagnoses',
  'thesis': 'theses',
  'crisis': 'crises',
  'phenomenon': 'phenomena',
  'criterion': 'criteria',
  'datum': 'data',
};

// Common adjectives with irregular comparatives/superlatives
const irregularAdjectives: { [key: string]: { comparative: string; superlative: string } } = {
  'good': { comparative: 'better', superlative: 'best' },
  'bad': { comparative: 'worse', superlative: 'worst' },
  'far': { comparative: 'farther', superlative: 'farthest' },
  'little': { comparative: 'less', superlative: 'least' },
  'much': { comparative: 'more', superlative: 'most' },
  'many': { comparative: 'more', superlative: 'most' },
};

/**
 * Generate all possible variations of a word
 */
export function generateWordVariations(word: string): string[] {
  const variations = new Set<string>();
  const lowerWord = word.toLowerCase();
  
  // Add the original word
  variations.add(word);
  
  // Try verb variations
  const verbVariations = generateVerbVariations(lowerWord);
  verbVariations.forEach(v => variations.add(v));
  
  // Try noun variations
  const nounVariations = generateNounVariations(lowerWord);
  nounVariations.forEach(v => variations.add(v));
  
  // Try adjective variations
  const adjectiveVariations = generateAdjectiveVariations(lowerWord);
  adjectiveVariations.forEach(v => variations.add(v));
  
  return Array.from(variations).filter(v => v !== lowerWord);
}

/**
 * Generate verb tense variations
 */
export function generateVerbVariations(verb: string): string[] {
  const variations: string[] = [];
  const lowerVerb = verb.toLowerCase();
  
  // Check for irregular verbs
  if (irregularVerbs[lowerVerb]) {
    const irregular = irregularVerbs[lowerVerb];
    variations.push(irregular.past);
    variations.push(irregular.pastParticiple);
    variations.push(irregular.present3rd);
    variations.push(irregular.continuous);
    return variations;
  }
  
  // Regular verb conjugations
  // Present 3rd person (he/she/it)
  if (lowerVerb.endsWith('y') && !isVowel(lowerVerb[lowerVerb.length - 2])) {
    variations.push(lowerVerb.slice(0, -1) + 'ies'); // try -> tries
  } else if (lowerVerb.endsWith('s') || lowerVerb.endsWith('sh') || lowerVerb.endsWith('ch') || 
             lowerVerb.endsWith('x') || lowerVerb.endsWith('z') || lowerVerb.endsWith('o')) {
    variations.push(lowerVerb + 'es'); // go -> goes, wash -> washes
  } else {
    variations.push(lowerVerb + 's'); // want -> wants
  }
  
  // Past tense
  if (lowerVerb.endsWith('e')) {
    variations.push(lowerVerb + 'd'); // like -> liked
  } else if (lowerVerb.endsWith('y') && !isVowel(lowerVerb[lowerVerb.length - 2])) {
    variations.push(lowerVerb.slice(0, -1) + 'ied'); // try -> tried
  } else if (shouldDoubleConsonant(lowerVerb)) {
    variations.push(lowerVerb + lowerVerb[lowerVerb.length - 1] + 'ed'); // stop -> stopped
  } else {
    variations.push(lowerVerb + 'ed'); // want -> wanted
  }
  
  // Continuous/progressive (present participle)
  if (lowerVerb.endsWith('ie')) {
    variations.push(lowerVerb.slice(0, -2) + 'ying'); // lie -> lying
  } else if (lowerVerb.endsWith('e') && !lowerVerb.endsWith('ee') && !lowerVerb.endsWith('ye') && !lowerVerb.endsWith('oe')) {
    variations.push(lowerVerb.slice(0, -1) + 'ing'); // make -> making
  } else if (shouldDoubleConsonant(lowerVerb)) {
    variations.push(lowerVerb + lowerVerb[lowerVerb.length - 1] + 'ing'); // run -> running
  } else {
    variations.push(lowerVerb + 'ing'); // want -> wanting
  }
  
  // Future tense (will + verb)
  variations.push(`will ${lowerVerb}`);
  
  // Past continuous
  variations.push(`was ${variations[variations.length - 1]}`); // was wanting
  
  return variations;
}

/**
 * Generate noun variations (plural, possessive)
 */
export function generateNounVariations(noun: string): string[] {
  const variations: string[] = [];
  const lowerNoun = noun.toLowerCase();
  
  // Check for irregular plurals
  if (irregularNouns[lowerNoun]) {
    variations.push(irregularNouns[lowerNoun]);
  } else {
    // Regular plural rules
    if (lowerNoun.endsWith('s') || lowerNoun.endsWith('ss') || lowerNoun.endsWith('sh') || 
        lowerNoun.endsWith('ch') || lowerNoun.endsWith('x') || lowerNoun.endsWith('z')) {
      variations.push(lowerNoun + 'es'); // bus -> buses, box -> boxes
    } else if (lowerNoun.endsWith('y') && !isVowel(lowerNoun[lowerNoun.length - 2])) {
      variations.push(lowerNoun.slice(0, -1) + 'ies'); // baby -> babies
    } else if (lowerNoun.endsWith('f')) {
      variations.push(lowerNoun.slice(0, -1) + 'ves'); // leaf -> leaves
    } else if (lowerNoun.endsWith('fe')) {
      variations.push(lowerNoun.slice(0, -2) + 'ves'); // knife -> knives
    } else if (lowerNoun.endsWith('o') && !isVowel(lowerNoun[lowerNoun.length - 2])) {
      variations.push(lowerNoun + 'es'); // hero -> heroes
    } else {
      variations.push(lowerNoun + 's'); // cat -> cats
    }
  }
  
  // Possessive forms
  variations.push(lowerNoun + "'s"); // cat's
  if (variations[0]) {
    variations.push(variations[0] + "'"); // cats'
  }
  
  return variations;
}

/**
 * Generate adjective variations (comparative, superlative)
 */
export function generateAdjectiveVariations(adjective: string): string[] {
  const variations: string[] = [];
  const lowerAdj = adjective.toLowerCase();
  
  // Check for irregular adjectives
  if (irregularAdjectives[lowerAdj]) {
    const irregular = irregularAdjectives[lowerAdj];
    variations.push(irregular.comparative);
    variations.push(irregular.superlative);
    return variations;
  }
  
  // One-syllable adjectives
  if (isSingleSyllable(lowerAdj)) {
    if (lowerAdj.endsWith('e')) {
      variations.push(lowerAdj + 'r'); // nice -> nicer
      variations.push(lowerAdj + 'st'); // nice -> nicest
    } else if (lowerAdj.endsWith('y')) {
      variations.push(lowerAdj.slice(0, -1) + 'ier'); // happy -> happier
      variations.push(lowerAdj.slice(0, -1) + 'iest'); // happy -> happiest
    } else if (shouldDoubleConsonant(lowerAdj)) {
      const last = lowerAdj[lowerAdj.length - 1];
      variations.push(lowerAdj + last + 'er'); // big -> bigger
      variations.push(lowerAdj + last + 'est'); // big -> biggest
    } else {
      variations.push(lowerAdj + 'er'); // fast -> faster
      variations.push(lowerAdj + 'est'); // fast -> fastest
    }
  } else {
    // Multi-syllable adjectives use "more" and "most"
    variations.push(`more ${lowerAdj}`);
    variations.push(`most ${lowerAdj}`);
  }
  
  return variations;
}

/**
 * Detect if a word is likely a verb based on common patterns
 */
export function isLikelyVerb(word: string): boolean {
  const lowerWord = word.toLowerCase();
  
  // Check if it's in irregular verbs
  if (irregularVerbs[lowerWord]) return true;
  
  // Common verb endings
  const verbEndings = ['ate', 'ify', 'ize', 'ise', 'en'];
  return verbEndings.some(ending => lowerWord.endsWith(ending));
}

/**
 * Detect if a word is likely a noun
 */
export function isLikelyNoun(word: string): boolean {
  const lowerWord = word.toLowerCase();
  
  // Check if it's in irregular nouns
  if (irregularNouns[lowerWord]) return true;
  
  // Common noun endings
  const nounEndings = ['tion', 'sion', 'ment', 'ness', 'ity', 'er', 'or', 'ist', 'ism', 'ship'];
  return nounEndings.some(ending => lowerWord.endsWith(ending));
}

/**
 * Detect if a word is likely an adjective
 */
export function isLikelyAdjective(word: string): boolean {
  const lowerWord = word.toLowerCase();
  
  // Check if it's in irregular adjectives
  if (irregularAdjectives[lowerWord]) return true;
  
  // Common adjective endings
  const adjectiveEndings = ['ful', 'less', 'ous', 'ive', 'able', 'ible', 'al', 'ic', 'ish', 'y'];
  return adjectiveEndings.some(ending => lowerWord.endsWith(ending));
}

/**
 * Get the base form of a word (lemmatization)
 */
export function getBaseForm(word: string): string {
  const lowerWord = word.toLowerCase();
  
  // Check irregular verbs
  for (const [base, forms] of Object.entries(irregularVerbs)) {
    if (forms.past === lowerWord || forms.pastParticiple === lowerWord || 
        forms.present3rd === lowerWord || forms.continuous === lowerWord) {
      return base;
    }
  }
  
  // Check irregular nouns
  for (const [base, plural] of Object.entries(irregularNouns)) {
    if (plural === lowerWord) return base;
  }
  
  // Remove common suffixes
  if (lowerWord.endsWith('ing') && lowerWord.length > 4) {
    const base = lowerWord.slice(0, -3);
    if (base.endsWith(base[base.length - 1]) && base.length > 2) {
      return base.slice(0, -1); // running -> run
    }
    return base + 'e'; // making -> make (try both)
  }
  
  if (lowerWord.endsWith('ed') && lowerWord.length > 3) {
    const base = lowerWord.slice(0, -2);
    if (base.endsWith(base[base.length - 1]) && base.length > 2) {
      return base.slice(0, -1); // stopped -> stop
    }
    return base; // wanted -> want
  }
  
  if (lowerWord.endsWith('s') && lowerWord.length > 2) {
    if (lowerWord.endsWith('ies')) {
      return lowerWord.slice(0, -3) + 'y'; // tries -> try
    }
    if (lowerWord.endsWith('es')) {
      return lowerWord.slice(0, -2); // goes -> go
    }
    return lowerWord.slice(0, -1); // wants -> want
  }
  
  return lowerWord;
}

// Helper functions
function isVowel(char: string): boolean {
  return ['a', 'e', 'i', 'o', 'u'].includes(char?.toLowerCase());
}

function shouldDoubleConsonant(word: string): boolean {
  if (word.length < 3) return false;
  const last = word[word.length - 1];
  const secondLast = word[word.length - 2];
  const thirdLast = word[word.length - 3];
  
  // CVC pattern (consonant-vowel-consonant) at the end
  return !isVowel(last) && isVowel(secondLast) && !isVowel(thirdLast) &&
         !['w', 'x', 'y'].includes(last);
}

function isSingleSyllable(word: string): boolean {
  // Simple heuristic: count vowel groups
  const vowelGroups = word.match(/[aeiou]+/gi);
  return (vowelGroups?.length || 0) <= 1;
}

/**
 * Detect tense context from sentence
 */
export function detectTenseContext(words: string[]): 'past' | 'present' | 'future' | 'unknown' {
  const lowerWords = words.map(w => w.toLowerCase());
  
  // Future indicators
  if (lowerWords.includes('will') || lowerWords.includes('going') || lowerWords.includes('gonna')) {
    return 'future';
  }
  
  // Past indicators
  if (lowerWords.includes('yesterday') || lowerWords.includes('ago') || lowerWords.includes('was') || 
      lowerWords.includes('were') || lowerWords.includes('did')) {
    return 'past';
  }
  
  // Check for past tense verbs
  for (const word of lowerWords) {
    if (word.endsWith('ed')) return 'past';
    for (const forms of Object.values(irregularVerbs)) {
      if (forms.past === word) return 'past';
    }
  }
  
  // Present indicators (default)
  if (lowerWords.includes('now') || lowerWords.includes('today') || lowerWords.includes('currently')) {
    return 'present';
  }
  
  return 'present'; // Default to present
}

/**
 * Get appropriate verb form based on context
 */
export function getVerbFormForContext(verb: string, tense: 'past' | 'present' | 'future', subject?: string): string {
  const lowerVerb = verb.toLowerCase();
  const baseForm = getBaseForm(lowerVerb);
  
  if (tense === 'future') {
    return `will ${baseForm}`;
  }
  
  if (tense === 'past') {
    if (irregularVerbs[baseForm]) {
      return irregularVerbs[baseForm].past;
    }
    // Regular past tense
    if (baseForm.endsWith('e')) return baseForm + 'd';
    if (shouldDoubleConsonant(baseForm)) return baseForm + baseForm[baseForm.length - 1] + 'ed';
    return baseForm + 'ed';
  }
  
  // Present tense
  if (subject && ['he', 'she', 'it'].includes(subject.toLowerCase())) {
    if (irregularVerbs[baseForm]) {
      return irregularVerbs[baseForm].present3rd;
    }
    // Regular 3rd person present
    if (baseForm.endsWith('y') && !isVowel(baseForm[baseForm.length - 2])) {
      return baseForm.slice(0, -1) + 'ies';
    }
    if (baseForm.endsWith('s') || baseForm.endsWith('sh') || baseForm.endsWith('ch') || 
        baseForm.endsWith('x') || baseForm.endsWith('z') || baseForm.endsWith('o')) {
      return baseForm + 'es';
    }
    return baseForm + 's';
  }
  
  return baseForm;
}
