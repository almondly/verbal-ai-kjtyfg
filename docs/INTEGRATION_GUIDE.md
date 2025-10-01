
# AI System Integration Guide

## Overview

This guide explains how the enhanced AI system integrates with the existing app and how to extend it further.

## Current Integration Points

### 1. Communication Screen (`app/communication.tsx`)

**What's integrated:**
- Advanced suggestions displayed in `AdvancedSuggestionsRow`
- User input recorded when speaking sentences
- Time-based suggestions shown when sentence is empty
- Suggestions update automatically as user builds sentence

**Code:**
```typescript
// Get suggestions
const { getAdvancedSuggestions, recordUserInput } = useAdvancedAI();

// Update suggestions when sentence changes
useEffect(() => {
  const updateSuggestions = async () => {
    if (sentence.length > 0) {
      const currentWords = sentence.map(t => t.text);
      const availableWords = tiles.map(t => t.text);
      const suggestions = await getAdvancedSuggestions(currentWords, availableWords);
      setAdvancedSuggestions(suggestions);
    }
  };
  updateSuggestions();
}, [sentence]);

// Record when user speaks
const handleSpeak = async () => {
  const text = sentence.map(t => t.text).join(' ');
  await speak(text);
  await recordUserInput(text, settings.selectedEmotion);
  setSentence([]);
};
```

### 2. Advanced Suggestions Row (`components/AdvancedSuggestionsRow.tsx`)

**What's integrated:**
- Displays suggestions with confidence indicators
- Shows suggestion type (completion, synonym, etc.)
- Provides context tooltips
- Handles suggestion selection

**No changes needed** - Component already supports enhanced suggestions

### 3. AI Preferences (`hooks/useAIPreferences.ts`)

**What's integrated:**
- User preferences (favorite color, food, activity)
- Contextual suggestions based on preferences
- Time-based routine preferences
- Communication style preferences

**Used by:**
- `useAdvancedAI` for personalized suggestions
- Settings screen for preference management

### 4. Database (`user_patterns` table)

**What's stored:**
- Word usage patterns
- Phrase patterns
- Word transitions (bigrams)
- Temporal patterns
- Correction patterns (for future use)

**Schema:**
```sql
CREATE TABLE user_patterns (
  id SERIAL PRIMARY KEY,
  pattern_type VARCHAR,
  pattern_key TEXT,
  frequency INTEGER DEFAULT 1,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(pattern_type, pattern_key)
);
```

## How to Extend

### Add New Suggestion Types

1. **Define the type** in `hooks/useAdvancedAI.ts`:

```typescript
export interface AdvancedSuggestion {
  text: string;
  confidence: number;
  type: 'completion' | 'next_word' | 'common_phrase' | 'contextual' | 
        'temporal' | 'synonym' | 'preference' | 'YOUR_NEW_TYPE';
  context?: string;
}
```

2. **Add suggestion logic** in `getAdvancedSuggestions`:

```typescript
// Your new suggestion type
if (someCondition) {
  suggestions.push({
    text: 'your suggestion',
    confidence: 0.8,
    type: 'YOUR_NEW_TYPE',
    context: 'Why this suggestion'
  });
}
```

3. **Update type priority** in sorting:

```typescript
const typePriority = {
  'YOUR_NEW_TYPE': 8, // Higher number = higher priority
  'common_phrase': 7,
  'preference': 6,
  // ...
};
```

### Add New Word Variation Rules

1. **Add to irregular database** in `utils/wordVariations.ts`:

```typescript
const irregularVerbs: { [key: string]: { ... } } = {
  'your_verb': { 
    past: 'past_form', 
    pastParticiple: 'past_participle', 
    present3rd: '3rd_person', 
    continuous: 'ing_form' 
  },
  // ...
};
```

2. **Add custom variation function**:

```typescript
export function generateCustomVariations(word: string): string[] {
  // Your custom logic
  return variations;
}
```

3. **Integrate in `generateWordVariations`**:

```typescript
export function generateWordVariations(word: string): string[] {
  const variations = new Set<string>();
  
  // Existing variations
  const verbVariations = generateVerbVariations(lowerWord);
  verbVariations.forEach(v => variations.add(v));
  
  // Your custom variations
  const customVariations = generateCustomVariations(lowerWord);
  customVariations.forEach(v => variations.add(v));
  
  return Array.from(variations);
}
```

