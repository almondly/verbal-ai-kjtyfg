
import { useCallback, useMemo, useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import Icon from '../components/Icon';
import { commonStyles, colors } from '../styles/commonStyles';
import CommunicationGrid from '../components/CommunicationGrid';
import PhraseBar from '../components/PhraseBar';
import SuggestionsRow from '../components/SuggestionsRow';
import AdvancedSuggestionsRow from '../components/AdvancedSuggestionsRow';
import TabbedSettingsSheet from '../components/TabbedSettingsSheet';
import { useLibrary } from '../hooks/useLibrary';
import { useAI } from '../hooks/useAI';
import { useAdvancedAI } from '../hooks/useAdvancedAI';
import { useEmotionSettings } from '../hooks/useEmotionSettings';
import { useTTSSettings } from '../hooks/useTTSSettings';
import { Tile } from '../types';
import CategoryBar from '../components/CategoryBar';
import { categories } from '../data/categories';
import LandscapeGuard from '../components/LandscapeGuard';
import { useRouter } from 'expo-router';
import EmotionFace from '../components/EmotionFace';

export default function CommunicationScreen() {
  console.log('CommunicationScreen rendering...');
  
  const router = useRouter();
  const {
    tiles,
    addTile,
    removeTile,
    resetTiles,
  } = useLibrary();

  const {
    recordSentence,
    suggestNextWords,
    dailySentenceCount,
    resetLearning,
  } = useAI();

  const {
    recordUserInput,
    getAdvancedSuggestions,
    getTimeBasedSuggestions,
    isLoading: aiLoading
  } = useAdvancedAI();

  const { settings, updateEmotion } = useEmotionSettings();
  const { speak } = useTTSSettings();
  
  const [sentence, setSentence] = useState<Tile[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('core');
  const [advancedSuggestions, setAdvancedSuggestions] = useState<any[]>([]);

  // Simple user activity handler without idle detection
  const handleUserActivity = useCallback(() => {
    console.log('User activity detected');
    // Just log activity, no idle detection for now
  }, []);

  useEffect(() => {
    // Lock orientation on native platforms only
    if (Platform.OS !== 'web') {
      try {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        console.log('Communication screen orientation locked to landscape');
      } catch (error) {
        console.log('Failed to lock screen orientation in communication screen:', error);
      }
    }
    
    // Log component mount
    console.log('Communication screen mounted successfully');
  }, []);

  // Update advanced suggestions when sentence changes
  useEffect(() => {
    const updateSuggestions = async () => {
      if (sentence.length > 0) {
        const currentWords = sentence.map(t => t.text);
        const availableWords = tiles.map(t => t.text);
        const suggestions = await getAdvancedSuggestions(currentWords, availableWords);
        setAdvancedSuggestions(suggestions);
      } else {
        // Get temporal suggestions when no sentence is started
        const timeBasedSuggestions = await getTimeBasedSuggestions();
        const temporalSuggestions = timeBasedSuggestions.slice(0, 3).map(phrase => ({
          text: phrase.split(' ')[0],
          confidence: 0.6,
          type: 'temporal' as const,
          context: `Common now: ${phrase}`
        }));
        setAdvancedSuggestions(temporalSuggestions);
      }
    };

    updateSuggestions();
  }, [sentence, tiles, getAdvancedSuggestions, getTimeBasedSuggestions]);

  console.log('Tiles loaded:', tiles.length);
  console.log('Categories loaded:', categories.length);
  console.log('Selected category:', selectedCategory);
  console.log('Current emotion:', settings.selectedEmotion);

  const handleTilePress = useCallback((tile: Tile) => {
    console.log('Tile pressed:', tile.text);
    setSentence(prev => [...prev, tile]);
    handleUserActivity();
  }, [handleUserActivity]);

  const normalizeForTTS = (text: string) => {
    const lowered = text.toLowerCase();
    const cleaned = lowered.replace(/\s+/g, ' ').trim();
    return cleaned;
  };

  const handleSpeak = useCallback(async () => {
    const text = sentence.map(t => t.text).join(' ');
    if (!text.trim()) {
      console.log('No text to speak');
      return;
    }
    const ttsText = normalizeForTTS(text);
    console.log('Speaking sentence:', ttsText);
    
    // Use the custom TTS settings with Australian greeting
    await speak(ttsText);
    
    // Record in both AI systems
    recordSentence(sentence.map(t => t.id), text);
    await recordUserInput(text, settings.selectedEmotion);
    
    setSentence([]);
    handleUserActivity();
  }, [sentence, recordSentence, recordUserInput, settings.selectedEmotion, handleUserActivity, speak]);

  const handleClear = useCallback(() => {
    console.log('Clearing sentence');
    setSentence([]);
    handleUserActivity();
  }, [handleUserActivity]);

  const suggestions = useMemo(() => {
    const words = sentence.map(s => s.text);
    const libraryWords = tiles.map(t => t.text);
    return suggestNextWords(words, libraryWords);
  }, [sentence, tiles, suggestNextWords]);

  const onSuggestionPress = useCallback((suggestionText: string) => {
    console.log('Suggestion pressed:', suggestionText);
    const found = tiles.find(t => t.text.toLowerCase() === suggestionText.toLowerCase());
    const tile: Tile = found || {
      id: `temp-${suggestionText}-${Date.now()}`,
      text: suggestionText,
      color: colors.backgroundAlt,
      imageUri: undefined,
    };
    setSentence(prev => [...prev, tile]);
    handleUserActivity();
  }, [tiles, handleUserActivity]);

  const visibleTiles = useMemo(() => {
    if (selectedCategory === 'all') return tiles;
    return tiles.filter(t => t.category === selectedCategory);
  }, [tiles, selectedCategory]);

  const handleBackToMenu = () => {
    console.log('Going back to main menu');
    router.push('/main-menu');
  };

  console.log('Visible tiles:', visibleTiles.length);

  return (
    <LandscapeGuard>
      <View style={[commonStyles.container, { paddingHorizontal: 8 }]} onTouchStart={handleUserActivity}>
        {/* Top Bar - Minimal padding */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={handleBackToMenu} style={styles.iconBtn} activeOpacity={0.8}>
            <Icon name="home-outline" size={32} color={colors.text} />
          </TouchableOpacity>
          
          <Text style={styles.appTitle}>ComPanion</Text>
          
          <View style={styles.rightSection}>
            <View style={styles.emotionContainer}>
              <EmotionFace emotion={settings.selectedEmotion} size={60} />
            </View>
            <TouchableOpacity onPress={() => setSettingsOpen(true)} style={styles.iconBtn} activeOpacity={0.8}>
              <Icon name="settings-outline" size={32} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Phrase Bar - Minimal margin */}
        <View style={styles.phraseBarContainer}>
          <PhraseBar
            sentence={sentence}
            onClear={handleClear}
            onSpeak={handleSpeak}
          />
        </View>

        {/* Suggestions Row - Tight spacing */}
        <View style={styles.suggestionsContainer}>
          {advancedSuggestions.length > 0 ? (
            <AdvancedSuggestionsRow
              suggestions={advancedSuggestions}
              onPressSuggestion={onSuggestionPress}
              showDetails={false}
            />
          ) : (
            <SuggestionsRow
              suggestions={suggestions}
              onPressSuggestion={onSuggestionPress}
            />
          )}
        </View>

        {/* Category Bar - Fixed position with proper z-index */}
        <View style={styles.categoryContainer}>
          <CategoryBar
            categories={categories}
            selectedId={selectedCategory}
            onSelect={(id) => {
              setSelectedCategory(id);
              handleUserActivity();
            }}
          />
        </View>

        {/* Communication Grid - Scrollable area below category bar */}
        <View style={styles.gridContainer}>
          <ScrollView
            style={styles.gridScrollView}
            contentContainerStyle={styles.gridScrollContent}
            contentInsetAdjustmentBehavior="never"
            keyboardShouldPersistTaps="handled"
            onTouchStart={handleUserActivity}
            showsVerticalScrollIndicator={true}
            bounces={true}
          >
            <CommunicationGrid
              tiles={visibleTiles}
              onPressTile={handleTilePress}
              onPressAdd={() => {
                setAddOpen(true);
                handleUserActivity();
              }}
              onRemoveTile={(id) => {
                removeTile(id);
                handleUserActivity();
              }}
            />
          </ScrollView>
        </View>

        <TabbedSettingsSheet
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          onResetLearning={() => {
            resetLearning();
            handleUserActivity();
          }}
          onResetTiles={() => {
            resetTiles();
            handleUserActivity();
          }}
          currentEmotion={settings.selectedEmotion}
          onEmotionChange={updateEmotion}
        />

        <TabbedSettingsSheet
          open={addOpen}
          title="Add Tile"
          mode="add"
          defaultCategoryId={selectedCategory === 'all' ? 'core' : selectedCategory}
          onClose={() => setAddOpen(false)}
          onAddTile={(tile) => {
            addTile(tile);
            setAddOpen(false);
            handleUserActivity();
          }}
        />
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
    flexGrow: 1,
  },
});
