
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../app/integrations/supabase/client';

export interface AIPreference {
  id: string;
  preference_type: string;
  preference_key: string;
  preference_value: string;
  options: string[];
  category: string;
  display_order: number;
  is_active: boolean;
}

export interface PreferenceOption {
  value: string;
  label: string;
  colour?: string;
}

export function useAIPreferences() {
  const [preferences, setPreferences] = useState<AIPreference[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Predefined preference categories with Australian English
  const preferenceCategories = {
    personal: {
      title: 'Personal Preferences',
      icon: 'person-outline',
      preferences: [
        {
          key: 'favourite_colour',
          type: 'choice',
          question: "What's your favourite colour?",
          options: [
            { value: 'red', label: 'Red', colour: '#FF6B6B' },
            { value: 'blue', label: 'Blue', colour: '#4ECDC4' },
            { value: 'green', label: 'Green', colour: '#45B7D1' },
            { value: 'yellow', label: 'Yellow', colour: '#FFA07A' },
            { value: 'purple', label: 'Purple', colour: '#98D8C8' },
            { value: 'orange', label: 'Orange', colour: '#F7DC6F' },
            { value: 'pink', label: 'Pink', colour: '#BB8FCE' },
            { value: 'black', label: 'Black', colour: '#2C3E50' },
          ]
        },
        {
          key: 'favourite_food',
          type: 'choice',
          question: "What's your favourite food?",
          options: [
            { value: 'pizza', label: 'Pizza' },
            { value: 'pasta', label: 'Pasta' },
            { value: 'burgers', label: 'Burgers' },
            { value: 'fish and chips', label: 'Fish and Chips' },
            { value: 'meat pies', label: 'Meat Pies' },
            { value: 'lamingtons', label: 'Lamingtons' },
            { value: 'pavlova', label: 'Pavlova' },
            { value: 'vegemite toast', label: 'Vegemite Toast' },
            { value: 'cake', label: 'Cake' },
            { value: 'ice cream', label: 'Ice Cream' },
          ]
        },
        {
          key: 'favourite_activity',
          type: 'choice',
          question: "What's your favourite activity?",
          options: [
            { value: 'playing games', label: 'Playing Games' },
            { value: 'watching tv', label: 'Watching TV' },
            { value: 'reading books', label: 'Reading Books' },
            { value: 'going to park', label: 'Going to the Park' },
            { value: 'swimming', label: 'Swimming' },
            { value: 'drawing', label: 'Drawing' },
            { value: 'listening music', label: 'Listening to Music' },
            { value: 'playing sport', label: 'Playing Sport' },
          ]
        },
        {
          key: 'favourite_animal',
          type: 'choice',
          question: "What's your favourite animal?",
          options: [
            { value: 'dog', label: 'Dog' },
            { value: 'cat', label: 'Cat' },
            { value: 'kangaroo', label: 'Kangaroo' },
            { value: 'koala', label: 'Koala' },
            { value: 'dolphin', label: 'Dolphin' },
            { value: 'elephant', label: 'Elephant' },
            { value: 'lion', label: 'Lion' },
            { value: 'penguin', label: 'Penguin' },
          ]
        }
      ]
    },
    communication: {
      title: 'Communication Style',
      icon: 'chatbubble-outline',
      preferences: [
        {
          key: 'greeting_style',
          type: 'choice',
          question: 'How do you like to say hello?',
          options: [
            { value: 'hello', label: 'Hello' },
            { value: 'hi', label: 'Hi' },
            { value: 'gday', label: 'G\'day' },
            { value: 'hey', label: 'Hey' },
            { value: 'good morning', label: 'Good Morning' },
            { value: 'howdy', label: 'Howdy' },
          ]
        },
        {
          key: 'politeness_level',
          type: 'choice',
          question: 'How polite do you like to be?',
          options: [
            { value: 'very_polite', label: 'Very Polite (Please, Thank You)' },
            { value: 'polite', label: 'Polite (Thanks, Please)' },
            { value: 'casual', label: 'Casual (Cheers, Ta)' },
            { value: 'direct', label: 'Direct (Straight to the point)' },
          ]
        },
        {
          key: 'sentence_length',
          type: 'choice',
          question: 'What sentence length do you prefer?',
          options: [
            { value: 'short', label: 'Short (1-3 words)' },
            { value: 'medium', label: 'Medium (4-6 words)' },
            { value: 'long', label: 'Long (7+ words)' },
            { value: 'mixed', label: 'Mixed (Varies)' },
          ]
        }
      ]
    },
    temporal: {
      title: 'Time-Based Preferences',
      icon: 'time-outline',
      preferences: [
        {
          key: 'morning_routine',
          type: 'choice',
          question: 'What do you usually do in the morning?',
          options: [
            { value: 'eat breakfast', label: 'Eat Breakfast' },
            { value: 'brush teeth', label: 'Brush Teeth' },
            { value: 'get dressed', label: 'Get Dressed' },
            { value: 'go to school', label: 'Go to School' },
            { value: 'watch tv', label: 'Watch TV' },
            { value: 'play games', label: 'Play Games' },
          ]
        },
        {
          key: 'afternoon_activity',
          type: 'choice',
          question: 'What do you like doing in the afternoon?',
          options: [
            { value: 'play outside', label: 'Play Outside' },
            { value: 'do homework', label: 'Do Homework' },
            { value: 'watch tv', label: 'Watch TV' },
            { value: 'have snack', label: 'Have a Snack' },
            { value: 'rest', label: 'Have a Rest' },
            { value: 'play with friends', label: 'Play with Friends' },
          ]
        },
        {
          key: 'evening_routine',
          type: 'choice',
          question: 'What do you do in the evening?',
          options: [
            { value: 'eat dinner', label: 'Eat Dinner' },
            { value: 'watch tv', label: 'Watch TV' },
            { value: 'read book', label: 'Read a Book' },
            { value: 'have bath', label: 'Have a Bath' },
            { value: 'brush teeth', label: 'Brush Teeth' },
            { value: 'go to bed', label: 'Go to Bed' },
          ]
        }
      ]
    }
  };

  // Load preferences from database
  const loadPreferences = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('ai_preferences')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('display_order', { ascending: true });

      if (error) {
        console.log('Error loading AI preferences:', error);
        setError('Failed to load preferences');
        return;
      }

      setPreferences(data || []);
      console.log('Loaded AI preferences:', data?.length || 0, data);
    } catch (err) {
      console.log('Error in loadPreferences:', err);
      setError('Failed to load preferences');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save or update a preference
  const savePreference = useCallback(async (
    category: string,
    key: string,
    value: string,
    options: string[] = []
  ) => {
    try {
      console.log('Saving preference:', { category, key, value });
      
      const { data, error } = await supabase
        .from('ai_preferences')
        .upsert({
          preference_type: 'choice',
          preference_key: key,
          preference_value: value,
          options: options,
          category: category,
          is_active: true,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'preference_key'
        })
        .select();

      if (error) {
        console.log('Error saving preference:', error);
        setError('Failed to save preference');
        return false;
      }

      console.log('Successfully saved preference:', data);

      // Update local state immediately for instant UI feedback
      setPreferences(prevPrefs => {
        const existingIndex = prevPrefs.findIndex(p => p.preference_key === key);
        if (existingIndex >= 0) {
          // Update existing preference
          const updated = [...prevPrefs];
          updated[existingIndex] = {
            ...updated[existingIndex],
            preference_value: value,
            category: category,
            updated_at: new Date().toISOString()
          } as AIPreference;
          return updated;
        } else {
          // Add new preference
          if (data && data.length > 0) {
            return [...prevPrefs, data[0] as AIPreference];
          }
          return prevPrefs;
        }
      });

      return true;
    } catch (err) {
      console.log('Error in savePreference:', err);
      setError('Failed to save preference');
      return false;
    }
  }, []);

  // Get preference value by key
  const getPreference = useCallback((key: string): string | null => {
    const pref = preferences.find(p => p.preference_key === key);
    const value = pref?.preference_value || null;
    console.log('Getting preference:', key, '=', value);
    return value;
  }, [preferences]);

  // Get preferences by category
  const getPreferencesByCategory = useCallback((category: string): AIPreference[] => {
    return preferences.filter(p => p.category === category);
  }, [preferences]);

  // Generate contextual suggestions based on preferences
  const getContextualSuggestions = useCallback((context: string, currentHour: number): string[] => {
    const suggestions: string[] = [];
    const lowerContext = context.toLowerCase();
    
    console.log('Getting contextual suggestions for:', { context: lowerContext, currentHour });
    
    // Time-based suggestions
    if (currentHour >= 6 && currentHour < 12) {
      const morningRoutine = getPreference('morning_routine');
      if (morningRoutine && (lowerContext.includes('morning') || lowerContext.includes('do'))) {
        suggestions.push(morningRoutine);
        console.log('Added morning routine suggestion:', morningRoutine);
      }
    } else if (currentHour >= 12 && currentHour < 17) {
      const afternoonActivity = getPreference('afternoon_activity');
      if (afternoonActivity && (lowerContext.includes('afternoon') || lowerContext.includes('arvo') || lowerContext.includes('do'))) {
        suggestions.push(afternoonActivity);
        console.log('Added afternoon activity suggestion:', afternoonActivity);
      }
    } else if (currentHour >= 17 && currentHour < 22) {
      const eveningRoutine = getPreference('evening_routine');
      if (eveningRoutine && (lowerContext.includes('evening') || lowerContext.includes('night') || lowerContext.includes('do'))) {
        suggestions.push(eveningRoutine);
        console.log('Added evening routine suggestion:', eveningRoutine);
      }
    }

    // Personal preference suggestions with context matching
    const favouriteColour = getPreference('favourite_colour');
    const favouriteFood = getPreference('favourite_food');
    const favouriteActivity = getPreference('favourite_activity');
    const favouriteAnimal = getPreference('favourite_animal');
    const greetingStyle = getPreference('greeting_style');

    // Colour context
    if (favouriteColour && (lowerContext.includes('colour') || lowerContext.includes('color') || lowerContext.includes('favourite colour'))) {
      suggestions.push(favouriteColour);
      console.log('Added favourite colour suggestion:', favouriteColour);
    }
    
    // Food context - more comprehensive matching
    if (favouriteFood && (
      lowerContext.includes('food') || 
      lowerContext.includes('eat') || 
      lowerContext.includes('hungry') ||
      lowerContext.includes('favourite food') ||
      lowerContext.includes('want to eat') ||
      lowerContext.includes('like to eat')
    )) {
      suggestions.push(favouriteFood);
      console.log('Added favourite food suggestion:', favouriteFood);
    }
    
    // Activity context
    if (favouriteActivity && (
      lowerContext.includes('play') || 
      lowerContext.includes('activity') || 
      lowerContext.includes('do') ||
      lowerContext.includes('favourite activity')
    )) {
      suggestions.push(favouriteActivity);
      console.log('Added favourite activity suggestion:', favouriteActivity);
    }
    
    // Animal context
    if (favouriteAnimal && (
      lowerContext.includes('animal') || 
      lowerContext.includes('pet') ||
      lowerContext.includes('favourite animal')
    )) {
      suggestions.push(favouriteAnimal);
      console.log('Added favourite animal suggestion:', favouriteAnimal);
    }
    
    // Greeting context
    if (greetingStyle && (lowerContext.includes('hello') || lowerContext.includes('hi') || lowerContext.includes('hey'))) {
      suggestions.push(greetingStyle);
      console.log('Added greeting style suggestion:', greetingStyle);
    }

    console.log('Total contextual suggestions:', suggestions.length);
    return suggestions.slice(0, 5); // Return max 5 suggestions
  }, [getPreference]);

  // Initialize preferences on mount
  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  return {
    preferences,
    preferenceCategories,
    isLoading,
    error,
    loadPreferences,
    savePreference,
    getPreference,
    getPreferencesByCategory,
    getContextualSuggestions
  };
}
