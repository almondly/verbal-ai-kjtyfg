
/**
 * Enhanced Sentence Completion Engine - COMPLETELY REBUILT PRIORITY SYSTEM
 * 
 * CRITICAL FIX: Priority system now works at GENERATION stage, not just scoring
 * - "am" after "I" is GUARANTEED to be in top suggestions
 * - All connecting words follow strict grammatical rules
 * - Category filtering is STRICT and accurate
 */

import { detectTenseContext, getVerbFormForContext, getBaseForm } from './wordVariations';
import { getContextualAACSentences, aacSentences } from './aacSentences';

// CRITICAL: Priority tiers for suggestion generation
const PRIORITY_TIERS = {
  ULTRA_CRITICAL: 1000,  // Must-follow words like "am" after "I"
  CRITICAL: 800,         // High-priority grammatical words
  VERY_HIGH: 600,        // Important connecting words
  HIGH: 400,             // Common words and phrases
  MEDIUM: 200,           // Regular suggestions
  LOW: 100,              // Fallback suggestions
};

// ULTRA-ENHANCED: Prioritized initial words for sentence starts
const prioritizedInitialWords = [
  // Ultra-high priority (most common sentence starters)
  { word: 'I', priority: PRIORITY_TIERS.CRITICAL, context: 'First person subject' },
  { word: 'Can', priority: PRIORITY_TIERS.VERY_HIGH, context: 'Permission/ability question' },
  { word: 'What', priority: PRIORITY_TIERS.VERY_HIGH, context: 'Question word' },
  { word: 'Where', priority: PRIORITY_TIERS.VERY_HIGH, context: 'Location question' },
  { word: 'I\'m', priority: PRIORITY_TIERS.VERY_HIGH, context: 'I am contraction' },
  { word: 'Thank', priority: PRIORITY_TIERS.HIGH, context: 'Gratitude' },
  { word: 'Please', priority: PRIORITY_TIERS.HIGH, context: 'Polite request' },
  { word: 'Hi', priority: PRIORITY_TIERS.HIGH, context: 'Greeting' },
  { word: 'Hello', priority: PRIORITY_TIERS.HIGH, context: 'Greeting' },
  { word: 'Sorry', priority: PRIORITY_TIERS.HIGH, context: 'Apology' },
  { word: 'Yes', priority: PRIORITY_TIERS.HIGH, context: 'Affirmation' },
  { word: 'No', priority: PRIORITY_TIERS.HIGH, context: 'Negation' },
  
  // High priority
  { word: 'He', priority: PRIORITY_TIERS.HIGH, context: 'Third person male subject' },
  { word: 'She', priority: PRIORITY_TIERS.HIGH, context: 'Third person female subject' },
  { word: 'We', priority: PRIORITY_TIERS.HIGH, context: 'First person plural subject' },
  { word: 'They', priority: PRIORITY_TIERS.MEDIUM, context: 'Third person plural subject' },
  { word: 'You', priority: PRIORITY_TIERS.MEDIUM, context: 'Second person subject' },
  { word: 'How', priority: PRIORITY_TIERS.MEDIUM, context: 'Question word' },
  { word: 'When', priority: PRIORITY_TIERS.MEDIUM, context: 'Time question' },
  { word: 'Who', priority: PRIORITY_TIERS.MEDIUM, context: 'Person question' },
  { word: 'Why', priority: PRIORITY_TIERS.MEDIUM, context: 'Reason question' },
  { word: 'Let\'s', priority: PRIORITY_TIERS.MEDIUM, context: 'Suggestion' },
  { word: 'More', priority: PRIORITY_TIERS.MEDIUM, context: 'Quantity request' },
  { word: 'All', priority: PRIORITY_TIERS.LOW, context: 'Completion' },
  { word: 'Goodbye', priority: PRIORITY_TIERS.LOW, context: 'Farewell' },
  
  // Medium priority
  { word: 'My', priority: PRIORITY_TIERS.MEDIUM, context: 'Possessive' },
  { word: 'The', priority: PRIORITY_TIERS.MEDIUM, context: 'Article' },
  { word: 'This', priority: PRIORITY_TIERS.MEDIUM, context: 'Demonstrative' },
  { word: 'That', priority: PRIORITY_TIERS.MEDIUM, context: 'Demonstrative' },
  { word: 'It', priority: PRIORITY_TIERS.LOW, context: 'Pronoun' },
  { word: 'Mum', priority: PRIORITY_TIERS.LOW, context: 'Family member' },
  { word: 'Dad', priority: PRIORITY_TIERS.LOW, context: 'Family member' },
];

// COMPLETELY REBUILT: Connecting words with STRICT grammatical rules
interface ConnectingWord {
  word: string;
  priority: number;
  context: string;
  mustFollow?: string[];  // MUST appear after these words
  canFollow?: string[];   // CAN appear after these words
  subjectRequired?: string; // Required sentence subject
}

const prioritizedConnectingWords: ConnectingWord[] = [
  // ULTRA-CRITICAL: Linking verbs that MUST follow specific pronouns
  { 
    word: 'am', 
    priority: PRIORITY_TIERS.ULTRA_CRITICAL, 
    context: 'Linking verb (I am)', 
    mustFollow: ['i'],
  },
  { 
    word: 'is', 
    priority: PRIORITY_TIERS.CRITICAL, 
    context: 'Linking verb (he/she/it is)', 
    mustFollow: ['he', 'she', 'it', 'that', 'this'],
  },
  { 
    word: 'are', 
    priority: PRIORITY_TIERS.CRITICAL, 
    context: 'Linking verb (you/we/they are)', 
    mustFollow: ['you', 'we', 'they'],
  },
  
  // CRITICAL: Articles and prepositions
  { 
    word: 'the', 
    priority: PRIORITY_TIERS.VERY_HIGH, 
    context: 'Definite article', 
    canFollow: ['want', 'need', 'have', 'see', 'like', 'love', 'in', 'on', 'at', 'with', 'help'],
  },
  { 
    word: 'a', 
    priority: PRIORITY_TIERS.VERY_HIGH, 
    context: 'Indefinite article', 
    canFollow: ['want', 'need', 'have', 'see', 'like', 'love', 'in', 'on', 'at', 'with'],
  },
  { 
    word: 'to', 
    priority: PRIORITY_TIERS.VERY_HIGH, 
    context: 'Preposition/infinitive marker', 
    canFollow: ['want', 'need', 'like', 'love', 'go', 'going', 'have'],
  },
  
  // HIGH: Common verbs and conjunctions
  { word: 'and', priority: PRIORITY_TIERS.HIGH, context: 'Conjunction' },
  { 
    word: 'can', 
    priority: PRIORITY_TIERS.HIGH, 
    context: 'Modal verb', 
    canFollow: ['i', 'you', 'we', 'he', 'she', 'they'],
  },
  { 
    word: 'want', 
    priority: PRIORITY_TIERS.HIGH, 
    context: 'Desire verb', 
    canFollow: ['i', 'you', 'we', 'they'],
  },
  { 
    word: 'need', 
    priority: PRIORITY_TIERS.HIGH, 
    context: 'Necessity verb', 
    canFollow: ['i', 'you', 'we', 'they'],
  },
  { 
    word: 'have', 
    priority: PRIORITY_TIERS.HIGH, 
    context: 'Possession verb', 
    canFollow: ['i', 'you', 'we', 'they'],
  },
  { 
    word: 'go', 
    priority: PRIORITY_TIERS.HIGH, 
    context: 'Movement verb', 
    canFollow: ['to', 'can', 'want', 'need'],
  },
  { 
    word: 'like', 
    priority: PRIORITY_TIERS.HIGH, 
    context: 'Preference verb', 
    canFollow: ['i', 'you', 'we', 'they'],
  },
  { 
    word: 'that', 
    priority: PRIORITY_TIERS.MEDIUM, 
    context: 'Demonstrative/conjunction', 
    canFollow: ['is', 'was', 'see', 'want', 'need'],
  },
  { 
    word: 'this', 
    priority: PRIORITY_TIERS.MEDIUM, 
    context: 'Demonstrative', 
    canFollow: ['is', 'was', 'see', 'want', 'need'],
  },
  { 
    word: 'with', 
    priority: PRIORITY_TIERS.MEDIUM, 
    context: 'Preposition', 
    canFollow: ['help', 'play', 'go', 'come'],
  },
  { 
    word: 'for', 
    priority: PRIORITY_TIERS.MEDIUM, 
    context: 'Preposition', 
    canFollow: ['time', 'wait', 'look'],
  },
  { 
    word: 'in', 
    priority: PRIORITY_TIERS.MEDIUM, 
    context: 'Preposition', 
    canFollow: ['am', 'is', 'are', 'go'],
  },
  { 
    word: 'on', 
    priority: PRIORITY_TIERS.MEDIUM, 
    context: 'Preposition', 
    canFollow: ['is', 'are', 'put', 'turn'],
  },
  { 
    word: 'at', 
    priority: PRIORITY_TIERS.MEDIUM, 
    context: 'Preposition', 
    canFollow: ['am', 'is', 'are', 'look'],
  },
  { word: 'or', priority: PRIORITY_TIERS.MEDIUM, context: 'Conjunction' },
  { word: 'but', priority: PRIORITY_TIERS.LOW, context: 'Conjunction' },
  
  // CRITICAL: Possessive pronouns with subject requirements
  { 
    word: 'my', 
    priority: PRIORITY_TIERS.CRITICAL, 
    context: 'Possessive pronoun', 
    canFollow: ['want', 'need', 'have', 'lost', 'found'], 
    subjectRequired: 'i',
  },
  { 
    word: 'your', 
    priority: PRIORITY_TIERS.CRITICAL, 
    context: 'Possessive pronoun', 
    canFollow: ['want', 'need', 'have', 'lost', 'found'], 
    subjectRequired: 'you',
  },
  { 
    word: 'his', 
    priority: PRIORITY_TIERS.CRITICAL, 
    context: 'Possessive pronoun', 
    canFollow: ['wants', 'needs', 'has', 'lost', 'found', 'help', 'with'], 
    subjectRequired: 'he',
  },
  { 
    word: 'her', 
    priority: PRIORITY_TIERS.CRITICAL, 
    context: 'Possessive pronoun', 
    canFollow: ['wants', 'needs', 'has', 'lost', 'found', 'help', 'with'], 
    subjectRequired: 'she',
  },
  { 
    word: 'our', 
    priority: PRIORITY_TIERS.MEDIUM, 
    context: 'Possessive pronoun', 
    canFollow: ['want', 'need', 'have', 'lost', 'found'], 
    subjectRequired: 'we',
  },
  { 
    word: 'their', 
    priority: PRIORITY_TIERS.MEDIUM, 
    context: 'Possessive pronoun', 
    canFollow: ['want', 'need', 'have', 'lost', 'found'], 
    subjectRequired: 'they',
  },
];

