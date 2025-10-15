
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../app/integrations/supabase/client';
import { useAIPreferences } from './useAIPreferences';
import { 
  generateWordVariations, 
  detectTenseContext, 
  getVerbFormForContext,
  getBaseForm,
  isLikelyVerb
} from '../utils/wordVariations';
import {
  findSentenceCompletions,
  generateCompleteSentences,
  predictNextWords,
  analyzeSentenceStructure,
  scoreSuggestions
} from '../utils/sentenceCompletion';

export interface AdvancedSuggestion {
  text: string;
  confidence: number;
  type: 'completion' | 'next_word' | 'common_phrase' | 'contextual' | 'temporal' | 'synonym' | 'preference' | 'full_sentence' | 'tense_variation';
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

  // ChatGPT-style common phrases database - Australian English
  const commonPhrases: { [key: string]: string[] } = {
    // Greetings and social
    'hello': ['mate', 'how are you', 'good morning', 'g\'day'],
    'hi': ['there', 'mate', 'how are you', 'everyone'],
    'g\'day': ['mate', 'how are you', 'everyone'],
    'good': ['morning', 'afternoon', 'evening', 'day', 'night'],
    'how': ['are you', 'are you going', 'was your day', 'do you feel'],
    'nice': ['to see you', 'to meet you', 'day', 'weather'],
    
    // Questions - comprehensive
    'what': ['is your name', 'time is it', 'are you doing', 'do you want', 'is that', 'happened', 'is your favourite', 'colour do you like'],
    'what\'s': ['your name', 'that', 'happening', 'for lunch', 'for tea', 'the time', 'your favourite'],
    'where': ['are you', 'is it', 'are we going', 'do you live', 'is the toilet', 'is mum', 'is dad'],
    'when': ['are we going', 'is lunch', 'is tea', 'can we go', 'will you be back'],
    'why': ['are you sad', 'are you happy', 'not', 'is that', 'do we have to'],
    'who': ['is that', 'are you', 'is coming', 'wants to play'],
    'can': ['I have', 'I go', 'you help me', 'we play', 'I please', 'you please'],
    'could': ['I have', 'you help me', 'we go', 'you please'],
    'would': ['you like', 'you please', 'you help me'],
    'do': ['you want', 'you like', 'you have', 'you know', 'I have to'],
    
    // Needs and wants
    'I': ['want', 'need', 'like', 'love', 'am hungry', 'am thirsty', 'am tired', 'feel', 'think', 'can', 'would like'],
    'I\'m': ['hungry', 'thirsty', 'tired', 'happy', 'sad', 'excited', 'ready', 'finished', 'sorry'],
    'want': ['to go', 'to play', 'to eat', 'to drink', 'some water', 'some food', 'that', 'more'],
    'need': ['help', 'the toilet', 'water', 'food', 'a break', 'to go', 'to rest'],
    'like': ['to play', 'to eat', 'this', 'that', 'it', 'you'],
    'love': ['you', 'this', 'that', 'it', 'playing', 'eating'],
    
    // Preference-based triggers
    'my': ['favourite colour', 'favourite food', 'favourite activity', 'favourite animal'],
    'favourite': ['colour is', 'food is', 'activity is', 'animal is'],
    
    // Food and drink - Australian
    'I\'m': ['hungry', 'thirsty', 'starving', 'peckish'],
    'want': ['some tucker', 'some water', 'a drink', 'a snack', 'lunch', 'tea'],
    'can': ['I have water', 'I have food', 'I have a snack', 'I have lunch', 'I have tea'],
    'what\'s': ['for lunch', 'for tea', 'for brekkie', 'for dinner'],
    'time': ['for lunch', 'for tea', 'for brekkie', 'to eat', 'to go'],
    
    // Feelings and emotions
    'I': ['feel happy', 'feel sad', 'feel tired', 'feel excited', 'feel scared', 'feel angry'],
    'feel': ['happy', 'sad', 'tired', 'excited', 'scared', 'angry', 'good', 'bad', 'sick'],
    'am': ['happy', 'sad', 'tired', 'excited', 'scared', 'angry', 'hungry', 'thirsty'],
    
    // Actions
    'want': ['to go home', 'to play outside', 'to watch telly', 'to read', 'to draw', 'to sleep'],
    'can': ['we go', 'we play', 'I play', 'I go', 'you help'],
    'let\'s': ['go', 'play', 'eat', 'have fun', 'do it'],
    'time': ['to go', 'to play', 'to eat', 'to sleep', 'to leave'],
    
    // Places
    'go': ['home', 'outside', 'to school', 'to the park', 'to the shop', 'to bed'],
    'at': ['home', 'school', 'the park', 'the shop'],
    'in': ['the house', 'the car', 'my room', 'the garden'],
    
    // Family and people
    'where': ['is mum', 'is dad', 'is my mate', 'are you'],
    'I': ['love mum', 'love dad', 'miss you', 'want mum', 'want dad'],
    'my': ['mum', 'dad', 'mate', 'friend', 'family', 'favourite'],
    
    // Colours - Australian spelling
    'my': ['favourite colour', 'favourite color'],
    'what': ['colour is it', 'colour do you like'],
    'favourite': ['colour', 'food', 'toy', 'game', 'animal'],
    'like': ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'orange'],
    
