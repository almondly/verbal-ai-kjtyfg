
# AI System Quick Reference

## For Developers

### How to Use the Enhanced AI

#### 1. Get Suggestions

```typescript
import { useAdvancedAI } from '../hooks/useAdvancedAI';

const { getAdvancedSuggestions } = useAdvancedAI();

// Get suggestions for current sentence
const currentWords = ['I', 'want'];
const availableWords = tiles.map(t => t.text);
const suggestions = await getAdvancedSuggestions(currentWords, availableWords, 10);

// suggestions = [
//   { text: 'to', confidence: 0.95, type: 'common_phrase', context: '"I want to go"' },
//   { text: 'some', confidence: 0.92, type: 'common_phrase', context: '"I want some water"' },
//   ...
// ]
```

#### 2. Record User Input

```typescript
import { useAdvancedAI } from '../hooks/useAdvancedAI';

const { recordUserInput } = useAdvancedAI();

// Record when user speaks a sentence
const sentence = 'I want to go outside';
const context = 'happy'; // Optional: current emotion or context
await recordUserInput(sentence, context);
```

#### 3. Generate Word Variations

```typescript
import { generateWordVariations, getVerbFormForContext } from '../utils/wordVariations';

// Get all variations of a word
const variations = generateWordVariations('want');
// Returns: ['wants', 'wanted', 'wanting', 'will want', ...]

// Get specific tense
const pastTense = getVerbFormForContext('want', 'past');
// Returns: 'wanted'

const futureTense = getVerbFormForContext('want', 'future');
// Returns: 'will want'
```

#### 4. Complete Sentences

```typescript
import { findSentenceCompletions, generateCompleteSentences } from '../utils/sentenceCompletion';

// Find completions for current words
const currentWords = ['I', 'want'];
const completions = findSentenceCompletions(currentWords, 5);
// Returns: ['to go', 'to play', 'to eat', 'some water', 'that']

// Generate complete sentences from user patterns
const userPhrases = new Map([
  ['i want to go outside', 5],
  ['i want to play games', 3],
]);
const sentences = generateCompleteSentences(currentWords, userPhrases, 3);
// Returns: ['i want to go outside', 'i want to play games', ...]
```

#### 5. Track Learning Patterns

```typescript
import { 
  trackWordUsage, 
  trackWordPair, 
  trackPhraseUsage,
  getFrequentWords 
} from '../utils/learningEngine';

// Track individual word usage
await trackWordUsage('want', 'happy', ['I', 'want', 'to', 'go']);

// Track word transitions
await trackWordPair('want', 'to', 'happy');

// Track complete phrase
await trackPhraseUsage('I want to go outside', 5, 'happy');

// Get most frequent words
const frequentWords = await getFrequentWords(50);
// Returns: ['I', 'want', 'to', 'go', 'the', ...]
```

### Key Functions Reference

#### useAdvancedAI Hook

```typescript
const {
  isLoading,              // boolean - AI is processing
  error,                  // string | null - Error message
  recordUserInput,        // (sentence, context?) => Promise<void>
  getAdvancedSuggestions, // (words, available, max?) => Promise<Suggestion[]>
  getTimeBasedSuggestions,// () => Promise<string[]>
  userPatterns            // { phrases, transitions, contexts, temporalPatterns }
} = useAdvancedAI();
```

#### Word Variations

```typescript
// Generate all variations
generateWordVariations(word: string): string[]

// Generate verb tenses
generateVerbVariations(verb: string): string[]

// Generate noun plurals
generateNounVariations(noun: string): string[]

// Generate adjective forms
generateAdjectiveVariations(adjective: string): string[]

// Get base form (lemmatization)
getBaseForm(word: string): string

// Detect tense from context
detectTenseContext(words: string[]): 'past' | 'present' | 'future' | 'unknown'

// Get verb form for context
getVerbFormForContext(verb: string, tense: string, subject?: string): string
```

#### Sentence Completion

```typescript
// Find sentence completions
findSentenceCompletions(currentWords: string[], max?: number): string[]

// Generate complete sentences
generateCompleteSentences(
  currentWords: string[], 
  userPhrases: Map<string, number>, 
  max?: number
): string[]

// Predict next words
predictNextWords(
  currentWords: string[], 
  transitions: Map<string, Map<string, number>>, 
  max?: number
): Array<{ word: string; confidence: number }>

// Analyze sentence structure
analyzeSentenceStructure(words: string[]): {
  hasSubject: boolean;
  hasVerb: boolean;
  hasObject: boolean;
  tense: 'past' | 'present' | 'future' | 'unknown';
  suggestedNextType: 'verb' | 'noun' | 'adjective' | 'adverb' | 'preposition' | 'unknown';
}
```

#### Learning Engine

