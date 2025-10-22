
/**
 * Enhanced Sentence Completion Engine
 * Provides intelligent, context-aware sentence completion based on:
 * - Category-specific vocabulary and patterns
 * - Common sentence patterns with grammatical awareness
 * - User history and learning patterns
 * - Grammatical rules and sentence structure
 * - Context awareness from current category and partial sentence
 * - Official AAC sentence database integration
 * - ENHANCED: Diverse subjects (I, You, He, She, We, They, Mum, Dad, My sister, My brother, etc.)
 * - ENHANCED: Connecting words (the, go, can, a, that, etc.)
 * - ULTRA-ENHANCED: Mind-reading AI with deep contextual understanding
 * - ULTRA-ENHANCED: Prioritized initial words and connecting words for better flow
 * - ULTRA-ENHANCED: Grammatical context awareness for "am", "is", "are", "the", etc.
 * - ULTRA-ENHANCED: Web-based sentence completion integration (Google-style predictions)
 * - CRITICAL FIX: "am" is IMMEDIATELY recommended after "I" with ULTRA-HIGH priority
 */

import { detectTenseContext, getVerbFormForContext, getBaseForm } from './wordVariations';
import { getContextualAACSentences, aacSentences } from './aacSentences';

// ULTRA-ENHANCED: Prioritized initial words for sentence starts
const prioritizedInitialWords = [
  // Ultra-high priority (most common sentence starters)
  { word: 'I', priority: 100, context: 'First person subject' },
  { word: 'Can', priority: 95, context: 'Permission/ability question' },
  { word: 'What', priority: 90, context: 'Question word' },
  { word: 'Where', priority: 90, context: 'Location question' },
  { word: 'I\'m', priority: 90, context: 'I am contraction' },
  { word: 'Thank', priority: 85, context: 'Gratitude' },
  { word: 'Please', priority: 85, context: 'Polite request' },
  { word: 'Hi', priority: 85, context: 'Greeting' },
  { word: 'Hello', priority: 85, context: 'Greeting' },
  { word: 'Sorry', priority: 85, context: 'Apology' },
  { word: 'Yes', priority: 85, context: 'Affirmation' },
  { word: 'No', priority: 85, context: 'Negation' },
  
  // High priority
  { word: 'He', priority: 80, context: 'Third person male subject' },
  { word: 'She', priority: 80, context: 'Third person female subject' },
  { word: 'We', priority: 80, context: 'First person plural subject' },
  { word: 'They', priority: 75, context: 'Third person plural subject' },
  { word: 'You', priority: 75, context: 'Second person subject' },
  { word: 'How', priority: 75, context: 'Question word' },
  { word: 'When', priority: 75, context: 'Time question' },
  { word: 'Who', priority: 75, context: 'Person question' },
  { word: 'Why', priority: 70, context: 'Reason question' },
  { word: 'Let\'s', priority: 70, context: 'Suggestion' },
  { word: 'More', priority: 70, context: 'Quantity request' },
  { word: 'All', priority: 65, context: 'Completion' },
  { word: 'Goodbye', priority: 65, context: 'Farewell' },
  
  // Medium priority
  { word: 'My', priority: 60, context: 'Possessive' },
  { word: 'The', priority: 60, context: 'Article' },
  { word: 'This', priority: 60, context: 'Demonstrative' },
  { word: 'That', priority: 60, context: 'Demonstrative' },
  { word: 'It', priority: 55, context: 'Pronoun' },
  { word: 'Mum', priority: 55, context: 'Family member' },
  { word: 'Dad', priority: 55, context: 'Family member' },
];