    // Time expressions
    'in': ['the morning', 'the arvo', 'the evening', 'the night'],
    'this': ['morning', 'arvo', 'afternoon', 'evening', 'night'],
    'right': ['now', 'here', 'there'],
    
    // Politeness - Australian style
    'please': ['can I', 'help me', 'thank you'],
    'thank': ['you', 'you very much', 'you mate'],
    'thanks': ['mate', 'very much', 'a lot'],
    'excuse': ['me', 'me please'],
    'sorry': ['about that', 'mate', 'I didn\'t mean to'],
    
    // Common responses
    'yes': ['please', 'I do', 'I can', 'I will', 'that\'s right'],
    'no': ['thank you', 'I don\'t', 'I can\'t', 'not now'],
    'maybe': ['later', 'tomorrow', 'next time'],
    
    // Activities
    'play': ['outside', 'with toys', 'games', 'with mates', 'at the park'],
    'watch': ['telly', 'TV', 'a movie', 'cartoons'],
    'read': ['a book', 'a story', 'with me'],
    'draw': ['a picture', 'with me', 'something'],
    
    // Help and assistance
    'help': ['me please', 'me with this', 'I need help'],
    'can': ['you help me', 'you show me', 'you teach me'],
    'show': ['me', 'me how', 'me please'],
    
    // Weather - Australian context
    'it\'s': ['hot', 'cold', 'raining', 'sunny', 'beautiful', 'stinking hot'],
    'the': ['weather is nice', 'weather is bad', 'sun is out'],
    
