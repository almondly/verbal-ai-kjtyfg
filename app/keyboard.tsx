
import { useCallback, useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, ScrollView, PanResponder } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { commonStyles, colors } from '../styles/commonStyles';
import CategoryBar from '../components/CategoryBar';
import { categories } from '../data/categories';
import EmotionFace from '../components/EmotionFace';
import { useEmotionSettings } from '../hooks/useEmotionSettings';
import LandscapeGuard from '../components/LandscapeGuard';
import AdvancedSuggestionsRow from '../components/AdvancedSuggestionsRow';
import { useAdvancedAI } from '../hooks/useAdvancedAI';
import { useTTSSettings } from '../hooks/useTTSSettings';
import Icon from '../components/Icon';
import { useRouter } from 'expo-router';
import { useIdleDetection } from '../hooks/useIdleDetection';

export default function KeyboardScreen() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      }
    })();
  }, []);

  // Idle detection - navigate to home after 60 seconds
  const { resetTimer } = useIdleDetection({
    timeout: 60000, // 60 seconds
    onIdle: () => {
      console.log('User idle for 60 seconds, navigating to home screen');
      router.push('/main-menu');
    },
  });

  // Create a PanResponder to capture ALL touch events on the screen
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => {
        resetTimer();
        return false; // Don't capture the event, just reset timer
      },
      onMoveShouldSetPanResponder: () => {
        resetTimer();
        return false; // Don't capture the event, just reset timer
      },
      onPanResponderTerminationRequest: () => true,
    })
  ).current;

  const [typedText, setTypedText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { getAdvancedSuggestions, getTimeBasedSuggestions, recordUserInput } = useAdvancedAI();
  const { currentEmotion } = useEmotionSettings();
  const { speak } = useTTSSettings();
  const [advancedSuggestions, setAdvancedSuggestions] = useState<any[]>([]);
  const [lastSpokenText, setLastSpokenText] = useState<string>('');

  useEffect(() => {
    (async () => {
      if (!typedText.trim()) {
        // Show initial suggestions when no text is typed
        const timeBased = await getTimeBasedSuggestions();
        const initialSuggestions = timeBased.slice(0, 10).map((phrase, index) => ({
          text: phrase.split(' ')[0], // Get first word of common phrases
          confidence: Math.max(0.6, 0.8 - index * 0.05),
          type: 'temporal' as const,
          context: 'Common starter word'
        }));
        
        // Add some common starter words if we don't have enough
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
        getAdvancedSuggestions(words, [], 10, selectedCategory !== 'all' ? selectedCategory : undefined),
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
  }, [typedText, getAdvancedSuggestions, getTimeBasedSuggestions, selectedCategory]);

  const handleDeleteLastWord = useCallback(() => {
    resetTimer(); // Reset idle timer on user activity
    setTypedText(prev => {
      const words = prev.trim().split(/\s+/);
      if (words.length === 0 || (words.length === 1 && !words[0])) return '';
      words.pop();
      return words.join(' ');
    });
  }, [resetTimer]);

  const handleReplayLastSentence = useCallback(async () => {
    resetTimer(); // Reset idle timer on user activity
    if (!lastSpokenText.trim()) return;
    
    const normalized = normalizeForTTS(lastSpokenText);
    await speak(normalized);
  }, [lastSpokenText, speak, resetTimer]);

  const handleSpeak = useCallback(async () => {
    resetTimer(); // Reset idle timer on user activity
    if (!typedText.trim()) return;
    
    const normalized = normalizeForTTS(typedText);
    await speak(normalized);
    
    // Store the last spoken text for replay
    setLastSpokenText(typedText);
    
    // Record the sentence for AI learning
    await recordUserInput(typedText, selectedCategory !== 'all' ? selectedCategory : undefined);
  }, [typedText, speak, recordUserInput, selectedCategory, resetTimer]);

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
    resetTimer(); // Reset idle timer on user activity
    router.push('/main-menu');
  }, [router, resetTimer]);

  const handleOpenSettings = useCallback(() => {
    resetTimer(); // Reset idle timer on user activity
    router.push('/settings');
  }, [router, resetTimer]);

  // Handle suggestion press with full sentence replacement logic
  const handleSuggestionPress = useCallback((text: string, isFullSentence: boolean) => {
    resetTimer(); // Reset idle timer on user activity
    if (isFullSentence) {
      // Replace entire text with the full sentence
      setTypedText(text);
    } else {
      // Add word to existing text
      setTypedText(prev => {
        const trimmed = prev.trim();
        return trimmed ? `${trimmed} ${text}` : text;
      });
    }
  }, [resetTimer]);

  const handleTextChange = useCallback((text: string) => {
    resetTimer(); // Reset idle timer on EVERY keystroke/text change
    setTypedText(text);
  }, [resetTimer]);

  const handleClearText = useCallback(() => {
    resetTimer(); // Reset idle timer on user activity
    setTypedText('');
  }, [resetTimer]);

  const handleCategorySelect = useCallback((categoryId: string) => {
    resetTimer(); // Reset idle timer on user activity
    setSelectedCategory(categoryId);
  }, [resetTimer]);

  return (
    <LandscapeGuard>
      <View 
        style={[commonStyles.container, styles.container]}
        {...panResponder.panHandlers}
      >
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
            <EmotionFace emotion={currentEmotion} size={50} />
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
            onTouchStart={resetTimer}
            onFocus={resetTimer}
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
        <View style={styles.suggestionsContainer}>
          {advancedSuggestions.length > 0 ? (
            <AdvancedSuggestionsRow
              suggestions={advancedSuggestions}
              onPressSuggestion={handleSuggestionPress}
              onRemoveWord={(word) => {
                resetTimer(); // Reset idle timer on user activity
                // Remove the word from the typed text when tense is changed
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
        </View>

        {/* Category Bar */}
        <View style={styles.categoryBarContainer}>
          <CategoryBar
            categories={categories}
            selectedId={selectedCategory}
            onSelect={handleCategorySelect}
          />
        </View>
      </View>
    </LandscapeGuard>
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
    borderBottomWidth: 2,
    borderBottomColor: colors.borderLight,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8 as any,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.background,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.borderLight,
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
    borderWidth: 2,
    borderColor: colors.borderLight,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.backgroundAlt,
    borderBottomWidth: 2,
    borderBottomColor: colors.borderLight,
  },
  textInput: {
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.borderLight,
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
    borderWidth: 2,
    borderColor: colors.borderLight,
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
    borderWidth: 2,
    borderColor: colors.borderLight,
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
    borderWidth: 2,
    borderColor: colors.borderLight,
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
    backgroundColor: colors.primary,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
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
    borderBottomWidth: 2,
    borderBottomColor: colors.borderLight,
    minHeight: 100,
    maxHeight: 120,
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
  },
});
