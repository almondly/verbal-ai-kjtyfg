
/**
 * AAC Common Sentences Database
 * Based on official AAC resources and commonly used phrases
 * Organized by communication functions and contexts
 */

export interface AACSentence {
  text: string;
  category: string;
  context: string;
  frequency: 'high' | 'medium' | 'low';
}

// Comprehensive AAC sentence database from official AAC resources
export const aacSentences: AACSentence[] = [
  // Basic Needs - High Frequency
  { text: 'I need help', category: 'needs', context: 'requesting assistance', frequency: 'high' },
  { text: 'I need the toilet', category: 'needs', context: 'bathroom request', frequency: 'high' },
  { text: 'I need a break', category: 'needs', context: 'requesting pause', frequency: 'high' },
  { text: 'I need water', category: 'needs', context: 'requesting drink', frequency: 'high' },
  { text: 'I need food', category: 'needs', context: 'requesting food', frequency: 'high' },
  { text: 'I am hungry', category: 'needs', context: 'expressing hunger', frequency: 'high' },
  { text: 'I am thirsty', category: 'needs', context: 'expressing thirst', frequency: 'high' },
  { text: 'I am tired', category: 'needs', context: 'expressing fatigue', frequency: 'high' },
  { text: 'I am finished', category: 'needs', context: 'completion', frequency: 'high' },
  { text: 'I am ready', category: 'needs', context: 'readiness', frequency: 'high' },
  
  // Wants and Preferences - High Frequency
  { text: 'I want to go outside', category: 'wants', context: 'outdoor activity', frequency: 'high' },
  { text: 'I want to play', category: 'wants', context: 'play request', frequency: 'high' },
  { text: 'I want to watch TV', category: 'wants', context: 'entertainment', frequency: 'high' },
  { text: 'I want to go home', category: 'wants', context: 'location change', frequency: 'high' },
  { text: 'I want more', category: 'wants', context: 'requesting more', frequency: 'high' },
  { text: 'I want that', category: 'wants', context: 'pointing request', frequency: 'high' },
  { text: 'I want to eat', category: 'wants', context: 'meal request', frequency: 'high' },
  { text: 'I want to drink', category: 'wants', context: 'drink request', frequency: 'high' },
  { text: 'I want to sleep', category: 'wants', context: 'rest request', frequency: 'high' },
  { text: 'I want to read', category: 'wants', context: 'reading activity', frequency: 'high' },
  
  // Feelings and Emotions - High Frequency
  { text: 'I feel happy', category: 'feelings', context: 'positive emotion', frequency: 'high' },
  { text: 'I feel sad', category: 'feelings', context: 'negative emotion', frequency: 'high' },
  { text: 'I feel angry', category: 'feelings', context: 'frustration', frequency: 'high' },
  { text: 'I feel scared', category: 'feelings', context: 'fear', frequency: 'high' },
  { text: 'I feel excited', category: 'feelings', context: 'enthusiasm', frequency: 'high' },
  { text: 'I feel sick', category: 'feelings', context: 'illness', frequency: 'high' },
  { text: 'I feel hurt', category: 'feelings', context: 'pain', frequency: 'high' },
  { text: 'I feel worried', category: 'feelings', context: 'anxiety', frequency: 'high' },
  { text: 'I feel good', category: 'feelings', context: 'wellbeing', frequency: 'high' },
  { text: 'I feel bad', category: 'feelings', context: 'discomfort', frequency: 'high' },
  
  // Social Interaction - High Frequency
  { text: 'Hello', category: 'social', context: 'greeting', frequency: 'high' },
  { text: 'Goodbye', category: 'social', context: 'farewell', frequency: 'high' },
  { text: 'Thank you', category: 'social', context: 'gratitude', frequency: 'high' },
  { text: 'Please', category: 'social', context: 'polite request', frequency: 'high' },
  { text: 'Excuse me', category: 'social', context: 'attention', frequency: 'high' },
  { text: 'I am sorry', category: 'social', context: 'apology', frequency: 'high' },
  { text: 'Good morning', category: 'social', context: 'morning greeting', frequency: 'high' },
  { text: 'Good night', category: 'social', context: 'evening farewell', frequency: 'high' },
  { text: 'How are you', category: 'social', context: 'inquiry', frequency: 'high' },
  { text: 'I love you', category: 'social', context: 'affection', frequency: 'high' },
  
  // Questions - High Frequency
  { text: 'What is that', category: 'questions', context: 'identification', frequency: 'high' },
  { text: 'Where is it', category: 'questions', context: 'location', frequency: 'high' },
  { text: 'When do we go', category: 'questions', context: 'timing', frequency: 'high' },
  { text: 'Who is that', category: 'questions', context: 'person identification', frequency: 'high' },
  { text: 'Why not', category: 'questions', context: 'reasoning', frequency: 'high' },
  { text: 'How do I do it', category: 'questions', context: 'instruction', frequency: 'high' },
  { text: 'Can I have that', category: 'questions', context: 'permission', frequency: 'high' },
  { text: 'Can you help me', category: 'questions', context: 'assistance', frequency: 'high' },
  { text: 'What time is it', category: 'questions', context: 'time inquiry', frequency: 'high' },
  { text: 'Where are we going', category: 'questions', context: 'destination', frequency: 'high' },
  
  // Actions and Activities - Medium Frequency
  { text: 'Let me try', category: 'actions', context: 'attempting task', frequency: 'medium' },
  { text: 'I can do it', category: 'actions', context: 'independence', frequency: 'medium' },
  { text: 'I need help with this', category: 'actions', context: 'specific assistance', frequency: 'medium' },
  { text: 'Show me how', category: 'actions', context: 'learning', frequency: 'medium' },
  { text: 'I want to try again', category: 'actions', context: 'persistence', frequency: 'medium' },
  { text: 'I am working on it', category: 'actions', context: 'in progress', frequency: 'medium' },
  { text: 'I am done', category: 'actions', context: 'completion', frequency: 'medium' },
  { text: 'I am not finished', category: 'actions', context: 'continuation', frequency: 'medium' },
  { text: 'Wait for me', category: 'actions', context: 'requesting patience', frequency: 'medium' },
  { text: 'Come with me', category: 'actions', context: 'invitation', frequency: 'medium' },
  
  // School and Learning - Medium Frequency
  { text: 'I do not understand', category: 'school', context: 'confusion', frequency: 'medium' },
  { text: 'I need more time', category: 'school', context: 'pacing', frequency: 'medium' },
  { text: 'Can you repeat that', category: 'school', context: 'clarification', frequency: 'medium' },
  { text: 'I know the answer', category: 'school', context: 'participation', frequency: 'medium' },
  { text: 'I have a question', category: 'school', context: 'inquiry', frequency: 'medium' },
  { text: 'I am ready to learn', category: 'school', context: 'engagement', frequency: 'medium' },
  { text: 'I need a pencil', category: 'school', context: 'materials', frequency: 'medium' },
  { text: 'I need paper', category: 'school', context: 'materials', frequency: 'medium' },
  { text: 'Can I go to the library', category: 'school', context: 'location request', frequency: 'medium' },
  { text: 'I finished my work', category: 'school', context: 'task completion', frequency: 'medium' },
  
  // Family and Home - Medium Frequency
  { text: 'Where is mum', category: 'family', context: 'parent location', frequency: 'medium' },
  { text: 'Where is dad', category: 'family', context: 'parent location', frequency: 'medium' },
  { text: 'I want mum', category: 'family', context: 'parent request', frequency: 'medium' },
  { text: 'I want dad', category: 'family', context: 'parent request', frequency: 'medium' },
  { text: 'I miss you', category: 'family', context: 'affection', frequency: 'medium' },
  { text: 'I love my family', category: 'family', context: 'affection', frequency: 'medium' },
  { text: 'Can I call home', category: 'family', context: 'communication', frequency: 'medium' },
  { text: 'I want to go to my room', category: 'family', context: 'privacy', frequency: 'medium' },
  { text: 'I want to watch a movie', category: 'family', context: 'entertainment', frequency: 'medium' },
  { text: 'Can we play together', category: 'family', context: 'interaction', frequency: 'medium' },
  
  // Food and Meals - Medium Frequency
  { text: 'What is for lunch', category: 'food', context: 'meal inquiry', frequency: 'medium' },
  { text: 'What is for dinner', category: 'food', context: 'meal inquiry', frequency: 'medium' },
  { text: 'I like this food', category: 'food', context: 'preference', frequency: 'medium' },
  { text: 'I do not like this', category: 'food', context: 'dislike', frequency: 'medium' },
  { text: 'Can I have more', category: 'food', context: 'seconds', frequency: 'medium' },
  { text: 'I am full', category: 'food', context: 'satiation', frequency: 'medium' },
  { text: 'Can I have a snack', category: 'food', context: 'snack request', frequency: 'medium' },
  { text: 'I want something different', category: 'food', context: 'alternative', frequency: 'medium' },
  { text: 'This tastes good', category: 'food', context: 'enjoyment', frequency: 'medium' },
  { text: 'I need a drink', category: 'food', context: 'beverage request', frequency: 'medium' },
  
  // Play and Recreation - Medium Frequency
  { text: 'Can I play with you', category: 'play', context: 'social play', frequency: 'medium' },
  { text: 'I want to play outside', category: 'play', context: 'outdoor play', frequency: 'medium' },
  { text: 'Can we go to the park', category: 'play', context: 'location request', frequency: 'medium' },
  { text: 'I want my toy', category: 'play', context: 'object request', frequency: 'medium' },
  { text: 'Let us play a game', category: 'play', context: 'activity suggestion', frequency: 'medium' },
  { text: 'I want to swing', category: 'play', context: 'playground activity', frequency: 'medium' },
  { text: 'I want to slide', category: 'play', context: 'playground activity', frequency: 'medium' },
  { text: 'Can I ride my bike', category: 'play', context: 'activity request', frequency: 'medium' },
  { text: 'I want to draw', category: 'play', context: 'creative activity', frequency: 'medium' },
  { text: 'I want to build', category: 'play', context: 'construction play', frequency: 'medium' },
  
  // Choices and Decisions - Medium Frequency
  { text: 'I choose this one', category: 'choices', context: 'selection', frequency: 'medium' },
  { text: 'I want the other one', category: 'choices', context: 'alternative', frequency: 'medium' },
  { text: 'I do not want that', category: 'choices', context: 'rejection', frequency: 'medium' },
  { text: 'Can I pick', category: 'choices', context: 'decision making', frequency: 'medium' },
  { text: 'I like this better', category: 'choices', context: 'preference', frequency: 'medium' },
  { text: 'I want something else', category: 'choices', context: 'alternative', frequency: 'medium' },
  { text: 'This is my favourite', category: 'choices', context: 'strong preference', frequency: 'medium' },
  { text: 'I do not know', category: 'choices', context: 'uncertainty', frequency: 'medium' },
  { text: 'Let me think', category: 'choices', context: 'deliberation', frequency: 'medium' },
  { text: 'I changed my mind', category: 'choices', context: 'revision', frequency: 'medium' },
  
  // Time and Routines - Low Frequency
  { text: 'Is it time to go', category: 'time', context: 'departure', frequency: 'low' },
  { text: 'When do we leave', category: 'time', context: 'schedule', frequency: 'low' },
  { text: 'I want to stay longer', category: 'time', context: 'extension', frequency: 'low' },
  { text: 'I am not ready yet', category: 'time', context: 'delay', frequency: 'low' },
  { text: 'Can we do it later', category: 'time', context: 'postponement', frequency: 'low' },
  { text: 'I want to do it now', category: 'time', context: 'immediacy', frequency: 'low' },
  { text: 'What are we doing today', category: 'time', context: 'schedule inquiry', frequency: 'low' },
  { text: 'What are we doing next', category: 'time', context: 'sequence', frequency: 'low' },
  { text: 'Is it morning', category: 'time', context: 'time of day', frequency: 'low' },
  { text: 'Is it bedtime', category: 'time', context: 'routine', frequency: 'low' },
  
  // Medical and Health - Low Frequency
  { text: 'My tummy hurts', category: 'health', context: 'pain location', frequency: 'low' },
  { text: 'My head hurts', category: 'health', context: 'pain location', frequency: 'low' },
  { text: 'I do not feel well', category: 'health', context: 'illness', frequency: 'low' },
  { text: 'I need medicine', category: 'health', context: 'treatment', frequency: 'low' },
  { text: 'I need a bandaid', category: 'health', context: 'first aid', frequency: 'low' },
  { text: 'I fell down', category: 'health', context: 'injury', frequency: 'low' },
  { text: 'I bumped my head', category: 'health', context: 'injury', frequency: 'low' },
  { text: 'I need to rest', category: 'health', context: 'recovery', frequency: 'low' },
  { text: 'I feel better now', category: 'health', context: 'improvement', frequency: 'low' },
  { text: 'I need to see the doctor', category: 'health', context: 'medical care', frequency: 'low' },
  
  // Sensory and Comfort - Low Frequency
  { text: 'It is too loud', category: 'sensory', context: 'auditory sensitivity', frequency: 'low' },
  { text: 'It is too bright', category: 'sensory', context: 'visual sensitivity', frequency: 'low' },
  { text: 'I need quiet', category: 'sensory', context: 'sensory regulation', frequency: 'low' },
  { text: 'I need space', category: 'sensory', context: 'personal space', frequency: 'low' },
  { text: 'It is too hot', category: 'sensory', context: 'temperature', frequency: 'low' },
  { text: 'It is too cold', category: 'sensory', context: 'temperature', frequency: 'low' },
  { text: 'I need my blanket', category: 'sensory', context: 'comfort object', frequency: 'low' },
  { text: 'I need a hug', category: 'sensory', context: 'physical comfort', frequency: 'low' },
  { text: 'That feels nice', category: 'sensory', context: 'pleasant sensation', frequency: 'low' },
  { text: 'I do not like that feeling', category: 'sensory', context: 'unpleasant sensation', frequency: 'low' },
  
  // Problem Solving - Low Frequency
  { text: 'I have a problem', category: 'problem', context: 'issue identification', frequency: 'low' },
  { text: 'Something is wrong', category: 'problem', context: 'alert', frequency: 'low' },
  { text: 'I need to fix this', category: 'problem', context: 'repair', frequency: 'low' },
  { text: 'It is broken', category: 'problem', context: 'damage', frequency: 'low' },
  { text: 'I made a mistake', category: 'problem', context: 'error', frequency: 'low' },
  { text: 'Can you fix it', category: 'problem', context: 'assistance request', frequency: 'low' },
  { text: 'I will try a different way', category: 'problem', context: 'alternative approach', frequency: 'low' },
  { text: 'I need to think about it', category: 'problem', context: 'reflection', frequency: 'low' },
  { text: 'I found a solution', category: 'problem', context: 'resolution', frequency: 'low' },
  { text: 'I need help solving this', category: 'problem', context: 'collaborative problem solving', frequency: 'low' },
  
  // Advanced Social - Low Frequency
  { text: 'Can I tell you something', category: 'social', context: 'sharing information', frequency: 'low' },
  { text: 'I have something to say', category: 'social', context: 'communication intent', frequency: 'low' },
  { text: 'Listen to me', category: 'social', context: 'attention request', frequency: 'low' },
  { text: 'I want to share', category: 'social', context: 'sharing', frequency: 'low' },
  { text: 'Can I have a turn', category: 'social', context: 'turn taking', frequency: 'low' },
  { text: 'It is my turn', category: 'social', context: 'turn claiming', frequency: 'low' },
  { text: 'You can have a turn', category: 'social', context: 'turn giving', frequency: 'low' },
  { text: 'Let us take turns', category: 'social', context: 'cooperation', frequency: 'low' },
  { text: 'I want to be friends', category: 'social', context: 'friendship', frequency: 'low' },
  { text: 'You are my friend', category: 'social', context: 'affirmation', frequency: 'low' },
];