// Enhanced sentence templates with pronoun variations and connecting words (Australian English)
export const sentenceTemplates = [
  // CRITICAL FIX: "I" immediately followed by "am" with ULTRA-HIGH priority
  { pattern: ['I'], completions: ['am', 'want', 'need', 'like', 'have', 'can', 'my'] },
  
  // PRONOUN TO POSSESSIVE MAPPINGS (NEW FEATURE!)
  // When user types a pronoun, suggest the possessive form
  { pattern: ['he'], completions: ['wants', 'needs', 'likes', 'has', 'is', 'can', 'his'] },
  { pattern: ['she'], completions: ['wants', 'needs', 'likes', 'has', 'is', 'can', 'her'] },
  { pattern: ['you'], completions: ['want', 'need', 'like', 'have', 'are', 'can', 'your'] },
  { pattern: ['we'], completions: ['want', 'need', 'like', 'have', 'are', 'can', 'our'] },
  { pattern: ['they'], completions: ['want', 'need', 'like', 'have', 'are', 'can', 'their'] },
  
  // Connecting words - THE
  { pattern: ['the'], completions: ['cat', 'dog', 'ball', 'book', 'toy', 'park', 'shop', 'toilet', 'car', 'bus', 'bathroom'] },
  { pattern: ['the', 'cat'], completions: ['is', 'was', 'can', 'wants', 'needs'] },
  { pattern: ['the', 'dog'], completions: ['is', 'was', 'can', 'wants', 'needs'] },
  
  // Connecting words - A
  { pattern: ['a'], completions: ['cat', 'dog', 'ball', 'book', 'toy', 'friend', 'snack', 'drink'] },
  { pattern: ['a', 'cat'], completions: ['is', 'was', 'can'] },
  { pattern: ['a', 'dog'], completions: ['is', 'was', 'can'] },
  
  // Connecting words - THAT
  { pattern: ['that'], completions: ['is', 'was', 'can', 'looks', 'sounds'] },
  { pattern: ['that', 'is'], completions: ['good', 'bad', 'nice', 'mine', 'yours', 'his', 'hers', 'loud'] },
  { pattern: ['that', 'was'], completions: ['good', 'bad', 'nice', 'fun'] },
  
  // Connecting words - THIS
  { pattern: ['this'], completions: ['is', 'was', 'can', 'looks', 'sounds'] },
  { pattern: ['this', 'is'], completions: ['good', 'bad', 'nice', 'mine', 'yours', 'my'] },
  
  // I want variations (with possessive)
  { pattern: ['I', 'want', 'to'], completions: ['go', 'play', 'eat', 'drink', 'sleep', 'read', 'draw', 'watch', 'go outside', 'go home'] },
  { pattern: ['I', 'want', 'the'], completions: ['ball', 'book', 'toy', 'red one', 'blue one', 'bathroom'] },
  { pattern: ['I', 'want', 'a'], completions: ['toy', 'book', 'snack', 'drink'] },
  { pattern: ['I', 'want'], completions: ['to', 'the', 'a', 'water', 'help', 'more', 'that'] },
  
  // You want variations (with possessive)
  { pattern: ['you', 'want', 'to'], completions: ['go', 'play', 'eat', 'drink', 'help me', 'come', 'see', 'know'] },
  { pattern: ['you', 'want', 'the'], completions: ['ball', 'book', 'toy', 'red one', 'blue one'] },
  
  // He/She wants variations (with possessive)
  { pattern: ['he', 'wants', 'to'], completions: ['go', 'play', 'eat', 'drink', 'help', 'come', 'see'] },
  { pattern: ['she', 'wants', 'to'], completions: ['go', 'play', 'eat', 'drink', 'help', 'come', 'see'] },
  { pattern: ['he', 'wants', 'the'], completions: ['ball', 'book', 'toy', 'red one', 'blue one'] },
  { pattern: ['she', 'wants', 'the'], completions: ['ball', 'book', 'toy', 'red one', 'blue one'] },
  
  // We want variations (with possessive)
  { pattern: ['we', 'want', 'to'], completions: ['go', 'play', 'eat', 'drink', 'go outside', 'play together', 'have fun'] },
  { pattern: ['we', 'want', 'the'], completions: ['ball', 'book', 'toy', 'red one', 'blue one'] },
  
  // They want variations (with possessive)
  { pattern: ['they', 'want', 'to'], completions: ['go', 'play', 'eat', 'drink', 'help', 'come', 'see'] },
  { pattern: ['they', 'want', 'the'], completions: ['ball', 'book', 'toy', 'red one', 'blue one'] },
  
  // Mum/Dad want variations
  { pattern: ['mum', 'wants'], completions: ['to go', 'to help', 'to see', 'you', 'me', 'that', 'the', 'a'] },
  { pattern: ['dad', 'wants'], completions: ['to go', 'to help', 'to see', 'you', 'me', 'that', 'the', 'a'] },
  { pattern: ['mum', 'wants', 'to'], completions: ['go', 'help', 'see', 'know'] },
  { pattern: ['dad', 'wants', 'to'], completions: ['go', 'help', 'see', 'know'] },
  
  // My sister/brother want variations
  { pattern: ['my', 'sister'], completions: ['wants', 'needs', 'is', 'can', 'has'] },
  { pattern: ['my', 'brother'], completions: ['wants', 'needs', 'is', 'can', 'has'] },
  { pattern: ['my', 'sister', 'wants'], completions: ['to play', 'to go', 'that', 'the', 'a'] },
  { pattern: ['my', 'brother', 'wants'], completions: ['to play', 'to go', 'that', 'the', 'a'] },
  { pattern: ['my', 'friend'], completions: ['wants', 'needs', 'is', 'can', 'has'] },
  { pattern: ['my', 'friend', 'wants'], completions: ['to play', 'to go', 'that', 'the', 'a'] },
  
  // I need variations
  { pattern: ['I', 'need'], completions: ['help', 'the toilet', 'the bathroom', 'water', 'food', 'a break', 'to go', 'to rest', 'mum', 'dad', 'you', 'the', 'a', 'a pencil'] },
  { pattern: ['I', 'need', 'to'], completions: ['go', 'eat', 'drink', 'sleep', 'rest', 'use toilet', 'go home'] },
  { pattern: ['I', 'need', 'the'], completions: ['toilet', 'bathroom', 'book', 'pencil'] },
  { pattern: ['I', 'need', 'a'], completions: ['break', 'drink', 'snack', 'rest', 'pencil'] },
  
  // You need variations
  { pattern: ['you', 'need'], completions: ['to help me', 'to come', 'to see', 'to know', 'this', 'that', 'the', 'a'] },
  { pattern: ['you', 'need', 'to'], completions: ['help me', 'come', 'see', 'know', 'listen'] },
  { pattern: ['you', 'need', 'the'], completions: ['book', 'pencil', 'paper'] },
  
  // He/She needs variations (with possessive suggestions)
  { pattern: ['he', 'needs'], completions: ['help', 'his', 'water', 'food', 'to go', 'to rest', 'that', 'this', 'the', 'a'] },
  { pattern: ['she', 'needs'], completions: ['help', 'her', 'water', 'food', 'to go', 'to rest', 'that', 'this', 'the', 'a'] },
  { pattern: ['he', 'needs', 'to'], completions: ['go', 'eat', 'drink', 'rest', 'help'] },
  { pattern: ['she', 'needs', 'to'], completions: ['go', 'eat', 'drink', 'rest', 'help'] },
  { pattern: ['he', 'needs', 'the'], completions: ['toilet', 'bathroom', 'book'] },
  { pattern: ['she', 'needs', 'the'], completions: ['toilet', 'bathroom', 'book'] },
  
  // Pronoun + "needs help with" pattern (possessive suggestions) - ENHANCED
  { pattern: ['he', 'needs', 'help'], completions: ['with', 'please', 'now'] },
  { pattern: ['she', 'needs', 'help'], completions: ['with', 'please', 'now'] },
  { pattern: ['I', 'need', 'help'], completions: ['with', 'please', 'now'] },
  { pattern: ['he', 'needs', 'help', 'with'], completions: ['his', 'the', 'this', 'that'] },
  { pattern: ['she', 'needs', 'help', 'with'], completions: ['her', 'the', 'this', 'that'] },
  { pattern: ['I', 'need', 'help', 'with'], completions: ['my', 'the', 'this', 'that'] },
  { pattern: ['you', 'need', 'help', 'with'], completions: ['your', 'the', 'this', 'that'] },
  { pattern: ['we', 'need', 'help', 'with'], completions: ['our', 'the', 'this', 'that'] },
  { pattern: ['they', 'need', 'help', 'with'], completions: ['their', 'the', 'this', 'that'] },
  
  // CRITICAL FIX: "help with his/her/my homework" patterns
  { pattern: ['help', 'with', 'his'], completions: ['homework', 'work', 'book', 'toy'] },
  { pattern: ['help', 'with', 'her'], completions: ['homework', 'work', 'book', 'toy'] },
  { pattern: ['help', 'with', 'my'], completions: ['homework', 'work', 'book', 'toy'] },
  { pattern: ['help', 'with', 'your'], completions: ['homework', 'work', 'book', 'toy'] },
  { pattern: ['help', 'with', 'our'], completions: ['homework', 'work', 'book', 'toy'] },
  { pattern: ['help', 'with', 'their'], completions: ['homework', 'work', 'book', 'toy'] },
  
  // CRITICAL FIX: "he wants help with his" patterns
  { pattern: ['he', 'wants', 'help'], completions: ['with', 'please', 'now'] },
  { pattern: ['she', 'wants', 'help'], completions: ['with', 'please', 'now'] },
  { pattern: ['he', 'wants', 'help', 'with'], completions: ['his', 'the', 'this', 'that'] },
  { pattern: ['she', 'wants', 'help', 'with'], completions: ['her', 'the', 'this', 'that'] },
  { pattern: ['I', 'want', 'help', 'with'], completions: ['my', 'the', 'this', 'that'] },
  
  // We need variations
  { pattern: ['we', 'need'], completions: ['help', 'water', 'food', 'to go', 'to rest', 'that', 'this', 'to go home', 'the', 'a'] },
  { pattern: ['we', 'need', 'to'], completions: ['go', 'eat', 'drink', 'rest', 'go home', 'leave'] },
  { pattern: ['we', 'need', 'the'], completions: ['toilet', 'bathroom', 'car'] },
  
  // They need variations
  { pattern: ['they', 'need'], completions: ['help', 'water', 'food', 'to go', 'to rest', 'that', 'this', 'the', 'a'] },
  { pattern: ['they', 'need', 'to'], completions: ['go', 'eat', 'drink', 'rest', 'help'] },
  { pattern: ['they', 'need', 'the'], completions: ['toilet', 'bathroom', 'book'] },
  
  // Mum/Dad need variations
  { pattern: ['mum', 'needs'], completions: ['help', 'to go', 'to rest', 'you', 'me', 'the', 'a'] },
  { pattern: ['dad', 'needs'], completions: ['help', 'to go', 'to rest', 'you', 'me', 'the', 'a'] },
  { pattern: ['mum', 'needs', 'to'], completions: ['go', 'rest', 'help'] },
  { pattern: ['dad', 'needs', 'to'], completions: ['go', 'rest', 'help'] },
  
  // My sister/brother need variations
  { pattern: ['my', 'sister', 'needs'], completions: ['help', 'water', 'food', 'to go', 'her', 'the', 'a'] },
  { pattern: ['my', 'brother', 'needs'], completions: ['help', 'water', 'food', 'to go', 'his', 'the', 'a'] },
  { pattern: ['my', 'friend', 'needs'], completions: ['help', 'water', 'food', 'to go', 'their', 'the', 'a'] },
  
  // Additional possessive pronoun patterns for common verbs
  { pattern: ['he', 'wants'], completions: ['his', 'to go', 'to play', 'to eat', 'to drink', 'some water', 'some food', 'that', 'more', 'help', 'the', 'a', 'help with his'] },
  { pattern: ['she', 'wants'], completions: ['her', 'to go', 'to play', 'to eat', 'to drink', 'some water', 'some food', 'that', 'more', 'help', 'the', 'a'] },
  { pattern: ['I', 'want'], completions: ['my', 'to go', 'to play', 'to eat', 'to drink', 'some water', 'some food', 'that', 'more', 'to go outside', 'to watch telly', 'help', 'the', 'a', 'water'] },
  { pattern: ['you', 'want'], completions: ['your', 'to go', 'to play', 'to eat', 'to drink', 'some water', 'some food', 'that', 'more', 'to help me', 'to come', 'the', 'a'] },
  { pattern: ['we', 'want'], completions: ['our', 'to go', 'to play', 'to eat', 'to drink', 'some water', 'some food', 'that', 'more', 'to go outside', 'to play together', 'the', 'a'] },
  { pattern: ['they', 'want'], completions: ['their', 'to go', 'to play', 'to eat', 'to drink', 'some water', 'some food', 'that', 'more', 'help', 'the', 'a'] },
  
  { pattern: ['he', 'likes'], completions: ['his', 'to play', 'to eat', 'this', 'that', 'it', 'playing', 'eating', 'the', 'a'] },
  { pattern: ['she', 'likes'], completions: ['her', 'to play', 'to eat', 'this', 'that', 'it', 'playing', 'eating', 'the', 'a'] },
  { pattern: ['I', 'like'], completions: ['my', 'to play', 'to eat', 'this', 'that', 'it', 'you', 'playing', 'eating', 'red', 'blue', 'the', 'a'] },
  { pattern: ['you', 'like'], completions: ['your', 'to play', 'to eat', 'this', 'that', 'it', 'playing', 'eating', 'the', 'a'] },
  { pattern: ['we', 'like'], completions: ['our', 'to play', 'to eat', 'this', 'that', 'it', 'playing', 'eating', 'playing together', 'the', 'a'] },
  { pattern: ['they', 'like'], completions: ['their', 'to play', 'to eat', 'this', 'that', 'it', 'playing', 'eating', 'the', 'a'] },
  
  { pattern: ['he', 'has'], completions: ['his', 'a toy', 'a book', 'water', 'food', 'this', 'that', 'something', 'to go', 'the', 'a'] },
  { pattern: ['she', 'has'], completions: ['her', 'a toy', 'a book', 'water', 'food', 'this', 'that', 'something', 'to go', 'the', 'a'] },
  { pattern: ['I', 'have'], completions: ['my', 'a toy', 'a book', 'water', 'food', 'this', 'that', 'something', 'to go', 'to tell you', 'the', 'a'] },
  { pattern: ['you', 'have'], completions: ['your', 'to help me', 'to come', 'to see', 'this', 'that', 'something', 'the', 'a'] },
  { pattern: ['we', 'have'], completions: ['our', 'to go', 'to eat', 'to play', 'this', 'that', 'something', 'fun', 'the', 'a'] },
  { pattern: ['they', 'have'], completions: ['their', 'to go', 'to eat', 'this', 'that', 'something', 'the', 'a'] },
  
  { pattern: ['he', 'lost'], completions: ['his', 'the', 'a', 'something'] },
  { pattern: ['she', 'lost'], completions: ['her', 'the', 'a', 'something'] },
  { pattern: ['I', 'lost'], completions: ['my', 'the', 'a', 'something'] },
  { pattern: ['you', 'lost'], completions: ['your', 'the', 'a', 'something'] },
  { pattern: ['we', 'lost'], completions: ['our', 'the', 'a', 'something'] },
  { pattern: ['they', 'lost'], completions: ['their', 'the', 'a', 'something'] },
  
  { pattern: ['he', 'found'], completions: ['his', 'the', 'a', 'something'] },
  { pattern: ['she', 'found'], completions: ['her', 'the', 'a', 'something'] },
  { pattern: ['I', 'found'], completions: ['my', 'the', 'a', 'something'] },
  { pattern: ['you', 'found'], completions: ['your', 'the', 'a', 'something'] },
  { pattern: ['we', 'found'], completions: ['our', 'the', 'a', 'something'] },
  { pattern: ['they', 'found'], completions: ['their', 'the', 'a', 'something'] },
  
  { pattern: ['he', 'brought'], completions: ['his', 'the', 'a', 'something'] },
  { pattern: ['she', 'brought'], completions: ['her', 'the', 'a', 'something'] },
  { pattern: ['I', 'brought'], completions: ['my', 'the', 'a', 'something'] },
  { pattern: ['you', 'brought'], completions: ['your', 'the', 'a', 'something'] },
  { pattern: ['we', 'brought'], completions: ['our', 'the', 'a', 'something'] },
  { pattern: ['they', 'brought'], completions: ['their', 'the', 'a', 'something'] },
  
  { pattern: ['he', 'forgot'], completions: ['his', 'the', 'a', 'something', 'to'] },
  { pattern: ['she', 'forgot'], completions: ['her', 'the', 'a', 'something', 'to'] },
  { pattern: ['I', 'forgot'], completions: ['my', 'the', 'a', 'something', 'to'] },
  { pattern: ['you', 'forgot'], completions: ['your', 'the', 'a', 'something', 'to'] },
  { pattern: ['we', 'forgot'], completions: ['our', 'the', 'a', 'something', 'to'] },
  { pattern: ['they', 'forgot'], completions: ['their', 'the', 'a', 'something', 'to'] },
  
  // I like variations (with possessive)
  { pattern: ['I', 'like', 'to'], completions: ['play', 'eat', 'read', 'draw', 'watch', 'listen', 'go outside'] },
  { pattern: ['I', 'like', 'the'], completions: ['red one', 'blue one', 'big one', 'small one'] },
  
  // You like variations (with possessive)
  { pattern: ['you', 'like', 'to'], completions: ['play', 'eat', 'read', 'draw', 'watch', 'help'] },
  { pattern: ['you', 'like', 'the'], completions: ['red one', 'blue one', 'big one', 'small one'] },
  
  // He/She likes variations (with possessive)
  { pattern: ['he', 'likes', 'to'], completions: ['play', 'eat', 'read', 'draw', 'watch'] },
  { pattern: ['she', 'likes', 'to'], completions: ['play', 'eat', 'read', 'draw', 'watch'] },
  { pattern: ['he', 'likes', 'the'], completions: ['red one', 'blue one', 'big one', 'small one'] },
  { pattern: ['she', 'likes', 'the'], completions: ['red one', 'blue one', 'big one', 'small one'] },
  
  // We like variations (with possessive)
  { pattern: ['we', 'like', 'to'], completions: ['play', 'eat', 'play together', 'have fun', 'go outside'] },
  { pattern: ['we', 'like', 'the'], completions: ['red one', 'blue one', 'big one', 'small one'] },
  
  // They like variations (with possessive)
  { pattern: ['they', 'like', 'to'], completions: ['play', 'eat', 'read', 'draw', 'watch'] },
  { pattern: ['they', 'like', 'the'], completions: ['red one', 'blue one', 'big one', 'small one'] },
  
  // Mum/Dad like variations
  { pattern: ['mum', 'likes'], completions: ['to go', 'to help', 'this', 'that', 'the', 'a'] },
  { pattern: ['dad', 'likes'], completions: ['to go', 'to help', 'this', 'that', 'the', 'a'] },
  
  // My sister/brother like variations
  { pattern: ['my', 'sister', 'likes'], completions: ['to play', 'to eat', 'this', 'that', 'the', 'a'] },
  { pattern: ['my', 'brother', 'likes'], completions: ['to play', 'to eat', 'this', 'that', 'the', 'a'] },
  { pattern: ['my', 'friend', 'likes'], completions: ['to play', 'to eat', 'this', 'that', 'the', 'a'] },
  
  // I have variations (with possessive)
  { pattern: ['I', 'have', 'to'], completions: ['go', 'eat', 'sleep', 'tell you', 'go home', 'use toilet'] },
  { pattern: ['I', 'have', 'the'], completions: ['ball', 'book', 'toy', 'red one', 'blue one'] },
  { pattern: ['I', 'have', 'a'], completions: ['toy', 'book', 'ball', 'question'] },
  
  // You have variations (with possessive)
  { pattern: ['you', 'have', 'to'], completions: ['help me', 'come', 'see', 'listen', 'know'] },
  { pattern: ['you', 'have', 'the'], completions: ['ball', 'book', 'toy', 'red one', 'blue one'] },
  
  // He/She has variations (with possessive)
  { pattern: ['he', 'has', 'to'], completions: ['go', 'eat', 'sleep', 'go home', 'leave'] },
  { pattern: ['she', 'has', 'to'], completions: ['go', 'eat', 'sleep', 'go home', 'leave'] },
  { pattern: ['he', 'has', 'the'], completions: ['ball', 'book', 'toy', 'red one', 'blue one'] },
  { pattern: ['she', 'has', 'the'], completions: ['ball', 'book', 'toy', 'red one', 'blue one'] },
  
  // We have variations (with possessive)
  { pattern: ['we', 'have', 'to'], completions: ['go', 'eat', 'play', 'go home', 'leave', 'finish'] },
  { pattern: ['we', 'have', 'the'], completions: ['ball', 'book', 'toy', 'red one', 'blue one'] },
  
  // They have variations (with possessive)
  { pattern: ['they', 'have', 'to'], completions: ['go', 'eat', 'leave', 'finish'] },
  { pattern: ['they', 'have', 'the'], completions: ['ball', 'book', 'toy', 'red one', 'blue one'] },
  
  // Mum/Dad have variations
  { pattern: ['mum', 'has'], completions: ['to go', 'to help', 'this', 'that', 'the', 'a'] },
  { pattern: ['dad', 'has'], completions: ['to go', 'to help', 'this', 'that', 'the', 'a'] },
  
  // My sister/brother have variations
  { pattern: ['my', 'sister', 'has'], completions: ['a toy', 'a book', 'to go', 'the', 'a'] },
  { pattern: ['my', 'brother', 'has'], completions: ['a toy', 'a book', 'to go', 'the', 'a'] },
  { pattern: ['my', 'friend', 'has'], completions: ['a toy', 'a book', 'to go', 'the', 'a'] },
  
  // I love variations
  { pattern: ['I', 'love'], completions: ['you', 'this', 'that', 'it', 'playing', 'eating', 'mum', 'dad', 'my family', 'the', 'a'] },
  
  // You love variations
  { pattern: ['you', 'love'], completions: ['this', 'that', 'it', 'playing', 'me', 'the', 'a'] },
  
  // He/She loves variations
  { pattern: ['he', 'loves'], completions: ['this', 'that', 'it', 'playing', 'eating', 'the', 'a'] },
  { pattern: ['she', 'loves'], completions: ['this', 'that', 'it', 'playing', 'eating', 'the', 'a'] },
  
  // We love variations
  { pattern: ['we', 'love'], completions: ['this', 'that', 'it', 'playing', 'eating', 'playing together', 'the', 'a'] },
  
  // They love variations
  { pattern: ['they', 'love'], completions: ['this', 'that', 'it', 'playing', 'eating', 'the', 'a'] },
  
  // Mum/Dad love variations
  { pattern: ['mum', 'loves'], completions: ['you', 'me', 'us', 'this', 'that', 'the', 'a'] },
  { pattern: ['dad', 'loves'], completions: ['you', 'me', 'us', 'this', 'that', 'the', 'a'] },
  
  // My sister/brother love variations
  { pattern: ['my', 'sister', 'loves'], completions: ['to play', 'this', 'that', 'the', 'a'] },
  { pattern: ['my', 'brother', 'loves'], completions: ['to play', 'this', 'that', 'the', 'a'] },
  
  // Questions with diverse subjects
  { pattern: ['what'], completions: ['is your name', 'time is it', 'are you doing', 'do you want', 'is that', 'happened', 'do I need', 'do we need', 'does he want', 'does she want'] },
  { pattern: ['what', 'is'], completions: ['your name', 'that', 'the time', 'happening', 'for lunch', 'for tea', 'his name', 'her name'] },
  { pattern: ['what', 'do'], completions: ['you want', 'I need', 'we need', 'they want', 'you need'] },
  { pattern: ['what', 'does'], completions: ['he want', 'she want', 'he need', 'she need', 'mum want', 'dad want'] },
  
  { pattern: ['where'], completions: ['are you', 'is it', 'are we going', 'do you live', 'is the toilet', 'is mum', 'is dad', 'are they', 'is he', 'is she', 'is my sister', 'is my brother'] },
  { pattern: ['where', 'is'], completions: ['it', 'the toilet', 'mum', 'dad', 'my toy', 'my book', 'he', 'she', 'my sister', 'my brother', 'my friend'] },
  { pattern: ['where', 'are'], completions: ['you', 'we going', 'they', 'we'] },
  
  { pattern: ['when'], completions: ['are we going', 'is lunch', 'is tea', 'can we go', 'will you be back', 'do we leave', 'does he come', 'does she come'] },
  
  { pattern: ['why'], completions: ['are you sad', 'are you happy', 'not', 'is that', 'do we have to', 'is he sad', 'is she happy', 'are they sad'] },
  
  { pattern: ['who'], completions: ['is that', 'are you', 'is coming', 'wants to play', 'needs help', 'is he', 'is she'] },
  
  { pattern: ['how'], completions: ['are you', 'are you going', 'was your day', 'do you feel', 'old are you', 'is he', 'is she', 'are they'] },
  
  // Can/Could/Would with pronoun variations
  { pattern: ['can', 'I'], completions: ['have', 'go', 'play', 'please', 'have water', 'have food', 'go outside', 'have the', 'have a', 'have that'] },
  { pattern: ['can', 'you'], completions: ['help me', 'please', 'show me', 'teach me', 'come here', 'give me the', 'give me a'] },
  { pattern: ['can', 'we'], completions: ['go', 'play', 'eat', 'have', 'go outside', 'go home', 'have the', 'have a'] },
  { pattern: ['can', 'he'], completions: ['come', 'help', 'play', 'go', 'have the', 'have a'] },
  { pattern: ['can', 'she'], completions: ['come', 'help', 'play', 'go', 'have the', 'have a'] },
  { pattern: ['can', 'they'], completions: ['come', 'help', 'play', 'go', 'have the', 'have a'] },
  { pattern: ['can', 'mum'], completions: ['come', 'help', 'go', 'have the', 'have a'] },
  { pattern: ['can', 'dad'], completions: ['come', 'help', 'go', 'have the', 'have a'] },
  { pattern: ['can', 'my', 'sister'], completions: ['come', 'play', 'go', 'have the', 'have a'] },
  { pattern: ['can', 'my', 'brother'], completions: ['come', 'play', 'go', 'have the', 'have a'] },
  
  { pattern: ['could', 'I'], completions: ['have', 'please', 'go', 'play', 'have the', 'have a'] },
  { pattern: ['could', 'you'], completions: ['help me', 'please', 'show me', 'give me the', 'give me a'] },
  { pattern: ['could', 'we'], completions: ['go', 'play', 'have', 'have the', 'have a'] },
  { pattern: ['could', 'he'], completions: ['come', 'help', 'go', 'have the', 'have a'] },
  { pattern: ['could', 'she'], completions: ['come', 'help', 'go', 'have the', 'have a'] },
  
  { pattern: ['would', 'you'], completions: ['like', 'please', 'help me', 'like the', 'like a'] },
  { pattern: ['would', 'I'], completions: ['like', 'like to', 'like some', 'like the', 'like a'] },
  { pattern: ['would', 'we'], completions: ['like', 'like to', 'like some', 'like the', 'like a'] },
  { pattern: ['would', 'he'], completions: ['like', 'like to', 'like the', 'like a'] },
  { pattern: ['would', 'she'], completions: ['like', 'like to', 'like the', 'like a'] },
  
  // Feelings with pronoun variations
  { pattern: ['I', 'feel'], completions: ['happy', 'sad', 'tired', 'excited', 'scared', 'angry', 'good', 'bad', 'sick'] },
  { pattern: ['you', 'feel'], completions: ['happy', 'sad', 'tired', 'excited', 'good', 'bad'] },
  { pattern: ['he', 'feels'], completions: ['happy', 'sad', 'tired', 'excited', 'good', 'bad'] },
  { pattern: ['she', 'feels'], completions: ['happy', 'sad', 'tired', 'excited', 'good', 'bad'] },
  { pattern: ['we', 'feel'], completions: ['happy', 'sad', 'tired', 'excited', 'good', 'bad'] },
  { pattern: ['they', 'feel'], completions: ['happy', 'sad', 'tired', 'excited', 'good', 'bad'] },
  { pattern: ['mum', 'feels'], completions: ['happy', 'sad', 'tired', 'good', 'bad'] },
  { pattern: ['dad', 'feels'], completions: ['happy', 'sad', 'tired', 'good', 'bad'] },
  { pattern: ['my', 'sister', 'feels'], completions: ['happy', 'sad', 'tired', 'excited'] },
  { pattern: ['my', 'brother', 'feels'], completions: ['happy', 'sad', 'tired', 'excited'] },
  
  { pattern: ['I', 'am'], completions: ['happy', 'sad', 'tired', 'excited', 'hungry', 'thirsty', 'ready', 'finished', 'reading', 'eating'] },
  { pattern: ['you', 'are'], completions: ['happy', 'sad', 'tired', 'excited', 'ready', 'nice'] },
  { pattern: ['he', 'is'], completions: ['happy', 'sad', 'tired', 'excited', 'hungry', 'ready'] },
  { pattern: ['she', 'is'], completions: ['happy', 'sad', 'tired', 'excited', 'hungry', 'ready'] },
  { pattern: ['we', 'are'], completions: ['happy', 'sad', 'tired', 'excited', 'ready', 'going', 'eating'] },
  { pattern: ['they', 'are'], completions: ['happy', 'sad', 'tired', 'excited', 'ready', 'coming'] },
  { pattern: ['mum', 'is'], completions: ['happy', 'sad', 'tired', 'ready', 'here', 'coming'] },
  { pattern: ['dad', 'is'], completions: ['happy', 'sad', 'tired', 'ready', 'here', 'coming'] },
  { pattern: ['my', 'sister', 'is'], completions: ['happy', 'sad', 'tired', 'ready', 'here'] },
  { pattern: ['my', 'brother', 'is'], completions: ['happy', 'sad', 'tired', 'ready', 'here'] },
  { pattern: ['I\'m'], completions: ['happy', 'sad', 'tired', 'excited', 'hungry', 'thirsty', 'ready', 'finished', 'sorry', 'sick'] },
  
  // "It is" patterns for descriptions
  { pattern: ['it', 'is'], completions: ['big', 'small', 'red', 'blue', 'green', 'yellow', 'loud', 'quiet', 'hot', 'cold'] },
  { pattern: ['it', 'is', 'big'], completions: ['and red', 'and blue', 'and green', 'and yellow', 'and orange', 'and purple', 'and pink', 'and black', 'and white', 'and brown'] },
  { pattern: ['it', 'is', 'big', 'and'], completions: ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'black', 'white', 'brown'] },
  
  // "I see" patterns
  { pattern: ['I', 'see'], completions: ['a dog', 'a cat', 'a bird', 'a car', 'the', 'a'] },
  { pattern: ['I', 'see', 'a'], completions: ['dog', 'cat', 'bird', 'car', 'ball', 'book'] },
  
  // "That is" patterns
  { pattern: ['that', 'is'], completions: ['loud', 'quiet', 'big', 'small', 'nice', 'good', 'bad'] },
  
  // Actions
  { pattern: ['want', 'to'], completions: ['go', 'play', 'eat', 'drink', 'sleep', 'read', 'draw', 'watch'] },
  { pattern: ['need', 'to'], completions: ['go', 'eat', 'drink', 'sleep', 'rest', 'use toilet'] },
  { pattern: ['like', 'to'], completions: ['play', 'eat', 'read', 'draw', 'watch', 'listen'] },
  { pattern: ['going', 'to'], completions: ['school', 'home', 'park', 'shop', 'play', 'eat', 'the'] },
  
  // Places
  { pattern: ['go', 'to'], completions: ['school', 'home', 'park', 'shop', 'bed', 'toilet', 'outside', 'the'] },
  { pattern: ['at'], completions: ['home', 'school', 'the park', 'the shop'] },
  { pattern: ['in'], completions: ['the house', 'the car', 'my room', 'the garden', 'bed'] },
  
  // Time
  { pattern: ['time', 'to'], completions: ['go', 'eat', 'sleep', 'play', 'leave', 'go home'] },
  { pattern: ['time', 'for'], completions: ['lunch', 'tea', 'brekkie', 'bed', 'school'] },
  
  // Greetings
  { pattern: ['good'], completions: ['morning', 'afternoon', 'evening', 'day', 'night'] },
  { pattern: ['how', 'are'], completions: ['you', 'you going', 'you feeling', 'they', 'we'] },
  
  // Politeness
  { pattern: ['thank'], completions: ['you', 'you very much', 'you mate'] },
  { pattern: ['please'], completions: ['can I', 'help me', 'thank you'] },
  { pattern: ['excuse'], completions: ['me', 'me please'] },
  
  // Family
  { pattern: ['where', 'is'], completions: ['mum', 'dad', 'my mate', 'my friend', 'my sister', 'my brother'] },
  { pattern: ['I', 'want'], completions: ['mum', 'dad', 'my toy', 'my book', 'my sister', 'my brother', 'water', 'to go', 'the', 'a'] },
  { pattern: ['my'], completions: ['mum', 'dad', 'mate', 'friend', 'toy', 'book', 'favourite', 'sister', 'brother'] },
  
  // Food
  { pattern: ['I\'m'], completions: ['hungry', 'thirsty', 'starving', 'peckish'] },
  { pattern: ['want', 'some'], completions: ['water', 'food', 'tucker', 'lunch', 'tea'] },
  { pattern: ['have'], completions: ['water', 'food', 'lunch', 'tea', 'a snack', 'a drink', 'the', 'a'] },
  
  // Activities
  { pattern: ['play'], completions: ['outside', 'with toys', 'games', 'with mates', 'at the park', 'together', 'a game'] },
  { pattern: ['watch'], completions: ['telly', 'TV', 'a movie', 'cartoons', 'the'] },
  { pattern: ['read'], completions: ['a book', 'a story', 'with me', 'the'] },
  { pattern: ['draw'], completions: ['a picture', 'with me', 'something'] },
  
  // GO variations with subjects
  { pattern: ['go'], completions: ['home', 'outside', 'to school', 'to the park', 'to the shop', 'to bed', 'with me', 'with him', 'with her'] },
  { pattern: ['go', 'to'], completions: ['school', 'home', 'the park', 'the shop', 'bed', 'the toilet'] },
  { pattern: ['go', 'with'], completions: ['me', 'you', 'him', 'her', 'them', 'mum', 'dad'] },
  { pattern: ['go', 'play'], completions: ['home', 'outside', 'at school', 'at the park', 'together', 'with him', 'with her'] },
  
  // "Let's" patterns
  { pattern: ['let\'s'], completions: ['play', 'go', 'eat', 'do math', 'play a game', 'read'] },
  { pattern: ['let\'s', 'play'], completions: ['a game', 'outside', 'together'] },
  
  // "More" patterns
  { pattern: ['more'], completions: ['please', 'water', 'food'] },
  
  // "All" patterns
  { pattern: ['all'], completions: ['done', 'finished'] },
  
  // "Turn" patterns
  { pattern: ['turn'], completions: ['the page', 'around', 'left', 'right'] },
  
  // "I finished" patterns
  { pattern: ['I', 'finished'], completions: ['my work', 'eating', 'reading', 'playing'] },
  
  // "I don't" patterns
  { pattern: ['I', 'don\'t'], completions: ['understand', 'like this', 'know', 'want that'] },
];

