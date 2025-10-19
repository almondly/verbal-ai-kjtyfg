
/**
 * Enhanced Learning Engine
 * Implements adaptive learning, intent recognition, and personalized predictions
 */

import { supabase } from '../app/integrations/supabase/client';

export interface SuggestionInteraction {
  suggestionText: string;
  suggestionType: string;
  contextWords: string[];
  wasSelected: boolean;
  confidenceScore: number;
  category?: string;
}

export interface IntentPattern {
  intentType: 'desire' | 'emotion' | 'question' | 'statement' | 'request' | 'greeting' | 'thanks';
  triggerWords: string[];
  commonCompletions: string[];
  confidence: number;
}

export interface IntentionSequence {
  firstIntention: string;
  secondIntention: string;
  frequency: number;
  timeGapSeconds: number;
}

/**
 * Track suggestion interaction (selected or ignored)
 * This is the core of adaptive learning
 */
export async function trackSuggestionInteraction(
  interaction: SuggestionInteraction
): Promise<void> {
  try {
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.getDay();
    
    const { error } = await supabase
      .from('suggestion_interactions')
      .insert({
        suggestion_text: interaction.suggestionText.toLowerCase(),
        suggestion_type: interaction.suggestionType,
        context_words: interaction.contextWords.map(w => w.toLowerCase()),
        was_selected: interaction.wasSelected,
        confidence_score: interaction.confidenceScore,
        category: interaction.category,
        hour_of_day: hour,
        day_of_week: dayOfWeek
      });
    
    if (error) {
      console.log('Error tracking suggestion interaction:', error);
    } else {
      console.log('✅ Tracked suggestion interaction:', {
        text: interaction.suggestionText,
        selected: interaction.wasSelected
      });
    }
    
    // Update user prediction model based on interaction
    await updatePredictionModel(interaction);
  } catch (err) {
    console.log('Error in trackSuggestionInteraction:', err);
  }
}

/**
 * Update user-specific prediction model based on interactions
 */
async function updatePredictionModel(interaction: SuggestionInteraction): Promise<void> {
  try {
    // Get existing model
    const { data: existingModel } = await supabase
      .from('user_prediction_models')
      .select('*')
      .eq('model_type', 'adaptive_suggestions')
      .single();
    
    let modelData = existingModel?.model_data || {
      selectedWords: {},
      ignoredWords: {},
      contextPatterns: {},
      accuracyHistory: []
    };
    
    // Update model based on interaction
    if (interaction.wasSelected) {
      const key = interaction.suggestionText.toLowerCase();
      modelData.selectedWords[key] = (modelData.selectedWords[key] || 0) + 1;
      
      // Track context patterns for selected suggestions
      const contextKey = interaction.contextWords.join(' ').toLowerCase();
      if (!modelData.contextPatterns[contextKey]) {
        modelData.contextPatterns[contextKey] = {};
      }
      modelData.contextPatterns[contextKey][key] = 
        (modelData.contextPatterns[contextKey][key] || 0) + 1;
    } else {
      const key = interaction.suggestionText.toLowerCase();
      modelData.ignoredWords[key] = (modelData.ignoredWords[key] || 0) + 1;
    }
    
    // Calculate accuracy score
    const totalSelected = Object.values(modelData.selectedWords).reduce((sum: number, count) => sum + (count as number), 0);
    const totalIgnored = Object.values(modelData.ignoredWords).reduce((sum: number, count) => sum + (count as number), 0);
    const accuracyScore = totalSelected / (totalSelected + totalIgnored + 1);
    
    // Store accuracy in history
    modelData.accuracyHistory.push({
      timestamp: new Date().toISOString(),
      accuracy: accuracyScore
    });
    
    // Keep only last 100 accuracy measurements
    if (modelData.accuracyHistory.length > 100) {
      modelData.accuracyHistory = modelData.accuracyHistory.slice(-100);
    }
    
    // Upsert model
    const { error } = await supabase
      .from('user_prediction_models')
      .upsert({
        model_type: 'adaptive_suggestions',
        model_data: modelData,
        accuracy_score: accuracyScore,
        last_trained_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,model_type'
      });
    
    if (error) {
      console.log('Error updating prediction model:', error);
    } else {
      console.log('✅ Updated prediction model, accuracy:', accuracyScore.toFixed(2));
    }
  } catch (err) {
    console.log('Error in updatePredictionModel:', err);
  }
}