// ULTRA-ENHANCED: Prioritized connecting words (should appear frequently)
// CRITICAL FIX: "am" has ULTRA-HIGH priority after "I"
const prioritizedConnectingWords = [
  // ULTRA-HIGH priority connecting words (MASSIVELY BOOSTED)
  { word: 'am', priority: 200, context: 'Linking verb (I am)', grammaticalContext: ['I'] },
  { word: 'is', priority: 150, context: 'Linking verb (he/she/it is)', grammaticalContext: ['he', 'she', 'it', 'that', 'this'] },
  { word: 'are', priority: 150, context: 'Linking verb (you/we/they are)', grammaticalContext: ['you', 'we', 'they'] },
  { word: 'the', priority: 145, context: 'Definite article', grammaticalContext: ['want', 'need', 'have', 'see', 'like', 'love', 'in', 'on', 'at', 'with'] },
  { word: 'a', priority: 140, context: 'Indefinite article', grammaticalContext: ['want', 'need', 'have', 'see', 'like', 'love', 'in', 'on', 'at', 'with'] },
  { word: 'to', priority: 135, context: 'Preposition/infinitive marker', grammaticalContext: ['want', 'need', 'like', 'love', 'go', 'going', 'have'] },
  { word: 'and', priority: 130, context: 'Conjunction', grammaticalContext: [] },
  { word: 'can', priority: 125, context: 'Modal verb', grammaticalContext: ['I', 'you', 'we', 'he', 'she', 'they'] },
  
  // Very high priority
  { word: 'want', priority: 120, context: 'Desire verb', grammaticalContext: ['I', 'you', 'we', 'they'] },
  { word: 'need', priority: 120, context: 'Necessity verb', grammaticalContext: ['I', 'you', 'we', 'they'] },
  { word: 'have', priority: 115, context: 'Possession verb', grammaticalContext: ['I', 'you', 'we', 'they'] },
  { word: 'go', priority: 110, context: 'Movement verb', grammaticalContext: ['to', 'can', 'want', 'need'] },
  { word: 'like', priority: 110, context: 'Preference verb', grammaticalContext: ['I', 'you', 'we', 'they'] },
  { word: 'that', priority: 105, context: 'Demonstrative/conjunction', grammaticalContext: ['is', 'was', 'see', 'want', 'need'] },
  { word: 'this', priority: 105, context: 'Demonstrative', grammaticalContext: ['is', 'was', 'see', 'want', 'need'] },
  { word: 'with', priority: 100, context: 'Preposition', grammaticalContext: ['help', 'play', 'go', 'come'] },
  { word: 'for', priority: 100, context: 'Preposition', grammaticalContext: ['time', 'wait', 'look'] },
  { word: 'in', priority: 95, context: 'Preposition', grammaticalContext: ['am', 'is', 'are', 'go'] },
  { word: 'on', priority: 95, context: 'Preposition', grammaticalContext: ['is', 'are', 'put', 'turn'] },
  { word: 'at', priority: 90, context: 'Preposition', grammaticalContext: ['am', 'is', 'are', 'look'] },
  { word: 'or', priority: 90, context: 'Conjunction', grammaticalContext: [] },
  { word: 'but', priority: 85, context: 'Conjunction', grammaticalContext: [] },
  { word: 'my', priority: 110, context: 'Possessive pronoun', grammaticalContext: ['I', 'want', 'need', 'have', 'lost', 'found'] },
  { word: 'your', priority: 105, context: 'Possessive pronoun', grammaticalContext: ['you', 'want', 'need', 'have', 'lost', 'found'] },
  { word: 'his', priority: 105, context: 'Possessive pronoun', grammaticalContext: ['he', 'wants', 'needs', 'has', 'lost', 'found'] },
  { word: 'her', priority: 105, context: 'Possessive pronoun', grammaticalContext: ['she', 'wants', 'needs', 'has', 'lost', 'found'] },
  { word: 'our', priority: 100, context: 'Possessive pronoun', grammaticalContext: ['we', 'want', 'need', 'have', 'lost', 'found'] },
  { word: 'their', priority: 100, context: 'Possessive pronoun', grammaticalContext: ['they', 'want', 'need', 'have', 'lost', 'found'] },
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
  
  // Pronoun + "needs help with" pattern (possessive suggestions)
  { pattern: ['he', 'needs', 'help'], completions: ['with', 'his', 'please', 'now'] },
  { pattern: ['she', 'needs', 'help'], completions: ['with', 'her', 'please', 'now'] },
  { pattern: ['I', 'need', 'help'], completions: ['with', 'my', 'please', 'now'] },
  { pattern: ['he', 'needs', 'help', 'with'], completions: ['his', 'the', 'this', 'that'] },
  { pattern: ['she', 'needs', 'help', 'with'], completions: ['her', 'the', 'this', 'that'] },
  { pattern: ['I', 'need', 'help', 'with'], completions: ['my', 'the', 'this', 'that'] },
  
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
} {
  const lowerWords = words.map(w => w.toLowerCase());
  
  // Detect subject (I, you, he, she, it, we, they, mum, dad, my sister, my brother, or nouns)
  const subjects = ['i', 'you', 'he', 'she', 'it', 'we', 'they', 'this', 'that', 'mum', 'dad', 'my', 'the', 'a'];
  const hasSubject = lowerWords.some(w => subjects.includes(w));
  
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
  
  return { hasSubject, hasVerb, hasObject, tense, suggestedNextType };
}

