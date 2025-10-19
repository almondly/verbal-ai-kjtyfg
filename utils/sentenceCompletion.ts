
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
 */

import { detectTenseContext, getVerbFormForContext, getBaseForm } from './wordVariations';
import { getContextualAACSentences, aacSentences } from './aacSentences';

// Enhanced sentence templates with pronoun variations and connecting words (Australian English)
export const sentenceTemplates = [
  // Connecting words - THE
  { pattern: ['the'], completions: ['cat', 'dog', 'ball', 'book', 'toy', 'park', 'shop', 'toilet', 'car', 'bus'] },
  { pattern: ['the', 'cat'], completions: ['is', 'was', 'can', 'wants', 'needs'] },
  { pattern: ['the', 'dog'], completions: ['is', 'was', 'can', 'wants', 'needs'] },
  
  // Connecting words - A
  { pattern: ['a'], completions: ['cat', 'dog', 'ball', 'book', 'toy', 'friend', 'snack', 'drink'] },
  { pattern: ['a', 'cat'], completions: ['is', 'was', 'can'] },
  { pattern: ['a', 'dog'], completions: ['is', 'was', 'can'] },
  
  // Connecting words - THAT
  { pattern: ['that'], completions: ['is', 'was', 'can', 'looks', 'sounds'] },
  { pattern: ['that', 'is'], completions: ['good', 'bad', 'nice', 'mine', 'yours', 'his', 'hers'] },
  { pattern: ['that', 'was'], completions: ['good', 'bad', 'nice', 'fun'] },
  
  // Connecting words - THIS
  { pattern: ['this'], completions: ['is', 'was', 'can', 'looks', 'sounds'] },
  { pattern: ['this', 'is'], completions: ['good', 'bad', 'nice', 'mine', 'yours', 'my'] },
  
  // I want variations
  { pattern: ['I', 'want'], completions: ['to go', 'to play', 'to eat', 'to drink', 'some water', 'some food', 'that', 'more', 'to go outside', 'to watch telly', 'help', 'the', 'a'] },
  { pattern: ['I', 'want', 'to'], completions: ['go', 'play', 'eat', 'drink', 'sleep', 'read', 'draw', 'watch', 'go outside', 'go home'] },
  { pattern: ['I', 'want', 'the'], completions: ['ball', 'book', 'toy', 'red one', 'blue one'] },
  { pattern: ['I', 'want', 'a'], completions: ['toy', 'book', 'snack', 'drink'] },
  
  // You want variations
  { pattern: ['you', 'want'], completions: ['to go', 'to play', 'to eat', 'to drink', 'some water', 'some food', 'that', 'more', 'to help me', 'to come', 'the', 'a'] },
  { pattern: ['you', 'want', 'to'], completions: ['go', 'play', 'eat', 'drink', 'help me', 'come', 'see', 'know'] },
  { pattern: ['you', 'want', 'the'], completions: ['ball', 'book', 'toy', 'red one', 'blue one'] },
  
  // He/She wants variations
  { pattern: ['he', 'wants'], completions: ['to go', 'to play', 'to eat', 'to drink', 'some water', 'some food', 'that', 'more', 'help', 'the', 'a'] },
  { pattern: ['she', 'wants'], completions: ['to go', 'to play', 'to eat', 'to drink', 'some water', 'some food', 'that', 'more', 'help', 'the', 'a'] },
  { pattern: ['he', 'wants', 'to'], completions: ['go', 'play', 'eat', 'drink', 'help', 'come', 'see'] },
  { pattern: ['she', 'wants', 'to'], completions: ['go', 'play', 'eat', 'drink', 'help', 'come', 'see'] },
  { pattern: ['he', 'wants', 'the'], completions: ['ball', 'book', 'toy', 'red one', 'blue one'] },
  { pattern: ['she', 'wants', 'the'], completions: ['ball', 'book', 'toy', 'red one', 'blue one'] },
  
  // We want variations
  { pattern: ['we', 'want'], completions: ['to go', 'to play', 'to eat', 'to drink', 'some water', 'some food', 'that', 'more', 'to go outside', 'to play together', 'the', 'a'] },
  { pattern: ['we', 'want', 'to'], completions: ['go', 'play', 'eat', 'drink', 'go outside', 'play together', 'have fun'] },
  { pattern: ['we', 'want', 'the'], completions: ['ball', 'book', 'toy', 'red one', 'blue one'] },
  
  // They want variations
  { pattern: ['they', 'want'], completions: ['to go', 'to play', 'to eat', 'to drink', 'some water', 'some food', 'that', 'more', 'help', 'the', 'a'] },
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
  { pattern: ['I', 'need'], completions: ['help', 'the toilet', 'water', 'food', 'a break', 'to go', 'to rest', 'mum', 'dad', 'you', 'the', 'a'] },
  { pattern: ['I', 'need', 'to'], completions: ['go', 'eat', 'drink', 'sleep', 'rest', 'use toilet', 'go home'] },
  { pattern: ['I', 'need', 'the'], completions: ['toilet', 'bathroom', 'book', 'pencil'] },
  { pattern: ['I', 'need', 'a'], completions: ['break', 'drink', 'snack', 'rest'] },
  
  // You need variations
  { pattern: ['you', 'need'], completions: ['to help me', 'to come', 'to see', 'to know', 'this', 'that', 'the', 'a'] },
  { pattern: ['you', 'need', 'to'], completions: ['help me', 'come', 'see', 'know', 'listen'] },
  { pattern: ['you', 'need', 'the'], completions: ['book', 'pencil', 'paper'] },
  
  // He/She needs variations
  { pattern: ['he', 'needs'], completions: ['help', 'water', 'food', 'to go', 'to rest', 'that', 'this', 'the', 'a'] },
  { pattern: ['she', 'needs'], completions: ['help', 'water', 'food', 'to go', 'to rest', 'that', 'this', 'the', 'a'] },
  { pattern: ['he', 'needs', 'to'], completions: ['go', 'eat', 'drink', 'rest', 'help'] },
  { pattern: ['she', 'needs', 'to'], completions: ['go', 'eat', 'drink', 'rest', 'help'] },
  { pattern: ['he', 'needs', 'the'], completions: ['toilet', 'bathroom', 'book'] },
  { pattern: ['she', 'needs', 'the'], completions: ['toilet', 'bathroom', 'book'] },
  
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
  { pattern: ['my', 'sister', 'needs'], completions: ['help', 'water', 'food', 'to go', 'the', 'a'] },
  { pattern: ['my', 'brother', 'needs'], completions: ['help', 'water', 'food', 'to go', 'the', 'a'] },
  { pattern: ['my', 'friend', 'needs'], completions: ['help', 'water', 'food', 'to go', 'the', 'a'] },
  
  // I like variations
  { pattern: ['I', 'like'], completions: ['to play', 'to eat', 'this', 'that', 'it', 'you', 'playing', 'eating', 'red', 'blue', 'the', 'a'] },
  { pattern: ['I', 'like', 'to'], completions: ['play', 'eat', 'read', 'draw', 'watch', 'listen', 'go outside'] },
  { pattern: ['I', 'like', 'the'], completions: ['red one', 'blue one', 'big one', 'small one'] },
  
  // You like variations
  { pattern: ['you', 'like'], completions: ['to play', 'to eat', 'this', 'that', 'it', 'playing', 'eating', 'the', 'a'] },
  { pattern: ['you', 'like', 'to'], completions: ['play', 'eat', 'read', 'draw', 'watch', 'help'] },
  { pattern: ['you', 'like', 'the'], completions: ['red one', 'blue one', 'big one', 'small one'] },
  
  // He/She likes variations
  { pattern: ['he', 'likes'], completions: ['to play', 'to eat', 'this', 'that', 'it', 'playing', 'eating', 'the', 'a'] },
  { pattern: ['she', 'likes'], completions: ['to play', 'to eat', 'this', 'that', 'it', 'playing', 'eating', 'the', 'a'] },
  { pattern: ['he', 'likes', 'to'], completions: ['play', 'eat', 'read', 'draw', 'watch'] },
  { pattern: ['she', 'likes', 'to'], completions: ['play', 'eat', 'read', 'draw', 'watch'] },
  { pattern: ['he', 'likes', 'the'], completions: ['red one', 'blue one', 'big one', 'small one'] },
  { pattern: ['she', 'likes', 'the'], completions: ['red one', 'blue one', 'big one', 'small one'] },
  
  // We like variations
  { pattern: ['we', 'like'], completions: ['to play', 'to eat', 'this', 'that', 'it', 'playing', 'eating', 'playing together', 'the', 'a'] },
  { pattern: ['we', 'like', 'to'], completions: ['play', 'eat', 'play together', 'have fun', 'go outside'] },
  { pattern: ['we', 'like', 'the'], completions: ['red one', 'blue one', 'big one', 'small one'] },
  
  // They like variations
  { pattern: ['they', 'like'], completions: ['to play', 'to eat', 'this', 'that', 'it', 'playing', 'eating', 'the', 'a'] },
  { pattern: ['they', 'like', 'to'], completions: ['play', 'eat', 'read', 'draw', 'watch'] },
  { pattern: ['they', 'like', 'the'], completions: ['red one', 'blue one', 'big one', 'small one'] },
  
  // Mum/Dad like variations
  { pattern: ['mum', 'likes'], completions: ['to go', 'to help', 'this', 'that', 'the', 'a'] },
  { pattern: ['dad', 'likes'], completions: ['to go', 'to help', 'this', 'that', 'the', 'a'] },
  
  // My sister/brother like variations
  { pattern: ['my', 'sister', 'likes'], completions: ['to play', 'to eat', 'this', 'that', 'the', 'a'] },
  { pattern: ['my', 'brother', 'likes'], completions: ['to play', 'to eat', 'this', 'that', 'the', 'a'] },
  { pattern: ['my', 'friend', 'likes'], completions: ['to play', 'to eat', 'this', 'that', 'the', 'a'] },
  
  // I have variations
  { pattern: ['I', 'have'], completions: ['a toy', 'a book', 'water', 'food', 'this', 'that', 'something', 'to go', 'to tell you', 'the', 'a'] },
  { pattern: ['I', 'have', 'to'], completions: ['go', 'eat', 'sleep', 'tell you', 'go home', 'use toilet'] },
  { pattern: ['I', 'have', 'the'], completions: ['ball', 'book', 'toy', 'red one', 'blue one'] },
  { pattern: ['I', 'have', 'a'], completions: ['toy', 'book', 'ball', 'question'] },
  
  // You have variations
  { pattern: ['you', 'have'], completions: ['to help me', 'to come', 'to see', 'this', 'that', 'something', 'the', 'a'] },
  { pattern: ['you', 'have', 'to'], completions: ['help me', 'come', 'see', 'listen', 'know'] },
  { pattern: ['you', 'have', 'the'], completions: ['ball', 'book', 'toy', 'red one', 'blue one'] },
  
  // He/She has variations
  { pattern: ['he', 'has'], completions: ['a toy', 'a book', 'water', 'food', 'this', 'that', 'something', 'to go', 'the', 'a'] },
  { pattern: ['she', 'has'], completions: ['a toy', 'a book', 'water', 'food', 'this', 'that', 'something', 'to go', 'the', 'a'] },
  { pattern: ['he', 'has', 'to'], completions: ['go', 'eat', 'sleep', 'go home', 'leave'] },
  { pattern: ['she', 'has', 'to'], completions: ['go', 'eat', 'sleep', 'go home', 'leave'] },
  { pattern: ['he', 'has', 'the'], completions: ['ball', 'book', 'toy', 'red one', 'blue one'] },
  { pattern: ['she', 'has', 'the'], completions: ['ball', 'book', 'toy', 'red one', 'blue one'] },
  
  // We have variations
  { pattern: ['we', 'have'], completions: ['to go', 'to eat', 'to play', 'this', 'that', 'something', 'fun', 'the', 'a'] },
  { pattern: ['we', 'have', 'to'], completions: ['go', 'eat', 'play', 'go home', 'leave', 'finish'] },
  { pattern: ['we', 'have', 'the'], completions: ['ball', 'book', 'toy', 'red one', 'blue one'] },
  
  // They have variations
  { pattern: ['they', 'have'], completions: ['to go', 'to eat', 'this', 'that', 'something', 'the', 'a'] },
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
  { pattern: ['can', 'I'], completions: ['have', 'go', 'play', 'please', 'have water', 'have food', 'go outside', 'have the', 'have a'] },
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
  
  { pattern: ['I', 'am'], completions: ['happy', 'sad', 'tired', 'excited', 'hungry', 'thirsty', 'ready', 'finished'] },
  { pattern: ['you', 'are'], completions: ['happy', 'sad', 'tired', 'excited', 'ready', 'nice'] },
  { pattern: ['he', 'is'], completions: ['happy', 'sad', 'tired', 'excited', 'hungry', 'ready'] },
  { pattern: ['she', 'is'], completions: ['happy', 'sad', 'tired', 'excited', 'hungry', 'ready'] },
  { pattern: ['we', 'are'], completions: ['happy', 'sad', 'tired', 'excited', 'ready', 'going'] },
  { pattern: ['they', 'are'], completions: ['happy', 'sad', 'tired', 'excited', 'ready', 'coming'] },
  { pattern: ['mum', 'is'], completions: ['happy', 'sad', 'tired', 'ready', 'here', 'coming'] },
  { pattern: ['dad', 'is'], completions: ['happy', 'sad', 'tired', 'ready', 'here', 'coming'] },
  { pattern: ['my', 'sister', 'is'], completions: ['happy', 'sad', 'tired', 'ready', 'here'] },
  { pattern: ['my', 'brother', 'is'], completions: ['happy', 'sad', 'tired', 'ready', 'here'] },
  { pattern: ['I\'m'], completions: ['happy', 'sad', 'tired', 'excited', 'hungry', 'thirsty', 'ready', 'finished', 'sorry'] },
  
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
  { pattern: ['I', 'want'], completions: ['mum', 'dad', 'my toy', 'my book', 'my sister', 'my brother'] },
  { pattern: ['my'], completions: ['mum', 'dad', 'mate', 'friend', 'toy', 'book', 'favourite', 'sister', 'brother'] },
  
  // Food
  { pattern: ['I\'m'], completions: ['hungry', 'thirsty', 'starving', 'peckish'] },
  { pattern: ['want', 'some'], completions: ['water', 'food', 'tucker', 'lunch', 'tea'] },
  { pattern: ['have'], completions: ['water', 'food', 'lunch', 'tea', 'a snack', 'a drink', 'the', 'a'] },
  
  // Activities
  { pattern: ['play'], completions: ['outside', 'with toys', 'games', 'with mates', 'at the park', 'together'] },
  { pattern: ['watch'], completions: ['telly', 'TV', 'a movie', 'cartoons', 'the'] },
  { pattern: ['read'], completions: ['a book', 'a story', 'with me', 'the'] },
  { pattern: ['draw'], completions: ['a picture', 'with me', 'something'] },
  
  // GO variations with subjects
  { pattern: ['go'], completions: ['home', 'outside', 'to school', 'to the park', 'to the shop', 'to bed', 'with me', 'with him', 'with her'] },
  { pattern: ['go', 'to'], completions: ['school', 'home', 'the park', 'the shop', 'bed', 'the toilet'] },
  { pattern: ['go', 'with'], completions: ['me', 'you', 'him', 'her', 'them', 'mum', 'dad'] },
];