/**
 * Get AAC sentences by category
 */
export function getAACSentencesByCategory(category: string): AACSentence[] {
  return aacSentences.filter(s => s.category === category);
}

/**
 * Get AAC sentences by frequency
 */
export function getAACSentencesByFrequency(frequency: 'high' | 'medium' | 'low'): AACSentence[] {
  return aacSentences.filter(s => s.frequency === frequency);
}

/**
 * Get AAC sentences by context
 */
export function getAACSentencesByContext(context: string): AACSentence[] {
  return aacSentences.filter(s => s.context.toLowerCase().includes(context.toLowerCase()));
}

/**
 * Search AAC sentences
 */
export function searchAACSentences(query: string): AACSentence[] {
  const lowerQuery = query.toLowerCase();
  return aacSentences.filter(s => 
    s.text.toLowerCase().includes(lowerQuery) ||
    s.category.toLowerCase().includes(lowerQuery) ||
    s.context.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get random AAC sentences
 */
export function getRandomAACSentences(count: number = 5): AACSentence[] {
  const shuffled = [...aacSentences].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Get contextually relevant AAC sentences based on current words
 */
export function getContextualAACSentences(currentWords: string[], maxResults: number = 5): string[] {
  if (currentWords.length === 0) {
    // Return high-frequency sentences if no context
    return getAACSentencesByFrequency('high')
      .slice(0, maxResults)
      .map(s => s.text);
  }
  
  const currentText = currentWords.join(' ').toLowerCase();
  const results: { sentence: string; score: number }[] = [];
  
  aacSentences.forEach(aacSentence => {
    let score = 0;
    const sentenceLower = aacSentence.text.toLowerCase();
    
    // Exact match or starts with current text
    if (sentenceLower.startsWith(currentText)) {
      score += 100;
    }
    
    // Contains current words
    currentWords.forEach(word => {
      if (sentenceLower.includes(word.toLowerCase())) {
        score += 20;
      }
    });
    
    // Frequency boost
    if (aacSentence.frequency === 'high') score += 30;
    else if (aacSentence.frequency === 'medium') score += 15;
    
    // Context relevance
    currentWords.forEach(word => {
      if (aacSentence.context.toLowerCase().includes(word.toLowerCase())) {
        score += 10;
      }
    });
    
    if (score > 0) {
      results.push({ sentence: aacSentence.text, score });
    }
  });
  
  // Sort by score and return top results
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(r => r.sentence);
}
