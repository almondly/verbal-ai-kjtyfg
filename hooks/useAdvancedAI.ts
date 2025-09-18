
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../app/integrations/supabase/client';

export interface AdvancedSuggestion {
  text: string;
  confidence: number;
  type: 'temporal' | 'pattern' | 'contextual';
  reasoning?: string;
}

export interface TemporalContext {
  hourOfDay: number;
  dayOfWeek: number;
  commonAtThisTime: string[];
}

export interface PredictionResponse {
  suggestions: AdvancedSuggestion[];
  temporalContext: TemporalContext;
}

export function useAdvancedAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastPredictions, setLastPredictions] = useState<AdvancedSuggestion[]>([]);
  const [temporalContext, setTemporalContext] = useState<TemporalContext | null>(null);
  const [dailySentenceCount, setDailySentenceCount] = useState(0);

  // Get daily sentence count
  useEffect(() => {
    const fetchDailyCount = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const { data, error } = await supabase
          .from('sentences')
          .select('usage_count')
          .eq('user_id', user.id)
          .gte('created_at', today.toISOString());

        if (!error && data) {
          const count = data.reduce((sum, item) => sum + item.usage_count, 0);
          setDailySentenceCount(count);
        }
      } catch (error) {
        console.log('Error fetching daily count:', error);
      }
    };

    fetchDailyCount();
  }, []);

  const recordSentence = useCallback(async (sentence: string, wordIds: string[] = []) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user found for recording sentence');
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('No session found for recording sentence');
        return;
      }

      console.log('Recording sentence:', sentence);

      const response = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/store-sentence`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          sentence: sentence.trim(),
          wordIds
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to record sentence:', errorText);
        return;
      }

      const result = await response.json();
      console.log('Sentence recorded successfully:', result);
      
      // Update daily count
      setDailySentenceCount(prev => prev + 1);

    } catch (error) {
      console.error('Error recording sentence:', error);
    }
  }, []);

  const getAdvancedSuggestions = useCallback(async (
    currentSentence: string,
    contextSentences: string[] = [],
    maxSuggestions: number = 6
  ): Promise<AdvancedSuggestion[]> => {
    if (!currentSentence.trim()) {
      return [];
    }

    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user found for predictions');
        return [];
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('No session found for predictions');
        return [];
      }

      console.log('Getting advanced suggestions for:', currentSentence);

      const response = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/advanced-sentence-predictor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          currentSentence: currentSentence.trim(),
          contextSentences,
          maxSuggestions
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to get predictions:', errorText);
        return [];
      }

      const result: PredictionResponse = await response.json();
      console.log('Advanced predictions received:', result);
      
      setLastPredictions(result.suggestions);
      setTemporalContext(result.temporalContext);
      
      return result.suggestions;

    } catch (error) {
      console.error('Error getting advanced suggestions:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const suggestNextWords = useCallback(async (
    currentWords: string[],
    libraryWords: string[] = [],
    maxSuggestions: number = 6
  ): Promise<string[]> => {
    const currentSentence = currentWords.join(' ');
    const suggestions = await getAdvancedSuggestions(currentSentence, [], maxSuggestions);
    
    // Extract just the next words from the suggestions
    const nextWords: string[] = [];
    
    for (const suggestion of suggestions) {
      if (suggestion.text.startsWith(currentSentence)) {
        const remainingText = suggestion.text.slice(currentSentence.length).trim();
        const nextWord = remainingText.split(' ')[0];
        if (nextWord && !nextWords.includes(nextWord)) {
          nextWords.push(nextWord);
        }
      }
    }
    
    // Fill remaining slots with library words if needed
    for (const word of libraryWords) {
      if (nextWords.length >= maxSuggestions) break;
      if (!nextWords.includes(word.toLowerCase())) {
        nextWords.push(word);
      }
    }
    
    return nextWords.slice(0, maxSuggestions);
  }, [getAdvancedSuggestions]);

  const getTemporalInsights = useCallback(() => {
    if (!temporalContext) return null;
    
    const { hourOfDay, dayOfWeek, commonAtThisTime } = temporalContext;
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const timeOfDay = hourOfDay < 12 ? 'morning' : hourOfDay < 17 ? 'afternoon' : 'evening';
    
    return {
      currentTime: `${timeOfDay} on ${dayNames[dayOfWeek]}`,
      commonSentences: commonAtThisTime,
      hourOfDay,
      dayOfWeek
    };
  }, [temporalContext]);

  const resetLearning = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Clear all user data
      await Promise.all([
        supabase.from('sentences').delete().eq('user_id', user.id),
        supabase.from('sentence_patterns').delete().eq('user_id', user.id),
        supabase.from('temporal_patterns').delete().eq('user_id', user.id)
      ]);

      setLastPredictions([]);
      setTemporalContext(null);
      setDailySentenceCount(0);
      
      console.log('Learning data reset successfully');
    } catch (error) {
      console.error('Error resetting learning data:', error);
    }
  }, []);

  return {
    recordSentence,
    getAdvancedSuggestions,
    suggestNextWords,
    getTemporalInsights,
    resetLearning,
    isLoading,
    lastPredictions,
    temporalContext,
    dailySentenceCount,
  };
}