// PERFORMANCE OPTIMIZATION: Cache for sentence completions
const completionCache = new Map<string, string[]>();
const COMPLETION_CACHE_SIZE = 200;

/**
 * Find sentence completions based on current words
 * OPTIMIZED: Now uses caching to reduce redundant calculations
 */
export function findSentenceCompletions(currentWords: string[], maxCompletions: number = 5): string[] {
  const cacheKey = `${currentWords.join('|')}|${maxCompletions}`;
  
  // Check cache first
  if (completionCache.has(cacheKey)) {
    return completionCache.get(cacheKey)!;
  }
  
  const completions: string[] = [];
  const lowerWords = currentWords.map(w => w.toLowerCase());
  
  // Try to match sentence templates
  for (const template of sentenceTemplates) {
    const patternLength = template.pattern.length;
    
    // Check if current words match the pattern
    if (lowerWords.length >= patternLength) {
      const lastWords = lowerWords.slice(-patternLength);
      const patternMatches = template.pattern.every((word, index) => 
        lastWords[index] === word.toLowerCase()
      );
      
      if (patternMatches) {
        completions.push(...template.completions);
      }
    }
    
    // Also check if current words are a prefix of the pattern
    if (lowerWords.length < patternLength) {
      const isPrefix = lowerWords.every((word, index) => 
        template.pattern[index]?.toLowerCase() === word
      );
      
      if (isPrefix) {
        // Suggest the next word in the pattern
        const nextWord = template.pattern[lowerWords.length];
        if (nextWord && !completions.includes(nextWord)) {
          completions.push(nextWord);
        }
      }
    }
  }
  
  const result = completions.slice(0, maxCompletions);
  
  // Cache the result
  if (completionCache.size > COMPLETION_CACHE_SIZE) {
    // Clear oldest entries
    const firstKey = completionCache.keys().next().value;
    completionCache.delete(firstKey);
  }
  completionCache.set(cacheKey, result);
  
  return result;
}

