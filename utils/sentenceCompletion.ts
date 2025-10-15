
/**
 * Sentence Completion Engine
 * Provides intelligent sentence completion based on:
 * - Common sentence patterns
 * - User history
 * - Grammatical rules
 * - Context awareness
 * - Pronoun variations (I, you, he, she, we, they)
 * - Category-based contextual recommendations
 * - Official AAC sentence database
 */

import { detectTenseContext, getVerbFormForContext, getBaseForm } from './wordVariations';
import { getContextualAACSentences, aacSentences } from './aacSentences';

// Enhanced sentence templates with pronoun variations (Australian English)
export const sentenceTemplates = [
  // I want variations
  { pattern: ['I', 'want'], completions: ['to go', 'to play', 'to eat', 'to drink', 'some water', 'some food', 'that', 'more', 'to go outside', 'to watch telly', 'help'] },
  { pattern: ['I', 'want', 'to'], completions: ['go', 'play', 'eat', 'drink', 'sleep', 'read', 'draw', 'watch', 'go outside', 'go home'] },
  
  // You want variations
  { pattern: ['you', 'want'], completions: ['to go', 'to play', 'to eat', 'to drink', 'some water', 'some food', 'that', 'more', 'to help me', 'to come'] },
  { pattern: ['you', 'want', 'to'], completions: ['go', 'play', 'eat', 'drink', 'help me', 'come', 'see', 'know'] },
  
  // He/She wants variations
  { pattern: ['he', 'wants'], completions: ['to go', 'to play', 'to eat', 'to drink', 'some water', 'some food', 'that', 'more', 'help'] },
  { pattern: ['she', 'wants'], completions: ['to go', 'to play', 'to eat', 'to drink', 'some water', 'some food', 'that', 'more', 'help'] },
  { pattern: ['he', 'wants', 'to'], completions: ['go', 'play', 'eat', 'drink', 'help', 'come', 'see'] },
  { pattern: ['she', 'wants', 'to'], completions: ['go', 'play', 'eat', 'drink', 'help', 'come', 'see'] },
  
  // We want variations
  { pattern: ['we', 'want'], completions: ['to go', 'to play', 'to eat', 'to drink', 'some water', 'some food', 'that', 'more', 'to go outside', 'to play together'] },
  { pattern: ['we', 'want', 'to'], completions: ['go', 'play', 'eat', 'drink', 'go outside', 'play together', 'have fun'] },
  
  // They want variations
  { pattern: ['they', 'want'], completions: ['to go', 'to play', 'to eat', 'to drink', 'some water', 'some food', 'that', 'more', 'help'] },
  { pattern: ['they', 'want', 'to'], completions: ['go', 'play', 'eat', 'drink', 'help', 'come', 'see'] },
  
  // I need variations
  { pattern: ['I', 'need'], completions: ['help', 'the toilet', 'water', 'food', 'a break', 'to go', 'to rest', 'mum', 'dad', 'you'] },
  { pattern: ['I', 'need', 'to'], completions: ['go', 'eat', 'drink', 'sleep', 'rest', 'use toilet', 'go home'] },
  
  // You need variations
  { pattern: ['you', 'need'], completions: ['to help me', 'to come', 'to see', 'to know', 'this', 'that'] },
  { pattern: ['you', 'need', 'to'], completions: ['help me', 'come', 'see', 'know', 'listen'] },
  
  // He/She needs variations
  { pattern: ['he', 'needs'], completions: ['help', 'water', 'food', 'to go', 'to rest', 'that', 'this'] },
  { pattern: ['she', 'needs'], completions: ['help', 'water', 'food', 'to go', 'to rest', 'that', 'this'] },
  { pattern: ['he', 'needs', 'to'], completions: ['go', 'eat', 'drink', 'rest', 'help'] },
  { pattern: ['she', 'needs', 'to'], completions: ['go', 'eat', 'drink', 'rest', 'help'] },
  
  // We need variations
  { pattern: ['we', 'need'], completions: ['help', 'water', 'food', 'to go', 'to rest', 'that', 'this', 'to go home'] },
  { pattern: ['we', 'need', 'to'], completions: ['go', 'eat', 'drink', 'rest', 'go home', 'leave'] },
  
  // They need variations
  { pattern: ['they', 'need'], completions: ['help', 'water', 'food', 'to go', 'to rest', 'that', 'this'] },
  { pattern: ['they', 'need', 'to'], completions: ['go', 'eat', 'drink', 'rest', 'help'] },
  
  // I like variations
  { pattern: ['I', 'like'], completions: ['to play', 'to eat', 'this', 'that', 'it', 'you', 'playing', 'eating', 'red', 'blue'] },
  { pattern: ['I', 'like', 'to'], completions: ['play', 'eat', 'read', 'draw', 'watch', 'listen', 'go outside'] },
  
  // You like variations
  { pattern: ['you', 'like'], completions: ['to play', 'to eat', 'this', 'that', 'it', 'playing', 'eating'] },
  { pattern: ['you', 'like', 'to'], completions: ['play', 'eat', 'read', 'draw', 'watch', 'help'] },
  
  // He/She likes variations
  { pattern: ['he', 'likes'], completions: ['to play', 'to eat', 'this', 'that', 'it', 'playing', 'eating'] },
  { pattern: ['she', 'likes'], completions: ['to play', 'to eat', 'this', 'that', 'it', 'playing', 'eating'] },
  { pattern: ['he', 'likes', 'to'], completions: ['play', 'eat', 'read', 'draw', 'watch'] },
  { pattern: ['she', 'likes', 'to'], completions: ['play', 'eat', 'read', 'draw', 'watch'] },
  
  // We like variations
  { pattern: ['we', 'like'], completions: ['to play', 'to eat', 'this', 'that', 'it', 'playing', 'eating', 'playing together'] },
  { pattern: ['we', 'like', 'to'], completions: ['play', 'eat', 'play together', 'have fun', 'go outside'] },
  
  // They like variations
  { pattern: ['they', 'like'], completions: ['to play', 'to eat', 'this', 'that', 'it', 'playing', 'eating'] },
  { pattern: ['they', 'like', 'to'], completions: ['play', 'eat', 'read', 'draw', 'watch'] },
  
  // I have variations
  { pattern: ['I', 'have'], completions: ['a toy', 'a book', 'water', 'food', 'this', 'that', 'something', 'to go', 'to tell you'] },
  { pattern: ['I', 'have', 'to'], completions: ['go', 'eat', 'sleep', 'tell you', 'go home', 'use toilet'] },
  
  // You have variations
  { pattern: ['you', 'have'], completions: ['to help me', 'to come', 'to see', 'this', 'that', 'something'] },
  { pattern: ['you', 'have', 'to'], completions: ['help me', 'come', 'see', 'listen', 'know'] },
  
  // He/She has variations
  { pattern: ['he', 'has'], completions: ['a toy', 'a book', 'water', 'food', 'this', 'that', 'something', 'to go'] },
  { pattern: ['she', 'has'], completions: ['a toy', 'a book', 'water', 'food', 'this', 'that', 'something', 'to go'] },
  { pattern: ['he', 'has', 'to'], completions: ['go', 'eat', 'sleep', 'go home', 'leave'] },
  { pattern: ['she', 'has', 'to'], completions: ['go', 'eat', 'sleep', 'go home', 'leave'] },
  
  // We have variations
  { pattern: ['we', 'have'], completions: ['to go', 'to eat', 'to play', 'this', 'that', 'something', 'fun'] },
  { pattern: ['we', 'have', 'to'], completions: ['go', 'eat', 'play', 'go home', 'leave', 'finish'] },
  
  // They have variations
  { pattern: ['they', 'have'], completions: ['to go', 'to eat', 'this', 'that', 'something'] },
  { pattern: ['they', 'have', 'to'], completions: ['go', 'eat', 'leave', 'finish'] },
  
  // I love variations
  { pattern: ['I', 'love'], completions: ['you', 'this', 'that', 'it', 'playing', 'eating', 'mum', 'dad', 'my family'] },
  
  // You love variations
  { pattern: ['you', 'love'], completions: ['this', 'that', 'it', 'playing', 'me'] },
  
  // He/She loves variations
  { pattern: ['he', 'loves'], completions: ['this', 'that', 'it', 'playing', 'eating'] },
  { pattern: ['she', 'loves'], completions: ['this', 'that', 'it', 'playing', 'eating'] },
  
  // We love variations
  { pattern: ['we', 'love'], completions: ['this', 'that', 'it', 'playing', 'eating', 'playing together'] },
  
  // They love variations
  { pattern: ['they', 'love'], completions: ['this', 'that', 'it', 'playing', 'eating'] },
  
  // Questions
  { pattern: ['what'], completions: ['is your name', 'time is it', 'are you doing', 'do you want', 'is that', 'happened', 'do I need', 'do we need'] },
  { pattern: ['what', 'is'], completions: ['your name', 'that', 'the time', 'happening', 'for lunch', 'for tea'] },
  { pattern: ['what', 'do'], completions: ['you want', 'I need', 'we need', 'they want', 'you need'] },
  { pattern: ['where'], completions: ['are you', 'is it', 'are we going', 'do you live', 'is the toilet', 'is mum', 'is dad', 'are they'] },
  { pattern: ['where', 'is'], completions: ['it', 'the toilet', 'mum', 'dad', 'my toy', 'my book', 'he', 'she'] },
  { pattern: ['where', 'are'], completions: ['you', 'we going', 'they', 'we'] },
  { pattern: ['when'], completions: ['are we going', 'is lunch', 'is tea', 'can we go', 'will you be back', 'do we leave'] },
  { pattern: ['why'], completions: ['are you sad', 'are you happy', 'not', 'is that', 'do we have to', 'is he sad', 'is she happy'] },
  { pattern: ['who'], completions: ['is that', 'are you', 'is coming', 'wants to play', 'needs help'] },
  { pattern: ['how'], completions: ['are you', 'are you going', 'was your day', 'do you feel', 'old are you', 'is he', 'is she'] },
  
  // Can/Could/Would with pronoun variations
  { pattern: ['can', 'I'], completions: ['have', 'go', 'play', 'please', 'have water', 'have food', 'go outside'] },
  { pattern: ['can', 'you'], completions: ['help me', 'please', 'show me', 'teach me', 'come here'] },
  { pattern: ['can', 'we'], completions: ['go', 'play', 'eat', 'have', 'go outside', 'go home'] },
  { pattern: ['can', 'he'], completions: ['come', 'help', 'play', 'go'] },
  { pattern: ['can', 'she'], completions: ['come', 'help', 'play', 'go'] },
  { pattern: ['can', 'they'], completions: ['come', 'help', 'play', 'go'] },
  { pattern: ['could', 'I'], completions: ['have', 'please', 'go', 'play'] },
  { pattern: ['could', 'you'], completions: ['help me', 'please', 'show me'] },
  { pattern: ['could', 'we'], completions: ['go', 'play', 'have'] },
  { pattern: ['would', 'you'], completions: ['like', 'please', 'help me'] },
  { pattern: ['would', 'I'], completions: ['like', 'like to', 'like some'] },
  { pattern: ['would', 'we'], completions: ['like', 'like to', 'like some'] },
  
  // Feelings with pronoun variations
  { pattern: ['I', 'feel'], completions: ['happy', 'sad', 'tired', 'excited', 'scared', 'angry', 'good', 'bad', 'sick'] },
  { pattern: ['you', 'feel'], completions: ['happy', 'sad', 'tired', 'excited', 'good', 'bad'] },
  { pattern: ['he', 'feels'], completions: ['happy', 'sad', 'tired', 'excited', 'good', 'bad'] },
  { pattern: ['she', 'feels'], completions: ['happy', 'sad', 'tired', 'excited', 'good', 'bad'] },
  { pattern: ['we', 'feel'], completions: ['happy', 'sad', 'tired', 'excited', 'good', 'bad'] },
  { pattern: ['they', 'feel'], completions: ['happy', 'sad', 'tired', 'excited', 'good', 'bad'] },
  { pattern: ['I', 'am'], completions: ['happy', 'sad', 'tired', 'excited', 'hungry', 'thirsty', 'ready', 'finished'] },
  { pattern: ['you', 'are'], completions: ['happy', 'sad', 'tired', 'excited', 'ready', 'nice'] },
  { pattern: ['he', 'is'], completions: ['happy', 'sad', 'tired', 'excited', 'hungry', 'ready'] },
  { pattern: ['she', 'is'], completions: ['happy', 'sad', 'tired', 'excited', 'hungry', 'ready'] },
  { pattern: ['we', 'are'], completions: ['happy', 'sad', 'tired', 'excited', 'ready', 'going'] },
  { pattern: ['they', 'are'], completions: ['happy', 'sad', 'tired', 'excited', 'ready', 'coming'] },
  { pattern: ['I\'m'], completions: ['happy', 'sad', 'tired', 'excited', 'hungry', 'thirsty', 'ready', 'finished', 'sorry'] },
  
  // Actions
  { pattern: ['want', 'to'], completions: ['go', 'play', 'eat', 'drink', 'sleep', 'read', 'draw', 'watch'] },
  { pattern: ['need', 'to'], completions: ['go', 'eat', 'drink', 'sleep', 'rest', 'use toilet'] },
  { pattern: ['like', 'to'], completions: ['play', 'eat', 'read', 'draw', 'watch', 'listen'] },
  { pattern: ['going', 'to'], completions: ['school', 'home', 'park', 'shop', 'play', 'eat'] },
  
  // Places
  { pattern: ['go', 'to'], completions: ['school', 'home', 'park', 'shop', 'bed', 'toilet', 'outside'] },
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
  { pattern: ['where', 'is'], completions: ['mum', 'dad', 'my mate', 'my friend'] },
  { pattern: ['I', 'want'], completions: ['mum', 'dad', 'my toy', 'my book'] },
  { pattern: ['my'], completions: ['mum', 'dad', 'mate', 'friend', 'toy', 'book', 'favourite'] },
  
  // Food
  { pattern: ['I\'m'], completions: ['hungry', 'thirsty', 'starving', 'peckish'] },
  { pattern: ['want', 'some'], completions: ['water', 'food', 'tucker', 'lunch', 'tea'] },
  { pattern: ['have'], completions: ['water', 'food', 'lunch', 'tea', 'a snack', 'a drink'] },
  
  // Activities
  { pattern: ['play'], completions: ['outside', 'with toys', 'games', 'with mates', 'at the park', 'together'] },
  { pattern: ['watch'], completions: ['telly', 'TV', 'a movie', 'cartoons'] },
  { pattern: ['read'], completions: ['a book', 'a story', 'with me'] },
  { pattern: ['draw'], completions: ['a picture', 'with me', 'something'] },
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
  
  // Detect subject (I, you, he, she, it, we, they, or nouns)
  const subjects = ['i', 'you', 'he', 'she', 'it', 'we', 'they', 'this', 'that'];
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
    
    return { ...suggestion, score };
  }).sort((a, b) => b.score - a.score);
}

