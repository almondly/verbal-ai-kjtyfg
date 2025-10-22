
/**
 * AAC Common Sentences Database
 * Based on official AAC resources and commonly used phrases
 * Organized by communication functions and contexts
 * ENHANCED: Now includes diverse subjects (I, You, He, She, We, They, Mum, Dad, etc.)
 * ULTRA-ENHANCED: Prioritized sentences for better AI predictions
 */

export interface AACSentence {
  text: string;
  category: string;
  context: string;
  frequency: 'high' | 'medium' | 'low';
  priority?: number; // NEW: Higher priority = more likely to be suggested
}

// ULTRA-HIGH PRIORITY SENTENCES - These should appear most frequently
const ultraHighPrioritySentences: AACSentence[] = [
  // Core communication needs
  { text: 'I want water', category: 'needs', context: 'requesting water', frequency: 'high', priority: 100 },
  { text: 'I need help', category: 'needs', context: 'requesting assistance', frequency: 'high', priority: 100 },
  { text: 'I\'m hungry', category: 'needs', context: 'expressing hunger', frequency: 'high', priority: 100 },
  { text: 'I need the bathroom', category: 'needs', context: 'bathroom request', frequency: 'high', priority: 100 },
  
  // Greetings and social
  { text: 'Hi', category: 'social', context: 'greeting', frequency: 'high', priority: 100 },
  { text: 'How are you', category: 'social', context: 'inquiry', frequency: 'high', priority: 100 },
  { text: 'Thank you', category: 'social', context: 'gratitude', frequency: 'high', priority: 100 },
  { text: 'Goodbye', category: 'social', context: 'farewell', frequency: 'high', priority: 100 },
  { text: 'Sorry', category: 'social', context: 'apology', frequency: 'high', priority: 100 },
  
  // Emotions
  { text: 'I feel happy', category: 'feelings', context: 'positive emotion', frequency: 'high', priority: 100 },
  { text: 'I\'m tired', category: 'feelings', context: 'fatigue', frequency: 'high', priority: 100 },
  { text: 'I\'m sick', category: 'feelings', context: 'illness', frequency: 'high', priority: 100 },
  
  // Preferences
  { text: 'I don\'t like this', category: 'choices', context: 'dislike', frequency: 'high', priority: 100 },
  { text: 'Can I have that', category: 'questions', context: 'permission', frequency: 'high', priority: 100 },
  
  // Questions
  { text: 'What is that', category: 'questions', context: 'identification', frequency: 'high', priority: 100 },
  { text: 'Where are we going', category: 'questions', context: 'destination', frequency: 'high', priority: 100 },
  { text: 'Who is that', category: 'questions', context: 'person identification', frequency: 'high', priority: 100 },
  
  // Descriptions
  { text: 'It is big', category: 'descriptions', context: 'size description', frequency: 'high', priority: 100 },
  { text: 'I see a dog', category: 'observations', context: 'observation', frequency: 'high', priority: 100 },
  { text: 'That is loud', category: 'observations', context: 'sound observation', frequency: 'high', priority: 100 },
  
  // Requests
  { text: 'More, please', category: 'requests', context: 'requesting more', frequency: 'high', priority: 100 },
  { text: 'All done', category: 'statements', context: 'completion', frequency: 'high', priority: 100 },
  { text: 'Yes', category: 'responses', context: 'affirmation', frequency: 'high', priority: 100 },
  { text: 'No', category: 'responses', context: 'negation', frequency: 'high', priority: 100 },
  
  // Activities
  { text: 'Let\'s play a game', category: 'play', context: 'activity suggestion', frequency: 'high', priority: 100 },
  { text: 'I want to go outside', category: 'wants', context: 'outdoor activity', frequency: 'high', priority: 100 },
  { text: 'I am reading a book', category: 'activities', context: 'reading activity', frequency: 'high', priority: 100 },
  { text: 'We are eating now', category: 'activities', context: 'meal time', frequency: 'high', priority: 100 },
  { text: 'Turn the page', category: 'instructions', context: 'reading instruction', frequency: 'high', priority: 100 },
  
  // School
  { text: 'I need a break', category: 'needs', context: 'requesting pause', frequency: 'high', priority: 100 },
  { text: 'I finished my work', category: 'school', context: 'task completion', frequency: 'high', priority: 100 },
  { text: 'I don\'t understand', category: 'school', context: 'confusion', frequency: 'high', priority: 100 },
  { text: 'I need a pencil', category: 'school', context: 'materials', frequency: 'high', priority: 100 },
  { text: 'Let\'s do math', category: 'school', context: 'subject activity', frequency: 'high', priority: 100 },
];