/**
 * Generate complete sentence suggestions from partial input
 * Now integrates AAC sentence database
 */
export function generateCompleteSentences(
  currentWords: string[],
  userPhrases: Map<string, number>,
  maxSuggestions: number = 3
): string[] {
  const suggestions: string[] = [];
  const currentText = currentWords.join(' ').toLowerCase();
  
  // First, try AAC sentences (highest priority)
  const aacSuggestions = getContextualAACSentences(currentWords, maxSuggestions);
  suggestions.push(...aacSuggestions);
  
  // If we need more suggestions, find user phrases that start with current text
  if (suggestions.length < maxSuggestions) {
    const matchingPhrases: { phrase: string; frequency: number }[] = [];
    
    userPhrases.forEach((frequency, phrase) => {
      if (phrase.startsWith(currentText) && phrase !== currentText && !suggestions.includes(phrase)) {
        matchingPhrases.push({ phrase, frequency });
      }
    });
    
    // Sort by frequency
    matchingPhrases.sort((a, b) => b.frequency - a.frequency);
    
    // Add top matching phrases
    matchingPhrases.slice(0, maxSuggestions - suggestions.length).forEach(({ phrase }) => {
      suggestions.push(phrase);
    });
  }
  
  // If we still don't have enough suggestions, try template-based completion
  if (suggestions.length < maxSuggestions) {
    const templateCompletions = findSentenceCompletions(currentWords, maxSuggestions - suggestions.length);
    
    templateCompletions.forEach(completion => {
      const fullSentence = [...currentWords, completion].join(' ');
      if (!suggestions.includes(fullSentence)) {
        suggestions.push(fullSentence);
      }
    });
  }
  
  return suggestions.slice(0, maxSuggestions);
}

