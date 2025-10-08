
import { useCallback, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, ScrollView } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import Icon from '../components/Icon';
import { commonStyles, colors } from '../styles/commonStyles';
import { useTTSSettings } from '../hooks/useTTSSettings';
import { useAdvancedAI } from '../hooks/useAdvancedAI';
import { useEmotionSettings } from '../hooks/useEmotionSettings';
import LandscapeGuard from '../components/LandscapeGuard';
import { useRouter } from 'expo-router';
import EmotionFace from '../components/EmotionFace';
import AdvancedSuggestionsRow from '../components/AdvancedSuggestionsRow';

export default function KeyboardScreen() {
  console.log('KeyboardScreen rendering...');
  
  const router = useRouter();
  const { speak } = useTTSSettings();
  const {
    recordUserInput,
    getAdvancedSuggestions,
    getTimeBasedSuggestions,
  } = useAdvancedAI();
  const { settings } = useEmotionSettings();
  
  const [typedText, setTypedText] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [sentenceHistory, setSentenceHistory] = useState<string[]>([]);

  useEffect(() => {
    // Lock orientation on native platforms only
    if (Platform.OS !== 'web') {
      try {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        console.log('Keyboard screen orientation locked to landscape');
      } catch (error) {
        console.log('Failed to lock screen orientation in keyboard screen:', error);
      }
    }
    
    console.log('Keyboard screen mounted successfully');
  }, []);

  // Update suggestions when text changes
  useEffect(() => {
    const updateSuggestions = async () => {
      if (typedText.trim().length > 0) {
        const words = typedText.trim().split(/\s+/);
        const availableWords: string[] = [];
        const aiSuggestions = await getAdvancedSuggestions(words, availableWords);
        setSuggestions(aiSuggestions.slice(0, 5));
      } else {
        // Get temporal suggestions when no text is typed
        const timeBasedSuggestions = await getTimeBasedSuggestions();
        const temporalSuggestions = timeBasedSuggestions.slice(0, 5).map(phrase => ({
          text: phrase,
          confidence: 0.6,
          type: 'temporal' as const,
          context: 'Common phrase'
        }));
        setSuggestions(temporalSuggestions);
      }
    };

    updateSuggestions();
  }, [typedText, getAdvancedSuggestions, getTimeBasedSuggestions]);

  const normalizeForTTS = (text: string) => {
    const lowered = text.toLowerCase();
    const cleaned = lowered.replace(/\s+/g, ' ').trim();
    return cleaned;
  };

  const handleSpeak = useCallback(async () => {
    if (!typedText.trim()) {
      console.log('No text to speak');
      return;
    }
    
    const ttsText = normalizeForTTS(typedText);
    console.log('Speaking typed sentence:', ttsText);
    
    await speak(ttsText);
    await recordUserInput(typedText, settings.selectedEmotion);
    
    // Add to history
    setSentenceHistory(prev => [typedText, ...prev.slice(0, 9)]);
    setTypedText('');
  }, [typedText, speak, recordUserInput, settings.selectedEmotion]);

  const handleClear = useCallback(() => {
    console.log('Clearing typed text');
    setTypedText('');
  }, []);

  const handleSuggestionPress = useCallback((suggestionText: string) => {
    console.log('Suggestion pressed:', suggestionText);
    
    // If it's a full sentence suggestion, replace the text
    if (suggestionText.split(' ').length > 2) {
      setTypedText(suggestionText);
    } else {
      // Otherwise append to current text
      setTypedText(prev => {
        const trimmed = prev.trim();
        return trimmed ? `${trimmed} ${suggestionText}` : suggestionText;
      });
    }
  }, []);

  const handleHistoryPress = useCallback((sentence: string) => {
    console.log('History item pressed:', sentence);
    setTypedText(sentence);
  }, []);

  const handleBackToMenu = () => {
    console.log('Going back to main menu');
    router.push('/main-menu');
  };

  const handleOpenSettings = () => {
    console.log('Opening settings');
    router.push('/settings');
  };

  return (
    <LandscapeGuard>
      <View style={[commonStyles.container, styles.container]}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={handleBackToMenu} style={styles.iconBtn} activeOpacity={0.8}>
            <Icon name="home-outline" size={32} color={colors.text} />
          </TouchableOpacity>
          
          <Text style={styles.appTitle}>Keyboard Mode</Text>
          
          <View style={styles.rightSection}>
            <View style={styles.emotionContainer}>
              <EmotionFace emotion={settings.selectedEmotion} size={60} />
            </View>
            <TouchableOpacity onPress={handleOpenSettings} style={styles.iconBtn} activeOpacity={0.8}>
              <Icon name="settings-outline" size={32} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Text Input Area */}
          <View style={styles.inputSection}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Type your sentence here, mate..."
                placeholderTextColor={colors.textSecondary}
                value={typedText}
                onChangeText={setTypedText}
                multiline
                autoFocus
                autoCorrect
                autoCapitalize="sentences"
              />
              
              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  onPress={handleClear} 
                  style={[styles.actionBtn, styles.clearBtn]}
                  activeOpacity={0.8}
                >
                  <Icon name="close-outline" size={24} color={colors.danger} />
                  <Text style={[styles.actionBtnText, { color: colors.danger }]}>Clear</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={handleSpeak} 
                  style={[styles.actionBtn, styles.speakBtn]}
                  activeOpacity={0.8}
                  disabled={!typedText.trim()}
                >
                  <Icon name="volume-high-outline" size={24} color="#FFFFFF" />
                  <Text style={[styles.actionBtnText, { color: '#FFFFFF' }]}>Speak</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <View style={styles.suggestionsSection}>
              <Text style={styles.sectionTitle}>Suggestions</Text>
              <AdvancedSuggestionsRow
                suggestions={suggestions}
                onPressSuggestion={handleSuggestionPress}
                showDetails={false}
              />
            </View>
          )}

          {/* History */}
          {sentenceHistory.length > 0 && (
            <View style={styles.historySection}>
              <Text style={styles.sectionTitle}>Recent Sentences</Text>
              <ScrollView 
                style={styles.historyScroll}
                showsVerticalScrollIndicator={false}
              >
                {sentenceHistory.map((sentence, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.historyItem}
                    onPress={() => handleHistoryPress(sentence)}
                    activeOpacity={0.8}
                  >
                    <Icon name="time-outline" size={20} color={colors.textSecondary} />
                    <Text style={styles.historyText} numberOfLines={1}>
                      {sentence}
                    </Text>
                    <Icon name="chevron-forward-outline" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </View>
    </LandscapeGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  topBar: {
    width: '100%',
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  iconBtn: {
    backgroundColor: colors.backgroundAlt,
    padding: 16,
    borderRadius: 16,
    boxShadow: '0px 6px 14px rgba(0,0,0,0.08)',
    minWidth: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTitle: {
    fontSize: 22,
    fontFamily: 'Montserrat_700Bold',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12 as any,
  },
  emotionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  inputSection: {
    marginBottom: 16,
  },
  inputContainer: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 20,
    padding: 20,
    boxShadow: '0px 6px 20px rgba(0,0,0,0.08)',
  },
  textInput: {
    fontSize: 20,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
    minHeight: 120,
    maxHeight: 180,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12 as any,
    justifyContent: 'flex-end',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8 as any,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
  },
  clearBtn: {
    backgroundColor: '#FEE2E2',
  },
  speakBtn: {
    backgroundColor: colors.primary,
  },
  actionBtnText: {
    fontSize: 16,
    fontFamily: 'Montserrat_700Bold',
  },
  suggestionsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Montserrat_700Bold',
    color: colors.text,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  historySection: {
    flex: 1,
  },
  historyScroll: {
    flex: 1,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12 as any,
    backgroundColor: colors.backgroundAlt,
    padding: 16,
    borderRadius: 14,
    marginBottom: 8,
    boxShadow: '0px 4px 10px rgba(0,0,0,0.06)',
  },
  historyText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
  },
});