/**
 * Find sentence completions based on current words
 */
export function findSentenceCompletions(currentWords: string[], maxCompletions: number = 5): string[] {
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
  
  return completions.slice(0, maxCompletions);
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
 */
export function scoreSuggestions(
  suggestions: { text: string; type: string; confidence: number }[],
  currentWords: string[],
  userFrequency: Map<string, number>
): { text: string; type: string; confidence: number; score: number }[] {
  return suggestions.map(suggestion => {
    let score = suggestion.confidence;
    
    // Boost score based on user frequency
    const userFreq = userFrequency.get(suggestion.text.toLowerCase()) || 0;
    score += userFreq * 0.1;
    
    // Boost score based on sentence structure
    const structure = analyzeSentenceStructure([...currentWords, suggestion.text]);
    if (structure.hasSubject && structure.hasVerb) {
      score += 0.2; // Bonus for grammatically complete suggestions
    }
    
    // Boost score for contextually appropriate suggestions
    if (suggestion.type === 'completion' || suggestion.type === 'common_phrase') {
      score += 0.3;
    }
    
    // Boost score for AAC sentences
    if (suggestion.type === 'aac_sentence') {
      score += 0.4; // Higher priority for official AAC sentences
    }
    
    // Boost score for category-contextual suggestions
    if (suggestion.type === 'category_contextual') {
      score += 0.35; // High priority for category-relevant words
    }
    
    return { ...suggestion, score };
  }).sort((a, b) => b.score - a.score);
}

/**
 * ENHANCED: Get category-relevant words for contextual suggestions
 * This is the core of the category-aware recommendation system
 */
export function getCategoryRelevantWords(
  currentWords: string[],
  category: string,
  availableWords: string[]
): string[] {
  console.log('Getting category-relevant words for:', { category, currentWords, availableWordsCount: availableWords.length });
  
  // Enhanced category-specific word associations with more comprehensive vocabulary
  const categoryKeywords: { [key: string]: string[] } = {
    'core': ['I', 'you', 'he', 'she', 'we', 'they', 'want', 'need', 'like', 'help', 'more', 'go', 'stop', 'yes', 'no', 'please', 'thank you', 'can', 'the', 'a', 'that'],
    'people': ['mum', 'dad', 'mom', 'mother', 'father', 'friend', 'teacher', 'family', 'brother', 'sister', 'mate', 'grandma', 'grandpa', 'he', 'she', 'they', 'my'],
    'actions': ['eat', 'drink', 'play', 'sleep', 'walk', 'run', 'read', 'write', 'watch', 'listen', 'sit', 'stand', 'jump', 'dance', 'go', 'can', 'the'],
    'feelings': ['happy', 'sad', 'angry', 'scared', 'excited', 'tired', 'love', 'worried', 'calm', 'hurt', 'sick', 'good', 'bad', 'I', 'he', 'she', 'we', 'they'],
    'food': ['water', 'juice', 'milk', 'apple', 'banana', 'bread', 'snack', 'lunch', 'dinner', 'breakfast', 'hungry', 'thirsty', 'eat', 'drink', 'the', 'a', 'can'],
    'home': ['house', 'bed', 'bathroom', 'kitchen', 'TV', 'door', 'window', 'room', 'bedroom', 'toilet', 'sleep', 'rest', 'the', 'a', 'go', 'my'],
    'school': ['book', 'pencil', 'paper', 'class', 'teacher', 'lunch', 'recess', 'learn', 'study', 'homework', 'read', 'write', 'the', 'a', 'my', 'can'],
    'places': ['park', 'store', 'shop', 'school', 'home', 'playground', 'car', 'bus', 'outside', 'inside', 'the', 'a', 'go', 'can'],
    'body': ['head', 'hand', 'foot', 'arm', 'leg', 'eye', 'ear', 'nose', 'mouth', 'hurt', 'pain', 'sick', 'my', 'the', 'a'],
    'routines': ['morning', 'afternoon', 'evening', 'night', 'breakfast', 'lunch', 'dinner', 'bedtime', 'wake up', 'sleep', 'the', 'a', 'go'],
    'questions': ['what', 'where', 'when', 'who', 'why', 'how', 'is', 'are', 'do', 'can', 'will', 'the', 'a', 'that'],
    'colours': ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'black', 'white', 'brown', 'the', 'a'],
    'numbers': ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'more', 'less', 'the', 'a'],
    'animals': ['dog', 'cat', 'bird', 'fish', 'horse', 'cow', 'pig', 'sheep', 'rabbit', 'pet', 'the', 'a', 'my'],
    'clothing': ['shirt', 'pants', 'dress', 'shoes', 'socks', 'hat', 'coat', 'jacket', 'wear', 'put on', 'the', 'a', 'my'],
    'weather': ['sunny', 'rainy', 'cloudy', 'windy', 'hot', 'cold', 'warm', 'cool', 'weather', 'outside', 'the', 'a'],
    'time': ['now', 'later', 'today', 'tomorrow', 'yesterday', 'morning', 'afternoon', 'evening', 'night', 'time', 'the', 'a'],
    'toys': ['toy', 'ball', 'doll', 'game', 'puzzle', 'blocks', 'play', 'fun', 'the', 'a', 'my'],
  };
  
  const relevantKeywords = categoryKeywords[category] || [];
  console.log('Relevant keywords for category:', relevantKeywords);
  
  // If no current words, return category keywords that are in available words
  if (currentWords.length === 0) {
    const matches = availableWords.filter(word => 
      relevantKeywords.some(keyword => 
        word.toLowerCase() === keyword.toLowerCase() ||
        word.toLowerCase().includes(keyword.toLowerCase()) ||
        keyword.toLowerCase().includes(word.toLowerCase())
      )
    ).slice(0, 8);
    console.log('No current words, returning category matches:', matches);
    return matches;
  }
  
  // Analyze current sentence context
  const lastWord = currentWords[currentWords.length - 1]?.toLowerCase();
  const sentenceContext = currentWords.join(' ').toLowerCase();
  
  // Context-aware filtering based on sentence structure
  const contextualMatches: { word: string; score: number }[] = [];
  
  availableWords.forEach(word => {
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
      
      // Contextual boosting based on sentence patterns
      // Example: "I want" -> boost action words like "eat", "play", "go"
      if (sentenceContext.includes('i want') || sentenceContext.includes('want to') ||
          sentenceContext.includes('he wants') || sentenceContext.includes('she wants') ||
          sentenceContext.includes('we want') || sentenceContext.includes('they want')) {
        if (['eat', 'drink', 'play', 'sleep', 'go', 'read', 'watch', 'the', 'a'].includes(lowerWord)) {
          score += 5;
        }
      }
      
      // Example: "I feel" -> boost feeling words
      if (sentenceContext.includes('i feel') || sentenceContext.includes('feel') ||
          sentenceContext.includes('he feels') || sentenceContext.includes('she feels') ||
          sentenceContext.includes('we feel') || sentenceContext.includes('they feel')) {
        if (['happy', 'sad', 'angry', 'scared', 'excited', 'tired', 'good', 'bad'].includes(lowerWord)) {
          score += 5;
        }
      }
      
      // Example: "I need" -> boost need-related words
      if (sentenceContext.includes('i need') || sentenceContext.includes('need') ||
          sentenceContext.includes('he needs') || sentenceContext.includes('she needs') ||
          sentenceContext.includes('we need') || sentenceContext.includes('they need')) {
        if (['help', 'water', 'food', 'toilet', 'rest', 'break', 'the', 'a'].includes(lowerWord)) {
          score += 5;
        }
      }
      
      // Example: "where is" -> boost location/people words
      if (sentenceContext.includes('where is') || sentenceContext.includes('where')) {
        if (['mum', 'dad', 'toilet', 'home', 'school', 'park', 'he', 'she', 'my', 'the'].includes(lowerWord)) {
          score += 5;
        }
      }
      
      // Boost connecting words
      if (['the', 'a', 'can', 'go', 'that', 'this'].includes(lowerWord)) {
        score += 3;
      }
      
      // Boost words that follow common patterns
      if (lastWord === 'to' && ['go', 'play', 'eat', 'drink', 'sleep', 'read', 'the'].includes(lowerWord)) {
        score += 3;
      }
      
      if (lastWord === 'the' && ['toilet', 'park', 'shop', 'school', 'home', 'ball', 'book'].includes(lowerWord)) {
        score += 3;
      }
      
      if (lastWord === 'can' && ['I', 'you', 'he', 'she', 'we', 'they', 'go'].includes(lowerWord)) {
        score += 3;
      }
      
      if (lastWord === 'my' && ['mum', 'dad', 'sister', 'brother', 'friend', 'toy', 'book'].includes(lowerWord)) {
        score += 3;
      }
      
      contextualMatches.push({ word, score });
    }
  });
  
  // Sort by score and return top matches
  const results = contextualMatches
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(m => m.word);
  
  console.log('Category-relevant words found:', results);
  return results;
}