/**
 * Predict next words based on n-gram patterns
 */
export function predictNextWords(
  currentWords: string[],
  transitions: Map<string, Map<string, number>>,
  maxPredictions: number = 5
): { word: string; confidence: number }[] {
  const predictions: { word: string; confidence: number }[] = [];
  
  if (currentWords.length === 0) return predictions;
  
  const lastWord = currentWords[currentWords.length - 1].toLowerCase();
  const lastTwoWords = currentWords.length >= 2 
    ? `${currentWords[currentWords.length - 2].toLowerCase()} ${lastWord}`
    : null;
  
  // Try bigram (two-word) predictions first
  if (lastTwoWords && transitions.has(lastTwoWords)) {
    const nextWords = transitions.get(lastTwoWords)!;
    nextWords.forEach((frequency, word) => {
      predictions.push({ word, confidence: frequency });
    });
  }
  
  // Try unigram (single-word) predictions
  if (transitions.has(lastWord)) {
    const nextWords = transitions.get(lastWord)!;
    nextWords.forEach((frequency, word) => {
      if (!predictions.find(p => p.word === word)) {
        predictions.push({ word, confidence: frequency * 0.7 }); // Lower confidence for unigrams
      }
    });
  }
  
  // Sort by confidence and return top predictions
  return predictions
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, maxPredictions);
}

