
import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';

export type VoiceType = 'boy' | 'girl';

export interface VoiceSettings {
  selectedVoice: VoiceType;
}

const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  selectedVoice: 'boy',
};

const VOICE_STORAGE_KEY = 'voice_settings';

// Voice characteristics for young boy and young girl
const VOICE_CHARACTERISTICS = {
  boy: {
    name: 'Young Boy',
    description: 'Youthful boy voice',
    pitch: 1.3, // Higher pitch for young voice
    rate: 1.0,
  },
  girl: {
    name: 'Young Girl',
    description: 'Youthful girl voice',
    pitch: 1.5, // Even higher pitch for young girl
    rate: 1.05,
  },
};

export function useVoiceSettings() {
  const [settings, setSettings] = useState<VoiceSettings>(DEFAULT_VOICE_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      console.log('Loading voice settings...');
      
      const localSettings = await AsyncStorage.getItem(VOICE_STORAGE_KEY);
      if (localSettings) {
        const parsed = JSON.parse(localSettings);
        console.log('Loaded voice settings from AsyncStorage:', parsed);
        setSettings(parsed);
      }
    } catch (err) {
      console.log('Error loading voice settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = useCallback(async (newSettings: Partial<VoiceSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      console.log('Updating voice settings:', updatedSettings);
      setSettings(updatedSettings);

      await AsyncStorage.setItem(VOICE_STORAGE_KEY, JSON.stringify(updatedSettings));
      console.log('Voice settings updated successfully:', updatedSettings);
    } catch (err) {
      console.log('Error updating voice settings:', err);
    }
  }, [settings]);

  const speak = useCallback(async (text: string) => {
    try {
      console.log('🔊 Speaking text with voice:', settings.selectedVoice);
      
      const characteristics = VOICE_CHARACTERISTICS[settings.selectedVoice];
      
      const options: Speech.SpeechOptions = {
        language: 'en-US',
        pitch: characteristics.pitch,
        rate: characteristics.rate,
      };

      console.log('🎤 Speech options:', options);
      await Speech.speak(text, options);
    } catch (err) {
      console.log('Error speaking text:', err);
      // Fallback to basic speech
      try {
        await Speech.speak(text, {
          language: 'en-US',
          pitch: 1.0,
          rate: 1.0,
        });
      } catch (fallbackErr) {
        console.log('Fallback speech also failed:', fallbackErr);
      }
    }
  }, [settings]);

  const testVoice = useCallback(async (voiceType: VoiceType) => {
    try {
      const characteristics = VOICE_CHARACTERISTICS[voiceType];
      
      const options: Speech.SpeechOptions = {
        language: 'en-US',
        pitch: characteristics.pitch,
        rate: characteristics.rate,
      };

      console.log('🎤 Testing voice with options:', options);
      
      const testPhrase = voiceType === 'girl' 
        ? 'Hi! I am the young girl voice!'
        : 'Hello! I am the young boy voice!';
      
      await Speech.speak(testPhrase, options);
    } catch (err) {
      console.log('Error testing voice:', err);
      await Speech.speak('Hello, this is how I sound!');
    }
  }, []);

  const getVoiceCharacteristics = useCallback((voiceType: VoiceType) => {
    return VOICE_CHARACTERISTICS[voiceType];
  }, []);

  return {
    settings,
    isLoading,
    updateSettings,
    speak,
    testVoice,
    getVoiceCharacteristics,
  };
}