/**
 * Score and rank sentence suggestions
 * ULTRA-ENHANCED: Now considers priority scores, grammatical context, and sentence structure
 * CRITICAL FIX: "am" after "I" gets ULTRA-HIGH score boost
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
    
    // ULTRA-HIGH BOOST: Check if this is a prioritized initial word (for sentence starts)
    if (currentWords.length === 0) {
      const prioritizedWord = prioritizedInitialWords.find(
        pw => pw.word.toLowerCase() === suggestionLower
      );
      if (prioritizedWord) {
        score += prioritizedWord.priority * 0.8; // MASSIVE boost for prioritized initial words
      }
    }
    
    // ULTRA-HIGH BOOST: Check if this is a prioritized connecting word
    const connectingWord = prioritizedConnectingWords.find(
      cw => cw.word.toLowerCase() === suggestionLower
    );
    if (connectingWord) {
      // Base boost for connecting words
      score += connectingWord.priority * 0.6; // SIGNIFICANTLY increased boost
      
      // ADDITIONAL CONTEXTUAL BOOST: Check if the connecting word fits grammatically
      if (connectingWord.grammaticalContext && connectingWord.grammaticalContext.length > 0) {
        const hasGrammaticalContext = connectingWord.grammaticalContext.some(ctx => 
          currentWords.some(word => word.toLowerCase() === ctx.toLowerCase())
        );
        if (hasGrammaticalContext) {
          score += connectingWord.priority * 0.4; // EXTRA boost for grammatically appropriate context
        }
      }
      
      // CRITICAL FIX: ULTRA-MASSIVE BOOST for "am" after "I"
      if (suggestionLower === 'am' && lastWord === 'i') {
        score += 200; // ULTRA-MASSIVE boost - this is VITAL!
      } else if (suggestionLower === 'is' && ['he', 'she', 'it', 'that', 'this'].includes(lastWord)) {
        score += 100; // MASSIVE boost
      } else if (suggestionLower === 'are' && ['you', 'we', 'they'].includes(lastWord)) {
        score += 100; // MASSIVE boost
      }
      
      // SPECIAL BOOST: "the" and "a" after verbs
      if ((suggestionLower === 'the' || suggestionLower === 'a') && 
          ['want', 'need', 'have', 'see', 'like', 'love', 'in', 'on', 'at', 'with'].includes(lastWord)) {
        score += 80; // Very high boost
      }
      
      // SPECIAL BOOST: "to" after "want", "need", "like", "love", "go"
      if (suggestionLower === 'to' && ['want', 'need', 'like', 'love', 'go', 'going', 'have'].includes(lastWord)) {
        score += 80; // Very high boost
      }
    }
    
    // Boost score based on user frequency
    const userFreq = userFrequency.get(suggestionLower) || 0;
    score += userFreq * 0.15;
    
    // ENHANCED: Boost score based on sentence structure and grammatical completeness
    const structure = analyzeSentenceStructure([...currentWords, suggestion.text]);
    
    // Boost for grammatically complete suggestions
    if (structure.hasSubject && structure.hasVerb) {
      score += 0.3;
    }
    
    // Boost for suggestions that complete missing grammatical elements
    const currentStructure = analyzeSentenceStructure(currentWords);
    if (!currentStructure.hasVerb && structure.hasVerb) {
      score += 0.5; // High boost for adding a verb
    }
    if (!currentStructure.hasSubject && structure.hasSubject) {
      score += 0.4; // High boost for adding a subject
    }
    
    // Boost score for contextually appropriate suggestions
    if (suggestion.type === 'completion' || suggestion.type === 'common_phrase') {
      score += 0.4;
    }
    
    // Boost score for AAC sentences
    if (suggestion.type === 'aac_sentence') {
      score += 0.5; // Higher priority for official AAC sentences
    }
    
    // Boost score for category-contextual suggestions
    if (suggestion.type === 'category_contextual') {
      score += 0.45; // High priority for category-relevant words
    }
    
    // Boost score for polite endings
    if (suggestion.type === 'polite_ending') {
      score += 0.35;
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
  
  // CRITICAL FIX: Filter availableWords to only include words that are ACTUALLY in the selected category
  let categoryWords = availableWords;
  if (categoryTiles && categoryTiles.length > 0) {
    const categoryWordSet = new Set(
      categoryTiles
        .filter(tile => tile.category === category)
        .map(tile => tile.text.toLowerCase())
    );
    categoryWords = availableWords.filter(word => categoryWordSet.has(word.toLowerCase()));
    console.log('✅ Filtered to category words:', { 
      originalCount: availableWords.length, 
      categoryCount: categoryWords.length,
      categoryWords: categoryWords.slice(0, 10)
    });
  }
  
  // Enhanced category-specific word associations with more comprehensive vocabulary
  const categoryKeywords: { [key: string]: string[] } = {
    'greetings': ['hello', 'hi', 'goodbye', 'bye', 'how are you', 'please', 'thank you', 'yes', 'no', 'good', 'bad', 'good morning', 'good afternoon', 'good evening', 'good night', 'see you', 'see you later', 'welcome', 'sorry', 'excuse me'],
    'core': ['I', 'you', 'he', 'she', 'we', 'they', 'want', 'need', 'like', 'help', 'more', 'go', 'stop', 'yes', 'no', 'please', 'thank you', 'can', 'the', 'a', 'that', 'this', 'use', 'borrow', 'am', 'is', 'are'],
    'people': ['mum', 'dad', 'mom', 'mother', 'father', 'friend', 'teacher', 'family', 'brother', 'sister', 'mate', 'grandma', 'grandpa', 'he', 'she', 'they', 'my', 'boy', 'girl', 'man', 'woman', 'baby'],
    'actions': ['eat', 'drink', 'play', 'sleep', 'walk', 'run', 'read', 'write', 'watch', 'listen', 'sit', 'stand', 'jump', 'dance', 'go', 'can', 'the', 'sing', 'draw', 'give', 'take', 'throw', 'catch', 'push', 'pull', 'wash', 'clean', 'am', 'is', 'are'],
    'feelings': ['happy', 'sad', 'angry', 'scared', 'excited', 'tired', 'love', 'worried', 'calm', 'hurt', 'sick', 'good', 'bad', 'I', 'he', 'she', 'we', 'they', 'feel', 'surprised', 'bored', 'confused', 'am', 'is', 'are'],
    'food': ['water', 'juice', 'milk', 'apple', 'banana', 'bread', 'snack', 'lunch', 'dinner', 'breakfast', 'hungry', 'thirsty', 'eat', 'drink', 'the', 'a', 'can', 'cheese', 'cookie', 'cake', 'pizza', 'sandwich', 'egg', 'chicken', 'fish', 'carrot', 'want', 'need', 'am', 'is'],
    'home': ['house', 'bed', 'bathroom', 'kitchen', 'TV', 'door', 'window', 'room', 'bedroom', 'toilet', 'sleep', 'rest', 'the', 'a', 'go', 'my', 'chair', 'table', 'living room', 'phone', 'computer', 'tablet', 'need', 'want'],
    'school': ['book', 'pencil', 'paper', 'class', 'teacher', 'lunch', 'recess', 'learn', 'study', 'homework', 'read', 'write', 'the', 'a', 'my', 'can', 'pen', 'crayon', 'scissors', 'glue', 'backpack', 'test', 'need', 'want', 'finished', 'math'],
    'places': ['park', 'store', 'shop', 'school', 'home', 'playground', 'car', 'bus', 'outside', 'inside', 'the', 'a', 'go', 'can', 'library', 'hospital', 'doctor', 'restaurant', 'train', 'airplane', 'beach', 'want', 'need'],
    'body': ['head', 'hand', 'foot', 'arm', 'leg', 'eye', 'ear', 'nose', 'mouth', 'hurt', 'pain', 'sick', 'my', 'the', 'a', 'face', 'teeth', 'hair', 'fingers', 'feet', 'tummy', 'need'],
    'routines': ['morning', 'afternoon', 'evening', 'night', 'breakfast', 'lunch', 'dinner', 'bedtime', 'wake up', 'sleep', 'the', 'a', 'go', 'snack time', 'bath time', 'brush teeth', 'get dressed', 'potty', 'am', 'is', 'are'],
    'questions': ['what', 'where', 'when', 'who', 'why', 'how', 'is', 'are', 'do', 'can', 'will', 'the', 'a', 'that', 'which'],
    'colours': ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'black', 'white', 'brown', 'the', 'a', 'is', 'and'],
    'numbers': ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'more', 'less', 'the', 'a', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    'animals': ['dog', 'cat', 'bird', 'fish', 'horse', 'cow', 'pig', 'sheep', 'rabbit', 'pet', 'the', 'a', 'my', 'chicken', 'duck', 'bear', 'lion', 'elephant', 'monkey', 'see'],
    'clothing': ['shirt', 'pants', 'dress', 'shoes', 'socks', 'hat', 'coat', 'jacket', 'wear', 'put on', 'the', 'a', 'my', 'gloves'],
    'weather': ['sunny', 'rainy', 'cloudy', 'windy', 'hot', 'cold', 'warm', 'cool', 'weather', 'outside', 'the', 'a', 'snowy', 'is'],
    'time': ['now', 'later', 'today', 'tomorrow', 'yesterday', 'morning', 'afternoon', 'evening', 'night', 'time', 'the', 'a', 'is'],
    'toys': ['toy', 'ball', 'doll', 'game', 'puzzle', 'blocks', 'play', 'fun', 'the', 'a', 'my', 'car', 'truck', 'train', 'bike', 'swing', 'slide', 'want'],
  };
  
  const relevantKeywords = categoryKeywords[category] || [];
  console.log('📚 Relevant keywords for category:', relevantKeywords.slice(0, 10));
  
  // If no current words, return category keywords that are in category words
  if (currentWords.length === 0) {
    const matches = categoryWords.filter(word => 
      relevantKeywords.some(keyword => 
        word.toLowerCase() === keyword.toLowerCase() ||
        word.toLowerCase().includes(keyword.toLowerCase()) ||
        keyword.toLowerCase().includes(word.toLowerCase())
      )
    ).slice(0, 8);
    console.log('🎯 No current words, returning category matches:', matches);
    return matches;
  }
  
  // Analyze current sentence context
  const lastWord = currentWords[currentWords.length - 1]?.toLowerCase();
  const sentenceContext = currentWords.join(' ').toLowerCase();
  
  // Context-aware filtering based on sentence structure
  const contextualMatches: { word: string; score: number }[] = [];
  
  categoryWords.forEach(word => {
    let score = 0;
    const lowerWord = word.toLowerCase();
    
    // Check if word is in category keywords
    const isInCategory = relevantKeywords.some(keyword => 
      lowerWord === keyword.toLowerCase() ||
      lowerWord.includes(keyword.toLowerCase()) ||
      keyword.toLowerCase().includes(lowerWord)
    );
    
    if (isInCategory) {
      score += 10; // Base score for being in category
      
      // ULTRA-ENHANCED: Deep contextual boosting based on sentence patterns
      // Example: "I want" -> boost action words like "eat", "play", "go"
      if (sentenceContext.includes('i want') || sentenceContext.includes('want to') ||
          sentenceContext.includes('he wants') || sentenceContext.includes('she wants') ||
          sentenceContext.includes('we want') || sentenceContext.includes('they want')) {
        if (['eat', 'drink', 'play', 'sleep', 'go', 'read', 'watch', 'the', 'a', 'to', 'water'].includes(lowerWord)) {
          score += 8;
        }
      }
      
      // Example: "I feel" -> boost feeling words
      if (sentenceContext.includes('i feel') || sentenceContext.includes('feel') ||
          sentenceContext.includes('he feels') || sentenceContext.includes('she feels') ||
          sentenceContext.includes('we feel') || sentenceContext.includes('they feel')) {
        if (['happy', 'sad', 'angry', 'scared', 'excited', 'tired', 'good', 'bad'].includes(lowerWord)) {
          score += 8;
        }
      }
      
      // Example: "I need" -> boost need-related words
      if (sentenceContext.includes('i need') || sentenceContext.includes('need') ||
          sentenceContext.includes('he needs') || sentenceContext.includes('she needs') ||
          sentenceContext.includes('we need') || sentenceContext.includes('they need')) {
        if (['help', 'water', 'food', 'toilet', 'bathroom', 'rest', 'break', 'the', 'a', 'to', 'pencil'].includes(lowerWord)) {
          score += 8;
        }
      }
      
      // Example: "where is" -> boost location/people words
      if (sentenceContext.includes('where is') || sentenceContext.includes('where')) {
        if (['mum', 'dad', 'toilet', 'bathroom', 'home', 'school', 'park', 'he', 'she', 'my', 'the'].includes(lowerWord)) {
          score += 8;
        }
      }
      
      // Example: "what is" -> boost descriptive/question words
      if (sentenceContext.includes('what is') || sentenceContext.includes('what')) {
        if (['that', 'this', 'your', 'the', 'time', 'happening'].includes(lowerWord)) {
          score += 8;
        }
      }
      
      // Example: "can I" -> boost action/permission words
      if (sentenceContext.includes('can i') || sentenceContext.includes('can you') ||
          sentenceContext.includes('can we') || sentenceContext.includes('can')) {
        if (['have', 'go', 'play', 'help', 'please', 'the', 'a'].includes(lowerWord)) {
          score += 8;
        }
      }
      
      // CRITICAL FIX: Example: "I" -> ULTRA-BOOST "am"
      if (lastWord === 'i' && lowerWord === 'am') {
        score += 20; // ULTRA-HIGH boost for "am" after "I"
      }
      
      // Example: "I am" -> boost state/activity words
      if (sentenceContext.includes('i am') || sentenceContext.includes('am') ||
          sentenceContext.includes('we are') || sentenceContext.includes('are')) {
        if (['happy', 'sad', 'tired', 'hungry', 'thirsty', 'reading', 'eating', 'finished'].includes(lowerWord)) {
          score += 8;
        }
      }
      
      // Boost connecting words (always useful)
      if (['the', 'a', 'can', 'go', 'that', 'this', 'to', 'and', 'or', 'am', 'is', 'are'].includes(lowerWord)) {
        score += 5;
      }
      
      // Boost words that follow common patterns
      if (lastWord === 'to' && ['go', 'play', 'eat', 'drink', 'sleep', 'read', 'the'].includes(lowerWord)) {
        score += 6;
      }
      
      if (lastWord === 'the' && ['toilet', 'bathroom', 'park', 'shop', 'school', 'home', 'ball', 'book', 'page'].includes(lowerWord)) {
        score += 6;
      }
      
      if (lastWord === 'can' && ['I', 'you', 'he', 'she', 'we', 'they', 'go', 'have'].includes(lowerWord)) {
        score += 6;
      }
      
      if (lastWord === 'my' && ['mum', 'dad', 'sister', 'brother', 'friend', 'toy', 'book', 'work'].includes(lowerWord)) {
        score += 6;
      }
      
      if (lastWord === 'want' && ['to', 'the', 'a', 'some', 'more', 'water'].includes(lowerWord)) {
        score += 6;
      }
      
      if (lastWord === 'need' && ['to', 'the', 'a', 'help', 'water', 'bathroom'].includes(lowerWord)) {
        score += 6;
      }
      
      // MIND-READING: Predict based on sentence intent
      // If sentence starts with "I", predict common continuations
      if (currentWords[0]?.toLowerCase() === 'i') {
        if (['want', 'need', 'like', 'love', 'feel', 'am', 'have', 'can', 'see'].includes(lowerWord)) {
          score += 7;
        }
      }
      
      // If sentence starts with "you", predict common continuations
      if (currentWords[0]?.toLowerCase() === 'you') {
        if (['are', 'can', 'want', 'need', 'like', 'have'].includes(lowerWord)) {
          score += 7;
        }
      }
      
      // If sentence starts with question word, predict question structure
      if (['what', 'where', 'when', 'who', 'why', 'how'].includes(currentWords[0]?.toLowerCase())) {
        if (['is', 'are', 'do', 'does', 'can', 'will', 'the'].includes(lowerWord)) {
          score += 7;
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
 * Get contextually appropriate connecting words based on current sentence
 * This ensures "am", "the", "is", "are" etc. are suggested at the right time
 * CRITICAL FIX: "am" after "I" gets ULTRA-HIGH priority
 */