/**
 * Analyze sentence structure to provide contextual suggestions
 */
export function analyzeSentenceStructure(words: string[]): {
  hasSubject: boolean;
  hasVerb: boolean;
  hasObject: boolean;
  tense: 'past' | 'present' | 'future' | 'unknown';
  suggestedNextType: 'verb' | 'noun' | 'adjective' | 'adverb' | 'preposition' | 'unknown';
  subject?: string;
} {
  const lowerWords = words.map(w => w.toLowerCase());
  
  // Detect subject (I, you, he, she, it, we, they, mum, dad, my sister, my brother, or nouns)
  const subjects = ['i', 'you', 'he', 'she', 'it', 'we', 'they', 'this', 'that', 'mum', 'dad', 'my', 'the', 'a'];
  const hasSubject = lowerWords.some(w => subjects.includes(w));
  
  // Find the actual subject for possessive pronoun suggestions
  let subject: string | undefined;
  for (const word of lowerWords) {
    if (['i', 'you', 'he', 'she', 'we', 'they'].includes(word)) {
      subject = word;
      break;
    }
  }
  
  // Detect verb (simple heuristic)
  const commonVerbs = ['am', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 
                       'do', 'does', 'did', 'will', 'would', 'can', 'could', 'should', 'may', 'might',
                       'want', 'need', 'like', 'love', 'go', 'come', 'see', 'know', 'think', 'feel',
                       'wants', 'needs', 'likes', 'loves', 'goes', 'comes', 'sees', 'knows', 'thinks', 'feels'];
  const hasVerb = lowerWords.some(w => commonVerbs.includes(w) || w.endsWith('ing') || w.endsWith('ed'));
  
  // Detect object (anything after verb)
  const hasObject = hasVerb && lowerWords.length > 2;
  
  // Detect tense
  const tense = detectTenseContext(words);
  
  // Suggest next word type
  let suggestedNextType: 'verb' | 'noun' | 'adjective' | 'adverb' | 'preposition' | 'unknown' = 'unknown';
  
  if (!hasSubject) {
    suggestedNextType = 'noun'; // Need a subject
  } else if (!hasVerb) {
    suggestedNextType = 'verb'; // Need a verb
  } else if (!hasObject) {
    suggestedNextType = 'noun'; // Need an object
  } else {
    suggestedNextType = 'preposition'; // Might need a preposition or adjective
  }
  
  return { hasSubject, hasVerb, hasObject, tense, suggestedNextType, subject };
}

/**
 * COMPLETELY REBUILT: Score and rank sentence suggestions
 * 
 * CRITICAL FIX: Priority-based scoring at GENERATION stage
 * - Words are scored based on their priority tier
 * - Grammatical rules are STRICTLY enforced
 * - "am" after "I" gets ULTRA_CRITICAL priority
 */
export function scoreSuggestions(
  suggestions: { text: string; type: string; confidence: number }[],
  currentWords: string[],
  userFrequency: Map<string, number>
): { text: string; type: string; confidence: number; score: number }[] {
  return suggestions.map(suggestion => {
    let score = suggestion.confidence;
    const suggestionLower = suggestion.text.toLowerCase();
    const lastWord = currentWords.length > 0 ? currentWords[currentWords.length - 1].toLowerCase() : '';
    
    // Analyze sentence structure to get subject
    const structure = analyzeSentenceStructure(currentWords);
    const sentenceSubject = structure.subject;
    
    // CRITICAL: Apply priority tier bonuses
    if (currentWords.length === 0) {
      const prioritizedWord = prioritizedInitialWords.find(
        pw => pw.word.toLowerCase() === suggestionLower
      );
      if (prioritizedWord) {
        score += prioritizedWord.priority;
      }
    }
    
    // ULTRA-CRITICAL: Check connecting words with STRICT grammatical rules
    const connectingWord = prioritizedConnectingWords.find(
      cw => cw.word.toLowerCase() === suggestionLower
    );
    
    if (connectingWord) {
      // Base priority bonus
      score += connectingWord.priority;
      
      // ULTRA-CRITICAL: mustFollow rules (e.g., "am" MUST follow "I")
      if (connectingWord.mustFollow && connectingWord.mustFollow.includes(lastWord)) {
        score += PRIORITY_TIERS.ULTRA_CRITICAL;
        console.log(`🔥 ULTRA-CRITICAL BOOST: "${suggestionLower}" must follow "${lastWord}" - score: ${score}`);
      }
      
      // CRITICAL: canFollow rules (e.g., "the" CAN follow "want")
      if (connectingWord.canFollow && connectingWord.canFollow.includes(lastWord)) {
        score += PRIORITY_TIERS.CRITICAL;
      }
      
      // CRITICAL: subjectRequired rules (e.g., "my" requires subject "I")
      if (connectingWord.subjectRequired && sentenceSubject === connectingWord.subjectRequired) {
        score += PRIORITY_TIERS.CRITICAL;
      }
    }
    
    // Boost score based on user frequency
    const userFreq = userFrequency.get(suggestionLower) || 0;
    score += userFreq * 0.15;
    
    // Boost for grammatically complete suggestions
    const suggestionStructure = analyzeSentenceStructure([...currentWords, suggestion.text]);
    if (suggestionStructure.hasSubject && suggestionStructure.hasVerb) {
      score += PRIORITY_TIERS.LOW;
    }
    
    // Boost for suggestions that complete missing grammatical elements
    const currentStructure = analyzeSentenceStructure(currentWords);
    if (!currentStructure.hasVerb && suggestionStructure.hasVerb) {
      score += PRIORITY_TIERS.MEDIUM;
    }
    if (!currentStructure.hasSubject && suggestionStructure.hasSubject) {
      score += PRIORITY_TIERS.MEDIUM;
    }
    
    // Boost score for contextually appropriate suggestions
    if (suggestion.type === 'completion' || suggestion.type === 'common_phrase') {
      score += PRIORITY_TIERS.LOW;
    }
    
    // Boost score for AAC sentences
    if (suggestion.type === 'aac_sentence') {
      score += PRIORITY_TIERS.MEDIUM;
    }
    
    // Boost score for category-contextual suggestions
    if (suggestion.type === 'category_contextual') {
      score += PRIORITY_TIERS.MEDIUM;
    }
    
    // Boost score for polite endings
    if (suggestion.type === 'polite_ending') {
      score += PRIORITY_TIERS.LOW;
    }
    
    // CRITICAL: ULTRA-HIGH boost for full sentence suggestions
    if (suggestion.type === 'full_sentence') {
      score += PRIORITY_TIERS.VERY_HIGH;
    }
    
    return { ...suggestion, score };
  }).sort((a, b) => b.score - a.score);
}

// PERFORMANCE OPTIMIZATION: Cache for category-relevant words
const categoryCache = new Map<string, string[]>();
const CATEGORY_CACHE_SIZE = 100;

/**
 * ULTRA-ENHANCED: Get category-relevant words for contextual suggestions
 * This is the FIXED core of the category-aware recommendation system
 * Now properly filters words that are ACTUALLY in the selected category
 * OPTIMIZED: Now uses caching to reduce redundant calculations
 * CRITICAL FIX: Stricter category filtering to prevent irrelevant suggestions
 */
