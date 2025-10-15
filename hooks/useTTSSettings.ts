
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../app/integrations/supabase/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

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
  voiceIdentifier: 'neutral',
  voiceName: 'Neutral Voice',
  language: 'en-US',
  pitch: 1.0,
  rate: 1.0,
};

const TTS_STORAGE_KEY = 'tts_settings';

// Properly configured voice options for Male, Female, and Neutral
// These are platform-specific identifiers that work correctly
const SIMPLIFIED_VOICES: TTSVoice[] = [
  { identifier: 'neutral', name: 'Neutral Voice', language: 'en-US' },
  { identifier: 'female', name: 'Female Voice', language: 'en-US' },
  { identifier: 'male', name: 'Male Voice', language: 'en-US' },
];

export function useTTSSettings() {
  const [settings, setSettings] = useState<TTSSettings>(DEFAULT_TTS_SETTINGS);
  const [availableVoices, setAvailableVoices] = useState<TTSVoice[]>(SIMPLIFIED_VOICES);
  const [systemVoices, setSystemVoices] = useState<Speech.Voice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load available voices from the system
  useEffect(() => {
    loadAvailableVoices();
  }, []);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadAvailableVoices = async () => {
    try {
      console.log('Loading system TTS voices...');
      
      // Get all available voices from the system
      const voices = await Speech.getAvailableVoicesAsync();
      console.log('System voices loaded:', voices.length);
      
      // Filter for English voices only
      const englishVoices = voices.filter(v => 
        v.language.startsWith('en-') || v.language === 'en'
      );
      
      console.log('English voices found:', englishVoices.length);
      setSystemVoices(englishVoices);
      
      // Always use our simplified three-voice system
      setAvailableVoices(SIMPLIFIED_VOICES);
      console.log('Simplified TTS voices configured:', SIMPLIFIED_VOICES);
    } catch (err) {
      console.log('Error loading available voices:', err);
      // Fallback to our simplified list
      setAvailableVoices(SIMPLIFIED_VOICES);
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

  // Helper function to find the best matching voice from system voices
  const findBestVoice = useCallback((voiceType: string): string | undefined => {
    if (systemVoices.length === 0) return undefined;
    
    console.log('Finding best voice for type:', voiceType);
    
    // Platform-specific voice selection with improved male and neutral voices
    if (Platform.OS === 'ios') {
      // iOS voice identifiers
      if (voiceType === 'male') {
        // Look for deeper male voices like Alex, Daniel, Fred
        const maleVoice = systemVoices.find(v => 
          v.identifier.includes('Alex') || 
          v.identifier.includes('Daniel') ||
          v.identifier.includes('Fred') ||
          v.name.toLowerCase().includes('alex') ||
          v.name.toLowerCase().includes('daniel') ||
          v.name.toLowerCase().includes('fred')
        );
        if (maleVoice) {
          console.log('Found male voice:', maleVoice.identifier);
          return maleVoice.identifier;
        }
      } else if (voiceType === 'female') {
        // Look for female voices like Samantha, Karen, Victoria
        const femaleVoice = systemVoices.find(v => 
          v.identifier.includes('Samantha') || 
          v.identifier.includes('Karen') ||
          v.identifier.includes('Victoria') ||
          v.name.toLowerCase().includes('samantha') ||
          v.name.toLowerCase().includes('karen') ||
          v.name.toLowerCase().includes('victoria')
        );
        if (femaleVoice) {
          console.log('Found female voice:', femaleVoice.identifier);
          return femaleVoice.identifier;
        }
      } else if (voiceType === 'neutral') {
        // Look for neutral voices - prefer Siri or default system voice
        const neutralVoice = systemVoices.find(v => 
          v.identifier.includes('Siri') ||
          v.name.toLowerCase().includes('siri') ||
          v.identifier.includes('Default')
        );
        if (neutralVoice) {
          console.log('Found neutral voice:', neutralVoice.identifier);
          return neutralVoice.identifier;
        }
      }
    } else if (Platform.OS === 'android') {
      // Android voice identifiers
      if (voiceType === 'male') {
        // Look for male voices with lower pitch
        const maleVoice = systemVoices.find(v => 
          v.language === 'en-US' && 
          (v.name.toLowerCase().includes('male') || 
           v.name.toLowerCase().includes('man') ||
           v.quality === Speech.VoiceQuality.Enhanced)
        );
        if (maleVoice) {
          console.log('Found male voice:', maleVoice.identifier);
          return maleVoice.identifier;
        }
      } else if (voiceType === 'female') {
        const femaleVoice = systemVoices.find(v => 
          v.language === 'en-US' && 
          v.name.toLowerCase().includes('female')
        );
        if (femaleVoice) {
          console.log('Found female voice:', femaleVoice.identifier);
          return femaleVoice.identifier;
        }
      } else if (voiceType === 'neutral') {
        // Look for default or standard voice
        const neutralVoice = systemVoices.find(v => 
          v.language === 'en-US' && 
          (v.name.toLowerCase().includes('default') || 
           v.name.toLowerCase().includes('standard'))
        );
        if (neutralVoice) {
          console.log('Found neutral voice:', neutralVoice.identifier);
          return neutralVoice.identifier;
        }
      }
    }
    
    // Fallback: return first English voice
    const fallbackVoice = systemVoices.find(v => v.language === 'en-US' || v.language.startsWith('en-'));
    console.log('Using fallback voice:', fallbackVoice?.identifier);
    return fallbackVoice?.identifier;
  }, [systemVoices]);

  const speak = useCallback(async (text: string) => {
    try {
      console.log('Speaking text with settings:', { text, settings });
      
      const options: Speech.SpeechOptions = {
        language: settings.language,
        pitch: settings.pitch,
        rate: settings.rate,
      };

      // Map our simplified voice types to actual system voices
      let voiceIdentifier: string | undefined;
      
      if (settings.voiceIdentifier === 'male') {
        voiceIdentifier = findBestVoice('male');
        // Adjust pitch for more masculine sound
        options.pitch = Math.max(0.7, settings.pitch - 0.2);
      } else if (settings.voiceIdentifier === 'female') {
        voiceIdentifier = findBestVoice('female');
        // Keep pitch slightly higher for feminine sound
        options.pitch = Math.min(1.3, settings.pitch + 0.1);
      } else if (settings.voiceIdentifier === 'neutral') {
        voiceIdentifier = findBestVoice('neutral');
        // Neutral pitch - slightly lower than default but not as low as male
        options.pitch = Math.max(0.85, settings.pitch - 0.1);
      }

      // Only set voice if we found a matching one
      if (voiceIdentifier) {
        options.voice = voiceIdentifier;
        console.log('Using voice identifier:', voiceIdentifier);
      } else {
        console.log('No specific voice found, using system default');
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
  }, [settings, findBestVoice]);

  const testVoice = useCallback(async (voiceIdentifier: string) => {
    try {
      const options: Speech.SpeechOptions = {
        language: settings.language,
        pitch: settings.pitch,
        rate: settings.rate,
      };

      // Map our simplified voice types to actual system voices
      let actualVoiceId: string | undefined;
      
      if (voiceIdentifier === 'male') {
        actualVoiceId = findBestVoice('male');
        // Adjust pitch for more masculine sound
        options.pitch = Math.max(0.7, settings.pitch - 0.2);
      } else if (voiceIdentifier === 'female') {
        actualVoiceId = findBestVoice('female');
        // Keep pitch slightly higher for feminine sound
        options.pitch = Math.min(1.3, settings.pitch + 0.1);
      } else if (voiceIdentifier === 'neutral') {
        actualVoiceId = findBestVoice('neutral');
        // Neutral pitch - slightly lower than default but not as low as male
        options.pitch = Math.max(0.85, settings.pitch - 0.1);
      }

      if (actualVoiceId) {
        options.voice = actualVoiceId;
        console.log('Testing voice with identifier:', actualVoiceId);
      }

      console.log('Testing voice with options:', options);
      await Speech.speak('Hello, this is how I sound!', options);
    } catch (err) {
      console.log('Error testing voice:', err);
      // Fallback test
      await Speech.speak('Hello, this is how I sound!');
    }
  }, [settings, findBestVoice]);

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
