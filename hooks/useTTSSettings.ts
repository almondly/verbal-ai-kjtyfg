
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
      console.log('Loading available TTS voices...');
      const voices = await Speech.getAvailableVoicesAsync();
      console.log('Raw TTS voices from Speech API:', voices);
      
      const formattedVoices: TTSVoice[] = [
        { identifier: 'default', name: 'Default Voice', language: 'en-US' },
      ];

      // Add system voices if available
      if (voices && voices.length > 0) {
        voices.forEach(voice => {
          formattedVoices.push({
            identifier: voice.identifier,
            name: voice.name,
            language: voice.language,
            quality: voice.quality,
          });
        });
      } else {
        // Fallback voices for different platforms
        formattedVoices.push(
          { identifier: 'com.apple.ttsbundle.Samantha-compact', name: 'Samantha', language: 'en-US' },
          { identifier: 'com.apple.ttsbundle.Alex-compact', name: 'Alex', language: 'en-US' },
          { identifier: 'com.apple.ttsbundle.Victoria-compact', name: 'Victoria', language: 'en-US' },
          { identifier: 'com.apple.ttsbundle.Daniel-compact', name: 'Daniel', language: 'en-GB' },
          { identifier: 'com.apple.ttsbundle.Karen-compact', name: 'Karen', language: 'en-AU' },
          { identifier: 'com.apple.speech.synthesis.voice.Fred', name: 'Fred', language: 'en-US' },
          { identifier: 'com.apple.speech.synthesis.voice.Princess', name: 'Princess', language: 'en-US' },
        );
      }
      
      console.log('Formatted TTS voices:', formattedVoices);
      setAvailableVoices(formattedVoices);
    } catch (err) {
      console.log('Error loading available voices:', err);
      // Fallback to basic voices
      setAvailableVoices([
        { identifier: 'default', name: 'Default Voice', language: 'en-US' },
        { identifier: 'system-voice-1', name: 'System Voice 1', language: 'en-US' },
        { identifier: 'system-voice-2', name: 'System Voice 2', language: 'en-US' },
      ]);
    }
  };

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      console.log('Loading TTS settings...');
      
      // Try to load from AsyncStorage first (for offline access)
      const localSettings = await AsyncStorage.getItem(TTS_STORAGE_KEY);
      if (localSettings) {
        const parsed = JSON.parse(localSettings);
        console.log('Loaded TTS settings from AsyncStorage:', parsed);
        setSettings(parsed);
      }

      // Try to load from Supabase (without user authentication requirement)
      try {
        const { data, error } = await supabase
          .from('tts_settings')
          .select('*')
          .limit(1)
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
          console.log('Loaded TTS settings from Supabase:', supabaseSettings);
          setSettings(supabaseSettings);
          // Update local storage
          await AsyncStorage.setItem(TTS_STORAGE_KEY, JSON.stringify(supabaseSettings));
        }
      } catch (supabaseErr) {
        console.log('Supabase TTS settings load failed, using local storage only:', supabaseErr);
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

      // Save to AsyncStorage immediately
      await AsyncStorage.setItem(TTS_STORAGE_KEY, JSON.stringify(updatedSettings));

      // Try to save to Supabase (without user authentication requirement)
      try {
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
        } else {
          console.log('TTS settings saved to Supabase successfully');
        }
      } catch (supabaseErr) {
        console.log('Supabase TTS settings save failed, using local storage only:', supabaseErr);
      }

      console.log('TTS settings updated successfully:', updatedSettings);
    } catch (err) {
      console.log('Error updating TTS settings:', err);
      setError('Failed to update TTS settings');
    }
  }, [settings]);

  const speak = useCallback(async (text: string) => {
    try {
      console.log('Speaking text with settings:', { text, settings });
      
      const options: Speech.SpeechOptions = {
        language: settings.language,
        pitch: settings.pitch,
        rate: settings.rate,
      };

      // Only set voice if it's not the default
      if (settings.voiceIdentifier !== 'default') {
        options.voice = settings.voiceIdentifier;
      }

      console.log('Speech options:', options);
      await Speech.speak(text, options);
    } catch (err) {
      console.log('Error speaking text:', err);
      // Fallback to basic speech without voice settings
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

  const testVoice = useCallback(async (voiceIdentifier: string) => {
    try {
      const options: Speech.SpeechOptions = {
        language: settings.language,
        pitch: settings.pitch,
        rate: settings.rate,
      };

      if (voiceIdentifier !== 'default') {
        options.voice = voiceIdentifier;
      }

      console.log('Testing voice with options:', options);
      await Speech.speak('Hello, this is how I sound!', options);
    } catch (err) {
      console.log('Error testing voice:', err);
      // Fallback test
      await Speech.speak('Hello, this is how I sound!');
    }
  }, [settings]);

  return {
    settings,
    availableVoices,
    isLoading,
    error,
    updateSettings,
    speak,
    testVoice,
  };
}
