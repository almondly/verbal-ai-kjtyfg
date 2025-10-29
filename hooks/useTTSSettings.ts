
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

// SIMPLIFIED: Only 3 distinct voices - Girl, Boy, Neutral
const SIMPLIFIED_VOICES: TTSVoice[] = [
  { identifier: 'girl', name: 'Girl Voice', language: 'en-US' },
  { identifier: 'boy', name: 'Boy Voice', language: 'en-US' },
  { identifier: 'neutral', name: 'Neutral Voice', language: 'en-US' },
];

// CRITICAL FIX: Use ACTUAL different voice identifiers instead of just pitch
// These are the actual system voice names that sound distinctly different
const VOICE_MAPPINGS = {
  girl: {
    // Female voices - prioritize high, clear voices
    preferredVoices: [
      'com.apple.voice.compact.en-US.Samantha',
      'com.apple.ttsbundle.Samantha-compact',
      'Samantha',
      'Karen',
      'Victoria',
      'Allison',
      'Susan',
      'Zoe',
      'Fiona',
    ],
    fallbackPitch: 1.3,
    fallbackRate: 1.1,
    description: 'Clear, feminine voice',
  },
  boy: {
    // Male voices - prioritize deep, masculine voices
    preferredVoices: [
      'com.apple.voice.compact.en-US.Aaron',
      'com.apple.ttsbundle.Aaron-compact',
      'Aaron',
      'Alex',
      'Daniel',
      'Fred',
      'Arthur',
      'Tom',
      'Oliver',
    ],
    fallbackPitch: 0.8,
    fallbackRate: 0.95,
    description: 'Deep, masculine voice',
  },
  neutral: {
    // Neutral/default voices
    preferredVoices: [
      'com.apple.voice.compact.en-US.Samantha',
      'com.apple.ttsbundle.Samantha-compact',
      'Samantha',
      'en-US-language',
    ],
    fallbackPitch: 1.0,
    fallbackRate: 1.0,
    description: 'Clear, balanced voice',
  },
};

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
      console.log('Available voice identifiers:', englishVoices.map(v => `${v.name} (${v.identifier})`).join(', '));
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

  // CRITICAL FIX: Find the best matching ACTUAL voice from system voices
  const findBestVoice = useCallback((voiceType: string): string | undefined => {
    if (systemVoices.length === 0) return undefined;
    
    console.log('🎤 Finding best voice for type:', voiceType);
    
    const mapping = VOICE_MAPPINGS[voiceType as keyof typeof VOICE_MAPPINGS];
    if (!mapping) return undefined;

    // Try to find a voice that matches the preferred identifiers
    for (const preferredIdentifier of mapping.preferredVoices) {
      const voice = systemVoices.find(v => 
        v.identifier === preferredIdentifier ||
        v.identifier.includes(preferredIdentifier) ||
        v.name === preferredIdentifier ||
        v.name.includes(preferredIdentifier)
      );
      
      if (voice) {
        console.log(`✅ Found ${voiceType} voice:`, voice.name, voice.identifier);
        return voice.identifier;
      }
    }
    
    // Fallback: return first English voice
    const fallbackVoice = systemVoices.find(v => v.language === 'en-US' || v.language.startsWith('en-'));
    console.log('⚠️ Using fallback voice:', fallbackVoice?.identifier, fallbackVoice?.name);
    return fallbackVoice?.identifier;
  }, [systemVoices]);

  // Get voice characteristics for a given voice type
  const getVoiceCharacteristics = useCallback((voiceType: string) => {
    return VOICE_MAPPINGS[voiceType as keyof typeof VOICE_MAPPINGS] || VOICE_MAPPINGS.neutral;
  }, []);

  const speak = useCallback(async (text: string) => {
    try {
      console.log('🔊 Speaking text with settings:', { text, settings });
      
      // Get voice characteristics
      const characteristics = getVoiceCharacteristics(settings.voiceIdentifier);
      
      const options: Speech.SpeechOptions = {
        language: settings.language,
        // Use fallback pitch/rate only if we can't find a specific voice
        pitch: settings.pitch * characteristics.fallbackPitch,
        rate: settings.rate * characteristics.fallbackRate,
      };

      // CRITICAL FIX: Try to use the actual voice identifier
      const voiceIdentifier = findBestVoice(settings.voiceIdentifier);

      if (voiceIdentifier) {
        options.voice = voiceIdentifier;
        console.log('✅ Using specific voice identifier:', voiceIdentifier);
      } else {
        console.log('⚠️ No specific voice found, using pitch/rate adjustments');
      }

      console.log('🎤 Speech options:', options);
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
  }, [settings, findBestVoice, getVoiceCharacteristics]);

  const testVoice = useCallback(async (voiceIdentifier: string) => {
    try {
      // Get voice characteristics
      const characteristics = getVoiceCharacteristics(voiceIdentifier);
      
      const options: Speech.SpeechOptions = {
        language: settings.language,
        pitch: settings.pitch * characteristics.fallbackPitch,
        rate: settings.rate * characteristics.fallbackRate,
      };

      // CRITICAL FIX: Try to use the actual voice identifier
      const actualVoiceId = findBestVoice(voiceIdentifier);

      if (actualVoiceId) {
        options.voice = actualVoiceId;
        console.log('✅ Testing voice with identifier:', actualVoiceId);
      }

      console.log('🎤 Testing voice with options:', options);
      
      // Use a longer test phrase to better demonstrate the voice
      const testPhrase = voiceIdentifier === 'girl' 
        ? 'Hi! I am the girl voice. I sound bright and cheerful!'
        : voiceIdentifier === 'boy'
        ? 'Hello. I am the boy voice. I sound deep and steady.'
        : 'Hello, I am the neutral voice. I sound clear and balanced.';
      
      await Speech.speak(testPhrase, options);
    } catch (err) {
      console.log('Error testing voice:', err);
      // Fallback test
      await Speech.speak('Hello, this is how I sound!');
    }
  }, [settings, findBestVoice, getVoiceCharacteristics]);

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
