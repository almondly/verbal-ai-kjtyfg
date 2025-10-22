
/**
 * Grammatical Correction Utility
 * Detects grammatically incomplete sentences and suggests corrections
 * Examples:
 * - "I good" -> "I am good"
 * - "I want go outside" -> "I want to go outside"
 * - "He happy" -> "He is happy"
 * - "They tired" -> "They are tired"
 */

export interface GrammaticalSuggestion {
  original: string;
  corrected: string;
  confidence: number;
  explanation: string;
}

/**
 * Detect if a sentence is grammatically incomplete and suggest corrections
 */
export function detectGrammaticalIssues(words: string[]): GrammaticalSuggestion[] {
  if (words.length === 0) return [];
  
  const suggestions: GrammaticalSuggestion[] = [];
  const lowerWords = words.map(w => w.toLowerCase());
  const originalText = words.join(' ');
  
  // Pattern 1: Subject + Adjective (missing "am/is/are")
  // Examples: "I good", "He happy", "They tired"
  if (lowerWords.length === 2) {
    const [subject, word2] = lowerWords;
    
    // Check if first word is a subject pronoun
    const subjectPronouns = {
      'i': 'am',
      'you': 'are',
      'he': 'is',
      'she': 'is',
      'it': 'is',
      'we': 'are',
      'they': 'are'
    };
    
    // Common adjectives and states
    const adjectives = [
      'good', 'bad', 'happy', 'sad', 'tired', 'hungry', 'thirsty', 'sick', 'ready',
      'excited', 'scared', 'angry', 'fine', 'okay', 'done', 'finished', 'busy',
      'hot', 'cold', 'warm', 'cool', 'big', 'small', 'nice', 'great', 'awesome'
    ];
    
    if (subjectPronouns[subject] && adjectives.includes(word2)) {
      const verb = subjectPronouns[subject];
      const corrected = `${words[0]} ${verb} ${words[1]}`;
      
      suggestions.push({
        original: originalText,
        corrected,
        confidence: 0.95,
        explanation: `Added "${verb}" between subject and adjective`
      });
    }
  }
  
  // Pattern 2: "I/He/She/They want go" (missing "to")
  // Examples: "I want go outside", "He want play"
  if (lowerWords.length >= 3) {
    for (let i = 0; i < lowerWords.length - 2; i++) {
      const word1 = lowerWords[i];
      const word2 = lowerWords[i + 1];
      const word3 = lowerWords[i + 2];
      
      // Check for "want/need/like + verb" pattern (missing "to")
      const modalVerbs = ['want', 'need', 'like', 'love', 'have', 'going'];
      const infinitiveVerbs = [
        'go', 'play', 'eat', 'drink', 'sleep', 'read', 'write', 'watch', 'listen',
        'run', 'walk', 'jump', 'dance', 'sing', 'draw', 'paint', 'build', 'make',
        'see', 'hear', 'feel', 'think', 'know', 'learn', 'teach', 'help', 'work'
      ];
      
      if (modalVerbs.includes(word2) && infinitiveVerbs.includes(word3)) {
        // Insert "to" between modal verb and infinitive
        const correctedWords = [...words];
        correctedWords.splice(i + 2, 0, 'to');
        const corrected = correctedWords.join(' ');
        
        suggestions.push({
          original: originalText,
          corrected,
          confidence: 0.92,
          explanation: `Added "to" before infinitive verb "${words[i + 2]}"`
        });
        break; // Only suggest one correction per sentence
      }
    }
  }
  
  // Pattern 3: "I want water" vs "I want to go outside" - detect when "to" is needed
  // This is more complex - we need to check if the word after "want/need" is a noun or verb
  if (lowerWords.length >= 3) {
    for (let i = 0; i < lowerWords.length - 2; i++) {
      const word1 = lowerWords[i];
      const word2 = lowerWords[i + 1];
      const word3 = lowerWords[i + 2];
      
      const modalVerbs = ['want', 'need', 'like', 'love'];
      const actionVerbs = [
        'go', 'play', 'eat', 'drink', 'sleep', 'read', 'write', 'watch', 'listen',
        'run', 'walk', 'jump', 'dance', 'sing', 'draw', 'paint', 'build', 'make',
        'see', 'hear', 'feel', 'think', 'know', 'learn', 'teach', 'help', 'work',
        'come', 'leave', 'stay', 'sit', 'stand', 'talk', 'speak', 'tell', 'ask'
      ];
      
      // Check if pattern is "subject + want/need + action verb + ..."
      if (modalVerbs.includes(word2) && actionVerbs.includes(word3)) {
        // Check if "to" is already there
        if (i + 3 < lowerWords.length && lowerWords[i + 2] !== 'to') {
          const correctedWords = [...words];
          correctedWords.splice(i + 2, 0, 'to');
          const corrected = correctedWords.join(' ');
          
          suggestions.push({
            original: originalText,
            corrected,
            confidence: 0.90,
            explanation: `Added "to" before action verb "${words[i + 2]}"`
          });
          break;
        }
      }
    }
  }
  
  // Pattern 4: Subject + Verb agreement
  // Examples: "He want" -> "He wants", "They wants" -> "They want"
  if (lowerWords.length >= 2) {
    for (let i = 0; i < lowerWords.length - 1; i++) {
      const subject = lowerWords[i];
      const verb = lowerWords[i + 1];
      
      // Third person singular subjects need "s" on verbs
      const thirdPersonSingular = ['he', 'she', 'it'];
      const thirdPersonPlural = ['i', 'you', 'we', 'they'];
      
      const baseVerbs = ['want', 'need', 'like', 'love', 'have', 'go', 'play', 'eat', 'drink'];
      const verbsWithS = ['wants', 'needs', 'likes', 'loves', 'has', 'goes', 'plays', 'eats', 'drinks'];
      
      // Check if third person singular needs "s"
      if (thirdPersonSingular.includes(subject)) {
        const verbIndex = baseVerbs.indexOf(verb);
        if (verbIndex !== -1) {
          const correctedWords = [...words];
          correctedWords[i + 1] = verbsWithS[verbIndex];
          const corrected = correctedWords.join(' ');
          
          suggestions.push({
            original: originalText,
            corrected,
            confidence: 0.88,
            explanation: `Changed "${verb}" to "${verbsWithS[verbIndex]}" for third person singular`
          });
          break;
        }
      }
      
      // Check if plural subject has incorrect "s"
      if (thirdPersonPlural.includes(subject)) {
        const verbIndex = verbsWithS.indexOf(verb);
        if (verbIndex !== -1) {
          const correctedWords = [...words];
          correctedWords[i + 1] = baseVerbs[verbIndex];
          const corrected = correctedWords.join(' ');
          
          suggestions.push({
            original: originalText,
            corrected,
            confidence: 0.88,
            explanation: `Changed "${verb}" to "${baseVerbs[verbIndex]}" for plural subject`
          });
          break;
        }
      }
    }
  }
  
  // Pattern 5: Missing articles "the" or "a"
  // Examples: "I want ball" -> "I want the ball", "I see dog" -> "I see a dog"
  if (lowerWords.length >= 3) {
    for (let i = 0; i < lowerWords.length - 2; i++) {
      const word1 = lowerWords[i];
      const word2 = lowerWords[i + 1];
      const word3 = lowerWords[i + 2];
      
      const verbsNeedingArticle = ['want', 'need', 'have', 'see', 'like', 'love', 'get', 'find'];
      const commonNouns = [
        'ball', 'book', 'toy', 'dog', 'cat', 'car', 'bike', 'game', 'food', 'water',
        'bathroom', 'toilet', 'park', 'shop', 'school', 'home', 'bed', 'chair', 'table'
      ];
      
      // Check if pattern is "verb + noun" (missing article)
      if (verbsNeedingArticle.includes(word2) && commonNouns.includes(word3)) {
        // Decide between "a" and "the"
        // Use "the" for specific/unique things, "a" for general things
        const useThe = ['bathroom', 'toilet', 'park', 'shop', 'school', 'home', 'bed'].includes(word3);
        const article = useThe ? 'the' : 'a';
        
        const correctedWords = [...words];
        correctedWords.splice(i + 2, 0, article);
        const corrected = correctedWords.join(' ');
        
        suggestions.push({
          original: originalText,
          corrected,
          confidence: 0.85,
          explanation: `Added article "${article}" before noun "${words[i + 2]}"`
        });
        break;
      }
    }
  }
  
  return suggestions;
}

/**
 * Get the best grammatical correction for a sentence
 */
export function getBestGrammaticalCorrection(words: string[]): string | null {
  const suggestions = detectGrammaticalIssues(words);
  
  if (suggestions.length === 0) return null;
  
  // Return the suggestion with highest confidence
  const best = suggestions.reduce((prev, current) => 
    current.confidence > prev.confidence ? current : prev
  );
  
  return best.corrected;
}

/**
 * Check if a sentence needs grammatical correction
 */
export function needsGrammaticalCorrection(words: string[]): boolean {
  const suggestions = detectGrammaticalIssues(words);
  return suggestions.length > 0 && suggestions[0].confidence >= 0.85;
}
