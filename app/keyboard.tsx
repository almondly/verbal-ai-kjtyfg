
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
import CategoryBar from '../components/CategoryBar';
import { categories } from '../data/categories';

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
  const [selectedCategory, setSelectedCategory] = useState<string>('keyboard');

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

  const handleCategorySelect = useCallback((categoryId: string) => {
    console.log('Category selected:', categoryId);
    if (categoryId === 'keyboard') {
      setSelectedCategory('keyboard');
    } else {
      console.log('Navigating to communication screen');
      router.push('/communication');
    }
  }, [router]);

  return (
    <LandscapeGuard>
      <View style={[commonStyles.container, { paddingHorizontal: 8 }]}>
        {/* Top Bar - Matching communication screen */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={handleBackToMenu} style={styles.iconBtn} activeOpacity={0.8}>
            <Icon name="home-outline" size={32} color={colors.text} />
          </TouchableOpacity>
          
          <Text style={styles.appTitle}>COMpanion</Text>
          
          <View style={styles.rightSection}>
            <View style={styles.emotionContainer}>
              <EmotionFace emotion={settings.selectedEmotion} size={60} />
            </View>
            <TouchableOpacity onPress={handleOpenSettings} style={styles.iconBtn} activeOpacity={0.8}>
              <Icon name="settings-outline" size={32} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Phrase Bar Area - Shows current typed text */}
        <View style={styles.phraseBarContainer}>
          <View style={styles.phraseBar}>
            <ScrollView 
              horizontal 
              style={styles.phraseScroll}
              showsHorizontalScrollIndicator={false}
            >
              <Text style={styles.phraseText}>
                {typedText || 'Type your sentence here...'}
              </Text>
            </ScrollView>
            <View style={styles.phraseActions}>
              <TouchableOpacity 
                onPress={handleClear} 
                style={styles.phraseBtn}
                activeOpacity={0.8}
              >
                <Icon name="close-outline" size={24} color={colors.danger} />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleSpeak} 
                style={[styles.phraseBtn, styles.speakBtn]}
                activeOpacity={0.8}
                disabled={!typedText.trim()}
              >
                <Icon name="volume-high-outline" size={28} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Suggestions Row - Matching communication screen */}
        <View style={styles.suggestionsContainer}>
          {suggestions.length > 0 && (
            <AdvancedSuggestionsRow
              suggestions={suggestions}
              onPressSuggestion={handleSuggestionPress}
              showDetails={false}
            />
          )}
        </View>

        {/* Category Bar - Same as communication screen */}
        <View style={styles.categoryContainer}>
          <CategoryBar
            categories={categories}
            selectedId={selectedCategory}
            onSelect={handleCategorySelect}
          />
        </View>

        {/* Main Content Area - Keyboard and History in tile-like format */}
        <View style={styles.gridContainer}>
          <ScrollView
            style={styles.gridScrollView}
            contentContainerStyle={styles.gridScrollContent}
            showsVerticalScrollIndicator={true}
          >
            {/* Text Input Tile */}
            <View style={styles.inputTile}>
              <Text style={styles.inputLabel}>Type Your Message</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Start typing here..."
                placeholderTextColor={colors.textSecondary}
                value={typedText}
                onChangeText={setTypedText}
                multiline
                autoFocus
                autoCorrect
                autoCapitalize="sentences"
              />
            </View>

            {/* History Section - Tile format */}
            {sentenceHistory.length > 0 && (
              <View style={styles.historySection}>
                <Text style={styles.sectionTitle}>Recent Sentences</Text>
                <View style={styles.historyGrid}>
                  {sentenceHistory.map((sentence, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.historyTile}
                      onPress={() => handleHistoryPress(sentence)}
                      activeOpacity={0.8}
                    >
                      <Icon name="time-outline" size={24} color={colors.primary} />
                      <Text style={styles.historyTileText} numberOfLines={3}>
                        {sentence}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </LandscapeGuard>
  );
}

const styles = StyleSheet.create({
  appTitle: {
    fontSize: 22,
    fontFamily: 'Montserrat_700Bold',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  topBar: {
    width: '100%',
    paddingTop: 1,
    paddingBottom: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
    zIndex: 10,
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
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12 as any,
  },
  emotionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  phraseBarContainer: {
    marginBottom: 2,
    zIndex: 9,
  },
  phraseBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 70,
    boxShadow: '0px 6px 14px rgba(0,0,0,0.08)',
  },
  phraseScroll: {
    flex: 1,
    marginRight: 12,
  },
  phraseText: {
    fontSize: 20,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
    lineHeight: 28,
  },
  phraseActions: {
    flexDirection: 'row',
    gap: 8 as any,
  },
  phraseBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 10px rgba(0,0,0,0.08)',
  },
  speakBtn: {
    backgroundColor: colors.primary,
  },
  suggestionsContainer: {
    marginBottom: 2,
    minHeight: 40,
    zIndex: 8,
  },
  categoryContainer: {
    marginBottom: 4,
    height: 70,
    zIndex: 5,
    backgroundColor: colors.background,
    position: 'relative',
  },
  gridContainer: {
    flex: 1,
    marginTop: 0,
    zIndex: 1,
  },
  gridScrollView: {
    flex: 1,
  },
  gridScrollContent: {
    paddingTop: 8,
    paddingBottom: 16,
    paddingHorizontal: 8,
  },
  inputTile: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    boxShadow: '0px 6px 20px rgba(0,0,0,0.08)',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  inputLabel: {
    fontSize: 18,
    fontFamily: 'Montserrat_700Bold',
    color: colors.primary,
    marginBottom: 12,
  },
  textInput: {
    fontSize: 20,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
    minHeight: 120,
    maxHeight: 200,
    textAlignVertical: 'top',
  },
  historySection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat_700Bold',
    color: colors.text,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  historyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12 as any,
  },
  historyTile: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    padding: 16,
    minWidth: 180,
    maxWidth: 250,
    minHeight: 120,
    boxShadow: '0px 6px 14px rgba(0,0,0,0.08)',
    borderWidth: 2,
    borderColor: colors.primary + '40',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8 as any,
  },
  historyTileText: {
    fontSize: 16,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
    textAlign: 'center',
  },
});