/**
 * Get personalized suggestions based on user's prediction model
 */
export async function getPersonalizedSuggestions(
  contextWords: string[],
  availableWords: string[],
  maxSuggestions: number = 5
): Promise<{ word: string; confidence: number }[]> {
  try {
    // Get user's prediction model
    const { data: model } = await supabase
      .from('user_prediction_models')
      .select('*')
      .eq('model_type', 'adaptive_suggestions')
      .single();
    
    if (!model || !model.model_data) {
      return [];
    }
    
    const modelData = model.model_data;
    const contextKey = contextWords.join(' ').toLowerCase();
    const suggestions: { word: string; confidence: number }[] = [];
    
    // Get context-specific patterns
    const contextPatterns = modelData.contextPatterns[contextKey] || {};
    
    // Score available words based on model
    availableWords.forEach(word => {
      const lowerWord = word.toLowerCase();
      let confidence = 0;
      
      // Boost based on selection history
      const selectedCount = modelData.selectedWords[lowerWord] || 0;
      const ignoredCount = modelData.ignoredWords[lowerWord] || 0;
      
      if (selectedCount > 0) {
        confidence += selectedCount / (selectedCount + ignoredCount + 1);
      }
      
      // Boost based on context patterns
      if (contextPatterns[lowerWord]) {
        confidence += contextPatterns[lowerWord] * 0.3;
      }
      
      // Penalize frequently ignored words
      if (ignoredCount > selectedCount * 2) {
        confidence *= 0.3;
      }
      
      if (confidence > 0) {
        suggestions.push({ word, confidence });
      }
    });
    
    return suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, maxSuggestions);
  } catch (err) {
    console.log('Error getting personalized suggestions:', err);
    return [];
  }
}

/**
 * Detect intent from sentence context
 */
export function detectIntent(words: string[]): IntentPattern['intentType'] {
  const sentence = words.join(' ').toLowerCase();
  
  // Desire/Want patterns
  if (sentence.includes('i want') || sentence.includes('i need') || 
      sentence.includes('i would like') || sentence.includes('can i have')) {
    return 'desire';
  }
  
  // Emotion patterns
  if (sentence.includes('i feel') || sentence.includes('i am') ||
      sentence.includes('i\'m happy') || sentence.includes('i\'m sad') ||
      sentence.includes('i love') || sentence.includes('i hate')) {
    return 'emotion';
  }
  
  // Question patterns
  if (words[0]?.toLowerCase() === 'what' || words[0]?.toLowerCase() === 'where' ||
      words[0]?.toLowerCase() === 'when' || words[0]?.toLowerCase() === 'who' ||
      words[0]?.toLowerCase() === 'why' || words[0]?.toLowerCase() === 'how' ||
      sentence.includes('can you') || sentence.includes('could you') ||
      sentence.includes('would you')) {
    return 'question';
  }
  
  // Request patterns
  if (sentence.includes('please') || sentence.includes('help me') ||
      sentence.includes('can you help') || sentence.includes('i need help')) {
    return 'request';
  }
  
  // Greeting patterns
  if (sentence.includes('hello') || sentence.includes('hi') ||
      sentence.includes('good morning') || sentence.includes('good afternoon') ||
      sentence.includes('g\'day')) {
    return 'greeting';
  }
  
  // Thanks patterns
  if (sentence.includes('thank') || sentence.includes('thanks') ||
      sentence.includes('cheers') || sentence.includes('ta')) {
    return 'thanks';
  }
  
  return 'statement';
}

/**
 * Track intent pattern for learning
 */
