
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../app/integrations/supabase/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';

export interface TTSVoice {
  identifier: string;
  name: string;
  language: string;
  quality?: string;
}

export interface TTSSettings {
  voiceIdentifier: string;
  voiceName: string;
  language: string;
  pitch: number;
  rate: number;
}

const DEFAULT_TTS_SETTINGS: TTSSettings = {
  voiceIdentifier: 'default',
  voiceName: 'Default Voice',
  language: 'en-US',
  pitch: 1.0,
  rate: 1.0,
};

const TTS_STORAGE_KEY = 'tts_settings';

export function useTTSSettings() {
  const [settings, setSettings] = useState<TTSSettings>(DEFAULT_TTS_SETTINGS);
  const [availableVoices, setAvailableVoices] = useState<TTSVoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load available voices
  useEffect(() => {
    loadAvailableVoices();
  }, []);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadAvailableVoices = async () => {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      console.log('Available TTS voices:', voices);
      
      const formattedVoices: TTSVoice[] = [
        { identifier: 'default', name: 'Default Voice', language: 'en-US' },
        ...voices.map(voice => ({
          identifier: voice.identifier,
          name: voice.name,
          language: voice.language,
          quality: voice.quality,
        }))
      ];
      
      setAvailableVoices(formattedVoices);
    } catch (err) {
      console.log('Error loading available voices:', err);
      // Fallback to default voices if API fails
      setAvailableVoices([
        { identifier: 'default', name: 'Default Voice', language: 'en-US' },
        { identifier: 'com.apple.ttsbundle.Samantha-compact', name: 'Samantha', language: 'en-US' },
        { identifier: 'com.apple.ttsbundle.Alex-compact', name: 'Alex', language: 'en-US' },
        { identifier: 'com.apple.ttsbundle.Victoria-compact', name: 'Victoria', language: 'en-US' },
      ]);
    }
  };

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      
      // Try to load from AsyncStorage first (for offline access)
      const localSettings = await AsyncStorage.getItem(TTS_STORAGE_KEY);
      if (localSettings) {
        const parsed = JSON.parse(localSettings);
        setSettings(parsed);
      }

      // Then try to load from Supabase (for sync across devices)
      const { data, error } = await supabase
        .from('tts_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        console.log('Error loading TTS settings from Supabase:', error);
      } else if (data) {
        const supabaseSettings: TTSSettings = {
          voiceIdentifier: data.voice_identifier,
          voiceName: data.voice_name,
          language: data.language,
          pitch: data.pitch,
          rate: data.rate,
        };
        setSettings(supabaseSettings);
        // Update local storage
        await AsyncStorage.setItem(TTS_STORAGE_KEY, JSON.stringify(supabaseSettings));
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
      setSettings(updatedSettings);

      // Save to AsyncStorage immediately
      await AsyncStorage.setItem(TTS_STORAGE_KEY, JSON.stringify(updatedSettings));

      // Save to Supabase
      const { error } = await supabase
        .from('tts_settings')
        .upsert({
          voice_identifier: updatedSettings.voiceIdentifier,
          voice_name: updatedSettings.voiceName,
          language: updatedSettings.language,
          pitch: updatedSettings.pitch,
          rate: updatedSettings.rate,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.log('Error saving TTS settings to Supabase:', error);
        // Don't throw error, local storage still works
      }

      console.log('TTS settings updated:', updatedSettings);
    } catch (err) {
      console.log('Error updating TTS settings:', err);
      setError('Failed to update TTS settings');
    }
  }, [settings]);

  const speak = useCallback(async (text: string) => {
    try {
      const options: Speech.SpeechOptions = {
        language: settings.language,
        pitch: settings.pitch,
        rate: settings.rate,
      };

      // Only set voice if it's not the default
      if (settings.voiceIdentifier !== 'default') {
        options.voice = settings.voiceIdentifier;
      }

      await Speech.speak(text, options);
    } catch (err) {
      console.log('Error speaking text:', err);
      // Fallback to basic speech without voice settings
      await Speech.speak(text);
    }
  }, [settings]);

  return {
    settings,
    availableVoices,
    isLoading,
    error,
    updateSettings,
    speak,
  };
}
