
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../app/integrations/supabase/client';

export interface AdvancedSuggestion {
  text: string;
  confidence: number;
  type: 'completion' | 'next_word' | 'common_phrase' | 'contextual';
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
  }>({
    phrases: new Map(),
    transitions: new Map(),
    contexts: new Map(),
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
        }
      });

      setUserPatterns({ phrases, transitions, contexts });
      console.log('Loaded user patterns:', { 
        phrases: phrases.size, 
        transitions: transitions.size, 
        contexts: contexts.size 
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
      
      // Record the full phrase
      const { error: phraseError } = await supabase
        .from('user_patterns')
        .upsert({
          pattern_type: 'phrase',
          pattern_key: sentence.toLowerCase(),
          frequency: 1,
          metadata: { word_count: words.length, context },
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

      // Update local patterns
      await loadUserPatterns();
    } catch (err) {
      console.log('Error recording user input:', err);
    }
  }, []);

  const getAdvancedSuggestions = useCallback(async (
    currentWords: string[],
    availableWords: string[],
    maxSuggestions: number = 6
  ): Promise<AdvancedSuggestion[]> => {
    try {
      const suggestions: AdvancedSuggestion[] = [];
      
      const currentText = currentWords.join(' ').toLowerCase();
      const lastWord = currentWords[currentWords.length - 1]?.toLowerCase();

      // 1. Look for phrase completions
      if (currentText) {
        userPatterns.phrases.forEach((frequency, phrase) => {
          if (phrase.startsWith(currentText) && phrase !== currentText) {
            const completion = phrase.substring(currentText.length).trim();
            if (completion) {
              const nextWord = completion.split(' ')[0];
              suggestions.push({
                text: nextWord,
                confidence: Math.min(0.9, frequency / 10),
                type: 'completion',
                context: phrase
              });
            }
          }
        });
      }

      // 2. Look for word transitions
      if (lastWord && userPatterns.transitions.has(lastWord)) {
        const nextWords = userPatterns.transitions.get(lastWord)!;
        nextWords.forEach((frequency, nextWord) => {
          if (!suggestions.some(s => s.text === nextWord)) {
            suggestions.push({
              text: nextWord,
              confidence: Math.min(0.8, frequency / 5),
              type: 'next_word',
              context: `${lastWord} -> ${nextWord}`
            });
          }
        });
      }

      // 3. Add common phrases from patterns
      const commonPhrases = Array.from(userPatterns.phrases.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

      commonPhrases.forEach(([phrase, frequency]) => {
        const firstWord = phrase.split(' ')[0];
        if (!suggestions.some(s => s.text === firstWord)) {
          suggestions.push({
            text: firstWord,
            confidence: Math.min(0.7, frequency / 8),
            type: 'common_phrase',
            context: phrase
          });
        }
      });

      // 4. Add contextual suggestions from available words
      availableWords.slice(0, 3).forEach(word => {
        if (!suggestions.some(s => s.text.toLowerCase() === word.toLowerCase())) {
          suggestions.push({
            text: word,
            confidence: 0.3,
            type: 'contextual'
          });
        }
      });

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
