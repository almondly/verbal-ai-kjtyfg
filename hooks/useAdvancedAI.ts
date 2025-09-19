
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../app/integrations/supabase/client';
import { useAIPreferences } from './useAIPreferences';

export interface AdvancedSuggestion {
  text: string;
  confidence: number;
  type: 'completion' | 'next_word' | 'common_phrase' | 'contextual' | 'temporal' | 'synonym' | 'preference';
  context?: string;
}

export function useAdvancedAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getContextualSuggestions, getPreference } = useAIPreferences();

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

  // Massively enhanced synonym database for maximum AI capabilities with Australian English
  const synonymDatabase: { [key: string]: string[] } = {
    // Basic needs and wants - Australian English
    'want': ['need', 'like', 'wish', 'desire', 'crave', 'require', 'seek', 'fancy', 'reckon I need'],
    'need': ['want', 'require', 'must have', 'demand', 'lack', 'desire', 'call for', 'gotta have'],
    'like': ['love', 'enjoy', 'want', 'prefer', 'adore', 'fancy', 'appreciate', 'favour', 'reckon'],
    'love': ['like', 'adore', 'enjoy', 'cherish', 'treasure', 'worship', 'value', 'absolutely love'],
    
    // Emotions - comprehensive set with Australian expressions
    'happy': ['glad', 'excited', 'joyful', 'cheerful', 'pleased', 'delighted', 'thrilled', 'elated', 'chuffed', 'stoked'],
    'sad': ['upset', 'unhappy', 'down', 'blue', 'disappointed', 'gloomy', 'dejected', 'melancholy', 'gutted'],
    'angry': ['mad', 'furious', 'upset', 'irritated', 'annoyed', 'livid', 'enraged', 'cross', 'cranky', 'shirty'],
    'scared': ['afraid', 'frightened', 'terrified', 'worried', 'anxious', 'nervous', 'fearful', 'spooked'],
    'excited': ['thrilled', 'eager', 'enthusiastic', 'pumped', 'animated', 'energetic', 'stoked', 'chuffed'],
    'calm': ['peaceful', 'relaxed', 'serene', 'tranquil', 'quiet', 'still', 'composed', 'chilled'],
    'tired': ['sleepy', 'exhausted', 'weary', 'fatigued', 'drowsy', 'worn out', 'knackered', 'buggered'],
    
    // Descriptive words - Australian flavour
    'good': ['great', 'nice', 'awesome', 'excellent', 'wonderful', 'fantastic', 'amazing', 'superb', 'bonzer', 'ripper', 'beaut'],
    'bad': ['terrible', 'awful', 'not good', 'horrible', 'poor', 'dreadful', 'nasty', 'crook', 'dodgy'],
    'big': ['large', 'huge', 'giant', 'enormous', 'massive', 'gigantic', 'immense', 'vast', 'whopping'],
    'small': ['little', 'tiny', 'mini', 'petite', 'compact', 'minute', 'miniature', 'wee'],
    'hot': ['warm', 'heated', 'burning', 'scorching', 'boiling', 'blazing', 'sweltering', 'roasting'],
    'cold': ['cool', 'chilly', 'freezing', 'icy', 'frigid', 'frosty', 'arctic', 'brass monkeys'],
    'fast': ['quick', 'rapid', 'speedy', 'swift', 'hasty', 'brisk', 'lightning', 'like the clappers'],
    'slow': ['gradual', 'leisurely', 'unhurried', 'sluggish', 'dawdling', 'like a wet week'],
    
    // Actions - extensive coverage with Australian expressions
    'go': ['move', 'travel', 'walk', 'head', 'proceed', 'advance', 'journey', 'depart', 'rock up', 'head off'],
    'come': ['arrive', 'visit', 'approach', 'return', 'reach', 'get here', 'show up', 'rock up', 'pitch up'],
    'eat': ['consume', 'have', 'taste', 'devour', 'munch', 'bite', 'chew', 'swallow', 'scoff', 'tuck in'],
    'drink': ['sip', 'have', 'consume', 'gulp', 'swallow', 'taste', 'imbibe', 'skull', 'down'],
    'play': ['have fun', 'enjoy', 'game', 'sport', 'activity', 'entertain', 'amuse', 'muck about'],
    'work': ['job', 'task', 'labour', 'effort', 'occupation', 'employment', 'duty', 'graft', 'yakka'],
    'help': ['assist', 'aid', 'support', 'guide', 'serve', 'back up', 'lend a hand', 'give a hand'],
    'stop': ['halt', 'cease', 'end', 'quit', 'pause', 'finish', 'terminate', 'discontinue', 'pull up'],
    'start': ['begin', 'commence', 'initiate', 'launch', 'open', 'kick off', 'embark', 'get cracking'],
    
    // Communication - Australian style
    'say': ['tell', 'speak', 'talk', 'express', 'voice', 'utter', 'mention', 'reckon', 'yarn'],
    'hello': ['hi', 'hey', 'g\'day', 'howdy', 'good morning', 'good day', 'hiya'],
    'goodbye': ['bye', 'see ya', 'cheerio', 'catch ya later', 'hooroo', 'see you later'],
    'thanks': ['thank you', 'cheers', 'ta', 'much obliged', 'appreciate it'],
    
    // Agreement/disagreement - Australian expressions
    'yes': ['yeah', 'yep', 'sure', 'absolutely', 'definitely', 'certainly', 'of course', 'right', 'too right', 'fair dinkum'],
    'no': ['nah', 'nope', 'never', 'not really', 'negative', 'absolutely not', 'refuse', 'no way'],
    'maybe': ['perhaps', 'possibly', 'might be', 'could be', 'uncertain', 'dunno'],
    
    // Time expressions
    'now': ['currently', 'right now', 'at present', 'immediately', 'today', 'this arvo'],
    'later': ['afterwards', 'soon', 'eventually', 'in a while', 'tomorrow', 'this arvo'],
    'morning': ['this morning', 'early', 'dawn', 'sunrise', 'AM'],
    'afternoon': ['this arvo', 'this afternoon', 'PM', 'after lunch'],
    'evening': ['tonight', 'this evening', 'after tea', 'nighttime'],
    
    // Places - Australian context
    'home': ['house', 'place', 'dwelling', 'abode', 'joint'],
    'school': ['class', 'education', 'learning', 'academy', 'institution', 'kindy', 'uni'],
    'shop': ['store', 'market', 'supermarket', 'deli', 'bottle-o'],
    'park': ['playground', 'reserve', 'gardens', 'oval'],
    
    // Food and drink - Australian favourites
    'water': ['drink', 'liquid', 'beverage', 'fluid', 'H2O'],
    'food': ['tucker', 'meal', 'snack', 'nutrition', 'sustenance', 'nourishment', 'grub'],
    'hungry': ['starving', 'famished', 'peckish', 'craving food', 'could eat a horse'],
    'thirsty': ['parched', 'dehydrated', 'needing drink', 'dry as a bone'],
    
    // Family and people - Australian terms
    'mum': ['mummy', 'mother', 'mama', 'parent', 'old lady'],
    'dad': ['daddy', 'father', 'papa', 'parent', 'old man'],
    'mate': ['friend', 'buddy', 'pal', 'companion', 'cobber'],
    
    // Weather - Australian context
    'hot': ['warm', 'scorching', 'boiling', 'sweltering', 'stinking hot'],
    'cold': ['chilly', 'freezing', 'brass monkeys', 'bloody cold'],
    'rain': ['shower', 'drizzle', 'downpour', 'bucketing down'],
    'sunny': ['bright', 'clear', 'beautiful day', 'lovely weather'],
  };

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

      // Record word transitions with enhanced context
      for (let i = 0; i < words.length - 1; i++) {
        const transition = `${words[i]}->${words[i + 1]}`;
        const { error: transitionError } = await supabase
          .from('user_patterns')
          .upsert({
            pattern_type: 'transition',
            pattern_key: transition,
            frequency: 1,
            metadata: { context, hour: currentHour, position: i },
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'pattern_type,pattern_key'
          });

        if (transitionError) {
          console.log('Error recording transition:', transitionError);
        }
      }

      // Record temporal patterns with enhanced data
      const { error: temporalError } = await supabase
        .from('user_patterns')
        .upsert({
          pattern_type: 'temporal',
          pattern_key: sentence.toLowerCase(),
          frequency: 1,
          metadata: { 
            hour: currentHour, 
            time_data: [{ hour: currentHour, count: 1 }],
            day_of_week: new Date().getDay(),
            context
          },
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

  // Ultra-enhanced duplicate detection with advanced fuzzy matching
  const removeDuplicateWords = (words: string[], currentSentence: string[] = []): string[] => {
    const seen = new Set<string>();
    const currentWords = new Set(currentSentence.map(w => w.toLowerCase()));
    const normalizedSeen = new Set<string>();
    
    return words.filter(word => {
      const lowerWord = word.toLowerCase();
      const normalizedWord = normalizeWord(lowerWord);
      
      // Check exact duplicates
      if (seen.has(lowerWord) || currentWords.has(lowerWord)) {
        return false;
      }
      
      // Check normalized duplicates (handles plurals, tenses, etc.)
      if (normalizedSeen.has(normalizedWord)) {
        return false;
      }
      
      // Check for similar words (advanced fuzzy matching)
      for (const existingWord of seen) {
        if (areSimilarWords(lowerWord, existingWord)) {
          return false;
        }
      }
      
      // Check against current sentence words with advanced similarity
      for (const currentWord of currentWords) {
        if (areSimilarWords(lowerWord, currentWord)) {
          return false;
        }
      }
      
      // Check semantic similarity to prevent conceptually duplicate suggestions
      for (const existingWord of seen) {
        if (areSemanticallySimilar(lowerWord, existingWord)) {
          return false;
        }
      }
      
      seen.add(lowerWord);
      normalizedSeen.add(normalizedWord);
      return true;
    });
  };

  // Advanced word normalization for better duplicate detection
  const normalizeWord = (word: string): string => {
    let normalized = word.toLowerCase().trim();
    
    // Remove common suffixes to get root form
    const suffixes = [
      'ing', 'ed', 'er', 'est', 'ly', 'tion', 'sion', 'ness', 'ment', 'ful', 'less'
    ];
    
    for (const suffix of suffixes) {
      if (normalized.endsWith(suffix) && normalized.length > suffix.length + 2) {
        normalized = normalized.slice(0, -suffix.length);
        break;
      }
    }
    
    // Handle plurals
    if (normalized.endsWith('ies') && normalized.length > 4) {
      normalized = normalized.slice(0, -3) + 'y';
    } else if (normalized.endsWith('es') && normalized.length > 3) {
      normalized = normalized.slice(0, -2);
    } else if (normalized.endsWith('s') && normalized.length > 2) {
      normalized = normalized.slice(0, -1);
    }
    
    return normalized;
  };

  // Ultra-enhanced similarity detection
  const areSimilarWords = (word1: string, word2: string): boolean => {
    // Exact match
    if (word1 === word2) return true;
    
    // Normalized match
    if (normalizeWord(word1) === normalizeWord(word2)) return true;
    
    // Check if one is a substring of the other (with length consideration)
    if (word1.length > 3 && word2.length > 3) {
      if (word1.includes(word2) || word2.includes(word1)) return true;
    }
    
    // Check Levenshtein distance for very similar words
    if (Math.abs(word1.length - word2.length) <= 2 && levenshteinDistance(word1, word2) <= 2) {
      return true;
    }
    
    // Check for common word variations
    const variations = [
      [word1 + 's', word2], [word1, word2 + 's'],
      [word1 + 'es', word2], [word1, word2 + 'es'],
      [word1 + 'ing', word2], [word1, word2 + 'ing'],
      [word1 + 'ed', word2], [word1, word2 + 'ed'],
      [word1 + 'er', word2], [word1, word2 + 'er'],
      [word1 + 'ly', word2], [word1, word2 + 'ly'],
    ];
    
    for (const [v1, v2] of variations) {
      if (v1 === v2) return true;
    }
    
    return false;
  };

  // Levenshtein distance calculation for fuzzy matching
  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  };

  // Massively enhanced alternative word finder with context awareness
  const findAlternativeWords = (word: string, availableWords: string[], currentSentence: string[] = []): string[] => {
    const alternatives: string[] = [];
    const lowerWord = word.toLowerCase();
    const currentWords = currentSentence.map(w => w.toLowerCase());
    const normalizedWord = normalizeWord(lowerWord);
    
    // Get direct synonyms from enhanced database
    if (synonymDatabase[lowerWord]) {
      synonymDatabase[lowerWord].forEach(synonym => {
        const matchingWord = availableWords.find(w => 
          normalizeWord(w.toLowerCase()) === normalizeWord(synonym.toLowerCase())
        );
        if (matchingWord && 
            !alternatives.includes(matchingWord) && 
            !currentWords.includes(matchingWord.toLowerCase()) &&
            !areSimilarWords(matchingWord.toLowerCase(), lowerWord)) {
          alternatives.push(matchingWord);
        }
      });
    }

    // Find reverse synonyms
    Object.entries(synonymDatabase).forEach(([key, synonyms]) => {
      if (synonyms.includes(lowerWord) && key !== lowerWord) {
        const matchingWord = availableWords.find(w => 
          normalizeWord(w.toLowerCase()) === normalizeWord(key)
        );
        if (matchingWord && 
            !alternatives.includes(matchingWord) && 
            !currentWords.includes(matchingWord.toLowerCase()) &&
            !areSimilarWords(matchingWord.toLowerCase(), lowerWord)) {
          alternatives.push(matchingWord);
        }
      }
    });

    // Find contextually similar words from available words
    availableWords.forEach(availableWord => {
      const lowerAvailable = availableWord.toLowerCase();
      const normalizedAvailable = normalizeWord(lowerAvailable);
      
      // Skip if already included or too similar
      if (alternatives.includes(availableWord) || 
          currentWords.includes(lowerAvailable) ||
          areSimilarWords(lowerAvailable, lowerWord)) {
        return;
      }
      
      // Check for advanced semantic similarity
      if (areAdvancedSemanticallySimilar(normalizedWord, normalizedAvailable)) {
        alternatives.push(availableWord);
      }
    });

    return alternatives.slice(0, 4); // Return max 4 alternatives
  };

  // Advanced semantic similarity with comprehensive categories
  const areAdvancedSemanticallySimilar = (word1: string, word2: string): boolean => {
    const semanticCategories = {
      emotions: ['happy', 'sad', 'angry', 'excited', 'calm', 'worried', 'scared', 'glad', 'upset', 'mad', 'chuffed', 'stoked'],
      actions: ['go', 'come', 'run', 'walk', 'move', 'travel', 'sit', 'stand', 'play', 'work', 'head', 'rock'],
      sizes: ['big', 'small', 'large', 'tiny', 'huge', 'little', 'giant', 'mini', 'whopping', 'wee'],
      foods: ['eat', 'drink', 'food', 'water', 'hungry', 'thirsty', 'meal', 'snack', 'tucker', 'grub'],
      family: ['mum', 'dad', 'parent', 'family', 'brother', 'sister', 'friend', 'mate', 'cobber'],
      places: ['home', 'school', 'outside', 'inside', 'here', 'there', 'park', 'shop'],
      time: ['now', 'later', 'before', 'after', 'today', 'tomorrow', 'yesterday', 'arvo'],
      qualities: ['good', 'bad', 'nice', 'great', 'awful', 'excellent', 'terrible', 'bonzer', 'ripper'],
      quantities: ['more', 'less', 'all', 'some', 'many', 'few', 'lots'],
      communication: ['say', 'tell', 'ask', 'listen', 'talk', 'speak', 'hear', 'yarn', 'reckon'],
      agreement: ['yes', 'no', 'okay', 'sure', 'maybe', 'never', 'always', 'yeah', 'nah', 'yep'],
      greetings: ['hello', 'hi', 'goodbye', 'bye', 'gday', 'hiya', 'cheerio', 'hooroo'],
      thanks: ['thanks', 'thank you', 'cheers', 'ta', 'appreciate'],
    };
    
    for (const category of Object.values(semanticCategories)) {
      if (category.includes(word1) && category.includes(word2)) {
        return true;
      }
    }
    
    return false;
  };

  // Enhanced semantic similarity check
  const areSemanticallySimilar = (word1: string, word2: string): boolean => {
    // Use the advanced version
    return areAdvancedSemanticallySimilar(normalizeWord(word1), normalizeWord(word2));
  };

  const getAdvancedSuggestions = useCallback(async (
    currentWords: string[],
    availableWords: string[],
    maxSuggestions: number = 10
  ): Promise<AdvancedSuggestion[]> => {
    try {
      const suggestions: AdvancedSuggestion[] = [];
      
      const currentText = currentWords.join(' ').toLowerCase();
      const lastWord = currentWords[currentWords.length - 1]?.toLowerCase();
      const currentHour = new Date().getHours();

      console.log('Getting ultra-advanced suggestions for:', { currentWords, lastWord, currentText });

      // 1. AI Preference-based suggestions (NEW!)
      const contextualPreferenceSuggestions = getContextualSuggestions(currentText, currentHour);
      contextualPreferenceSuggestions.forEach((suggestion, index) => {
        if (!suggestions.some(s => areSimilarWords(s.text.toLowerCase(), suggestion.toLowerCase()))) {
          suggestions.push({
            text: suggestion,
            confidence: Math.max(0.85, 0.95 - index * 0.05),
            type: 'preference',
            context: 'Based on your preferences'
          });
        }
      });

      // 2. Enhanced phrase completions with better scoring
      if (currentText) {
        userPatterns.phrases.forEach((frequency, phrase) => {
          if (phrase.startsWith(currentText) && phrase !== currentText) {
            const completion = phrase.substring(currentText.length).trim();
            if (completion) {
              const nextWords = completion.split(' ');
              nextWords.slice(0, 2).forEach((nextWord, index) => {
                if (!currentWords.some(w => areSimilarWords(w.toLowerCase(), nextWord.toLowerCase()))) {
                  const confidence = Math.min(0.90, (frequency / 6) * (1 - index * 0.2));
                  suggestions.push({
                    text: nextWord,
                    confidence,
                    type: 'completion',
                    context: `Completes: "${phrase}"`
                  });
                }
              });
            }
          }
        });
      }

      // 3. Enhanced word transitions with context scoring
      if (lastWord && userPatterns.transitions.has(lastWord)) {
        const nextWords = userPatterns.transitions.get(lastWord)!;
        nextWords.forEach((frequency, nextWord) => {
          if (!suggestions.some(s => areSimilarWords(s.text.toLowerCase(), nextWord.toLowerCase())) &&
              !currentWords.some(w => areSimilarWords(w.toLowerCase(), nextWord.toLowerCase()))) {
            
            // Boost confidence based on recent usage and context
            let confidence = Math.min(0.85, frequency / 3);
            
            // Boost if it's a common transition at this time
            const timeBoost = getTimeBasedBoost(nextWord, currentHour);
            confidence = Math.min(0.90, confidence + timeBoost);
            
            suggestions.push({
              text: nextWord,
              confidence,
              type: 'next_word',
              context: `Often follows "${lastWord}"`
            });
          }
        });
      }

      // 4. Enhanced temporal suggestions with day/time awareness
      userPatterns.temporalPatterns.forEach((timeData, phrase) => {
        const relevantTimes = timeData.filter(t => Math.abs(t.hour - currentHour) <= 1);
        if (relevantTimes.length > 0) {
          const words = phrase.split(' ');
          words.slice(0, 2).forEach((word, index) => {
            if (!suggestions.some(s => areSimilarWords(s.text.toLowerCase(), word.toLowerCase())) &&
                !currentWords.some(w => areSimilarWords(w.toLowerCase(), word.toLowerCase()))) {
              const totalCount = relevantTimes.reduce((sum, t) => sum + t.count, 0);
              const confidence = Math.min(0.80, (totalCount / 3) * (1 - index * 0.15));
              suggestions.push({
                text: word,
                confidence,
                type: 'temporal',
                context: `Common at ${currentHour}:00`
              });
            }
          });
        }
      });

      // 5. Enhanced common phrases with frequency weighting
      const commonPhrases = Array.from(userPatterns.phrases.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);

      commonPhrases.forEach(([phrase, frequency]) => {
        const words = phrase.split(' ');
        words.slice(0, 2).forEach((word, index) => {
          if (!suggestions.some(s => areSimilarWords(s.text.toLowerCase(), word.toLowerCase())) &&
              !currentWords.some(w => areSimilarWords(w.toLowerCase(), word.toLowerCase()))) {
            const confidence = Math.min(0.75, (frequency / 5) * (1 - index * 0.1));
            suggestions.push({
              text: word,
              confidence,
              type: 'common_phrase',
              context: `From: "${phrase}"`
            });
          }
        });
      });

      // 6. Enhanced synonym suggestions with multiple alternatives
      if (lastWord) {
        const synonyms = findAlternativeWords(lastWord, availableWords, currentWords);
        synonyms.forEach((synonym, index) => {
          if (!suggestions.some(s => areSimilarWords(s.text.toLowerCase(), synonym.toLowerCase()))) {
            const confidence = Math.max(0.4, 0.65 - index * 0.1);
            suggestions.push({
              text: synonym,
              confidence,
              type: 'synonym',
              context: `Alternative to "${lastWord}"`
            });
          }
        });
      }

      // 7. Enhanced contextual suggestions with smart filtering
      const filteredAvailableWords = removeDuplicateWords(availableWords, currentWords);
      const contextualWords = filteredAvailableWords
        .filter(word => {
          // Prefer words that are semantically related to current context
          if (currentWords.length > 0) {
            return currentWords.some(cw => areAdvancedSemanticallySimilar(
              normalizeWord(cw.toLowerCase()), 
              normalizeWord(word.toLowerCase())
            ));
          }
          return true;
        })
        .slice(0, 5);

      contextualWords.forEach((word, index) => {
        if (!suggestions.some(s => areSimilarWords(s.text.toLowerCase(), word.toLowerCase()))) {
          const confidence = Math.max(0.3, 0.45 - index * 0.05);
          suggestions.push({
            text: word,
            confidence,
            type: 'contextual',
            context: 'Contextually relevant'
          });
        }
      });

      // 8. Add high-frequency words as fallback
      if (suggestions.length < maxSuggestions) {
        const fallbackWords = filteredAvailableWords
          .filter(word => !suggestions.some(s => areSimilarWords(s.text.toLowerCase(), word.toLowerCase())))
          .slice(0, maxSuggestions - suggestions.length);
        
        fallbackWords.forEach(word => {
          suggestions.push({
            text: word,
            confidence: 0.25,
            type: 'contextual',
            context: 'Available option'
          });
        });
      }

      // Ultra-smart deduplication and sorting
      const uniqueSuggestions = suggestions.filter((suggestion, index, self) => 
        index === self.findIndex(s => 
          normalizeWord(s.text.toLowerCase()) === normalizeWord(suggestion.text.toLowerCase())
        )
      );

      const finalSuggestions = uniqueSuggestions
        .sort((a, b) => {
          // Primary sort by confidence
          if (Math.abs(a.confidence - b.confidence) > 0.1) {
            return b.confidence - a.confidence;
          }
          // Secondary sort by type priority
          const typePriority = {
            'preference': 6,
            'completion': 5,
            'next_word': 4,
            'temporal': 3,
            'common_phrase': 2,
            'synonym': 1,
            'contextual': 0
          };
          return (typePriority[b.type] || 0) - (typePriority[a.type] || 0);
        })
        .slice(0, maxSuggestions);

      console.log('Generated ultra-advanced suggestions:', finalSuggestions);
      return finalSuggestions;

    } catch (err) {
      console.log('Error getting advanced suggestions:', err);
      setError('Failed to get suggestions');
      return [];
    }
  }, [userPatterns, getContextualSuggestions]);

  // Helper function for time-based confidence boosting with Australian context
  const getTimeBasedBoost = (word: string, currentHour: number): number => {
    // Morning words (6-12) - Australian breakfast and morning routine
    const morningWords = ['brekkie', 'breakfast', 'morning', 'wake', 'start', 'school', 'work', 'cuppa', 'coffee'];
    // Afternoon words (12-17) - Australian lunch and arvo activities
    const afternoonWords = ['lunch', 'arvo', 'afternoon', 'play', 'outside', 'mate', 'sport'];
    // Evening words (17-21) - Australian dinner and evening
    const eveningWords = ['tea', 'dinner', 'evening', 'home', 'family', 'tired', 'telly'];
    // Night words (21-6) - Australian bedtime
    const nightWords = ['sleep', 'bed', 'night', 'rest', 'quiet', 'knackered'];
    
    const lowerWord = word.toLowerCase();
    
    if (currentHour >= 6 && currentHour < 12 && morningWords.includes(lowerWord)) return 0.2;
    if (currentHour >= 12 && currentHour < 17 && afternoonWords.includes(lowerWord)) return 0.2;
    if (currentHour >= 17 && currentHour < 21 && eveningWords.includes(lowerWord)) return 0.2;
    if ((currentHour >= 21 || currentHour < 6) && nightWords.includes(lowerWord)) return 0.2;
    
    return 0;
  };

  const getTimeBasedSuggestions = useCallback(async (): Promise<string[]> => {
    try {
      const hour = new Date().getHours();
      let timeContext = '';
      
      if (hour >= 6 && hour < 12) {
        timeContext = 'morning';
      } else if (hour >= 12 && hour < 17) {
        timeContext = 'arvo'; // Australian afternoon
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
        .limit(8);

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