export async function trackIntentPattern(
  words: string[],
  completion: string
): Promise<void> {
  try {
    const intentType = detectIntent(words);
    const triggerWords = words.map(w => w.toLowerCase());
    
    // Get existing pattern
    const { data: existing } = await supabase
      .from('intent_patterns')
      .select('*')
      .eq('intent_type', intentType)
      .contains('trigger_words', triggerWords)
      .single();
    
    if (existing) {
      // Update existing pattern
      const commonCompletions = existing.common_completions || [];
      if (!commonCompletions.includes(completion.toLowerCase())) {
        commonCompletions.push(completion.toLowerCase());
      }
      
      const { error } = await supabase
        .from('intent_patterns')
        .update({
          common_completions: commonCompletions,
          frequency: existing.frequency + 1,
          confidence: Math.min(1.0, existing.confidence + 0.05),
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);
      
      if (error) {
        console.log('Error updating intent pattern:', error);
      }
    } else {
      // Create new pattern
      const { error } = await supabase
        .from('intent_patterns')
        .insert({
          intent_type: intentType,
          trigger_words: triggerWords,
          common_completions: [completion.toLowerCase()],
          frequency: 1,
          confidence: 0.5
        });
      
      if (error) {
        console.log('Error creating intent pattern:', error);
      }
    }
    
    console.log('✅ Tracked intent pattern:', { intentType, completion });
  } catch (err) {
    console.log('Error in trackIntentPattern:', err);
  }
}

/**
 * Get intent-based suggestions
 */
export async function getIntentBasedSuggestions(
  words: string[],
  maxSuggestions: number = 5
): Promise<string[]> {
  try {
    const intentType = detectIntent(words);
    
    const { data } = await supabase
      .from('intent_patterns')
      .select('*')
      .eq('intent_type', intentType)
      .order('confidence', { ascending: false })
      .order('frequency', { ascending: false })
      .limit(10);
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Collect all common completions
    const completions = new Set<string>();
    data.forEach(pattern => {
      pattern.common_completions?.forEach((comp: string) => completions.add(comp));
    });
    
    return Array.from(completions).slice(0, maxSuggestions);
  } catch (err) {
    console.log('Error getting intent-based suggestions:', err);
    return [];
  }
}

/**
 * Track intention sequence (what follows what)
 */
export async function trackIntentionSequence(
  firstSentence: string,
  secondSentence: string,
  timeGapSeconds: number
): Promise<void> {
  try {
    const firstIntent = detectIntent(firstSentence.split(' '));
    const secondIntent = detectIntent(secondSentence.split(' '));
    
    const { data: existing } = await supabase
      .from('intention_sequences')
      .select('*')
      .eq('first_intention', firstIntent)
      .eq('second_intention', secondIntent)
      .single();
    
    if (existing) {
      // Update existing sequence
      const newFrequency = existing.frequency + 1;
      const avgTimeGap = ((existing.time_gap_seconds * existing.frequency) + timeGapSeconds) / newFrequency;
      
      const { error } = await supabase
        .from('intention_sequences')
        .update({
          frequency: newFrequency,
          time_gap_seconds: Math.round(avgTimeGap),
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);
      
      if (error) {
        console.log('Error updating intention sequence:', error);
      }
    } else {
      // Create new sequence
      const { error } = await supabase
        .from('intention_sequences')
        .insert({
          first_intention: firstIntent,
          second_intention: secondIntent,
          frequency: 1,
          time_gap_seconds: timeGapSeconds
        });
      
      if (error) {
        console.log('Error creating intention sequence:', error);
      }
    }
    
    console.log('✅ Tracked intention sequence:', { firstIntent, secondIntent });
  } catch (err) {
    console.log('Error in trackIntentionSequence:', err);
  }
}

/**
 * Predict next intention based on current sentence
 */
export async function predictNextIntention(
  currentSentence: string
): Promise<{ intention: string; confidence: number; suggestedSentences: string[] }[]> {
  try {
    const currentIntent = detectIntent(currentSentence.split(' '));
    
    const { data } = await supabase
      .from('intention_sequences')
      .select('*')
      .eq('first_intention', currentIntent)
      .order('frequency', { ascending: false })
      .limit(5);
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Get suggested sentences for each predicted intention
    const predictions = await Promise.all(
      data.map(async (seq) => {
        const { data: patterns } = await supabase
          .from('intent_patterns')
          .select('*')
          .eq('intent_type', seq.second_intention)
          .order('frequency', { ascending: false })
          .limit(3);
        
        const suggestedSentences = patterns?.flatMap(p => 
          p.common_completions?.slice(0, 2) || []
        ) || [];
        
        return {
          intention: seq.second_intention,
          confidence: Math.min(1.0, seq.frequency / 10),
          suggestedSentences
        };
      })
    );
    
    return predictions;
  } catch (err) {
    console.log('Error predicting next intention:', err);
    return [];
  }
}

/**
 * Track contextual embedding (semantic understanding)
 */
export async function trackContextualEmbedding(
  phrase: string,
  semanticCategory: string,
  relatedPhrases: string[]
): Promise<void> {
  try {
    const { data: existing } = await supabase
      .from('contextual_embeddings')
      .select('*')
      .eq('phrase', phrase.toLowerCase())
      .eq('semantic_category', semanticCategory)
      .single();
    
    if (existing) {
      // Update existing embedding
      const updatedRelated = Array.from(new Set([
        ...existing.related_phrases,
        ...relatedPhrases.map(p => p.toLowerCase())
      ]));
      
      const { error } = await supabase
        .from('contextual_embeddings')
        .update({
          related_phrases: updatedRelated,
          usage_count: existing.usage_count + 1,
          last_used_at: new Date().toISOString()
        })
        .eq('id', existing.id);
      
      if (error) {
        console.log('Error updating contextual embedding:', error);
      }
    } else {
      // Create new embedding
      const { error } = await supabase
        .from('contextual_embeddings')
        .insert({
          phrase: phrase.toLowerCase(),
          semantic_category: semanticCategory,
          related_phrases: relatedPhrases.map(p => p.toLowerCase()),
          usage_count: 1,
          last_used_at: new Date().toISOString()
        });
      
      if (error) {
        console.log('Error creating contextual embedding:', error);
      }
    }
    
    console.log('✅ Tracked contextual embedding:', { phrase, semanticCategory });
  } catch (err) {
    console.log('Error in trackContextualEmbedding:', err);
  }
}

/**
 * Get semantically similar phrases
 */
export async function getSemanticallyRelatedPhrases(
  phrase: string,
  maxResults: number = 5
): Promise<string[]> {
  try {
    // Find embeddings that contain this phrase or are related to it
    const { data } = await supabase
      .from('contextual_embeddings')
      .select('*')
      .or(`phrase.ilike.%${phrase.toLowerCase()}%,related_phrases.cs.{${phrase.toLowerCase()}}`)
      .order('usage_count', { ascending: false })
      .limit(maxResults);
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Collect all related phrases
    const relatedSet = new Set<string>();
    data.forEach(embedding => {
      embedding.related_phrases?.forEach((p: string) => relatedSet.add(p));
    });
    
    return Array.from(relatedSet).slice(0, maxResults);
  } catch (err) {
    console.log('Error getting semantically related phrases:', err);
    return [];
  }
}

/**
 * Get learning statistics for user
 */
export async function getLearningStatistics(): Promise<{
  totalInteractions: number;
  selectionRate: number;
  topSelectedWords: string[];
  topIgnoredWords: string[];
  modelAccuracy: number;
  intentDistribution: { [key: string]: number };
}> {
  try {
    // Get interaction stats
    const { data: interactions } = await supabase
      .from('suggestion_interactions')
      .select('suggestion_text, was_selected');
    
    const totalInteractions = interactions?.length || 0;
    const selectedCount = interactions?.filter(i => i.was_selected).length || 0;
    const selectionRate = totalInteractions > 0 ? selectedCount / totalInteractions : 0;
    
    // Get top selected/ignored words
    const selectedWords = new Map<string, number>();
    const ignoredWords = new Map<string, number>();
    
    interactions?.forEach(i => {
      if (i.was_selected) {
        selectedWords.set(i.suggestion_text, (selectedWords.get(i.suggestion_text) || 0) + 1);
      } else {
        ignoredWords.set(i.suggestion_text, (ignoredWords.get(i.suggestion_text) || 0) + 1);
      }
    });
    
    const topSelectedWords = Array.from(selectedWords.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
    
    const topIgnoredWords = Array.from(ignoredWords.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word]) => word);
    
    // Get model accuracy
    const { data: model } = await supabase
      .from('user_prediction_models')
      .select('accuracy_score')
      .eq('model_type', 'adaptive_suggestions')
      .single();
    
    const modelAccuracy = model?.accuracy_score || 0;
    
    // Get intent distribution
    const { data: intents } = await supabase
      .from('intent_patterns')
      .select('intent_type, frequency');
    
    const intentDistribution: { [key: string]: number } = {};
    intents?.forEach(intent => {
      intentDistribution[intent.intent_type] = 
        (intentDistribution[intent.intent_type] || 0) + intent.frequency;
    });
    
    return {
      totalInteractions,
      selectionRate,
      topSelectedWords,
      topIgnoredWords,
      modelAccuracy,
      intentDistribution
    };
  } catch (err) {
    console.log('Error getting learning statistics:', err);
    return {
      totalInteractions: 0,
      selectionRate: 0,
      topSelectedWords: [],
      topIgnoredWords: [],
      modelAccuracy: 0,
      intentDistribution: {}
    };
  }
}