// Comprehensive AAC sentence database from official AAC resources
export const aacSentences: AACSentence[] = [
  // Include ultra-high priority sentences first
  ...ultraHighPrioritySentences,
  
  // Basic Needs - High Frequency (I)
  { text: 'I need the toilet', category: 'needs', context: 'bathroom request', frequency: 'high', priority: 95 },
  { text: 'I need food', category: 'needs', context: 'requesting food', frequency: 'high', priority: 90 },
  { text: 'I am thirsty', category: 'needs', context: 'expressing thirst', frequency: 'high', priority: 90 },
  { text: 'I am finished', category: 'needs', context: 'completion', frequency: 'high', priority: 85 },
  { text: 'I am ready', category: 'needs', context: 'readiness', frequency: 'high', priority: 85 },
  
  // Basic Needs - High Frequency (He/She)
  { text: 'He needs help', category: 'needs', context: 'requesting assistance for him', frequency: 'high', priority: 80 },
  { text: 'She needs help', category: 'needs', context: 'requesting assistance for her', frequency: 'high', priority: 80 },
  { text: 'He needs the toilet', category: 'needs', context: 'bathroom request for him', frequency: 'high', priority: 75 },
  { text: 'She needs the toilet', category: 'needs', context: 'bathroom request for her', frequency: 'high', priority: 75 },
  { text: 'He is hungry', category: 'needs', context: 'expressing his hunger', frequency: 'high', priority: 75 },
  { text: 'She is hungry', category: 'needs', context: 'expressing her hunger', frequency: 'high', priority: 75 },
  { text: 'He is thirsty', category: 'needs', context: 'expressing his thirst', frequency: 'high', priority: 70 },
  { text: 'She is thirsty', category: 'needs', context: 'expressing her thirst', frequency: 'high', priority: 70 },
  { text: 'He is tired', category: 'needs', context: 'expressing his fatigue', frequency: 'high', priority: 70 },
  { text: 'She is tired', category: 'needs', context: 'expressing her fatigue', frequency: 'high', priority: 70 },
  
  // Basic Needs - High Frequency (We/They)
  { text: 'We need help', category: 'needs', context: 'requesting assistance for us', frequency: 'high', priority: 75 },
  { text: 'They need help', category: 'needs', context: 'requesting assistance for them', frequency: 'high', priority: 70 },
  { text: 'We are hungry', category: 'needs', context: 'expressing our hunger', frequency: 'high', priority: 70 },
  { text: 'They are hungry', category: 'needs', context: 'expressing their hunger', frequency: 'high', priority: 65 },
  { text: 'We are tired', category: 'needs', context: 'expressing our fatigue', frequency: 'high', priority: 65 },
  { text: 'They are tired', category: 'needs', context: 'expressing their fatigue', frequency: 'high', priority: 60 },
  { text: 'We are ready', category: 'needs', context: 'expressing our readiness', frequency: 'high', priority: 65 },
  { text: 'They are ready', category: 'needs', context: 'expressing their readiness', frequency: 'high', priority: 60 },
  
  // Basic Needs - High Frequency (Mum/Dad)
  { text: 'Mum needs help', category: 'needs', context: 'requesting assistance for mum', frequency: 'high', priority: 70 },
  { text: 'Dad needs help', category: 'needs', context: 'requesting assistance for dad', frequency: 'high', priority: 70 },
  { text: 'Mum is tired', category: 'needs', context: 'expressing mum is tired', frequency: 'high', priority: 65 },
  { text: 'Dad is tired', category: 'needs', context: 'expressing dad is tired', frequency: 'high', priority: 65 },
  
  // Wants and Preferences - High Frequency (I)
  { text: 'I want to play', category: 'wants', context: 'play request', frequency: 'high', priority: 85 },
  { text: 'I want to watch TV', category: 'wants', context: 'entertainment', frequency: 'high', priority: 80 },
  { text: 'I want to go home', category: 'wants', context: 'location change', frequency: 'high', priority: 85 },
  { text: 'I want more', category: 'wants', context: 'requesting more', frequency: 'high', priority: 90 },
  { text: 'I want that', category: 'wants', context: 'pointing request', frequency: 'high', priority: 85 },
  { text: 'I want to eat', category: 'wants', context: 'meal request', frequency: 'high', priority: 80 },
  { text: 'I want to drink', category: 'wants', context: 'drink request', frequency: 'high', priority: 80 },
  { text: 'I want to sleep', category: 'wants', context: 'rest request', frequency: 'high', priority: 75 },
  { text: 'I want to read', category: 'wants', context: 'reading activity', frequency: 'high', priority: 75 },
  
  // Wants and Preferences - High Frequency (He/She)
  { text: 'He wants to play', category: 'wants', context: 'play request for him', frequency: 'high', priority: 75 },
  { text: 'She wants to play', category: 'wants', context: 'play request for her', frequency: 'high', priority: 75 },
  { text: 'He wants to go outside', category: 'wants', context: 'outdoor activity for him', frequency: 'high', priority: 70 },
  { text: 'She wants to go outside', category: 'wants', context: 'outdoor activity for her', frequency: 'high', priority: 70 },
  { text: 'He wants that', category: 'wants', context: 'pointing request for him', frequency: 'high', priority: 70 },
  { text: 'She wants that', category: 'wants', context: 'pointing request for her', frequency: 'high', priority: 70 },
  { text: 'He wants more', category: 'wants', context: 'requesting more for him', frequency: 'high', priority: 70 },
  { text: 'She wants more', category: 'wants', context: 'requesting more for her', frequency: 'high', priority: 70 },
  
  // Wants and Preferences - High Frequency (We/They)
  { text: 'We want to play', category: 'wants', context: 'play request for us', frequency: 'high', priority: 75 },
  { text: 'They want to play', category: 'wants', context: 'play request for them', frequency: 'high', priority: 70 },
  { text: 'We want to go outside', category: 'wants', context: 'outdoor activity for us', frequency: 'high', priority: 75 },
  { text: 'They want to go outside', category: 'wants', context: 'outdoor activity for them', frequency: 'high', priority: 70 },
  { text: 'We want to go home', category: 'wants', context: 'location change for us', frequency: 'high', priority: 75 },
  { text: 'They want to go home', category: 'wants', context: 'location change for them', frequency: 'high', priority: 70 },
  
  // Wants and Preferences - High Frequency (Mum/Dad/My)
  { text: 'Mum wants to go', category: 'wants', context: 'mum wants to leave', frequency: 'high', priority: 70 },
  { text: 'Dad wants to go', category: 'wants', context: 'dad wants to leave', frequency: 'high', priority: 70 },
  { text: 'My sister wants to play', category: 'wants', context: 'sister play request', frequency: 'high', priority: 70 },
  { text: 'My brother wants to play', category: 'wants', context: 'brother play request', frequency: 'high', priority: 70 },
  { text: 'My friend wants that', category: 'wants', context: 'friend wants something', frequency: 'high', priority: 65 },
  
  // Feelings and Emotions - High Frequency (I)
  { text: 'I feel sad', category: 'feelings', context: 'negative emotion', frequency: 'high', priority: 85 },
  { text: 'I feel angry', category: 'feelings', context: 'frustration', frequency: 'high', priority: 80 },
  { text: 'I feel scared', category: 'feelings', context: 'fear', frequency: 'high', priority: 80 },
  { text: 'I feel excited', category: 'feelings', context: 'enthusiasm', frequency: 'high', priority: 80 },
  { text: 'I feel hurt', category: 'feelings', context: 'pain', frequency: 'high', priority: 75 },
  { text: 'I feel worried', category: 'feelings', context: 'anxiety', frequency: 'high', priority: 75 },
  { text: 'I feel good', category: 'feelings', context: 'wellbeing', frequency: 'high', priority: 80 },
  { text: 'I feel bad', category: 'feelings', context: 'discomfort', frequency: 'high', priority: 75 },
  
  // Feelings and Emotions - High Frequency (He/She)
  { text: 'He feels happy', category: 'feelings', context: 'his positive emotion', frequency: 'high', priority: 70 },
  { text: 'She feels happy', category: 'feelings', context: 'her positive emotion', frequency: 'high', priority: 70 },
  { text: 'He feels sad', category: 'feelings', context: 'his negative emotion', frequency: 'high', priority: 70 },
  { text: 'She feels sad', category: 'feelings', context: 'her negative emotion', frequency: 'high', priority: 70 },
  { text: 'He is happy', category: 'feelings', context: 'he is happy', frequency: 'high', priority: 70 },
  { text: 'She is happy', category: 'feelings', context: 'she is happy', frequency: 'high', priority: 70 },
  { text: 'He is sad', category: 'feelings', context: 'he is sad', frequency: 'high', priority: 70 },
  { text: 'She is sad', category: 'feelings', context: 'she is sad', frequency: 'high', priority: 70 },
  
  // Feelings and Emotions - High Frequency (We/They)
  { text: 'We feel happy', category: 'feelings', context: 'our positive emotion', frequency: 'high', priority: 70 },
  { text: 'They feel happy', category: 'feelings', context: 'their positive emotion', frequency: 'high', priority: 65 },
  { text: 'We are happy', category: 'feelings', context: 'we are happy', frequency: 'high', priority: 70 },
  { text: 'They are happy', category: 'feelings', context: 'they are happy', frequency: 'high', priority: 65 },
  { text: 'We feel sad', category: 'feelings', context: 'our negative emotion', frequency: 'high', priority: 65 },
  { text: 'They feel sad', category: 'feelings', context: 'their negative emotion', frequency: 'high', priority: 60 },
  
  // Feelings and Emotions - High Frequency (Mum/Dad/My)
  { text: 'Mum is happy', category: 'feelings', context: 'mum is happy', frequency: 'high', priority: 65 },
  { text: 'Dad is happy', category: 'feelings', context: 'dad is happy', frequency: 'high', priority: 65 },
  { text: 'My sister is sad', category: 'feelings', context: 'sister is sad', frequency: 'high', priority: 60 },
  { text: 'My brother is sad', category: 'feelings', context: 'brother is sad', frequency: 'high', priority: 60 },
  
  // Social Interaction - High Frequency
  { text: 'Hello', category: 'social', context: 'greeting', frequency: 'high', priority: 90 },
  { text: 'Please', category: 'social', context: 'polite request', frequency: 'high', priority: 90 },
  { text: 'Excuse me', category: 'social', context: 'attention', frequency: 'high', priority: 85 },
  { text: 'I am sorry', category: 'social', context: 'apology', frequency: 'high', priority: 85 },
  { text: 'Good morning', category: 'social', context: 'morning greeting', frequency: 'high', priority: 80 },
  { text: 'Good night', category: 'social', context: 'evening farewell', frequency: 'high', priority: 80 },
  { text: 'I love you', category: 'social', context: 'affection', frequency: 'high', priority: 85 },
  { text: 'He says hello', category: 'social', context: 'greeting from him', frequency: 'high', priority: 65 },
  { text: 'She says hello', category: 'social', context: 'greeting from her', frequency: 'high', priority: 65 },
  { text: 'We love you', category: 'social', context: 'affection from us', frequency: 'high', priority: 70 },
  { text: 'They say thank you', category: 'social', context: 'gratitude from them', frequency: 'high', priority: 65 },
  
  // Questions - High Frequency (with diverse subjects)
  { text: 'Where is it', category: 'questions', context: 'location', frequency: 'high', priority: 85 },
  { text: 'When do we go', category: 'questions', context: 'timing', frequency: 'high', priority: 80 },
  { text: 'Why not', category: 'questions', context: 'reasoning', frequency: 'high', priority: 75 },
  { text: 'How do I do it', category: 'questions', context: 'instruction', frequency: 'high', priority: 75 },
  { text: 'Can you help me', category: 'questions', context: 'assistance', frequency: 'high', priority: 90 },
  { text: 'What time is it', category: 'questions', context: 'time inquiry', frequency: 'high', priority: 80 },
  { text: 'Can he come', category: 'questions', context: 'permission for him', frequency: 'high', priority: 70 },
  { text: 'Can she come', category: 'questions', context: 'permission for her', frequency: 'high', priority: 70 },
  { text: 'Can we go', category: 'questions', context: 'permission for us', frequency: 'high', priority: 80 },
  { text: 'Can they play', category: 'questions', context: 'permission for them', frequency: 'high', priority: 70 },
  { text: 'Where is mum', category: 'questions', context: 'location of mum', frequency: 'high', priority: 80 },
  { text: 'Where is dad', category: 'questions', context: 'location of dad', frequency: 'high', priority: 80 },
  { text: 'Where is my sister', category: 'questions', context: 'location of sister', frequency: 'high', priority: 70 },
  { text: 'Where is my brother', category: 'questions', context: 'location of brother', frequency: 'high', priority: 70 },
  
  // Actions and Activities - Medium Frequency (diverse subjects)
  { text: 'Let me try', category: 'actions', context: 'attempting task', frequency: 'medium', priority: 70 },
  { text: 'I can do it', category: 'actions', context: 'independence', frequency: 'medium', priority: 75 },
  { text: 'He can do it', category: 'actions', context: 'his independence', frequency: 'medium', priority: 65 },
  { text: 'She can do it', category: 'actions', context: 'her independence', frequency: 'medium', priority: 65 },
  { text: 'We can do it', category: 'actions', context: 'our independence', frequency: 'medium', priority: 70 },
  { text: 'They can do it', category: 'actions', context: 'their independence', frequency: 'medium', priority: 60 },
  { text: 'I need help with this', category: 'actions', context: 'specific assistance', frequency: 'medium', priority: 75 },
  { text: 'Show me how', category: 'actions', context: 'learning', frequency: 'medium', priority: 70 },
  { text: 'I want to try again', category: 'actions', context: 'persistence', frequency: 'medium', priority: 65 },
  { text: 'I am working on it', category: 'actions', context: 'in progress', frequency: 'medium', priority: 65 },
  { text: 'He is working on it', category: 'actions', context: 'he is working', frequency: 'medium', priority: 55 },
  { text: 'She is working on it', category: 'actions', context: 'she is working', frequency: 'medium', priority: 55 },
  { text: 'I am done', category: 'actions', context: 'completion', frequency: 'medium', priority: 70 },
  { text: 'I am not finished', category: 'actions', context: 'continuation', frequency: 'medium', priority: 65 },
  { text: 'Wait for me', category: 'actions', context: 'requesting patience', frequency: 'medium', priority: 65 },
  { text: 'Come with me', category: 'actions', context: 'invitation', frequency: 'medium', priority: 65 },
  { text: 'Go with him', category: 'actions', context: 'instruction to go with him', frequency: 'medium', priority: 55 },
  { text: 'Go with her', category: 'actions', context: 'instruction to go with her', frequency: 'medium', priority: 55 },
  
  // School and Learning - Medium Frequency
  { text: 'I need more time', category: 'school', context: 'pacing', frequency: 'medium', priority: 70 },
  { text: 'Can you repeat that', category: 'school', context: 'clarification', frequency: 'medium', priority: 70 },
  { text: 'I know the answer', category: 'school', context: 'participation', frequency: 'medium', priority: 65 },
  { text: 'I have a question', category: 'school', context: 'inquiry', frequency: 'medium', priority: 70 },
  { text: 'I am ready to learn', category: 'school', context: 'engagement', frequency: 'medium', priority: 65 },
  { text: 'I need paper', category: 'school', context: 'materials', frequency: 'medium', priority: 65 },
  { text: 'Can I go to the library', category: 'school', context: 'location request', frequency: 'medium', priority: 60 },
  { text: 'He finished his work', category: 'school', context: 'his task completion', frequency: 'medium', priority: 60 },
  { text: 'She finished her work', category: 'school', context: 'her task completion', frequency: 'medium', priority: 60 },
  { text: 'We finished our work', category: 'school', context: 'our task completion', frequency: 'medium', priority: 65 },
  
  // Family and Home - Medium Frequency (enhanced with diverse subjects)
  { text: 'I want mum', category: 'family', context: 'parent request', frequency: 'medium', priority: 75 },
  { text: 'I want dad', category: 'family', context: 'parent request', frequency: 'medium', priority: 75 },
  { text: 'I miss you', category: 'family', context: 'affection', frequency: 'medium', priority: 70 },
  { text: 'I love my family', category: 'family', context: 'affection', frequency: 'medium', priority: 70 },
  { text: 'Can I call home', category: 'family', context: 'communication', frequency: 'medium', priority: 65 },
  { text: 'I want to go to my room', category: 'family', context: 'privacy', frequency: 'medium', priority: 65 },
  { text: 'I want to watch a movie', category: 'family', context: 'entertainment', frequency: 'medium', priority: 70 },
  { text: 'Can we play together', category: 'family', context: 'interaction', frequency: 'medium', priority: 70 },
  { text: 'My sister is here', category: 'family', context: 'sister presence', frequency: 'medium', priority: 60 },
  { text: 'My brother is here', category: 'family', context: 'brother presence', frequency: 'medium', priority: 60 },
  { text: 'My sister wants to play', category: 'family', context: 'sister play request', frequency: 'medium', priority: 65 },
  { text: 'My brother wants to play', category: 'family', context: 'brother play request', frequency: 'medium', priority: 65 },
  { text: 'Mum is at home', category: 'family', context: 'mum location', frequency: 'medium', priority: 65 },
  { text: 'Dad is at work', category: 'family', context: 'dad location', frequency: 'medium', priority: 65 },
  { text: 'My friend is coming', category: 'family', context: 'friend arrival', frequency: 'medium', priority: 65 },
  
  // Food and Meals - Medium Frequency
  { text: 'What is for lunch', category: 'food', context: 'meal inquiry', frequency: 'medium', priority: 70 },
  { text: 'What is for dinner', category: 'food', context: 'meal inquiry', frequency: 'medium', priority: 70 },
  { text: 'I like this food', category: 'food', context: 'preference', frequency: 'medium', priority: 65 },
  { text: 'I do not like this', category: 'food', context: 'dislike', frequency: 'medium', priority: 70 },
  { text: 'Can I have more', category: 'food', context: 'seconds', frequency: 'medium', priority: 75 },
  { text: 'I am full', category: 'food', context: 'satiation', frequency: 'medium', priority: 70 },
  { text: 'Can I have a snack', category: 'food', context: 'snack request', frequency: 'medium', priority: 75 },
  { text: 'I want something different', category: 'food', context: 'alternative', frequency: 'medium', priority: 65 },
  { text: 'This tastes good', category: 'food', context: 'enjoyment', frequency: 'medium', priority: 65 },
  { text: 'I need a drink', category: 'food', context: 'beverage request', frequency: 'medium', priority: 75 },
  { text: 'He wants a snack', category: 'food', context: 'his snack request', frequency: 'medium', priority: 60 },
  { text: 'She wants a snack', category: 'food', context: 'her snack request', frequency: 'medium', priority: 60 },
  { text: 'We are hungry', category: 'food', context: 'our hunger', frequency: 'medium', priority: 70 },
  { text: 'They are thirsty', category: 'food', context: 'their thirst', frequency: 'medium', priority: 60 },
  
  // Play and Recreation - Medium Frequency (diverse subjects)
  { text: 'Can I play with you', category: 'play', context: 'social play', frequency: 'medium', priority: 70 },
  { text: 'I want to play outside', category: 'play', context: 'outdoor play', frequency: 'medium', priority: 75 },
  { text: 'Can we go to the park', category: 'play', context: 'location request', frequency: 'medium', priority: 75 },
  { text: 'I want my toy', category: 'play', context: 'object request', frequency: 'medium', priority: 70 },
  { text: 'I want to swing', category: 'play', context: 'playground activity', frequency: 'medium', priority: 65 },
  { text: 'I want to slide', category: 'play', context: 'playground activity', frequency: 'medium', priority: 65 },
  { text: 'Can I ride my bike', category: 'play', context: 'activity request', frequency: 'medium', priority: 65 },
  { text: 'I want to draw', category: 'play', context: 'creative activity', frequency: 'medium', priority: 65 },
  { text: 'I want to build', category: 'play', context: 'construction play', frequency: 'medium', priority: 60 },
  { text: 'He wants to play', category: 'play', context: 'his play request', frequency: 'medium', priority: 65 },
  { text: 'She wants to play', category: 'play', context: 'her play request', frequency: 'medium', priority: 65 },
  { text: 'We can play together', category: 'play', context: 'group play', frequency: 'medium', priority: 70 },
  { text: 'They are playing', category: 'play', context: 'their play activity', frequency: 'medium', priority: 60 },
  { text: 'My friend can play', category: 'play', context: 'friend play permission', frequency: 'medium', priority: 60 },
  
  // Choices and Decisions - Medium Frequency
  { text: 'I choose this one', category: 'choices', context: 'selection', frequency: 'medium', priority: 65 },
  { text: 'I want the other one', category: 'choices', context: 'alternative', frequency: 'medium', priority: 65 },
  { text: 'I do not want that', category: 'choices', context: 'rejection', frequency: 'medium', priority: 70 },
  { text: 'Can I pick', category: 'choices', context: 'decision making', frequency: 'medium', priority: 65 },
  { text: 'I like this better', category: 'choices', context: 'preference', frequency: 'medium', priority: 65 },
  { text: 'I want something else', category: 'choices', context: 'alternative', frequency: 'medium', priority: 65 },
  { text: 'This is my favourite', category: 'choices', context: 'strong preference', frequency: 'medium', priority: 65 },
  { text: 'I do not know', category: 'choices', context: 'uncertainty', frequency: 'medium', priority: 65 },
  { text: 'Let me think', category: 'choices', context: 'deliberation', frequency: 'medium', priority: 60 },
  { text: 'I changed my mind', category: 'choices', context: 'revision', frequency: 'medium', priority: 60 },
  { text: 'He wants that one', category: 'choices', context: 'his selection', frequency: 'medium', priority: 55 },
  { text: 'She wants that one', category: 'choices', context: 'her selection', frequency: 'medium', priority: 55 },
  { text: 'We can choose', category: 'choices', context: 'our decision', frequency: 'medium', priority: 60 },
  
  // Time and Routines - Low Frequency
  { text: 'Is it time to go', category: 'time', context: 'departure', frequency: 'low', priority: 50 },
  { text: 'When do we leave', category: 'time', context: 'schedule', frequency: 'low', priority: 50 },
  { text: 'I want to stay longer', category: 'time', context: 'extension', frequency: 'low', priority: 50 },
  { text: 'I am not ready yet', category: 'time', context: 'delay', frequency: 'low', priority: 50 },
  { text: 'Can we do it later', category: 'time', context: 'postponement', frequency: 'low', priority: 50 },
  { text: 'I want to do it now', category: 'time', context: 'immediacy', frequency: 'low', priority: 55 },
  { text: 'What are we doing today', category: 'time', context: 'schedule inquiry', frequency: 'low', priority: 55 },
  { text: 'What are we doing next', category: 'time', context: 'sequence', frequency: 'low', priority: 55 },
  { text: 'Is it morning', category: 'time', context: 'time of day', frequency: 'low', priority: 45 },
  { text: 'Is it bedtime', category: 'time', context: 'routine', frequency: 'low', priority: 50 },
  
  // Medical and Health - Low Frequency
  { text: 'My tummy hurts', category: 'health', context: 'pain location', frequency: 'low', priority: 60 },
  { text: 'My head hurts', category: 'health', context: 'pain location', frequency: 'low', priority: 60 },
  { text: 'I do not feel well', category: 'health', context: 'illness', frequency: 'low', priority: 60 },
  { text: 'I need medicine', category: 'health', context: 'treatment', frequency: 'low', priority: 55 },
  { text: 'I need a bandaid', category: 'health', context: 'first aid', frequency: 'low', priority: 50 },
  { text: 'I fell down', category: 'health', context: 'injury', frequency: 'low', priority: 55 },
  { text: 'I bumped my head', category: 'health', context: 'injury', frequency: 'low', priority: 50 },
  { text: 'I need to rest', category: 'health', context: 'recovery', frequency: 'low', priority: 55 },
  { text: 'I feel better now', category: 'health', context: 'improvement', frequency: 'low', priority: 55 },
  { text: 'I need to see the doctor', category: 'health', context: 'medical care', frequency: 'low', priority: 50 },
  { text: 'He is sick', category: 'health', context: 'his illness', frequency: 'low', priority: 55 },
  { text: 'She is sick', category: 'health', context: 'her illness', frequency: 'low', priority: 55 },
  { text: 'My sister is hurt', category: 'health', context: 'sister injury', frequency: 'low', priority: 50 },
  { text: 'My brother is hurt', category: 'health', context: 'brother injury', frequency: 'low', priority: 50 },
  
  // Sensory and Comfort - Low Frequency
  { text: 'It is too loud', category: 'sensory', context: 'auditory sensitivity', frequency: 'low', priority: 55 },
  { text: 'It is too bright', category: 'sensory', context: 'visual sensitivity', frequency: 'low', priority: 50 },
  { text: 'I need quiet', category: 'sensory', context: 'sensory regulation', frequency: 'low', priority: 55 },
  { text: 'I need space', category: 'sensory', context: 'personal space', frequency: 'low', priority: 50 },
  { text: 'It is too hot', category: 'sensory', context: 'temperature', frequency: 'low', priority: 50 },
  { text: 'It is too cold', category: 'sensory', context: 'temperature', frequency: 'low', priority: 50 },
  { text: 'I need my blanket', category: 'sensory', context: 'comfort object', frequency: 'low', priority: 50 },
  { text: 'I need a hug', category: 'sensory', context: 'physical comfort', frequency: 'low', priority: 55 },
  { text: 'That feels nice', category: 'sensory', context: 'pleasant sensation', frequency: 'low', priority: 50 },
  { text: 'I do not like that feeling', category: 'sensory', context: 'unpleasant sensation', frequency: 'low', priority: 50 },
  
  // Problem Solving - Low Frequency
  { text: 'I have a problem', category: 'problem', context: 'issue identification', frequency: 'low', priority: 55 },
  { text: 'Something is wrong', category: 'problem', context: 'alert', frequency: 'low', priority: 55 },
  { text: 'I need to fix this', category: 'problem', context: 'repair', frequency: 'low', priority: 50 },
  { text: 'It is broken', category: 'problem', context: 'damage', frequency: 'low', priority: 55 },
  { text: 'I made a mistake', category: 'problem', context: 'error', frequency: 'low', priority: 50 },
  { text: 'Can you fix it', category: 'problem', context: 'assistance request', frequency: 'low', priority: 50 },
  { text: 'I will try a different way', category: 'problem', context: 'alternative approach', frequency: 'low', priority: 50 },
  { text: 'I need to think about it', category: 'problem', context: 'reflection', frequency: 'low', priority: 50 },
  { text: 'I found a solution', category: 'problem', context: 'resolution', frequency: 'low', priority: 50 },
  { text: 'I need help solving this', category: 'problem', context: 'collaborative problem solving', frequency: 'low', priority: 55 },
  
  // Advanced Social - Low Frequency
  { text: 'Can I tell you something', category: 'social', context: 'sharing information', frequency: 'low', priority: 55 },
  { text: 'I have something to say', category: 'social', context: 'communication intent', frequency: 'low', priority: 55 },
  { text: 'Listen to me', category: 'social', context: 'attention request', frequency: 'low', priority: 50 },
  { text: 'I want to share', category: 'social', context: 'sharing', frequency: 'low', priority: 50 },
  { text: 'Can I have a turn', category: 'social', context: 'turn taking', frequency: 'low', priority: 55 },
  { text: 'It is my turn', category: 'social', context: 'turn claiming', frequency: 'low', priority: 55 },
  { text: 'You can have a turn', category: 'social', context: 'turn giving', frequency: 'low', priority: 50 },
  { text: 'Let us take turns', category: 'social', context: 'cooperation', frequency: 'low', priority: 50 },
  { text: 'I want to be friends', category: 'social', context: 'friendship', frequency: 'low', priority: 50 },
  { text: 'You are my friend', category: 'social', context: 'affirmation', frequency: 'low', priority: 55 },
  { text: 'He is my friend', category: 'social', context: 'his friendship', frequency: 'low', priority: 50 },
  { text: 'She is my friend', category: 'social', context: 'her friendship', frequency: 'low', priority: 50 },
  { text: 'We are friends', category: 'social', context: 'our friendship', frequency: 'low', priority: 50 },
  { text: 'They are friends', category: 'social', context: 'their friendship', frequency: 'low', priority: 45 },
  
  // Connecting Words and Common Phrases - High Frequency
  { text: 'Can I go', category: 'connecting', context: 'permission to go', frequency: 'high', priority: 85 },
  { text: 'Can I have', category: 'connecting', context: 'permission to have', frequency: 'high', priority: 85 },
  { text: 'Can I see', category: 'connecting', context: 'permission to see', frequency: 'high', priority: 80 },
  { text: 'Can we go', category: 'connecting', context: 'permission for us to go', frequency: 'high', priority: 80 },
  { text: 'Can we have', category: 'connecting', context: 'permission for us to have', frequency: 'high', priority: 75 },
  { text: 'Can he go', category: 'connecting', context: 'permission for him to go', frequency: 'high', priority: 70 },
  { text: 'Can she go', category: 'connecting', context: 'permission for her to go', frequency: 'high', priority: 70 },
  { text: 'Can they go', category: 'connecting', context: 'permission for them to go', frequency: 'high', priority: 65 },
  { text: 'I can go', category: 'connecting', context: 'ability to go', frequency: 'high', priority: 75 },
  { text: 'I can see', category: 'connecting', context: 'ability to see', frequency: 'high', priority: 70 },
  { text: 'I can do', category: 'connecting', context: 'ability to do', frequency: 'high', priority: 70 },
  { text: 'The cat', category: 'connecting', context: 'article with noun', frequency: 'high', priority: 65 },
  { text: 'The dog', category: 'connecting', context: 'article with noun', frequency: 'high', priority: 65 },
  { text: 'The ball', category: 'connecting', context: 'article with noun', frequency: 'high', priority: 65 },
  { text: 'The book', category: 'connecting', context: 'article with noun', frequency: 'high', priority: 65 },
  { text: 'A toy', category: 'connecting', context: 'article with noun', frequency: 'high', priority: 65 },
  { text: 'A book', category: 'connecting', context: 'article with noun', frequency: 'high', priority: 65 },
  { text: 'A friend', category: 'connecting', context: 'article with noun', frequency: 'high', priority: 65 },
  { text: 'That is', category: 'connecting', context: 'demonstrative', frequency: 'high', priority: 75 },
  { text: 'That was', category: 'connecting', context: 'demonstrative past', frequency: 'high', priority: 70 },
  { text: 'This is', category: 'connecting', context: 'demonstrative', frequency: 'high', priority: 75 },
  { text: 'This was', category: 'connecting', context: 'demonstrative past', frequency: 'high', priority: 70 },
  
  // Colour descriptions - High Priority
  { text: 'It is big and red', category: 'descriptions', context: 'size and colour', frequency: 'high', priority: 85 },
  { text: 'It is big and blue', category: 'descriptions', context: 'size and colour', frequency: 'high', priority: 85 },
  { text: 'It is big and green', category: 'descriptions', context: 'size and colour', frequency: 'high', priority: 85 },
  { text: 'It is big and yellow', category: 'descriptions', context: 'size and colour', frequency: 'high', priority: 85 },
  { text: 'It is big and orange', category: 'descriptions', context: 'size and colour', frequency: 'high', priority: 80 },
  { text: 'It is big and purple', category: 'descriptions', context: 'size and colour', frequency: 'high', priority: 80 },
  { text: 'It is big and pink', category: 'descriptions', context: 'size and colour', frequency: 'high', priority: 80 },
  { text: 'It is big and black', category: 'descriptions', context: 'size and colour', frequency: 'high', priority: 80 },
  { text: 'It is big and white', category: 'descriptions', context: 'size and colour', frequency: 'high', priority: 80 },
  { text: 'It is big and brown', category: 'descriptions', context: 'size and colour', frequency: 'high', priority: 80 },
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
 * ENHANCED: Now uses priority scoring for better suggestions
 */
export function getContextualAACSentences(currentWords: string[], maxResults: number = 5): string[] {
  if (currentWords.length === 0) {
    // Return ultra-high-priority sentences if no context
    return aacSentences
      .filter(s => s.priority && s.priority >= 95)
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))
      .slice(0, maxResults)
      .map(s => s.text);
  }
  
  const currentText = currentWords.join(' ').toLowerCase();
  const results: { sentence: string; score: number }[] = [];
  
  aacSentences.forEach(aacSentence => {
    let score = 0;
    const sentenceLower = aacSentence.text.toLowerCase();
    
    // ULTRA-HIGH BOOST: Priority score (most important factor)
    if (aacSentence.priority) {
      score += aacSentence.priority * 2; // Double the priority weight
    }
    
    // Exact match or starts with current text
    if (sentenceLower.startsWith(currentText)) {
      score += 150; // Massive boost for exact prefix match
    }
    
    // Contains current words
    currentWords.forEach(word => {
      if (sentenceLower.includes(word.toLowerCase())) {
        score += 30;
      }
    });
    
    // Frequency boost
    if (aacSentence.frequency === 'high') score += 40;
    else if (aacSentence.frequency === 'medium') score += 20;
    
    // Context relevance
    currentWords.forEach(word => {
      if (aacSentence.context.toLowerCase().includes(word.toLowerCase())) {
        score += 15;
      }
    });
    
    // Boost for connecting words (am, is, are, the, a, etc.)
    const connectingWords = ['am', 'is', 'are', 'the', 'a', 'an', 'to', 'and', 'or', 'can', 'will'];
    const hasConnectingWord = currentWords.some(w => connectingWords.includes(w.toLowerCase()));
    if (hasConnectingWord && sentenceLower.split(' ').some(w => connectingWords.includes(w))) {
      score += 25; // Boost sentences with connecting words
    }
    
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

/**
 * Get ultra-high priority sentences (for initial suggestions)
 */
export function getUltraHighPrioritySentences(maxResults: number = 10): string[] {
  return aacSentences
    .filter(s => s.priority && s.priority >= 95)
    .sort((a, b) => (b.priority || 0) - (a.priority || 0))
    .slice(0, maxResults)
    .map(s => s.text);
}
