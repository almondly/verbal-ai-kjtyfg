
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EMOTION_SETTINGS_KEY = 'emotion_settings';

export interface EmotionSettings {
  selectedEmotion: 1 | 2 | 3; // 1: sad, 2: happy, 3: angry
  idleTimeout: number; // in milliseconds
}

const defaultSettings: EmotionSettings = {
  selectedEmotion: 2, // Default to happy
  idleTimeout: 30000, // 30 seconds
};

export function useEmotionSettings() {
  const [settings, setSettings] = useState<EmotionSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(EMOTION_SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure emotion is a valid number (1, 2, or 3)
        if (parsed.selectedEmotion && [1, 2, 3].includes(parsed.selectedEmotion)) {
          setSettings({ ...defaultSettings, ...parsed });
        } else {
          // Migrate old string-based emotions to numbers
          const legacyMap: Record<string, 1 | 2 | 3> = {
            'sad': 1,
            'happy': 2,
            'angry': 3,
          };
          const emotionId = legacyMap[parsed.selectedEmotion?.toLowerCase()] || 2;
          setSettings({ ...defaultSettings, selectedEmotion: emotionId });
        }
      }
    } catch (error) {
      console.log('Error loading emotion settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<EmotionSettings>) => {
    try {
      const updated = { ...settings, ...newSettings };
      setSettings(updated);
      await AsyncStorage.setItem(EMOTION_SETTINGS_KEY, JSON.stringify(updated));
      console.log('Emotion settings updated:', updated);
    } catch (error) {
      console.log('Error saving emotion settings:', error);
    }
  };

  const updateEmotion = (emotion: 1 | 2 | 3) => {
    updateSettings({ selectedEmotion: emotion });
  };

  const updateIdleTimeout = (timeout: number) => {
    updateSettings({ idleTimeout: timeout });
  };

  return {
    settings,
    isLoading,
    updateEmotion,
    updateIdleTimeout,
    updateSettings,
  };
}