    // School
    'at': ['school', 'kindy', 'uni'],
    'go': ['to school', 'to kindy', 'to class'],
    'time': ['for school', 'for class', 'for learning'],
  };

  // Common full sentence templates
  const fullSentenceTemplates: string[] = [
    'I want to go outside',
    'Can I have some water please',
    'I need help with this',
    'What time is it',
    'Where is mum',
    'I am feeling happy today',
    'Can we play together',
    'I would like to eat now',
    'Thank you very much',
    'I need to go to the toilet',
    'Can you help me please',
    'I want to watch telly',
    'What are we doing today',
    'I love you',
    'Good morning everyone',
  ];

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
    'morning': ['this morning', 'early', 'dawn', 'sunrise', 'AM', 'brekkie time'],
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
      const dayOfWeek = new Date().getDay();
      const tenseContext = detectTenseContext(words);
      
      // Detect sentence topics for better context learning
      const topics = detectSentenceTopics(words);
      
      // Record the full phrase with enhanced metadata
      const { error: phraseError } = await supabase
        .from('user_patterns')
        .upsert({
          pattern_type: 'phrase',
          pattern_key: sentence.toLowerCase(),
          frequency: 1,
          metadata: { 
            word_count: words.length, 
            context, 
            hour: currentHour,
            dayOfWeek,
            tense: tenseContext,
            topics,
            lastUsed: new Date().toISOString()
          },
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'pattern_type,pattern_key'
        });

      if (phraseError) {
        console.log('Error recording phrase:', phraseError);
      }

      // Record individual word usage with enhanced context
      for (let i = 0; i < words.length; i++) {
        const { error: wordError } = await supabase
          .from('user_patterns')
          .upsert({
            pattern_type: 'word',
            pattern_key: words[i],
            frequency: 1,
            metadata: {
              context,
              hour: currentHour,
              dayOfWeek,
              position: i,
              sentenceLength: words.length,
              tense: tenseContext,
              topics,
              lastUsed: new Date().toISOString()
            },
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'pattern_type,pattern_key'
          });

        if (wordError) {
          console.log('Error recording word:', wordError);
        }
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
            metadata: { 
              from: words[i],
              to: words[i + 1],
              context, 
              hour: currentHour,
              dayOfWeek,
              position: i,
              tense: tenseContext,
              topics,
              lastUsed: new Date().toISOString()
            },
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
            day_of_week: dayOfWeek,
            context,
            tense: tenseContext,
            topics,
            lastUsed: new Date().toISOString()
          },
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'pattern_type,pattern_key'
        });

      if (temporalError) {
        console.log('Error recording temporal pattern:', temporalError);
      }
      
      // Record topic-based patterns for context learning
      for (const topic of topics) {
        const { error: topicError } = await supabase
          .from('user_patterns')
          .upsert({
            pattern_type: 'topic',
            pattern_key: topic,
            frequency: 1,
            metadata: {
              sentence: sentence.toLowerCase(),
              words,
              hour: currentHour,
              dayOfWeek,
              lastUsed: new Date().toISOString()
            },
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'pattern_type,pattern_key'
          });

        if (topicError) {
          console.log('Error recording topic:', topicError);
        }
      }

      // Update local patterns
      await loadUserPatterns();
      
      console.log('Recorded user input:', { sentence, words: words.length, context, tense: tenseContext, topics });
    } catch (err) {
      console.log('Error recording user input:', err);
    }
  }, []);
  
  // Helper function to detect sentence topics for context learning
  const detectSentenceTopics = (words: string[]): string[] => {
    const topics: string[] = [];
    
    // Topic categories with keywords
    const topicKeywords = {
      'school': ['school', 'class', 'teacher', 'learn', 'study', 'homework', 'book', 'pencil'],
      'food': ['eat', 'drink', 'hungry', 'thirsty', 'food', 'water', 'lunch', 'dinner', 'breakfast', 'snack'],
      'family': ['mum', 'dad', 'mom', 'mother', 'father', 'brother', 'sister', 'family', 'grandma', 'grandpa'],
      'play': ['play', 'game', 'toy', 'fun', 'outside', 'park', 'playground', 'ball', 'swing'],
      'feelings': ['happy', 'sad', 'angry', 'scared', 'excited', 'tired', 'love', 'like', 'feel'],
      'home': ['home', 'house', 'bed', 'room', 'bathroom', 'kitchen', 'tv', 'sleep'],
      'help': ['help', 'need', 'want', 'please', 'can', 'could', 'would'],
      'time': ['morning', 'afternoon', 'evening', 'night', 'today', 'tomorrow', 'now', 'later'],
    };
    
    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (words.some(word => keywords.includes(word.toLowerCase()))) {
        topics.push(topic);
      }
    }
    
    return topics;
  };

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
      
      // Detect sentence context for tense-aware suggestions
      const tenseContext = detectTenseContext(currentWords);
      const sentenceStructure = analyzeSentenceStructure(currentWords);

      console.log('Getting advanced suggestions for:', { 
        currentWords, 
        lastWord, 
        currentText, 
        tenseContext,
        sentenceStructure 
      });

      // 1. ChatGPT-style common phrase completions (HIGHEST PRIORITY)
      if (lastWord && commonPhrases[lastWord]) {
        const phraseCompletions = commonPhrases[lastWord];
        phraseCompletions.forEach((completion, index) => {
          const nextWord = completion.split(' ')[0];
          if (!suggestions.some(s => areSimilarWords(s.text.toLowerCase(), nextWord.toLowerCase())) &&
              !currentWords.some(w => areSimilarWords(w.toLowerCase(), nextWord.toLowerCase()))) {
            suggestions.push({
              text: nextWord,
              confidence: Math.max(0.92, 0.98 - index * 0.02),
              type: 'common_phrase',
              context: `"${lastWord} ${completion}"`
            });
          }
        });
      }

      // 2. Multi-word phrase matching for better context
      if (currentWords.length >= 2) {
        const lastTwoWords = currentWords.slice(-2).join(' ').toLowerCase();
        Object.entries(commonPhrases).forEach(([key, completions]) => {
          if (lastTwoWords.includes(key)) {
            completions.forEach((completion, index) => {
              const nextWord = completion.split(' ')[0];
              if (!suggestions.some(s => areSimilarWords(s.text.toLowerCase(), nextWord.toLowerCase())) &&
                  !currentWords.some(w => areSimilarWords(w.toLowerCase(), nextWord.toLowerCase()))) {
                suggestions.push({
                  text: nextWord,
                  confidence: Math.max(0.88, 0.95 - index * 0.02),
                  type: 'common_phrase',
                  context: `Completes phrase`
                });
              }
            });
          }
        });
      }

      // 3. AI Preference-based suggestions (ENHANCED)
      const contextualPreferenceSuggestions = getContextualSuggestions(currentText, currentHour);
      console.log('Contextual preference suggestions:', contextualPreferenceSuggestions);
      contextualPreferenceSuggestions.forEach((suggestion, index) => {
        if (!suggestions.some(s => areSimilarWords(s.text.toLowerCase(), suggestion.toLowerCase()))) {
          suggestions.push({
            text: suggestion,
            confidence: Math.max(0.88, 0.93 - index * 0.03),
            type: 'preference',
            context: 'Based on your preferences'
          });
        }
      });
      
      // 3.5. Topic-based context learning suggestions
      const currentTopics = detectSentenceTopics(currentWords);
      if (currentTopics.length > 0) {
        // Fetch phrases related to current topics
        const { data: topicData } = await supabase
          .from('user_patterns')
          .select('*')
          .eq('pattern_type', 'topic')
          .in('pattern_key', currentTopics)
          .order('frequency', { ascending: false })
          .limit(5);
        
        topicData?.forEach((pattern, index) => {
          const relatedWords = pattern.metadata?.words || [];
          relatedWords.slice(0, 3).forEach((word: string) => {
            if (!suggestions.some(s => areSimilarWords(s.text.toLowerCase(), word.toLowerCase())) &&
                !currentWords.some(w => areSimilarWords(w.toLowerCase(), word.toLowerCase()))) {
              suggestions.push({
                text: word,
                confidence: Math.max(0.75, 0.85 - index * 0.05),
                type: 'contextual',
                context: `Related to ${currentTopics.join(', ')}`
              });
            }
          });
        });
      }

      // 4. Enhanced phrase completions from user patterns
      if (currentText) {
        userPatterns.phrases.forEach((frequency, phrase) => {
          if (phrase.startsWith(currentText) && phrase !== currentText) {
            const completion = phrase.substring(currentText.length).trim();
            if (completion) {
              const nextWords = completion.split(' ');
              nextWords.slice(0, 2).forEach((nextWord, index) => {
                if (!currentWords.some(w => areSimilarWords(w.toLowerCase(), nextWord.toLowerCase()))) {
                  const confidence = Math.min(0.87, (frequency / 6) * (1 - index * 0.2));
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

      // 5. Enhanced word transitions with context scoring
      if (lastWord && userPatterns.transitions.has(lastWord)) {
        const nextWords = userPatterns.transitions.get(lastWord)!;
        nextWords.forEach((frequency, nextWord) => {
          if (!suggestions.some(s => areSimilarWords(s.text.toLowerCase(), nextWord.toLowerCase())) &&
              !currentWords.some(w => areSimilarWords(w.toLowerCase(), nextWord.toLowerCase()))) {
            
            // Boost confidence based on recent usage and context
            let confidence = Math.min(0.82, frequency / 3);
            
            // Boost if it's a common transition at this time
            const timeBoost = getTimeBasedBoost(nextWord, currentHour);
            confidence = Math.min(0.87, confidence + timeBoost);
            
            suggestions.push({
              text: nextWord,
              confidence,
              type: 'next_word',
              context: `Often follows "${lastWord}"`
            });
          }
        });
      }

      // 6. Enhanced temporal suggestions with day/time awareness
      userPatterns.temporalPatterns.forEach((timeData, phrase) => {
        const relevantTimes = timeData.filter(t => Math.abs(t.hour - currentHour) <= 1);
        if (relevantTimes.length > 0) {
          const words = phrase.split(' ');
          words.slice(0, 2).forEach((word, index) => {
            if (!suggestions.some(s => areSimilarWords(s.text.toLowerCase(), word.toLowerCase())) &&
                !currentWords.some(w => areSimilarWords(w.toLowerCase(), word.toLowerCase()))) {
              const totalCount = relevantTimes.reduce((sum, t) => sum + t.count, 0);
              const confidence = Math.min(0.78, (totalCount / 3) * (1 - index * 0.15));
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

      // 7. Enhanced synonym suggestions with multiple alternatives
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
      
      // 7.5. Enhanced tense variation suggestions with all tenses
      if (lastWord && isLikelyVerb(lastWord)) {
        const baseForm = getBaseForm(lastWord);
        
        // Generate all tense variations
        const tenseVariations = [
          { tense: 'present', form: getVerbFormForContext(baseForm, 'present'), label: 'Present' },
          { tense: 'past', form: getVerbFormForContext(baseForm, 'past'), label: 'Past' },
          { tense: 'future', form: getVerbFormForContext(baseForm, 'future'), label: 'Future' },
        ];
        
        tenseVariations.forEach(({ tense, form, label }) => {
          if (form && form.toLowerCase() !== lastWord.toLowerCase() && 
              !suggestions.some(s => areSimilarWords(s.text.toLowerCase(), form.toLowerCase()))) {
            // Higher confidence for contextually appropriate tense
            const confidence = tense === tenseContext ? 0.85 : 0.65;
            suggestions.push({
              text: form,
              confidence,
              type: 'tense_variation',
              context: `${label} tense`
            });
          }
        });
      }
      
      // 7.6. Word variation suggestions (plurals, etc.)
      if (lastWord) {
        const variations = generateWordVariations(lastWord);
        
        // Add other variations
        variations.slice(0, 3).forEach((variation, index) => {
          if (!suggestions.some(s => areSimilarWords(s.text.toLowerCase(), variation.toLowerCase())) &&
              !currentWords.some(w => areSimilarWords(w.toLowerCase(), variation.toLowerCase()))) {
            const confidence = Math.max(0.35, 0.55 - index * 0.1);
            suggestions.push({
              text: variation,
              confidence,
              type: 'synonym',
              context: `Variation of "${lastWord}"`
            });
          }
        });
      }
      
      // 7.7. Complete sentence suggestions from partial input
      if (currentWords.length >= 1 && currentWords.length <= 3) {
        const completeSentences = generateCompleteSentences(currentWords, userPatterns.phrases, 2);
        
        completeSentences.forEach((sentence, index) => {
          // Extract the next word(s) from the complete sentence
          const sentenceWords = sentence.split(' ');
          const nextWord = sentenceWords[currentWords.length];
          
          if (nextWord && !suggestions.some(s => areSimilarWords(s.text.toLowerCase(), nextWord.toLowerCase()))) {
            const confidence = Math.max(0.7, 0.85 - index * 0.1);
            suggestions.push({
              text: nextWord,
              confidence,
              type: 'completion',
              context: `Completes: "${sentence}"`
            });
          }
        });
      }
      
      // 7.8. N-gram based predictions
      if (currentWords.length > 0) {
        const ngramPredictions = predictNextWords(currentWords, userPatterns.transitions, 3);
        
        ngramPredictions.forEach(({ word, confidence: freq }) => {
          if (!suggestions.some(s => areSimilarWords(s.text.toLowerCase(), word.toLowerCase())) &&
              !currentWords.some(w => areSimilarWords(w.toLowerCase(), word.toLowerCase()))) {
            const confidence = Math.min(0.8, freq / 5);
            suggestions.push({
              text: word,
              confidence,
              type: 'next_word',
              context: 'Based on your patterns'
            });
          }
        });
      }

      // 8. Enhanced contextual suggestions with smart filtering
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

      // 9. Add high-frequency words as fallback
      if (suggestions.length < maxSuggestions - 3) {
        const fallbackWords = filteredAvailableWords
          .filter(word => !suggestions.some(s => areSimilarWords(s.text.toLowerCase(), word.toLowerCase())))
          .slice(0, maxSuggestions - suggestions.length - 3);
        
        fallbackWords.forEach(word => {
          suggestions.push({
            text: word,
            confidence: 0.25,
            type: 'contextual',
            context: 'Available option'
          });
        });
      }

      // 10. Add full sentence suggestions as last options (NEW FEATURE)
      if (currentWords.length >= 1 && currentWords.length <= 4) {
        const relevantSentences = fullSentenceTemplates
          .filter(sentence => {
            const sentenceLower = sentence.toLowerCase();
            // Check if sentence starts with current text or is contextually relevant
            return sentenceLower.startsWith(currentText) || 
                   currentWords.some(word => sentenceLower.includes(word.toLowerCase()));
          })
          .slice(0, 3);

        relevantSentences.forEach((sentence, index) => {
          if (!suggestions.some(s => s.text.toLowerCase() === sentence.toLowerCase())) {
            suggestions.push({
              text: sentence,
              confidence: Math.max(0.75, 0.85 - index * 0.05),
              type: 'full_sentence',
              context: 'Complete sentence suggestion'
            });
          }
        });
      }

      // Ultra-smart deduplication and sorting
      const uniqueSuggestions = suggestions.filter((suggestion, index, self) => 
        index === self.findIndex(s => 
          normalizeWord(s.text.toLowerCase()) === normalizeWord(suggestion.text.toLowerCase())
        )
      );

      // Score suggestions based on multiple factors
      const wordFrequency = new Map<string, number>();
      userPatterns.phrases.forEach((freq, phrase) => {
        phrase.split(' ').forEach(word => {
          wordFrequency.set(word, (wordFrequency.get(word) || 0) + freq);
        });
      });
      
      const scoredSuggestions = scoreSuggestions(uniqueSuggestions, currentWords, wordFrequency);

      const finalSuggestions = scoredSuggestions
        .sort((a, b) => {
          // Primary sort by score
          if (Math.abs(a.score - b.score) > 0.05) {
            return b.score - a.score;
          }
          // Secondary sort by type priority
          const typePriority = {
            'preference': 9,
            'common_phrase': 8,
            'full_sentence': 7,
            'tense_variation': 6,
            'completion': 5,
            'next_word': 4,
            'temporal': 3,
            'synonym': 2,
            'contextual': 1
          };
          return (typePriority[b.type] || 0) - (typePriority[a.type] || 0);
        })
        .slice(0, maxSuggestions)
        .map(({ text, confidence, type, context }) => ({ text, confidence, type, context })); // Remove score from output

      console.log('Generated advanced suggestions:', finalSuggestions);
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
