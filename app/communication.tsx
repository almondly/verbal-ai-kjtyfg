
import { useCallback, useMemo, useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import * as Speech from 'expo-speech';
import * as ScreenOrientation from 'expo-screen-orientation';
import Icon from '../components/Icon';
import { commonStyles, colors } from '../styles/commonStyles';
import CommunicationGrid from '../components/CommunicationGrid';
import PhraseBar from '../components/PhraseBar';
import SuggestionsRow from '../components/SuggestionsRow';
import AdvancedSuggestionsRow from '../components/AdvancedSuggestionsRow';
import SettingsSheet from '../components/SettingsSheet';
import IdleOverlay from '../components/IdleOverlay';
import { useLibrary } from '../hooks/useLibrary';
import { useAI } from '../hooks/useAI';
import { useAdvancedAI } from '../hooks/useAdvancedAI';
import { useIdleDetection } from '../hooks/useIdleDetection';
import { useEmotionSettings } from '../hooks/useEmotionSettings';
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
  
  const [sentence, setSentence] = useState<Tile[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('core');
  const [showIdleOverlay, setShowIdleOverlay] = useState(false);
  const [advancedSuggestions, setAdvancedSuggestions] = useState<any[]>([]);

  const { resetTimer } = useIdleDetection({
    timeout: settings.idleTimeout,
    onIdle: () => {
      console.log('Device went idle, showing emotion overlay');
      setShowIdleOverlay(true);
    },
    onActive: () => {
      console.log('Device became active');
      setShowIdleOverlay(false);
    },
  });

  // Reset idle timer on any interaction
  const handleUserActivity = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

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
    
    // Reset timer when component mounts
    handleUserActivity();
  }, [handleUserActivity]);

  // Update advanced suggestions when sentence changes
  useEffect(() => {
    const updateSuggestions = async () => {
      if (sentence.length > 0) {
        const currentWords = sentence.map(t => t.text);
        const availableWords = tiles.map(t => t.text);
        const suggestions = await getAdvancedSuggestions(currentWords, availableWords);
        setAdvancedSuggestions(suggestions);
      } else {
        setAdvancedSuggestions([]);
      }
    };

    updateSuggestions();
  }, [sentence, tiles, getAdvancedSuggestions]);

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
    Speech.stop();
    Speech.speak(ttsText, { language: 'en-US', pitch: 1, rate: 0.9 });
    
    // Record in both AI systems
    recordSentence(sentence.map(t => t.id), text);
    await recordUserInput(text, settings.selectedEmotion);
    
    setSentence([]);
    handleUserActivity();
  }, [sentence, recordSentence, recordUserInput, settings.selectedEmotion, handleUserActivity]);

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

  const handleDismissIdle = () => {
    console.log('Dismissing idle overlay');
    setShowIdleOverlay(false);
    handleUserActivity();
  };

  console.log('Visible tiles:', visibleTiles.length);

  return (
    <LandscapeGuard>
      <View style={[commonStyles.container, { paddingHorizontal: 8 }]} onTouchStart={handleUserActivity}>
        <View style={[styles.topBar]}>
          <TouchableOpacity onPress={handleBackToMenu} style={styles.iconBtn} activeOpacity={0.8}>
            <Icon name="home-outline" size={32} color={colors.text} />
          </TouchableOpacity>
          
          <Text style={styles.appTitle}>Speak Buddy</Text>
          
          <View style={styles.rightSection}>
            <View style={styles.emotionContainer}>
              <EmotionFace emotion={settings.selectedEmotion} size={60} />
            </View>
            <TouchableOpacity onPress={() => setSettingsOpen(true)} style={styles.iconBtn} activeOpacity={0.8}>
              <Icon name="settings-outline" size={32} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Phrase Bar */}
        <PhraseBar
          sentence={sentence}
          onClear={handleClear}
          onSpeak={handleSpeak}
        />

        {/* Suggestions Row - moved directly under phrase bar */}
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

        {/* Category Bar - only show when settings is not open */}
        {!settingsOpen && (
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
        )}

        {/* Communication Grid with proper spacing */}
        <View style={styles.gridContainer}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingTop: 8, paddingBottom: 16 }}
            contentInsetAdjustmentBehavior="never"
            keyboardShouldPersistTaps="handled"
            onTouchStart={handleUserActivity}
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

        <SettingsSheet
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

        <SettingsSheet
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

        <IdleOverlay
          visible={showIdleOverlay}
          emotion={settings.selectedEmotion}
          onDismiss={handleDismissIdle}
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
    paddingTop: 4,
    paddingBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
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
  suggestionsContainer: {
    marginBottom: 8,
    minHeight: 40,
  },
  categoryContainer: {
    marginBottom: 8,
    height: 100,
  },
  gridContainer: {
    flex: 1,
    marginTop: 8,
  },
});