export function getCategoryRelevantWords(
  currentWords: string[],
  category: string,
  availableWords: string[],
  categoryTiles?: { text: string; category: string }[]
): string[] {
  const cacheKey = `${currentWords.join('|')}|${category}|${availableWords.length}`;
  
  // Check cache first
  if (categoryCache.has(cacheKey)) {
    return categoryCache.get(cacheKey)!;
  }
  
  console.log('🎯 Getting category-relevant words for:', { 
    category, 
    currentWords, 
    availableWordsCount: availableWords.length,
    hasCategoryTiles: !!categoryTiles 
  });
  
  // CRITICAL FIX: STRICT category filtering - ONLY show words from the selected category
  let categoryWords = availableWords;
  if (categoryTiles && categoryTiles.length > 0 && category !== 'all' && category !== 'keyboard') {
    const categoryWordSet = new Set(
      categoryTiles
        .filter(tile => tile.category === category)
        .map(tile => tile.text.toLowerCase())
    );
    
    // STRICT FILTERING: Only include words that are EXACTLY in this category
    categoryWords = availableWords.filter(word => categoryWordSet.has(word.toLowerCase()));
    
    console.log('✅ STRICT category filtering applied:', { 
      category,
      originalCount: availableWords.length, 
      categoryCount: categoryWords.length,
      categoryWords: categoryWords.slice(0, 10)
    });
    
    // If no category words found, return empty array (don't show irrelevant words)
    if (categoryWords.length === 0) {
      console.log('⚠️ No words found in category, returning empty array');
      categoryCache.set(cacheKey, []);
      return [];
    }
  }
  
  // CRITICAL FIX: Remove generic connecting words from category keywords
  // These should only appear when grammatically appropriate, not as category suggestions
  const categoryKeywords: { [key: string]: string[] } = {
    'greetings': ['hello', 'hi', 'goodbye', 'bye', 'how are you', 'please', 'thank you', 'yes', 'no', 'good', 'bad', 'good morning', 'good afternoon', 'good evening', 'good night', 'see you', 'see you later', 'welcome', 'sorry', 'excuse me'],
    'core': ['I', 'you', 'he', 'she', 'we', 'they', 'want', 'need', 'like', 'help', 'more', 'go', 'stop', 'yes', 'no', 'please', 'thank you', 'can', 'use', 'borrow'],
    'people': ['mum', 'dad', 'mom', 'mother', 'father', 'friend', 'teacher', 'family', 'brother', 'sister', 'mate', 'grandma', 'grandpa', 'he', 'she', 'they', 'boy', 'girl', 'man', 'woman', 'baby'],
    'actions': ['eat', 'drink', 'play', 'sleep', 'walk', 'run', 'read', 'write', 'watch', 'listen', 'sit', 'stand', 'jump', 'dance', 'go', 'sing', 'draw', 'give', 'take', 'throw', 'catch', 'push', 'pull', 'wash', 'clean'],
    'feelings': ['happy', 'sad', 'angry', 'scared', 'excited', 'tired', 'love', 'worried', 'calm', 'hurt', 'sick', 'good', 'bad', 'feel', 'surprised', 'bored', 'confused'],
    'food': ['water', 'juice', 'milk', 'apple', 'banana', 'bread', 'snack', 'lunch', 'dinner', 'breakfast', 'hungry', 'thirsty', 'eat', 'drink', 'cheese', 'cookie', 'cake', 'pizza', 'sandwich', 'egg', 'chicken', 'fish', 'carrot'],
    'home': ['house', 'bed', 'bathroom', 'kitchen', 'TV', 'door', 'window', 'room', 'bedroom', 'toilet', 'sleep', 'rest', 'chair', 'table', 'living room', 'phone', 'computer', 'tablet'],
    'school': ['book', 'pencil', 'paper', 'class', 'teacher', 'lunch', 'recess', 'learn', 'study', 'homework', 'read', 'write', 'pen', 'crayon', 'scissors', 'glue', 'backpack', 'test', 'finished', 'math'],
    'places': ['park', 'store', 'shop', 'school', 'home', 'playground', 'car', 'bus', 'outside', 'inside', 'library', 'hospital', 'doctor', 'restaurant', 'train', 'airplane', 'beach'],
    'body': ['head', 'hand', 'foot', 'arm', 'leg', 'eye', 'ear', 'nose', 'mouth', 'hurt', 'pain', 'sick', 'face', 'teeth', 'hair', 'fingers', 'feet', 'tummy'],
    'routines': ['morning', 'afternoon', 'evening', 'night', 'breakfast', 'lunch', 'dinner', 'bedtime', 'wake up', 'sleep', 'snack time', 'bath time', 'brush teeth', 'get dressed', 'potty'],
    'questions': ['what', 'where', 'when', 'who', 'why', 'how', 'which'],
    'colours': ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'black', 'white', 'brown'],
    'numbers': ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'more', 'less', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    'animals': ['dog', 'cat', 'bird', 'fish', 'horse', 'cow', 'pig', 'sheep', 'rabbit', 'pet', 'chicken', 'duck', 'bear', 'lion', 'elephant', 'monkey', 'see'],
    'clothing': ['shirt', 'pants', 'dress', 'shoes', 'socks', 'hat', 'coat', 'jacket', 'wear', 'put on', 'gloves'],
    'weather': ['sunny', 'rainy', 'cloudy', 'windy', 'hot', 'cold', 'warm', 'cool', 'weather', 'outside', 'snowy'],
    'time': ['now', 'later', 'today', 'tomorrow', 'yesterday', 'morning', 'afternoon', 'evening', 'night', 'time'],
    'toys': ['toy', 'ball', 'doll', 'game', 'puzzle', 'blocks', 'play', 'fun', 'car', 'truck', 'train', 'bike', 'swing', 'slide'],
  };
  
  const relevantKeywords = categoryKeywords[category] || [];
  console.log('📚 Relevant keywords for category:', relevantKeywords.slice(0, 10));
  
  // If no current words, return ONLY words that are EXACTLY in the category
  if (currentWords.length === 0) {
    // STRICT: Only return words that are in both categoryWords AND relevantKeywords
    const matches = categoryWords.filter(word => 
      relevantKeywords.some(keyword => 
        word.toLowerCase() === keyword.toLowerCase()
      )
    ).slice(0, 8);
    console.log('🎯 No current words, returning STRICT category matches:', matches);
    
    // Cache and return
    if (categoryCache.size > CATEGORY_CACHE_SIZE) {
      const firstKey = categoryCache.keys().next().value;
      categoryCache.delete(firstKey);
    }
    categoryCache.set(cacheKey, matches);
    return matches;
  }
  
  // Analyze current sentence context
  const lastWord = currentWords[currentWords.length - 1]?.toLowerCase();
  const sentenceContext = currentWords.join(' ').toLowerCase();
  const structure = analyzeSentenceStructure(currentWords);
  const sentenceSubject = structure.subject;
  
  // Context-aware filtering based on sentence structure
  const contextualMatches: { word: string; score: number }[] = [];
  
  categoryWords.forEach(word => {
    let score = 0;
    const lowerWord = word.toLowerCase();
    
    // STRICT: Check if word is EXACTLY in category keywords (no partial matches)
    const isInCategory = relevantKeywords.some(keyword => 
      lowerWord === keyword.toLowerCase()
    );
    
    if (isInCategory) {
      score += PRIORITY_TIERS.HIGH; // Higher base score for being EXACTLY in category
      
      // ULTRA-ENHANCED: Deep contextual boosting based on sentence patterns
      // Example: "I want" -> boost action words like "eat", "play", "go"
      if (sentenceContext.includes('i want') || sentenceContext.includes('want to') ||
          sentenceContext.includes('he wants') || sentenceContext.includes('she wants') ||
          sentenceContext.includes('we want') || sentenceContext.includes('they want')) {
        if (['eat', 'drink', 'play', 'sleep', 'go', 'read', 'watch', 'water'].includes(lowerWord)) {
          score += PRIORITY_TIERS.MEDIUM;
        }
      }
      
      // CRITICAL FIX V2: SMART boost for possessive pronouns based on sentence subject
      const possessiveMap: { [key: string]: string } = {
        'i': 'my',
        'you': 'your',
        'he': 'his',
        'she': 'her',
        'we': 'our',
        'they': 'their'
      };
      
      if (sentenceSubject && possessiveMap[sentenceSubject] === lowerWord) {
        // Check if we're in a context where possessive makes sense
        const possessiveContexts = ['wants', 'needs', 'likes', 'has', 'lost', 'found', 'help', 'with'];
        if (currentWords.some(w => possessiveContexts.includes(w.toLowerCase()))) {
          score += PRIORITY_TIERS.VERY_HIGH;
        }
      }
      
      // CRITICAL FIX: Boost possessive pronouns after appropriate contexts
      // Example: "he wants help with" -> boost "his"
      if (sentenceContext.includes('he wants') || sentenceContext.includes('he needs') || 
          sentenceContext.includes('he likes') || sentenceContext.includes('he has')) {
        if (lowerWord === 'his') {
          score += PRIORITY_TIERS.HIGH;
        }
      }
      
      if (sentenceContext.includes('she wants') || sentenceContext.includes('she needs') || 
          sentenceContext.includes('she likes') || sentenceContext.includes('she has')) {
        if (lowerWord === 'her') {
          score += PRIORITY_TIERS.HIGH;
        }
      }
      
      if (sentenceContext.includes('i want') || sentenceContext.includes('i need') || 
          sentenceContext.includes('i like') || sentenceContext.includes('i have')) {
        if (lowerWord === 'my') {
          score += PRIORITY_TIERS.HIGH;
        }
      }
      
      if (sentenceContext.includes('you want') || sentenceContext.includes('you need') || 
          sentenceContext.includes('you like') || sentenceContext.includes('you have')) {
        if (lowerWord === 'your') {
          score += PRIORITY_TIERS.HIGH;
        }
      }
      
      if (sentenceContext.includes('we want') || sentenceContext.includes('we need') || 
          sentenceContext.includes('we like') || sentenceContext.includes('we have')) {
        if (lowerWord === 'our') {
          score += PRIORITY_TIERS.HIGH;
        }
      }
      
      if (sentenceContext.includes('they want') || sentenceContext.includes('they need') || 
          sentenceContext.includes('they like') || sentenceContext.includes('they have')) {
        if (lowerWord === 'their') {
          score += PRIORITY_TIERS.HIGH;
        }
      }
      
      // CRITICAL FIX: Boost "homework" after "help with his/her/my"
      if ((sentenceContext.includes('help with his') || sentenceContext.includes('help with her') || 
           sentenceContext.includes('help with my')) && lowerWord === 'homework') {
        score += PRIORITY_TIERS.VERY_HIGH;
      }
      
      // Example: "I feel" -> boost feeling words
      if (sentenceContext.includes('i feel') || sentenceContext.includes('feel') ||
          sentenceContext.includes('he feels') || sentenceContext.includes('she feels') ||
          sentenceContext.includes('we feel') || sentenceContext.includes('they feel')) {
        if (['happy', 'sad', 'angry', 'scared', 'excited', 'tired', 'good', 'bad'].includes(lowerWord)) {
          score += PRIORITY_TIERS.LOW;
        }
      }
      
      // Example: "I need" -> boost need-related words
      if (sentenceContext.includes('i need') || sentenceContext.includes('need') ||
          sentenceContext.includes('he needs') || sentenceContext.includes('she needs') ||
          sentenceContext.includes('we need') || sentenceContext.includes('they need')) {
        if (['help', 'water', 'food', 'toilet', 'bathroom', 'rest', 'break', 'the', 'a', 'to', 'pencil'].includes(lowerWord)) {
          score += PRIORITY_TIERS.LOW;
        }
      }
      
      // Example: "where is" -> boost location/people words
      if (sentenceContext.includes('where is') || sentenceContext.includes('where')) {
        if (['mum', 'dad', 'toilet', 'bathroom', 'home', 'school', 'park', 'he', 'she', 'my', 'the'].includes(lowerWord)) {
          score += PRIORITY_TIERS.LOW;
        }
      }
      
      // Example: "what is" -> boost descriptive/question words
      if (sentenceContext.includes('what is') || sentenceContext.includes('what')) {
        if (['that', 'this', 'your', 'the', 'time', 'happening'].includes(lowerWord)) {
          score += PRIORITY_TIERS.LOW;
        }
      }
      
      // Example: "can I" -> boost action/permission words
      if (sentenceContext.includes('can i') || sentenceContext.includes('can you') ||
          sentenceContext.includes('can we') || sentenceContext.includes('can')) {
        if (['have', 'go', 'play', 'help', 'please', 'the', 'a'].includes(lowerWord)) {
          score += PRIORITY_TIERS.LOW;
        }
      }
      
      // CRITICAL FIX: Example: "I" -> ULTRA-BOOST "am"
      if (lastWord === 'i' && lowerWord === 'am') {
        score += PRIORITY_TIERS.ULTRA_CRITICAL;
      }
      
      // Example: "I am" -> boost state/activity words
      if (sentenceContext.includes('i am') || sentenceContext.includes('am') ||
          sentenceContext.includes('we are') || sentenceContext.includes('are')) {
        if (['happy', 'sad', 'tired', 'hungry', 'thirsty', 'reading', 'eating', 'finished'].includes(lowerWord)) {
          score += PRIORITY_TIERS.LOW;
        }
      }
      
      // Boost words that follow common patterns
      if (lastWord === 'to' && ['go', 'play', 'eat', 'drink', 'sleep', 'read', 'the'].includes(lowerWord)) {
        score += PRIORITY_TIERS.LOW;
      }
      
      if (lastWord === 'the' && ['toilet', 'bathroom', 'park', 'shop', 'school', 'home', 'ball', 'book', 'page'].includes(lowerWord)) {
        score += PRIORITY_TIERS.LOW;
      }
      
      if (lastWord === 'can' && ['I', 'you', 'he', 'she', 'we', 'they', 'go', 'have'].includes(lowerWord)) {
        score += PRIORITY_TIERS.LOW;
      }
      
      if (lastWord === 'my' && ['mum', 'dad', 'sister', 'brother', 'friend', 'toy', 'book', 'work'].includes(lowerWord)) {
        score += PRIORITY_TIERS.LOW;
      }
      
      if (lastWord === 'want' && ['to', 'the', 'a', 'some', 'more', 'water'].includes(lowerWord)) {
        score += PRIORITY_TIERS.LOW;
      }
      
      if (lastWord === 'need' && ['to', 'the', 'a', 'help', 'water', 'bathroom'].includes(lowerWord)) {
        score += PRIORITY_TIERS.LOW;
      }
      
      // MIND-READING: Predict based on sentence intent
      // If sentence starts with "I", predict common continuations
      if (currentWords[0]?.toLowerCase() === 'i') {
        if (['want', 'need', 'like', 'love', 'feel', 'am', 'have', 'can', 'see'].includes(lowerWord)) {
          score += PRIORITY_TIERS.LOW;
        }
      }
      
      // If sentence starts with "you", predict common continuations
      if (currentWords[0]?.toLowerCase() === 'you') {
        if (['are', 'can', 'want', 'need', 'like', 'have'].includes(lowerWord)) {
          score += PRIORITY_TIERS.LOW;
        }
      }
      
      // If sentence starts with question word, predict question structure
      if (['what', 'where', 'when', 'who', 'why', 'how'].includes(currentWords[0]?.toLowerCase())) {
        if (['is', 'are', 'do', 'does', 'can', 'will', 'the'].includes(lowerWord)) {
          score += PRIORITY_TIERS.LOW;
        }
      }
      
      contextualMatches.push({ word, score });
    }
  });
  
  // Sort by score and return top matches
  const results = contextualMatches
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(m => m.word);
  
  // Cache the result
  if (categoryCache.size > CATEGORY_CACHE_SIZE) {
    // Clear oldest entries
    const firstKey = categoryCache.keys().next().value;
    categoryCache.delete(firstKey);
  }
  categoryCache.set(cacheKey, results);
  
  console.log('✨ Category-relevant words found:', results);
  return results;
}

