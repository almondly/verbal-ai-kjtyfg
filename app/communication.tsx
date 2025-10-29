
import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, PanResponder } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { commonStyles, colors } from '../styles/commonStyles';
import { Tile } from '../types';
import CategoryBar from '../components/CategoryBar';
import PhraseBar from '../components/PhraseBar';
import SuggestionsRow from '../components/SuggestionsRow';
import TabbedSettingsSheet from '../components/TabbedSettingsSheet';
import TileEditor from '../components/TileEditor';
import Icon from '../components/Icon';
import EmotionFace from '../components/EmotionFace';
import { categories } from '../data/categories';
import { useLibrary } from '../hooks/useLibrary';
import { useAI } from '../hooks/useAI';
import { useEmotionSettings } from '../hooks/useEmotionSettings';
import LandscapeGuard from '../components/LandscapeGuard';
import AdvancedSuggestionsRow from '../components/AdvancedSuggestionsRow';
import CommunicationGrid from '../components/CommunicationGrid';
import { useAdvancedAI } from '../hooks/useAdvancedAI';
import { useTTSSettings } from '../hooks/useTTSSettings';
import { useRouter } from 'expo-router';
import { useIdleDetection } from '../hooks/useIdleDetection';

export default function CommunicationScreen() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      }
    })();
  }, []);

  // Idle detection - navigate to home after 30 seconds
  const { resetTimer } = useIdleDetection({
    timeout: 30000, // 30 seconds
    onIdle: () => {
      console.log('User idle for 30 seconds, navigating to home screen');
      router.push('/main-menu');
    },
  });

  // Create a PanResponder to capture ALL touch events on the screen, including scrolling
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => {
        resetTimer();
        return false; // Don't capture the event, just reset timer
      },
      onMoveShouldSetPanResponder: () => {
        resetTimer(); // Reset timer on scroll/drag movements
        return false; // Don't capture the event, just reset timer
      },
      onPanResponderTerminationRequest: () => true,
    })
  ).current;

  const { getAdvancedSuggestions, getTimeBasedSuggestions, recordUserInput } = useAdvancedAI();
  const { currentEmotion, setCurrentEmotion } = useEmotionSettings();
  const [sentence, setSentence] = useState<Tile[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('core');
  const { tiles, addTile, updateTile, removeTile, resetTiles } = useLibrary();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [advancedSuggestions, setAdvancedSuggestions] = useState<any[]>([]);
  const { speak } = useTTSSettings();
  const [editingTile, setEditingTile] = useState<Tile | null>(null);
  const [lastSpokenText, setLastSpokenText] = useState<string>('');

  // Handle keyboard category selection - redirect to keyboard screen
  useEffect(() => {
    if (selectedCategory === 'keyboard') {
      router.push('/keyboard');
      setSelectedCategory('core');
    }
  }, [selectedCategory, router]);

  const filteredTiles = useMemo(() => {
    if (selectedCategory === 'all') return tiles;
    if (selectedCategory === 'keyboard') return [];
    return tiles.filter(t => t.category === selectedCategory);
  }, [tiles, selectedCategory]);

  const { resetLearning } = useAI();

  useEffect(() => {
    (async () => {
      if (sentence.length === 0) {
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

      const words = sentence.map(t => t.text);
      const availableWords = tiles.map(t => t.text);
      
      const categoryForAI = (selectedCategory !== 'all' && selectedCategory !== 'keyboard') ? selectedCategory : undefined;
      
      const categoryTiles = tiles.map(tile => ({
        text: tile.text,
        category: tile.category || 'core'
      }));
      
      console.log('🎯 Calling getAdvancedSuggestions with:', {
        words,
        availableWordsCount: availableWords.length,
        categoryForAI,
        categoryTilesCount: categoryTiles.length
      });
      
      const [advanced, timeBased] = await Promise.all([
        getAdvancedSuggestions(words, availableWords, 10, categoryForAI, categoryTiles),
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
  }, [sentence, tiles, getAdvancedSuggestions, getTimeBasedSuggestions, selectedCategory]);

  const handleTilePress = useCallback((tile: Tile) => {
    resetTimer();
    setSentence(prev => [...prev, tile]);
  }, [resetTimer]);

  const handleTileLongPress = useCallback((tile: Tile) => {
    resetTimer();
    if (tile.id.startsWith('custom-')) {
      removeTile(tile.id);
    }
  }, [removeTile, resetTimer]);

  const handleTileEdit = useCallback((tile: Tile) => {
    resetTimer();
    setEditingTile(tile);
  }, [resetTimer]);

  const handleSaveEdit = useCallback((updatedTile: Tile) => {
    resetTimer();
    updateTile(updatedTile);
    setEditingTile(null);
  }, [updateTile, resetTimer]);

  const handleRemoveFromSentence = useCallback((index: number) => {
    resetTimer();
    setSentence(prev => prev.filter((_, i) => i !== index));
  }, [resetTimer]);

  const handleClearSentence = useCallback(() => {
    resetTimer();
    setSentence([]);
  }, [resetTimer]);

  const handleDeleteLastWord = useCallback(() => {
    resetTimer();
    setSentence(prev => {
      if (prev.length === 0) return prev;
      return prev.slice(0, -1);
    });
  }, [resetTimer]);

  const handleReplayLastSentence = useCallback(async () => {
    resetTimer();
    if (!lastSpokenText.trim()) return;
    
    const normalized = normalizeForTTS(lastSpokenText);
    await speak(normalized);
  }, [lastSpokenText, speak, resetTimer]);

  const handleSpeak = useCallback(async () => {
    resetTimer();
    const text = sentence.map(t => t.text).join(' ');
    if (!text.trim()) return;
    
    const normalized = normalizeForTTS(text);
    await speak(normalized);
    
    setLastSpokenText(text);
    
    const categoryForAI = (selectedCategory !== 'all' && selectedCategory !== 'keyboard') ? selectedCategory : undefined;
    await recordUserInput(text, categoryForAI);
    
    setSentence([]);
  }, [sentence, speak, recordUserInput, selectedCategory, resetTimer]);

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
    resetTimer();
    router.push('/main-menu');
  }, [router, resetTimer]);

  const handleOpenSettings = useCallback(() => {
    resetTimer();
    router.push('/settings');
  }, [router, resetTimer]);

  const handleSuggestionPress = useCallback((text: string, isFullSentence: boolean) => {
    resetTimer();
    if (isFullSentence) {
      const words = text.split(' ');
      const newSentence = words.map((word, index) => ({
        id: `suggestion-${Date.now()}-${index}`,
        text: word,
        color: colors.primary,
        category: 'suggestion',
      }));
      setSentence(newSentence);
    } else {
      const tile: Tile = {
        id: `suggestion-${Date.now()}`,
        text,
        color: colors.primary,
        category: 'suggestion',
      };
      handleTilePress(tile);
    }
  }, [handleTilePress, resetTimer]);

  const handleCategorySelect = useCallback((categoryId: string) => {
    resetTimer();
    setSelectedCategory(categoryId);
  }, [resetTimer]);

  const handleSettingsOpen = useCallback(() => {
    resetTimer();
    setSettingsOpen(true);
  }, [resetTimer]);

  const handleSettingsClose = useCallback(() => {
    resetTimer();
    setSettingsOpen(false);
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

        {/* Phrase Bar */}
        <View style={styles.phraseBarContainer}>
          <PhraseBar
            sentence={sentence}
            onRemove={handleRemoveFromSentence}
            onClear={handleClearSentence}
            onSpeak={handleSpeak}
            onDeleteWord={handleDeleteLastWord}
            onReplay={handleReplayLastSentence}
            hasLastSpoken={!!lastSpokenText}
          />
        </View>

        {/* AI Sentence Predictor / Recommendations */}
        <ScrollView 
          style={styles.predictorContainer}
          onScroll={resetTimer}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          {advancedSuggestions.length > 0 ? (
            <AdvancedSuggestionsRow
              suggestions={advancedSuggestions}
              onPressSuggestion={handleSuggestionPress}
              onRemoveWord={(word) => {
                resetTimer();
                setSentence(prev => {
                  const index = prev.findIndex(t => t.text.toLowerCase() === word.toLowerCase());
                  if (index !== -1) {
                    return prev.filter((_, i) => i !== index);
                  }
                  return prev;
                });
              }}
              style={styles.suggestions}
            />
          ) : (
            <View style={styles.emptyPredictorContainer}>
              <Text style={styles.emptyPredictorText}>
                Start building a sentence to see AI predictions
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Category Bar */}
        <ScrollView 
          style={styles.categoryBarContainer}
          horizontal
          onScroll={resetTimer}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
        >
          <CategoryBar
            categories={categories}
            selectedId={selectedCategory}
            onSelect={handleCategorySelect}
          />
        </ScrollView>

        {/* Tiles Grid */}
        <View style={styles.gridContainer}>
          <ScrollView
            style={styles.gridScrollView}
            onScroll={resetTimer}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
          >
            <CommunicationGrid
              tiles={filteredTiles}
              onTilePress={handleTilePress}
              onTileLongPress={handleTileLongPress}
              onTileEdit={handleTileEdit}
              onAddTile={handleSettingsOpen}
              selectedCategory={selectedCategory}
            />
          </ScrollView>
        </View>

        {/* Settings Sheet */}
        <TabbedSettingsSheet
          open={settingsOpen}
          onClose={handleSettingsClose}
          onResetLearning={resetLearning}
          onResetTiles={resetTiles}
          mode="add"
          onAddTile={addTile}
          defaultCategoryId={selectedCategory !== 'all' && selectedCategory !== 'keyboard' ? selectedCategory : undefined}
          currentEmotion={currentEmotion}
          onEmotionChange={setCurrentEmotion}
        />

        {/* Tile Editor */}
        {editingTile && (
          <TileEditor
            visible={!!editingTile}
            tile={editingTile}
            onSave={handleSaveEdit}
            onClose={() => {
              resetTimer();
              setEditingTile(null);
            }}
          />
        )}
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
  phraseBarContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  predictorContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.backgroundAlt,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.borderLight,
    minHeight: 100,
    maxHeight: 120,
  },
  suggestions: {
    flex: 1,
  },
  emptyPredictorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyPredictorText: {
    fontSize: 13,
    fontFamily: 'Montserrat_500Medium',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  categoryBarContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 60,
  },
  gridContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  gridScrollView: {
    flex: 1,
  },
});