/**
 * Get category-relevant words for contextual suggestions
 */
export function getCategoryRelevantWords(
  currentWords: string[],
  category: string,
  availableWords: string[]
): string[] {
  // Category-specific word associations
  const categoryKeywords: { [key: string]: string[] } = {
    'core': ['I', 'you', 'want', 'need', 'like', 'help', 'more', 'go', 'stop', 'yes', 'no'],
    'people': ['mom', 'dad', 'friend', 'teacher', 'family', 'brother', 'sister'],
    'actions': ['eat', 'drink', 'play', 'sleep', 'walk', 'run', 'read', 'write', 'watch'],
    'feelings': ['happy', 'sad', 'angry', 'scared', 'excited', 'tired', 'love'],
    'food': ['water', 'juice', 'milk', 'apple', 'banana', 'bread', 'snack'],
    'home': ['house', 'bed', 'bathroom', 'kitchen', 'TV', 'door', 'window'],
    'school': ['book', 'pencil', 'paper', 'class', 'teacher', 'lunch', 'recess'],
    'places': ['park', 'store', 'school', 'home', 'playground', 'car', 'bus'],
  };
  
  const relevantKeywords = categoryKeywords[category] || [];
  
  // Filter available words that match the category
  return availableWords.filter(word => 
    relevantKeywords.some(keyword => 
      word.toLowerCase().includes(keyword.toLowerCase()) ||
      keyword.toLowerCase().includes(word.toLowerCase())
    )
  ).slice(0, 5);
}
