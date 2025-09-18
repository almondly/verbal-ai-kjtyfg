
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../app/integrations/supabase/client';

export interface AdvancedSuggestion {
  text: string;
  confidence: number;
  type: 'completion' | 'next_word' | 'common_phrase' | 'contextual' | 'temporal';
  context?: string;
}

export function useAdvancedAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Store user patterns locally for faster access
  const [userPatterns, setUserPatterns] = useState<{
    phrases: Map<string, number>;
    transitions: Map<string, Map<string, number>>;
    contexts: Map<string, string[]>;
    temporalPatterns: Map<string, { hour: number; count: number }[]>;
  }>({
    phrases: new Map(),
    transitions: new Map(),
    contexts: new Map(),
    temporalPatterns: new Map(),
  });

  // Initialize patterns from Supabase
  useEffect(() => {
    loadUserPatterns();
  }, []);

  const loadUserPatterns = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('user_patterns')
        .select('*')
        .order('frequency', { ascending: false });

      if (error) {
        console.log('Error loading patterns:', error);
        return;
      }

      const phrases = new Map();
      const transitions = new Map();
      const contexts = new Map();
      const temporalPatterns = new Map();

      data?.forEach(pattern => {
        if (pattern.pattern_type === 'phrase') {
          phrases.set(pattern.pattern_key, pattern.frequency);
        } else if (pattern.pattern_type === 'transition') {
          const [from, to] = pattern.pattern_key.split('->');
          if (!transitions.has(from)) {
            transitions.set(from, new Map());
          }
          transitions.get(from)!.set(to, pattern.frequency);
        } else if (pattern.pattern_type === 'context') {
          contexts.set(pattern.pattern_key, pattern.metadata?.related_words || []);
        } else if (pattern.pattern_type === 'temporal') {
          temporalPatterns.set(pattern.pattern_key, pattern.metadata?.time_data || []);
        }
      });

      setUserPatterns({ phrases, transitions, contexts, temporalPatterns });
      console.log('Loaded user patterns:', { 
        phrases: phrases.size, 
        transitions: transitions.size, 
        contexts: contexts.size,
        temporal: temporalPatterns.size
      });
    } catch (err) {
      console.log('Error in loadUserPatterns:', err);
      setError('Failed to load user patterns');
    } finally {
      setIsLoading(false);
    }
  };

  const recordUserInput = useCallback(async (sentence: string, context?: string) => {
    try {
      const words = sentence.toLowerCase().trim().split(/\s+/).filter(Boolean);
      const currentHour = new Date().getHours();
      
      // Record the full phrase
      const { error: phraseError } = await supabase
        .from('user_patterns')
        .upsert({
          pattern_type: 'phrase',
          pattern_key: sentence.toLowerCase(),
          frequency: 1,
          metadata: { word_count: words.length, context, hour: currentHour },
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'pattern_type,pattern_key'
        });

      if (phraseError) {
        console.log('Error recording phrase:', phraseError);
      }

      // Record word transitions
      for (let i = 0; i < words.length - 1; i++) {
        const transition = `${words[i]}->${words[i + 1]}`;
        const { error: transitionError } = await supabase
          .from('user_patterns')
          .upsert({
            pattern_type: 'transition',
            pattern_key: transition,
            frequency: 1,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'pattern_type,pattern_key'
          });

        if (transitionError) {
          console.log('Error recording transition:', transitionError);
        }
      }

      // Record temporal patterns
      const { error: temporalError } = await supabase
        .from('user_patterns')
        .upsert({
          pattern_type: 'temporal',
          pattern_key: sentence.toLowerCase(),
          frequency: 1,
          metadata: { hour: currentHour, time_data: [{ hour: currentHour, count: 1 }] },
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'pattern_type,pattern_key'
        });

      if (temporalError) {
        console.log('Error recording temporal pattern:', temporalError);
      }

      // Update local patterns
      await loadUserPatterns();
    } catch (err) {
      console.log('Error recording user input:', err);
    }
  }, []);

  const removeDuplicateWords = (words: string[]): string[] => {
    const seen = new Set<string>();
    return words.filter(word => {
      const lowerWord = word.toLowerCase();
      if (seen.has(lowerWord)) {
        return false;
      }
      seen.add(lowerWord);
      return true;
    });
  };

  const findAlternativeWords = (word: string, availableWords: string[]): string[] => {
    const alternatives: string[] = [];
    const lowerWord = word.toLowerCase();
    
    // Simple synonym mapping for common words
    const synonyms: { [key: string]: string[] } = {
      'want': ['need', 'like', 'wish'],
      'need': ['want', 'require', 'must have'],
      'like': ['love', 'enjoy', 'want'],
      'good': ['great', 'nice', 'awesome'],
      'bad': ['terrible', 'awful', 'not good'],
      'happy': ['glad', 'excited', 'joyful'],
      'sad': ['upset', 'unhappy', 'down'],
      'big': ['large', 'huge', 'giant'],
      'small': ['little', 'tiny', 'mini'],
      'go': ['move', 'travel', 'walk'],
      'come': ['arrive', 'visit', 'approach'],
      'eat': ['consume', 'have', 'taste'],
      'drink': ['sip', 'have', 'consume'],
    };

    if (synonyms[lowerWord]) {
      synonyms[lowerWord].forEach(synonym => {
        const matchingWord = availableWords.find(w => w.toLowerCase() === synonym);
        if (matchingWord && !alternatives.includes(matchingWord)) {
          alternatives.push(matchingWord);
        }
      });
    }

    return alternatives.slice(0, 2); // Return max 2 alternatives
  };

  const getAdvancedSuggestions = useCallback(async (
    currentWords: string[],
    availableWords: string[],
    maxSuggestions: number = 6
  ): Promise<AdvancedSuggestion[]> => {
    try {
      const suggestions: AdvancedSuggestion[] = [];
      
      const currentText = currentWords.join(' ').toLowerCase();
      const lastWord = currentWords[currentWords.length - 1]?.toLowerCase();
      const currentHour = new Date().getHours();

      // Remove duplicate words from current sentence
      const uniqueCurrentWords = removeDuplicateWords(currentWords);
      
      // 1. Look for phrase completions
      if (currentText) {
        userPatterns.phrases.forEach((frequency, phrase) => {
          if (phrase.startsWith(currentText) && phrase !== currentText) {
            const completion = phrase.substring(currentText.length).trim();
            if (completion) {
              const nextWord = completion.split(' ')[0];
              // Check if this word would create a duplicate
              if (!uniqueCurrentWords.some(w => w.toLowerCase() === nextWord.toLowerCase())) {
                suggestions.push({
                  text: nextWord,
                  confidence: Math.min(0.9, frequency / 10),
                  type: 'completion',
                  context: phrase
                });
              }
            }
          }
        });
      }

      // 2. Look for word transitions
      if (lastWord && userPatterns.transitions.has(lastWord)) {
        const nextWords = userPatterns.transitions.get(lastWord)!;
        nextWords.forEach((frequency, nextWord) => {
          // Check for duplicates and existing suggestions
          if (!suggestions.some(s => s.text.toLowerCase() === nextWord.toLowerCase()) &&
              !uniqueCurrentWords.some(w => w.toLowerCase() === nextWord.toLowerCase())) {
            suggestions.push({
              text: nextWord,
              confidence: Math.min(0.8, frequency / 5),
              type: 'next_word',
              context: `${lastWord} -> ${nextWord}`
            });
          }
        });
      }

      // 3. Add temporal suggestions based on current time
      userPatterns.temporalPatterns.forEach((timeData, phrase) => {
        const relevantTimes = timeData.filter(t => Math.abs(t.hour - currentHour) <= 2);
        if (relevantTimes.length > 0) {
          const firstWord = phrase.split(' ')[0];
          if (!suggestions.some(s => s.text.toLowerCase() === firstWord.toLowerCase()) &&
              !uniqueCurrentWords.some(w => w.toLowerCase() === firstWord.toLowerCase())) {
            const totalCount = relevantTimes.reduce((sum, t) => sum + t.count, 0);
            suggestions.push({
              text: firstWord,
              confidence: Math.min(0.75, totalCount / 5),
              type: 'temporal',
              context: `Common at ${currentHour}:00`
            });
          }
        }
      });

      // 4. Add common phrases from patterns
      const commonPhrases = Array.from(userPatterns.phrases.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

      commonPhrases.forEach(([phrase, frequency]) => {
        const firstWord = phrase.split(' ')[0];
        if (!suggestions.some(s => s.text.toLowerCase() === firstWord.toLowerCase()) &&
            !uniqueCurrentWords.some(w => w.toLowerCase() === firstWord.toLowerCase())) {
          suggestions.push({
            text: firstWord,
            confidence: Math.min(0.7, frequency / 8),
            type: 'common_phrase',
            context: phrase
          });
        }
      });

      // 5. Add contextual suggestions from available words (avoiding duplicates)
      availableWords.slice(0, 3).forEach(word => {
        if (!suggestions.some(s => s.text.toLowerCase() === word.toLowerCase()) &&
            !uniqueCurrentWords.some(w => w.toLowerCase() === word.toLowerCase())) {
          suggestions.push({
            text: word,
            confidence: 0.3,
            type: 'contextual'
          });
        }
      });

      // 6. Add alternative words for the last word if it exists
      if (lastWord) {
        const alternatives = findAlternativeWords(lastWord, availableWords);
        alternatives.forEach(alt => {
          if (!suggestions.some(s => s.text.toLowerCase() === alt.toLowerCase()) &&
              !uniqueCurrentWords.some(w => w.toLowerCase() === alt.toLowerCase())) {
            suggestions.push({
              text: alt,
              confidence: 0.4,
              type: 'contextual',
              context: `Alternative to "${lastWord}"`
            });
          }
        });
      }

      // Sort by confidence and return top suggestions
      return suggestions
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, maxSuggestions);

    } catch (err) {
      console.log('Error getting advanced suggestions:', err);
      setError('Failed to get suggestions');
      return [];
    }
  }, [userPatterns]);

  const getTimeBasedSuggestions = useCallback(async (): Promise<string[]> => {
    try {
      const hour = new Date().getHours();
      let timeContext = '';
      
      if (hour >= 6 && hour < 12) {
        timeContext = 'morning';
      } else if (hour >= 12 && hour < 17) {
        timeContext = 'afternoon';
      } else if (hour >= 17 && hour < 21) {
        timeContext = 'evening';
      } else {
        timeContext = 'night';
      }

      const { data } = await supabase
        .from('user_patterns')
        .select('pattern_key, frequency')
        .eq('pattern_type', 'phrase')
        .contains('metadata', { context: timeContext })
        .order('frequency', { ascending: false })
        .limit(5);

      return data?.map(d => d.pattern_key) || [];
    } catch (err) {
      console.log('Error getting time-based suggestions:', err);
      return [];
    }
  }, []);

  return {
    isLoading,
    error,
    recordUserInput,
    getAdvancedSuggestions,
    getTimeBasedSuggestions,
    userPatterns
  };
}
