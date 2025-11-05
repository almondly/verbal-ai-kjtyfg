
import { useCallback, useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, ScrollView } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { commonStyles, colors } from '../styles/commonStyles';
import CategoryBar from '../components/CategoryBar';
import { categories } from '../data/categories';
import EmotionFace from '../components/EmotionFace';
import { useEmotionSettings } from '../hooks/useEmotionSettings';
import AdvancedSuggestionsRow from '../components/AdvancedSuggestionsRow';
import { useAdvancedAI } from '../hooks/useAdvancedAI';
import { useVoiceSettings } from '../hooks/useVoiceSettings';
import Icon from '../components/Icon';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

export default function KeyboardScreen() {
  const router = useRouter();

  useEffect(() => {
    console.log('Keyboard screen mounted');
    (async () => {
      if (Platform.OS !== 'web') {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      }
    })();
  }, []);

  const [typedText, setTypedText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('keyboard');
  const { getAdvancedSuggestions, getTimeBasedSuggestions, recordUserInput } = useAdvancedAI();
  const { settings: emotionSettings } = useEmotionSettings();
  const { speak, stopSpeaking } = useVoiceSettings();
  const [advancedSuggestions, setAdvancedSuggestions] = useState<any[]>([]);
  const [lastSpokenText, setLastSpokenText] = useState<string>('');
  const isNavigatingRef = useRef(false);

  // Stop speech when screen loses focus (e.g., navigating to settings)
  useFocusEffect(
    useCallback(() => {
      console.log('📱 Keyboard screen focused');
      isNavigatingRef.current = false;
      
      // Cleanup function runs when screen loses focus
      return () => {
        console.log('📱 Keyboard screen unfocused - stopping speech');
        stopSpeaking();
      };
    }, [stopSpeaking])
  );

  // Handle category selection - redirect to communication screen if not keyboard
  useEffect(() => {
    if (selectedCategory !== 'keyboard' && !isNavigatingRef.current) {
      console.log('🔄 Category changed to:', selectedCategory, '- redirecting to communication screen');
      isNavigatingRef.current = true;
      // Pass the selected category to the communication screen
      router.push({
        pathname: '/communication',
        params: { category: selectedCategory }
      });
    }
  }, [selectedCategory, router]);

  useEffect(() => {
    (async () => {
      if (!typedText.trim()) {
        const timeBased = await getTimeBasedSuggestions();
        const initialSuggestions = timeBased.slice(0, 10).map((phrase, index) => ({
          text: phrase.split(' ')[0],
          confidence: Math.max(0.6, 0.8 - index * 0.05),
          type: 'temporal' as const,
          context: 'Common starter word'
        }));
        
        const commonStarters = ['I', 'you', 'want', 'need', 'can', 'what', 'where', 'help', 'please', 'like'];
        commonStarters.forEach((word, index) => {
          if (!initialSuggestions.some(s => s.text.toLowerCase() === word.toLowerCase())) {
            initialSuggestions.push({
              text: word,
              confidence: Math.max(0.5, 0.7 - index * 0.05),
              type: 'contextual' as const,
              context: 'Common word'
            });
          }
        });
        
        setAdvancedSuggestions(initialSuggestions.slice(0, 10));
        return;
      }

      const words = typedText.trim().split(/\s+/);
      const [advanced, timeBased] = await Promise.all([
        getAdvancedSuggestions(words, [], 10, undefined),
        getTimeBasedSuggestions(),
      ]);

      const combined = [...advanced, ...timeBased.slice(0, 3).map((phrase, index) => ({
        text: phrase,
        confidence: Math.max(0.5, 0.7 - index * 0.05),
        type: 'temporal' as const,
        context: 'Common phrase'
      }))]
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 10);

      setAdvancedSuggestions(combined);
    })();
  }, [typedText, getAdvancedSuggestions, getTimeBasedSuggestions]);

  const handleDeleteLastWord = useCallback(() => {
    setTypedText(prev => {
      const words = prev.trim().split(/\s+/);
      if (words.length === 0 || (words.length === 1 && !words[0])) return '';
      words.pop();
      return words.join(' ');
    });
  }, []);

  const handleReplayLastSentence = useCallback(async () => {
    if (!lastSpokenText.trim()) return;
    
    const normalized = normalizeForTTS(lastSpokenText);
    await speak(normalized);
  }, [lastSpokenText, speak]);

  const handleSpeak = useCallback(async () => {
    if (!typedText.trim()) return;
    
    const normalized = normalizeForTTS(typedText);
    await speak(normalized);
    
    setLastSpokenText(typedText);
    
    await recordUserInput(typedText, undefined);
  }, [typedText, speak, recordUserInput]);

  const normalizeForTTS = (text: string): string => {
    return text
      .replace(/\bi\b/gi, 'I')
      .replace(/\bim\b/gi, "I'm")
      .replace(/\bive\b/gi, "I've")
      .replace(/\bill\b/gi, "I'll")
      .replace(/\bid\b/gi, "I'd")
      .replace(/\bu\b/gi, 'you')
      .replace(/\bur\b/gi, 'your')
      .replace(/\br\b/gi, 'are')
      .replace(/\bu r\b/gi, 'you are')
      .trim();
  };

  const handleBackToMenu = useCallback(() => {
    router.push('/main-menu');
  }, [router]);

  const handleOpenSettings = useCallback(() => {
    router.push('/settings');
  }, [router]);

  const handleSuggestionPress = useCallback((text: string, isFullSentence: boolean) => {
    if (isFullSentence) {
      // For full sentences, check if the suggestion starts with the current input
      const currentInput = typedText.trim().toLowerCase();
      const suggestionLower = text.toLowerCase();
      
      if (suggestionLower.startsWith(currentInput) && currentInput) {
        // Replace the entire input with the suggestion
        setTypedText(text);
      } else {
        // Append the suggestion to the current input
        setTypedText(prev => {
          const trimmed = prev.trim();
          return trimmed ? `${trimmed} ${text}` : text;
        });
      }
    } else {
      // For single words, check if the last word matches the beginning of the suggestion
      const words = typedText.trim().split(/\s+/);
      const lastWord = words.length > 0 && words[words.length - 1] ? words[words.length - 1].toLowerCase() : '';
      const suggestionLower = text.toLowerCase();
      
      if (lastWord && suggestionLower.startsWith(lastWord)) {
        // Replace the last word with the suggestion
        words[words.length - 1] = text;
        setTypedText(words.join(' '));
      } else {
        // Append the suggestion
        setTypedText(prev => {
          const trimmed = prev.trim();
          return trimmed ? `${trimmed} ${text}` : text;
        });
      }
    }
  }, [typedText]);

  const handleTextChange = useCallback((text: string) => {
    setTypedText(text);
  }, []);

  const handleClearText = useCallback(() => {
    setTypedText('');
  }, []);

  const handleCategorySelect = useCallback((categoryId: string) => {
    console.log('🎯 Category selected in keyboard screen:', categoryId);
    setSelectedCategory(categoryId);
  }, []);

  return (
    <View style={[commonStyles.container, styles.container]}>
      {/* Top Bar with Back, Emotion, and Settings */}
      <View style={styles.topBar}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBackToMenu}
          activeOpacity={0.8}
        >
          <Icon name="arrow-back-outline" size={24} color={colors.text} />
          <Text style={styles.backButtonText}>Menu</Text>
        </TouchableOpacity>

        <View style={styles.emotionContainer}>
          <EmotionFace emotion={emotionSettings.selectedEmotion} size={50} />
        </View>

        <TouchableOpacity 
          style={styles.settingsButton} 
          onPress={handleOpenSettings}
          activeOpacity={0.8}
        >
          <Icon name="settings-outline" size={28} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Text Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={typedText}
          onChangeText={handleTextChange}
          placeholder="Type your message here..."
          placeholderTextColor={colors.textSecondary}
          multiline
          autoFocus
        />
        <View style={styles.inputActions}>
          <View style={styles.leftActions}>
            <TouchableOpacity 
              style={[styles.deleteWordButton, !typedText.trim() && styles.buttonDisabled]} 
              onPress={handleDeleteLastWord}
              disabled={!typedText.trim()}
              activeOpacity={0.8}
            >
              <Icon name="backspace-outline" size={22} color={colors.text} />
              <Text style={styles.deleteWordButtonText}>Delete Word</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.replayButton, !lastSpokenText && styles.buttonDisabled]} 
              onPress={handleReplayLastSentence}
              disabled={!lastSpokenText}
              activeOpacity={0.8}
            >
              <Icon name="play-outline" size={22} color={colors.text} />
              <Text style={styles.replayButtonText}>Replay</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.rightActions}>
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={handleClearText}
              activeOpacity={0.8}
            >
              <Icon name="close-circle-outline" size={24} color={colors.textSecondary} />
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.speakButton, !typedText.trim() && styles.speakButtonDisabled]} 
              onPress={handleSpeak}
              disabled={!typedText.trim()}
              activeOpacity={0.8}
            >
              <Icon name="volume-high-outline" size={28} color={colors.white} />
              <Text style={styles.speakButtonText}>Speak</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* AI Suggestions */}
      <ScrollView 
        style={styles.suggestionsContainer}
        showsVerticalScrollIndicator={false}
      >
        {advancedSuggestions.length > 0 ? (
          <AdvancedSuggestionsRow
            suggestions={advancedSuggestions}
            onPressSuggestion={handleSuggestionPress}
            onRemoveWord={(word) => {
              setTypedText(prev => {
                const words = prev.trim().split(/\s+/);
                const index = words.findIndex(w => w.toLowerCase() === word.toLowerCase());
                if (index !== -1) {
                  words.splice(index, 1);
                  return words.join(' ');
                }
                return prev;
              });
            }}
            style={styles.suggestions}
          />
        ) : (
          <View style={styles.emptySuggestionsContainer}>
            <Text style={styles.emptySuggestionsText}>
              Start typing to see AI predictions
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Category Bar */}
      <View style={styles.categoryBarContainer}>
        <CategoryBar
          categories={categories}
          selectedId={selectedCategory}
          onSelect={handleCategorySelect}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.backgroundAlt,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    zIndex: 10,
    elevation: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8 as any,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  backButtonText: {
    fontSize: 15,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
  },
  emotionContainer: {
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -25 }],
  },
  settingsButton: {
    padding: 8,
    backgroundColor: colors.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.backgroundAlt,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    zIndex: 9,
    elevation: 9,
  },
  textInput: {
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    fontSize: 18,
    fontFamily: 'Montserrat_500Medium',
    color: colors.text,
    minHeight: 100,
    maxHeight: 150,
    textAlignVertical: 'top',
  },
  inputActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  leftActions: {
    flexDirection: 'row',
    gap: 8 as any,
  },
  rightActions: {
    flexDirection: 'row',
    gap: 8 as any,
  },
  deleteWordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6 as any,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  deleteWordButtonText: {
    fontSize: 13,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
  },
  replayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6 as any,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  replayButtonText: {
    fontSize: 13,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6 as any,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  clearButtonText: {
    fontSize: 15,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.textSecondary,
  },
  speakButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8 as any,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  speakButtonDisabled: {
    backgroundColor: colors.textSecondary,
    borderColor: colors.textSecondary,
    opacity: 0.5,
  },
  speakButtonText: {
    fontSize: 16,
    fontFamily: 'Montserrat_700Bold',
    color: colors.white,
  },
  suggestionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.backgroundAlt,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    minHeight: 100,
    maxHeight: 120,
    zIndex: 8,
    elevation: 8,
  },
  suggestions: {
    flex: 1,
  },
  emptySuggestionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptySuggestionsText: {
    fontSize: 13,
    fontFamily: 'Montserrat_500Medium',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  categoryBarContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 7,
    elevation: 7,
  },
});