```typescript
// Track word usage
trackWordUsage(word: string, context: string, sentenceWords: string[]): Promise<void>

// Track word pairs
trackWordPair(fromWord: string, toWord: string, context: string): Promise<void>

// Track phrase usage
trackPhraseUsage(phrase: string, wordCount: number, context?: string): Promise<void>

// Track corrections
trackCorrection(suggestedWord: string, actualWord: string, context: string): Promise<void>

// Get word statistics
getWordStatistics(word: string): Promise<UsagePattern | null>

// Get frequent words
getFrequentWords(limit?: number): Promise<string[]>

// Get confident word pairs
getConfidentWordPairs(minFrequency?: number): Promise<WordPair[]>

// Analyze vocabulary
analyzeVocabulary(): Promise<{
  totalWords: number;
  averageWordLength: number;
  mostCommonWords: string[];
  preferredSentenceLength: number;
  vocabularyDiversity: number;
}>
```

### Database Queries

#### Get User Patterns

```typescript
// Get all phrases
const { data } = await supabase
  .from('user_patterns')
  .select('*')
  .eq('pattern_type', 'phrase')
  .order('frequency', { ascending: false });

// Get word transitions
const { data } = await supabase
  .from('user_patterns')
  .select('*')
  .eq('pattern_type', 'transition')
  .order('frequency', { ascending: false });

// Get temporal patterns
const { data } = await supabase
  .from('user_patterns')
  .select('*')
  .eq('pattern_type', 'temporal')
  .contains('metadata', { hour: currentHour });
```

#### Update Pattern Frequency

```typescript
// Upsert pattern (increment frequency)
const { error } = await supabase
  .from('user_patterns')
  .upsert({
    pattern_type: 'phrase',
    pattern_key: 'i want to go outside',
    frequency: 1,
    metadata: { word_count: 5, context: 'happy', hour: 14 },
    updated_at: new Date().toISOString()
  }, {
    onConflict: 'pattern_type,pattern_key'
  });
```

### Common Patterns

#### Pattern 1: Add Suggestion on Tile Press

```typescript
const handleTilePress = async (tile: Tile) => {
  // Add tile to sentence
  setSentence(prev => [...prev, tile]);
  
  // Get new suggestions
  const currentWords = [...sentence.map(t => t.text), tile.text];
  const suggestions = await getAdvancedSuggestions(currentWords, availableWords);
  setAdvancedSuggestions(suggestions);
};
```

#### Pattern 2: Record on Speak

```typescript
const handleSpeak = async () => {
  const text = sentence.map(t => t.text).join(' ');
  
  // Speak the sentence
  await speak(text);
  
  // Record in AI system
  await recordUserInput(text, currentEmotion);
  
  // Clear sentence
  setSentence([]);
};
```

#### Pattern 3: Time-Based Suggestions

```typescript
useEffect(() => {
  const loadTimeBasedSuggestions = async () => {
    const suggestions = await getTimeBasedSuggestions();
    // Show suggestions relevant to current time
    setTimeSuggestions(suggestions);
  };
  
  loadTimeBasedSuggestions();
  
  // Refresh every hour
  const interval = setInterval(loadTimeBasedSuggestions, 60 * 60 * 1000);
  return () => clearInterval(interval);
}, []);
```

### Testing

#### Test Word Variations

```typescript
console.log(generateWordVariations('want'));
// ['wants', 'wanted', 'wanting', 'will want']

console.log(generateWordVariations('child'));
// ['children', "child's", "children's"]

console.log(generateWordVariations('happy'));
// ['happier', 'happiest', 'more happy', 'most happy']
```

#### Test Tense Detection

```typescript
console.log(detectTenseContext(['yesterday', 'I', 'went']));
// 'past'

console.log(detectTenseContext(['I', 'will', 'go']));
// 'future'

console.log(detectTenseContext(['I', 'am', 'going']));
// 'present'
```

#### Test Sentence Completion

```typescript
console.log(findSentenceCompletions(['I', 'want']));
// ['to go', 'to play', 'to eat', 'to drink', 'some water']

console.log(findSentenceCompletions(['where', 'is']));
// ['it', 'the toilet', 'mum', 'dad', 'my toy']
```

### Performance Tips

1. **Cache suggestions** - Don't regenerate on every render
2. **Debounce updates** - Wait for user to finish typing
3. **Limit results** - Request only what you need (max 10-15)
4. **Background recording** - Don't block UI for pattern updates
5. **Lazy load patterns** - Load patterns on demand, not all at once

### Debugging

```typescript
// Enable detailed logging
console.log('Current patterns:', userPatterns);
console.log('Suggestions:', advancedSuggestions);
console.log('Tense context:', detectTenseContext(currentWords));
console.log('Sentence structure:', analyzeSentenceStructure(currentWords));
```

### Common Issues

**Issue:** Suggestions not updating
**Solution:** Check that `getAdvancedSuggestions` is called after sentence changes

**Issue:** Patterns not being recorded
**Solution:** Verify `recordUserInput` is called when user speaks

**Issue:** Slow performance
**Solution:** Reduce `maxSuggestions` parameter, enable caching

**Issue:** Duplicate suggestions
**Solution:** System automatically deduplicates, but check for similar words

**Issue:** Wrong tense suggestions
**Solution:** Verify sentence context includes tense indicators (yesterday, will, etc.)
