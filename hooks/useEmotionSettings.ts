
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EMOTION_SETTINGS_KEY = 'emotion_settings';

export interface EmotionSettings {
  selectedEmotion: string;
  idleTimeout: number; // in milliseconds
}

const defaultSettings: EmotionSettings = {
  selectedEmotion: 'happy',
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
        setSettings({ ...defaultSettings, ...parsed });
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

  const updateEmotion = (emotion: string) => {
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