### Add New Sentence Templates

1. **Add to `sentenceTemplates`** in `utils/sentenceCompletion.ts`:

```typescript
export const sentenceTemplates = [
  // Existing templates
  { pattern: ['I', 'want'], completions: ['to go', 'to play', ...] },
  
  // Your new template
  { 
    pattern: ['your', 'pattern'], 
    completions: ['completion1', 'completion2', 'completion3'] 
  },
];
```

2. **Add dynamic templates** based on user data:

```typescript
// In useAdvancedAI.ts
const userTemplates = useMemo(() => {
  const templates: Array<{ pattern: string[]; completions: string[] }> = [];
  
  // Generate templates from user's frequent phrases
  userPatterns.phrases.forEach((frequency, phrase) => {
    if (frequency > 5) {
      const words = phrase.split(' ');
      if (words.length >= 3) {
        templates.push({
          pattern: words.slice(0, 2),
          completions: [words.slice(2).join(' ')]
        });
      }
    }
  });
  
  return templates;
}, [userPatterns]);
```

### Add New Learning Patterns

1. **Define pattern type** in database:

```typescript
// Add to user_patterns table
pattern_type: 'your_new_pattern_type'
```

2. **Create tracking function** in `utils/learningEngine.ts`:

```typescript
export async function trackYourPattern(
  data: YourDataType,
  context: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('user_patterns')
      .upsert({
        pattern_type: 'your_new_pattern_type',
        pattern_key: generateKey(data),
        frequency: 1,
        metadata: { ...yourMetadata },
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'pattern_type,pattern_key'
      });
    
    if (error) console.log('Error tracking pattern:', error);
  } catch (err) {
    console.log('Error in trackYourPattern:', err);
  }
}
```

3. **Integrate in `recordUserInput`**:

```typescript
const recordUserInput = useCallback(async (sentence: string, context?: string) => {
  // Existing recording
  await trackPhraseUsage(sentence, words.length, context);
  
  // Your new pattern tracking
  await trackYourPattern(extractData(sentence), context);
}, []);
```

### Add Context-Aware Features

1. **Detect context** in sentence:

```typescript
function detectContext(words: string[]): string {
  if (words.some(w => ['hungry', 'thirsty', 'eat', 'drink'].includes(w))) {
    return 'food';
  }
  if (words.some(w => ['tired', 'sleep', 'bed'].includes(w))) {
    return 'rest';
  }
  // Add more contexts
  return 'general';
}
```

2. **Use context in suggestions**:

```typescript
const context = detectContext(currentWords);

if (context === 'food') {
  // Add food-related suggestions
  suggestions.push({
    text: 'hungry',
    confidence: 0.8,
    type: 'contextual',
    context: 'Food context detected'
  });
}
```

### Add Multi-Language Support

1. **Create language-specific databases**:

```typescript
// utils/wordVariations.en-AU.ts
export const irregularVerbs_AU = { ... };

// utils/wordVariations.en-US.ts
export const irregularVerbs_US = { ... };
```

2. **Add language selector**:

```typescript
const [language, setLanguage] = useState('en-AU');

const getIrregularVerbs = () => {
  switch (language) {
    case 'en-AU': return irregularVerbs_AU;
    case 'en-US': return irregularVerbs_US;
    default: return irregularVerbs_AU;
  }
};
```

3. **Update templates per language**:

```typescript
const sentenceTemplates = useMemo(() => {
  return language === 'en-AU' 
    ? australianTemplates 
    : americanTemplates;
}, [language]);
```

## Advanced Features

### 1. Predictive Typing

Show suggestions before user finishes typing:

```typescript
const [partialWord, setPartialWord] = useState('');

useEffect(() => {
  if (partialWord.length >= 2) {
    const predictions = availableWords.filter(word => 
      word.toLowerCase().startsWith(partialWord.toLowerCase())
    );
    setPredictions(predictions);
  }
}, [partialWord]);
```

### 2. Sentence Confidence Scoring

Rate how likely a sentence is grammatically correct:

```typescript
function scoreSentence(words: string[]): number {
  const structure = analyzeSentenceStructure(words);
  let score = 0;
  
  if (structure.hasSubject) score += 0.3;
  if (structure.hasVerb) score += 0.4;
  if (structure.hasObject) score += 0.3;
  
  return score;
}
```

