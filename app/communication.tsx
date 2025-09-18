
import { useCallback, useMemo, useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import * as Speech from 'expo-speech';
import * as ScreenOrientation from 'expo-screen-orientation';
import Icon from '../components/Icon';
import { commonStyles, colors } from '../styles/commonStyles';
import CommunicationGrid from '../components/CommunicationGrid';
import PhraseBar from '../components/PhraseBar';
import SuggestionsRow from '../components/SuggestionsRow';
import SettingsSheet from '../components/SettingsSheet';
import DonutProgress from '../components/DonutProgress';
import IdleOverlay from '../components/IdleOverlay';
import { useLibrary } from '../hooks/useLibrary';
import { useAI } from '../hooks/useAI';
import { useIdleDetection } from '../hooks/useIdleDetection';
import { useEmotionSettings } from '../hooks/useEmotionSettings';
import { Tile } from '../types';
import CategoryBar from '../components/CategoryBar';
import { categories } from '../data/categories';
import LandscapeGuard from '../components/LandscapeGuard';
import { useRouter } from 'expo-router';

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

  const { settings, updateEmotion } = useEmotionSettings();
  
  const [sentence, setSentence] = useState<Tile[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('core');
  const [showIdleOverlay, setShowIdleOverlay] = useState(false);

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

  const handleSpeak = useCallback(() => {
    const text = sentence.map(t => t.text).join(' ');
    if (!text.trim()) {
      console.log('No text to speak');
      return;
    }
    const ttsText = normalizeForTTS(text);
    console.log('Speaking sentence:', ttsText);
    Speech.stop();
    Speech.speak(ttsText, { language: 'en-US', pitch: 1, rate: 0.9 });
    recordSentence(sentence.map(t => t.id), text);
    setSentence([]);
    handleUserActivity();
  }, [sentence, recordSentence, handleUserActivity]);

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
            <Icon name="home-outline" size={22} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSettingsOpen(true)} style={styles.iconBtn} activeOpacity={0.8}>
            <Icon name="settings-outline" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.appTitle}>Speak Buddy</Text>
          <View style={styles.progressWrap}>
            <DonutProgress size={34} strokeWidth={6} progress={Math.min(1, dailySentenceCount / 10)} />
          </View>
        </View>

        <PhraseBar
          sentence={sentence}
          onClear={handleClear}
          onSpeak={handleSpeak}
        />

        <SuggestionsRow
          suggestions={suggestions}
          onPressSuggestion={onSuggestionPress}
          style={{ marginTop: -10, marginBottom: -14 }}
        />

        <CategoryBar
          categories={categories}
          selectedId={selectedCategory}
          onSelect={(id) => {
            setSelectedCategory(id);
            handleUserActivity();
          }}
          style={{ marginTop: -14, marginBottom: -12 }}
        />

        <ScrollView
          style={{ flex: 1, marginTop: -12 }}
          contentContainerStyle={{ paddingTop: 0, paddingBottom: 0 }}
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
    fontSize: 19,
    fontFamily: 'Montserrat_700Bold',
    color: colors.text,
  },
  topBar: {
    width: '100%',
    paddingTop: 2,
    paddingBottom: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  iconBtn: {
    backgroundColor: colors.backgroundAlt,
    padding: 8,
    borderRadius: 10,
    boxShadow: '0px 6px 14px rgba(0,0,0,0.08)',
  },
  progressWrap: {
    backgroundColor: colors.backgroundAlt,
    padding: 4,
    borderRadius: 18,
    boxShadow: '0px 6px 14px rgba(0,0,0,0.08)',
  },
});
