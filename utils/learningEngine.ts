
/**
 * Learning Engine
 * Tracks user behavior and adapts suggestions over time
 */

import { supabase } from '../app/integrations/supabase/client';

export interface UsagePattern {
  word: string;
  frequency: number;
  lastUsed: number;
  contexts: string[];
  timeOfDay: number[];
  dayOfWeek: number[];
}

export interface WordPair {
  from: string;
  to: string;
  frequency: number;
  confidence: number;
}

/**
 * Track word usage with enhanced metadata
 */
export async function trackWordUsage(
  word: string,
  context: string,
  sentenceWords: string[]
): Promise<void> {
  try {
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.getDay();
    
    // Update word frequency
    const { error: wordError } = await supabase
      .from('user_patterns')
      .upsert({
        pattern_type: 'word',
        pattern_key: word.toLowerCase(),
        frequency: 1,
        metadata: {
          context,
          hour,
          dayOfWeek,
          lastUsed: now.toISOString(),
          sentenceLength: sentenceWords.length
        },
        updated_at: now.toISOString()
      }, {
        onConflict: 'pattern_type,pattern_key'
      });
    
    if (wordError) {
      console.log('Error tracking word usage:', wordError);
    }
    
    // Track word position patterns
    const position = sentenceWords.findIndex(w => w.toLowerCase() === word.toLowerCase());
    if (position >= 0) {
      const { error: posError } = await supabase
        .from('user_patterns')
        .upsert({
          pattern_type: 'word_position',
          pattern_key: `${word.toLowerCase()}_pos_${position}`,
          frequency: 1,
          metadata: {
            word: word.toLowerCase(),
            position,
            sentenceLength: sentenceWords.length,
            hour,
            dayOfWeek
          },
          updated_at: now.toISOString()
        }, {
          onConflict: 'pattern_type,pattern_key'
        });
      
      if (posError) {
        console.log('Error tracking word position:', posError);
      }
    }
  } catch (err) {
    console.log('Error in trackWordUsage:', err);
  }
}

/**
 * Track word pair transitions with context
 */
export async function trackWordPair(
  fromWord: string,
  toWord: string,
  context: string
): Promise<void> {
  try {
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.getDay();
    
    const { error } = await supabase
      .from('user_patterns')
      .upsert({
        pattern_type: 'transition',
        pattern_key: `${fromWord.toLowerCase()}->${toWord.toLowerCase()}`,
        frequency: 1,
        metadata: {
          from: fromWord.toLowerCase(),
          to: toWord.toLowerCase(),
          context,
          hour,
          dayOfWeek,
          lastUsed: now.toISOString()
        },
        updated_at: now.toISOString()
      }, {
        onConflict: 'pattern_type,pattern_key'
      });
    
    if (error) {
      console.log('Error tracking word pair:', error);
    }
  } catch (err) {
    console.log('Error in trackWordPair:', err);
  }
}

/**
 * Track complete phrase usage
 */
export async function trackPhraseUsage(
  phrase: string,
  wordCount: number,
  context?: string
): Promise<void> {
  try {
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.getDay();
    
    const { error } = await supabase
      .from('user_patterns')
      .upsert({
        pattern_type: 'phrase',
        pattern_key: phrase.toLowerCase(),
        frequency: 1,
        metadata: {
          wordCount,
          context,
          hour,
          dayOfWeek,
          lastUsed: now.toISOString()
        },
        updated_at: now.toISOString()
      }, {
        onConflict: 'pattern_type,pattern_key'
      });
    
    if (error) {
      console.log('Error tracking phrase:', error);
    }
  } catch (err) {
    console.log('Error in trackPhraseUsage:', err);
  }
}

/**
 * Track user corrections (when user changes a suggested word)
 */
export async function trackCorrection(
  suggestedWord: string,
  actualWord: string,
  context: string
): Promise<void> {
  try {
    const now = new Date();
    
    const { error } = await supabase
      .from('user_patterns')
      .upsert({
        pattern_type: 'correction',
        pattern_key: `${suggestedWord.toLowerCase()}->${actualWord.toLowerCase()}`,
        frequency: 1,
        metadata: {
          suggested: suggestedWord.toLowerCase(),
          actual: actualWord.toLowerCase(),
          context,
          timestamp: now.toISOString()
        },
        updated_at: now.toISOString()
      }, {
        onConflict: 'pattern_type,pattern_key'
      });
    
    if (error) {
      console.log('Error tracking correction:', error);
    }
    
    // Reduce confidence in the suggested word for this context
    const { error: confidenceError } = await supabase
      .from('user_patterns')
      .update({
        metadata: {
          confidence: 0.5, // Reduce confidence
          lastCorrected: now.toISOString()
        }
      })
      .eq('pattern_type', 'word')
      .eq('pattern_key', suggestedWord.toLowerCase());
    
    if (confidenceError) {
      console.log('Error updating confidence:', confidenceError);
    }
  } catch (err) {
    console.log('Error in trackCorrection:', err);
  }
}