### 3. Vocabulary Growth Tracking

Track user's vocabulary expansion over time:

```typescript
async function trackVocabularyGrowth() {
  const stats = await analyzeVocabulary();
  
  await supabase
    .from('vocabulary_stats')
    .insert({
      date: new Date().toISOString(),
      total_words: stats.totalWords,
      diversity: stats.vocabularyDiversity,
      avg_sentence_length: stats.preferredSentenceLength
    });
}
```

### 4. Adaptive Learning Rate

Adjust how quickly the system learns:

```typescript
function getAdaptiveLearningRate(userLevel: string): number {
  switch (userLevel) {
    case 'beginner': return 2.0; // Learn faster
    case 'intermediate': return 1.0; // Normal
    case 'advanced': return 0.5; // Learn slower
    default: return 1.0;
  }
}

// Apply in frequency updates
const learningRate = getAdaptiveLearningRate(userLevel);
frequency: Math.floor(1 * learningRate)
```

### 5. Suggestion Explanation

Explain why a suggestion was made:

```typescript
function explainSuggestion(suggestion: AdvancedSuggestion): string {
  switch (suggestion.type) {
    case 'common_phrase':
      return `This completes the common phrase: "${suggestion.context}"`;
    case 'preference':
      return `Based on your preference: ${suggestion.context}`;
    case 'temporal':
      return `You often use this at this time: ${suggestion.context}`;
    default:
      return suggestion.context || 'Suggested based on your usage';
  }
}
```

## Testing Integration

### Unit Tests

```typescript
// Test word variations
describe('Word Variations', () => {
  it('should generate verb tenses', () => {
    const variations = generateVerbVariations('want');
    expect(variations).toContain('wants');
    expect(variations).toContain('wanted');
    expect(variations).toContain('wanting');
  });
});

// Test sentence completion
describe('Sentence Completion', () => {
  it('should complete common phrases', () => {
    const completions = findSentenceCompletions(['I', 'want']);
    expect(completions).toContain('to go');
    expect(completions).toContain('to play');
  });
});
```

### Integration Tests

```typescript
// Test full suggestion flow
describe('AI Suggestions', () => {
  it('should provide suggestions for partial sentence', async () => {
    const { getAdvancedSuggestions } = useAdvancedAI();
    const suggestions = await getAdvancedSuggestions(
      ['I', 'want'],
      ['go', 'play', 'eat'],
      5
    );
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions[0]).toHaveProperty('text');
    expect(suggestions[0]).toHaveProperty('confidence');
  });
});
```

## Performance Monitoring

```typescript
// Add performance tracking
const startTime = performance.now();
const suggestions = await getAdvancedSuggestions(currentWords, availableWords);
const endTime = performance.now();
console.log(`Suggestions generated in ${endTime - startTime}ms`);

// Track suggestion accuracy
let suggestionsUsed = 0;
let suggestionsShown = 0;

const trackSuggestionUsage = (wasUsed: boolean) => {
  suggestionsShown++;
  if (wasUsed) suggestionsUsed++;
  
  const accuracy = suggestionsUsed / suggestionsShown;
  console.log(`Suggestion accuracy: ${(accuracy * 100).toFixed(1)}%`);
};
```

## Troubleshooting

### Common Issues

**Suggestions not appearing:**
- Check that `getAdvancedSuggestions` is being called
- Verify `availableWords` array is not empty
- Check console for errors

**Patterns not being learned:**
- Verify `recordUserInput` is called on speak
- Check database connection
- Verify user_patterns table exists

**Slow performance:**
- Reduce `maxSuggestions` parameter
- Enable caching for patterns
- Optimize database queries with indexes

**Incorrect tense suggestions:**
- Check tense detection logic
- Verify sentence context includes tense indicators
- Add more irregular verbs to database

## Support

For questions or issues:
1. Check console logs for errors
2. Review the AI_ENHANCEMENTS.md documentation
3. Test with the AI_QUICK_REFERENCE.md examples
4. Check database for pattern data

## Summary

The AI system is fully integrated and ready to use. It learns from every sentence, suggests intelligent completions, handles word variations, and adapts to user habits. All features work seamlessly behind the scenes with no UI changes required.
