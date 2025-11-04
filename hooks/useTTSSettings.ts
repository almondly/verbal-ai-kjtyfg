
import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';

export interface TTSVoice {
  identifier: string;
  name: string;
  language: string;
}

export interface TTSSettings {
  voiceIdentifier: string;
  voiceName: string;
  language: string;
}

const DEFAULT_TTS_SETTINGS: TTSSettings = {
  voiceIdentifier: 'young_girl',
  voiceName: 'Young Girl',
  language: 'en-US',
};

const TTS_STORAGE_KEY = 'tts_settings';

// Two youthful voices - young boy and young girl
const YOUTHFUL_VOICES: TTSVoice[] = [
  { identifier: 'young_girl', name: 'Young Girl', language: 'en-US' },
  { identifier: 'young_boy', name: 'Young Boy', language: 'en-US' },
];

// Voice characteristics for youthful voices
const VOICE_CHARACTERISTICS = {
  young_girl: {
    pitch: 1.4, // Higher pitch for young girl
    rate: 1.05, // Slightly faster
    description: 'Bright, youthful girl voice',
  },
  young_boy: {
    pitch: 1.2, // Moderately high pitch for young boy
    rate: 1.0, // Normal rate
    description: 'Clear, youthful boy voice',
  },
};

export function useTTSSettings() {
  const [settings, setSettings] = useState<TTSSettings>(DEFAULT_TTS_SETTINGS);
  const [availableVoices, setAvailableVoices] = useState<TTSVoice[]>(YOUTHFUL_VOICES);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      console.log('Loading TTS settings...');
      
      // Load from AsyncStorage
      const localSettings = await AsyncStorage.getItem(TTS_STORAGE_KEY);
      if (localSettings) {
        const parsed = JSON.parse(localSettings);
        console.log('Loaded TTS settings from AsyncStorage:', parsed);
        setSettings(parsed);
      }
    } catch (err) {
      console.log('Error loading TTS settings:', err);
      setError('Failed to load TTS settings');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = useCallback(async (newSettings: Partial<TTSSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      console.log('Updating TTS settings:', updatedSettings);
      setSettings(updatedSettings);

      // Save to AsyncStorage
      await AsyncStorage.setItem(TTS_STORAGE_KEY, JSON.stringify(updatedSettings));
      console.log('TTS settings updated successfully:', updatedSettings);
    } catch (err) {
      console.log('Error updating TTS settings:', err);
      setError('Failed to update TTS settings');
    }
  }, [settings]);

  // Get voice characteristics for a given voice type
  const getVoiceCharacteristics = useCallback((voiceIdentifier: string) => {
    return VOICE_CHARACTERISTICS[voiceIdentifier as keyof typeof VOICE_CHARACTERISTICS] || VOICE_CHARACTERISTICS.young_girl;
  }, []);

  const speak = useCallback(async (text: string) => {
    try {
      console.log('🔊 Speaking text with settings:', { text, settings });
      
      // Get voice characteristics
      const characteristics = getVoiceCharacteristics(settings.voiceIdentifier);
      
      const options: Speech.SpeechOptions = {
        language: settings.language,
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
          pitch: 1.2,
          rate: 1.0,
        });
      } catch (fallbackErr) {
        console.log('Fallback speech also failed:', fallbackErr);
      }
    }
  }, [settings, getVoiceCharacteristics]);

  const testVoice = useCallback(async (voiceIdentifier: string) => {
    try {
      // Get voice characteristics
      const characteristics = getVoiceCharacteristics(voiceIdentifier);
      
      const options: Speech.SpeechOptions = {
        language: settings.language,
        pitch: characteristics.pitch,
        rate: characteristics.rate,
      };

      console.log('🎤 Testing voice with options:', options);
      
      // Use different test phrases for each voice
      const testPhrase = voiceIdentifier === 'young_girl' 
        ? 'Hi! I am the young girl voice. I sound bright and cheerful!'
        : 'Hello! I am the young boy voice. I sound clear and friendly!';
      
      await Speech.speak(testPhrase, options);
    } catch (err) {
      console.log('Error testing voice:', err);
      // Fallback test
      await Speech.speak('Hello, this is how I sound!');
    }
  }, [settings, getVoiceCharacteristics]);

  return {
    settings,
    availableVoices,
    isLoading,
    error,
    updateSettings,
    speak,
    testVoice,
    getVoiceCharacteristics,
  };
}