/**
 * Get word usage statistics
 */
export async function getWordStatistics(word: string): Promise<UsagePattern | null> {
  try {
    const { data, error } = await supabase
      .from('user_patterns')
      .select('*')
      .eq('pattern_type', 'word')
      .eq('pattern_key', word.toLowerCase())
      .single();
    
    if (error || !data) {
      return null;
    }
    
    return {
      word: data.pattern_key,
      frequency: data.frequency,
      lastUsed: new Date(data.metadata?.lastUsed || data.updated_at).getTime(),
      contexts: data.metadata?.contexts || [],
      timeOfDay: data.metadata?.timeOfDay || [],
      dayOfWeek: data.metadata?.dayOfWeek || []
    };
  } catch (err) {
    console.log('Error getting word statistics:', err);
    return null;
  }
}

/**
 * Get most frequently used words
 */
export async function getFrequentWords(limit: number = 50): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('user_patterns')
      .select('pattern_key, frequency')
      .eq('pattern_type', 'word')
      .order('frequency', { ascending: false })
      .limit(limit);
    
    if (error || !data) {
      return [];
    }
    
    return data.map(d => d.pattern_key);
  } catch (err) {
    console.log('Error getting frequent words:', err);
    return [];
  }
}

/**
 * Get word pairs (transitions) with high confidence
 */
export async function getConfidentWordPairs(minFrequency: number = 3): Promise<WordPair[]> {
  try {
    const { data, error } = await supabase
      .from('user_patterns')
      .select('pattern_key, frequency, metadata')
      .eq('pattern_type', 'transition')
      .gte('frequency', minFrequency)
      .order('frequency', { ascending: false });
    
    if (error || !data) {
      return [];
    }
    
    return data.map(d => {
      const [from, to] = d.pattern_key.split('->');
      return {
        from,
        to,
        frequency: d.frequency,
        confidence: Math.min(1.0, d.frequency / 10)
      };
    });
  } catch (err) {
    console.log('Error getting word pairs:', err);
    return [];
  }
}

/**
 * Analyze user's vocabulary level and preferences
 */
export async function analyzeVocabulary(): Promise<{
  totalWords: number;
  averageWordLength: number;
  mostCommonWords: string[];
  preferredSentenceLength: number;
  vocabularyDiversity: number;
}> {
  try {
    const { data: words, error: wordsError } = await supabase
      .from('user_patterns')
      .select('pattern_key, frequency')
      .eq('pattern_type', 'word');
    
    const { data: phrases, error: phrasesError } = await supabase
      .from('user_patterns')
      .select('pattern_key, frequency, metadata')
      .eq('pattern_type', 'phrase');
    
    if (wordsError || phrasesError || !words || !phrases) {
      return {
        totalWords: 0,
        averageWordLength: 0,
        mostCommonWords: [],
        preferredSentenceLength: 0,
        vocabularyDiversity: 0
      };
    }
    
    const totalWords = words.length;
    const averageWordLength = words.reduce((sum, w) => sum + w.pattern_key.length, 0) / totalWords;
    const mostCommonWords = words
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10)
      .map(w => w.pattern_key);
    
    const totalPhraseWords = phrases.reduce((sum, p) => sum + (p.metadata?.wordCount || 0), 0);
    const preferredSentenceLength = totalPhraseWords / phrases.length;
    
    // Calculate vocabulary diversity (unique words / total word usage)
    const totalUsage = words.reduce((sum, w) => sum + w.frequency, 0);
    const vocabularyDiversity = totalWords / totalUsage;
    
    return {
      totalWords,
      averageWordLength,
      mostCommonWords,
      preferredSentenceLength,
      vocabularyDiversity
    };
  } catch (err) {
    console.log('Error analyzing vocabulary:', err);
    return {
      totalWords: 0,
      averageWordLength: 0,
      mostCommonWords: [],
      preferredSentenceLength: 0,
      vocabularyDiversity: 0
    };
  }
}

/**
 * Clean up old patterns (keep only recent and frequent ones)
 */
export async function cleanupOldPatterns(daysToKeep: number = 90): Promise<void> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    
    // Delete old, infrequent patterns
    const { error } = await supabase
      .from('user_patterns')
      .delete()
      .lt('updated_at', cutoffDate.toISOString())
      .lt('frequency', 2);
    
    if (error) {
      console.log('Error cleaning up patterns:', error);
    } else {
      console.log('Cleaned up old patterns');
    }
  } catch (err) {
    console.log('Error in cleanupOldPatterns:', err);
  }
}
