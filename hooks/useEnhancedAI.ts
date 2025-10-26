
/**
 * Enhanced AI Hook
 * Integrates adaptive learning, intent recognition, and personalised predictions
 */

import { useCallback, useEffect, useState, useRef } from 'react';
import { supabase } from '../app/integrations/supabase/client';
import { useAdvancedAI, AdvancedSuggestion } from './useAdvancedAI';
import {
  trackSuggestionInteraction,
  getPersonalizedSuggestions,
  detectIntent,
  trackIntentPattern,
  getIntentBasedSuggestions,
  trackIntentionSequence,
  predictNextIntention,
  trackContextualEmbedding,
  getSemanticallyRelatedPhrases,
  getLearningStatistics
} from '../utils/enhancedLearningEngine';

export interface EnhancedSuggestion extends AdvancedSuggestion {
  isPersonalized?: boolean;
  intentBased?: boolean;
  semanticScore?: number;
}

export function useEnhancedAI() {
  const baseAI = useAdvancedAI();
  const [lastSentence, setLastSentence] = useState<string>('');
  const [lastSentenceTime, setLastSentenceTime] = useState<number>(Date.now());
  const [nextIntentionPredictions, setNextIntentionPredictions] = useState<string[]>([]);
  const [learningStats, setLearningStats] = useState<any>(null);
  
  // Track the last selected suggestion for flow refinement
  const lastSelectedSuggestion = useRef<{ text: string; isFullSentence: boolean } | null>(null);

  /**
   * Enhanced suggestion generation with all new features
   */
  const getEnhancedSuggestions = useCallback(async (
    currentWords: string[],
    availableWords: string[] = [],
    maxSuggestions: number = 10,
    currentCategory?: string,
    categoryTiles?: { text: string; category: string }[]
  ): Promise<EnhancedSuggestion[]> => {
    try {
      console.log('🧠 Getting ENHANCED AI suggestions with adaptive learning...');
      
      // Get base suggestions from existing AI
      const baseSuggestions = await baseAI.getAdvancedSuggestions(
        currentWords,
        availableWords,
        maxSuggestions,
        currentCategory,
        categoryTiles
      );
      
      // Get personalized suggestions based on user's learning model
      const personalizedSugs = await getPersonalizedSuggestions(
        currentWords,
        availableWords,
        5
      );
      
      // Get intent-based suggestions
      const intentSugs = await getIntentBasedSuggestions(currentWords, 5);
      
      // Get semantically related phrases
      const semanticSugs = currentWords.length > 0 
        ? await getSemanticallyRelatedPhrases(currentWords.join(' '), 3)
        : [];
      
      // Merge all suggestions with enhanced scoring
      const allSuggestions: EnhancedSuggestion[] = [];
      
      // Add base suggestions
      baseSuggestions.forEach(sug => {
        allSuggestions.push({
          ...sug,
          isPersonalized: false,
          intentBased: false,
          semanticScore: 0
        });
      });
      
      // Add personalized suggestions with boost
      personalizedSugs.forEach(({ word, confidence }) => {
        const existing = allSuggestions.find(s => 
          s.text.toLowerCase() === word.toLowerCase()
        );
        
        if (existing) {
          // Boost existing suggestion
          existing.confidence = Math.min(1.0, existing.confidence + confidence * 0.3);
          existing.isPersonalized = true;
        } else {
          allSuggestions.push({
            text: word,
            confidence: confidence * 0.8,
            type: 'contextual',
            context: 'Personalized for you',
            isPersonalized: true,
            intentBased: false,
            semanticScore: 0
          });
        }
      });
      
      // Add intent-based suggestions
      intentSugs.forEach(word => {
        const existing = allSuggestions.find(s => 
          s.text.toLowerCase() === word.toLowerCase()
        );
        
        if (existing) {
          existing.confidence = Math.min(1.0, existing.confidence + 0.2);
          existing.intentBased = true;
        } else {
          allSuggestions.push({
            text: word,
            confidence: 0.75,
            type: 'contextual',
            context: 'Based on your intent',
            isPersonalized: false,
            intentBased: true,
            semanticScore: 0
          });
        }
      });
      
      // Add semantic suggestions
      semanticSugs.forEach(phrase => {
        const words = phrase.split(' ');
        const nextWord = words[currentWords.length] || words[0];
        
        if (nextWord) {
          const existing = allSuggestions.find(s => 
            s.text.toLowerCase() === nextWord.toLowerCase()
          );
          
          if (existing) {
            existing.confidence = Math.min(1.0, existing.confidence + 0.15);
            existing.semanticScore = 0.8;
          } else {
            allSuggestions.push({
              text: nextWord,
              confidence: 0.7,
              type: 'contextual',
              context: 'Semantically related',
              isPersonalized: false,
              intentBased: false,
              semanticScore: 0.8
            });
          }
        }
      });
      
      // Remove duplicates and sort by confidence
      const uniqueSuggestions = allSuggestions.filter((sug, index, self) =>
        index === self.findIndex(s => s.text.toLowerCase() === sug.text.toLowerCase())
      );
      
      const sortedSuggestions = uniqueSuggestions
        .sort((a, b) => {
          // Prioritize personalized and intent-based suggestions
          const aBoost = (a.isPersonalized ? 0.1 : 0) + (a.intentBased ? 0.1 : 0) + (a.semanticScore || 0) * 0.05;
          const bBoost = (b.isPersonalized ? 0.1 : 0) + (b.intentBased ? 0.1 : 0) + (b.semanticScore || 0) * 0.05;
          
          return (b.confidence + bBoost) - (a.confidence + aBoost);
        })
        .slice(0, maxSuggestions);
      
      console.log('✨ Enhanced suggestions generated:', {
        total: sortedSuggestions.length,
        personalized: sortedSuggestions.filter(s => s.isPersonalized).length,
        intentBased: sortedSuggestions.filter(s => s.intentBased).length,
        semantic: sortedSuggestions.filter(s => (s.semanticScore || 0) > 0).length
      });
      
      return sortedSuggestions;
    } catch (err) {
      console.log('Error getting enhanced suggestions:', err);
      return [];
    }
  }, [baseAI]);

  /**
   * Track when user selects a suggestion
   */
  const onSuggestionSelected = useCallback(async (
    suggestion: EnhancedSuggestion,
    contextWords: string[],
    category?: string
  ) => {
    console.log('✅ User selected suggestion:', suggestion.text);
    
    // Track the interaction
    await trackSuggestionInteraction({
      suggestionText: suggestion.text,
      suggestionType: suggestion.type,
      contextWords,
      wasSelected: true,
      confidenceScore: suggestion.confidence,
      category
    });
    
    // Track intent pattern
    await trackIntentPattern(contextWords, suggestion.text);
    
    // Track contextual embedding
    const semanticCategory = detectIntent(contextWords);
    await trackContextualEmbedding(
      contextWords.join(' '),
      semanticCategory,
      [suggestion.text]
    );
    
    // Store for flow refinement
    lastSelectedSuggestion.current = {
      text: suggestion.text,
      isFullSentence: suggestion.type === 'full_sentence'
    };
  }, []);

  /**
   * Track when user ignores suggestions (types something else)
   */
  const onSuggestionsIgnored = useCallback(async (
    ignoredSuggestions: EnhancedSuggestion[],
    contextWords: string[],
    category?: string
  ) => {
    console.log('❌ User ignored suggestions:', ignoredSuggestions.length);
    
    // Track each ignored suggestion
    for (const suggestion of ignoredSuggestions) {
      await trackSuggestionInteraction({
        suggestionText: suggestion.text,
        suggestionType: suggestion.type,
        contextWords,
        wasSelected: false,
        confidenceScore: suggestion.confidence,
        category
      });
    }
  }, []);

  /**
   * Handle sentence completion (for intention sequence tracking)
   */
  const onSentenceCompleted = useCallback(async (sentence: string) => {
    console.log('📝 Sentence completed:', sentence);
    
    // Track intention sequence if there was a previous sentence
    if (lastSentence) {
      const timeGap = Math.floor((Date.now() - lastSentenceTime) / 1000);
      await trackIntentionSequence(lastSentence, sentence, timeGap);
    }
    
    // Predict next intention
    const predictions = await predictNextIntention(sentence);
    if (predictions.length > 0) {
      const suggestedSentences = predictions.flatMap(p => p.suggestedSentences);
      setNextIntentionPredictions(suggestedSentences.slice(0, 5));
      console.log('🔮 Predicted next intentions:', suggestedSentences);
    }
    
    // Update last sentence
    setLastSentence(sentence);
    setLastSentenceTime(Date.now());
    
    // Record in base AI
    await baseAI.recordUserInput(sentence);
  }, [lastSentence, lastSentenceTime, baseAI]);

  /**
   * Get the last selected suggestion for flow refinement
   */
  const getLastSelectedSuggestion = useCallback(() => {
    return lastSelectedSuggestion.current;
  }, []);

  /**
   * Clear the last selected suggestion
   */
  const clearLastSelectedSuggestion = useCallback(() => {
    lastSelectedSuggestion.current = null;
  }, []);

  /**
   * Load learning statistics
   */
  const loadLearningStats = useCallback(async () => {
    const stats = await getLearningStatistics();
    setLearningStats(stats);
    return stats;
  }, []);

  // Load stats on mount
  useEffect(() => {
    loadLearningStats();
  }, [loadLearningStats]);

  return {
    // Enhanced methods
    getEnhancedSuggestions,
    onSuggestionSelected,
    onSuggestionsIgnored,
    onSentenceCompleted,
    getLastSelectedSuggestion,
    clearLastSelectedSuggestion,
    loadLearningStats,
    
    // State
    nextIntentionPredictions,
    learningStats,
    
    // Base AI methods (pass through)
    recordUserInput: baseAI.recordUserInput,
    getTimeBasedSuggestions: baseAI.getTimeBasedSuggestions,
    userPatterns: baseAI.userPatterns,
    isLoading: baseAI.isLoading,
    error: baseAI.error
  };
}