export function getContextualConnectingWords(currentWords: string[], maxWords: number = 5): string[] {
  const lastWord = currentWords.length > 0 ? currentWords[currentWords.length - 1].toLowerCase() : '';
  const contextualWords: { word: string; priority: number }[] = [];
  
  // Find connecting words that fit the current context
  prioritizedConnectingWords.forEach(cw => {
    let priority = cw.priority;
    
    // Boost priority if grammatical context matches
    if (cw.grammaticalContext && cw.grammaticalContext.length > 0) {
      const hasContext = cw.grammaticalContext.some(ctx => 
        currentWords.some(word => word.toLowerCase() === ctx.toLowerCase())
      );
      if (hasContext) {
        priority += 50; // Significant boost for grammatical match
      }
    }
    
    // CRITICAL FIX: ULTRA-MASSIVE boost for "am" after "I"
    if (cw.word === 'am' && lastWord === 'i') {
      priority += 200; // ULTRA-MASSIVE boost - this is VITAL!
    } else if (cw.word === 'is' && ['he', 'she', 'it', 'that', 'this'].includes(lastWord)) {
      priority += 100;
    } else if (cw.word === 'are' && ['you', 'we', 'they'].includes(lastWord)) {
      priority += 100;
    } else if ((cw.word === 'the' || cw.word === 'a') && 
               ['want', 'need', 'have', 'see', 'like', 'love'].includes(lastWord)) {
      priority += 80;
    } else if (cw.word === 'to' && ['want', 'need', 'like', 'love', 'go', 'have'].includes(lastWord)) {
      priority += 80;
    }
    
    contextualWords.push({ word: cw.word, priority });
  });
  
  return contextualWords
    .sort((a, b) => b.priority - a.priority)
    .slice(0, maxWords)
    .map(cw => cw.word);
}
