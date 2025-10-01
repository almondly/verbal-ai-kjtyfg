
/**
 * Sentence Completion Engine
 * Provides intelligent sentence completion based on:
 * - Common sentence patterns
 * - User history
 * - Grammatical rules
 * - Context awareness
 */

import { detectTenseContext, getVerbFormForContext, getBaseForm } from './wordVariations';

// Common sentence templates (Australian English)
export const sentenceTemplates = [
  // Basic needs
  { pattern: ['I', 'want'], completions: ['to go', 'to play', 'to eat', 'to drink', 'some water', 'some food', 'that', 'more'] },
  { pattern: ['I', 'need'], completions: ['help', 'the toilet', 'water', 'food', 'a break', 'to go', 'to rest', 'mum', 'dad'] },
  { pattern: ['I', 'like'], completions: ['to play', 'to eat', 'this', 'that', 'it', 'you', 'playing', 'eating'] },
  { pattern: ['I', 'love'], completions: ['you', 'this', 'that', 'it', 'playing', 'eating', 'mum', 'dad'] },
  
  // Questions
  { pattern: ['what'], completions: ['is your name', 'time is it', 'are you doing', 'do you want', 'is that', 'happened'] },
  { pattern: ['what', 'is'], completions: ['your name', 'that', 'the time', 'happening', 'for lunch', 'for tea'] },
  { pattern: ['where'], completions: ['are you', 'is it', 'are we going', 'do you live', 'is the toilet', 'is mum', 'is dad'] },
  { pattern: ['where', 'is'], completions: ['it', 'the toilet', 'mum', 'dad', 'my toy', 'my book'] },
  { pattern: ['when'], completions: ['are we going', 'is lunch', 'is tea', 'can we go', 'will you be back'] },
  { pattern: ['why'], completions: ['are you sad', 'are you happy', 'not', 'is that', 'do we have to'] },
  { pattern: ['who'], completions: ['is that', 'are you', 'is coming', 'wants to play'] },
  { pattern: ['how'], completions: ['are you', 'are you going', 'was your day', 'do you feel', 'old are you'] },
  
  // Can/Could/Would
  { pattern: ['can', 'I'], completions: ['have', 'go', 'play', 'please', 'have water', 'have food', 'go outside'] },
  { pattern: ['can', 'you'], completions: ['help me', 'please', 'show me', 'teach me', 'come here'] },
  { pattern: ['can', 'we'], completions: ['go', 'play', 'eat', 'have', 'go outside', 'go home'] },
  { pattern: ['could', 'I'], completions: ['have', 'please', 'go', 'play'] },
  { pattern: ['could', 'you'], completions: ['help me', 'please', 'show me'] },
  { pattern: ['would', 'you'], completions: ['like', 'please', 'help me'] },
  
  // Feelings
  { pattern: ['I', 'feel'], completions: ['happy', 'sad', 'tired', 'excited', 'scared', 'angry', 'good', 'bad', 'sick'] },
  { pattern: ['I', 'am'], completions: ['happy', 'sad', 'tired', 'excited', 'hungry', 'thirsty', 'ready', 'finished'] },
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
  { pattern: ['how', 'are'], completions: ['you', 'you going', 'you feeling'] },
  
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
  { pattern: ['play'], completions: ['outside', 'with toys', 'games', 'with mates', 'at the park'] },
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
 */
export function generateCompleteSentences(
  currentWords: string[],
  userPhrases: Map<string, number>,
  maxSuggestions: number = 3
): string[] {
  const suggestions: string[] = [];
  const currentText = currentWords.join(' ').toLowerCase();
  
  // Find user phrases that start with current text
  const matchingPhrases: Array<{ phrase: string; frequency: number }> = [];
  
  userPhrases.forEach((frequency, phrase) => {
    if (phrase.startsWith(currentText) && phrase !== currentText) {
      matchingPhrases.push({ phrase, frequency });
    }
  });
  
  // Sort by frequency
  matchingPhrases.sort((a, b) => b.frequency - a.frequency);
  
  // Add top matching phrases
  matchingPhrases.slice(0, maxSuggestions).forEach(({ phrase }) => {
    suggestions.push(phrase);
  });
  
  // If we don't have enough suggestions, try template-based completion
  if (suggestions.length < maxSuggestions) {
    const templateCompletions = findSentenceCompletions(currentWords, maxSuggestions - suggestions.length);
    
    templateCompletions.forEach(completion => {
      const fullSentence = [...currentWords, completion].join(' ');
      if (!suggestions.includes(fullSentence)) {
        suggestions.push(fullSentence);
      }
    });
  }
  
  return suggestions;
}

/**
 * Predict next words based on n-gram patterns
 */
export function predictNextWords(
  currentWords: string[],
  transitions: Map<string, Map<string, number>>,
  maxPredictions: number = 5
): Array<{ word: string; confidence: number }> {
  const predictions: Array<{ word: string; confidence: number }> = [];
  
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
                       'want', 'need', 'like', 'love', 'go', 'come', 'see', 'know', 'think', 'feel'];
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
  suggestions: Array<{ text: string; type: string; confidence: number }>,
  currentWords: string[],
  userFrequency: Map<string, number>
): Array<{ text: string; type: string; confidence: number; score: number }> {
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
    
    return { ...suggestion, score };
  }).sort((a, b) => b.score - a.score);
}