/**
 * Get prioritized initial words for sentence starts
 */
export function getPrioritizedInitialWords(maxWords: number = 10): string[] {
  return prioritizedInitialWords
    .sort((a, b) => b.priority - a.priority)
    .slice(0, maxWords)
    .map(pw => pw.word);
}

/**
 * Get prioritized connecting words
 */
export function getPrioritizedConnectingWords(maxWords: number = 10): string[] {
  return prioritizedConnectingWords
    .sort((a, b) => b.priority - a.priority)
    .slice(0, maxWords)
    .map(cw => cw.word);
}

/**
 * COMPLETELY REBUILT: Get contextually appropriate connecting words
 * 
 * CRITICAL FIX: "am" after "I" gets ULTRA-CRITICAL priority
 * This ensures "am" is ALWAYS recommended after "I"
 */
export function getContextualConnectingWords(currentWords: string[], maxWords: number = 5): string[] {
  const lastWord = currentWords.length > 0 ? currentWords[currentWords.length - 1].toLowerCase() : '';
  const lastTwoWords = currentWords.length >= 2 ? 
    [currentWords[currentWords.length - 2].toLowerCase(), lastWord].join(' ') : '';
  
  // Analyze sentence structure to get subject
  const structure = analyzeSentenceStructure(currentWords);
  const sentenceSubject = structure.subject;
  
  const contextualWords: { word: string; priority: number }[] = [];
  
  // CRITICAL FIX: Check for "help with" pattern - suggest possessive pronouns
  if (lastTwoWords === 'help with' || lastWord === 'with') {
    // Determine which possessive pronoun based on subject
    const sentence = currentWords.join(' ').toLowerCase();
    if (sentence.includes('he ') || sentenceSubject === 'he') {
      contextualWords.push({ word: 'his', priority: PRIORITY_TIERS.ULTRA_CRITICAL });
    } else if (sentence.includes('she ') || sentenceSubject === 'she') {
      contextualWords.push({ word: 'her', priority: PRIORITY_TIERS.ULTRA_CRITICAL });
    } else if (sentence.includes('i ') || sentenceSubject === 'i') {
      contextualWords.push({ word: 'my', priority: PRIORITY_TIERS.ULTRA_CRITICAL });
    } else if (sentence.includes('you ') || sentenceSubject === 'you') {
      contextualWords.push({ word: 'your', priority: PRIORITY_TIERS.ULTRA_CRITICAL });
    } else if (sentence.includes('we ') || sentenceSubject === 'we') {
      contextualWords.push({ word: 'our', priority: PRIORITY_TIERS.ULTRA_CRITICAL });
    } else if (sentence.includes('they ') || sentenceSubject === 'they') {
      contextualWords.push({ word: 'their', priority: PRIORITY_TIERS.ULTRA_CRITICAL });
    }
  }
  
  // CRITICAL FIX: Check for possessive pronoun patterns after verbs
  const verbsBeforePossessive = ['wants', 'needs', 'likes', 'has', 'lost', 'found', 'brought', 'forgot'];
  if (verbsBeforePossessive.includes(lastWord)) {
    const sentence = currentWords.join(' ').toLowerCase();
    if (sentence.includes('he ') || sentenceSubject === 'he') {
      contextualWords.push({ word: 'his', priority: PRIORITY_TIERS.CRITICAL });
    } else if (sentence.includes('she ') || sentenceSubject === 'she') {
      contextualWords.push({ word: 'her', priority: PRIORITY_TIERS.CRITICAL });
    } else if (sentence.includes('i ') || sentenceSubject === 'i') {
      contextualWords.push({ word: 'my', priority: PRIORITY_TIERS.CRITICAL });
    } else if (sentence.includes('you ') || sentenceSubject === 'you') {
      contextualWords.push({ word: 'your', priority: PRIORITY_TIERS.CRITICAL });
    } else if (sentence.includes('we ') || sentenceSubject === 'we') {
      contextualWords.push({ word: 'our', priority: PRIORITY_TIERS.CRITICAL });
    } else if (sentence.includes('they ') || sentenceSubject === 'they') {
      contextualWords.push({ word: 'their', priority: PRIORITY_TIERS.CRITICAL });
    }
  }
  
  // Find connecting words that fit the current context
  prioritizedConnectingWords.forEach(cw => {
    let priority = cw.priority;
    
    // ULTRA-CRITICAL: mustFollow rules (e.g., "am" MUST follow "I")
    if (cw.mustFollow && cw.mustFollow.includes(lastWord)) {
      priority += PRIORITY_TIERS.ULTRA_CRITICAL;
      console.log(`🔥 ULTRA-CRITICAL: "${cw.word}" must follow "${lastWord}" - priority: ${priority}`);
    }
    
    // CRITICAL: canFollow rules
    if (cw.canFollow && cw.canFollow.includes(lastWord)) {
      priority += PRIORITY_TIERS.CRITICAL;
    }
    
    // CRITICAL: subjectRequired rules
    if (cw.subjectRequired && sentenceSubject === cw.subjectRequired) {
      priority += PRIORITY_TIERS.CRITICAL;
    }
    
    contextualWords.push({ word: cw.word, priority });
  });
  
  return contextualWords
    .sort((a, b) => b.priority - a.priority)
    .slice(0, maxWords)
    .map(cw => cw.word);
}
