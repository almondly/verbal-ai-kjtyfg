
import { useCallback, useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import * as Speech from 'expo-speech';
import Icon from '../components/Icon';
import { commonStyles, colors } from '../styles/commonStyles';
import CommunicationGrid from '../components/CommunicationGrid';
import PhraseBar from '../components/PhraseBar';
import SuggestionsRow from '../components/SuggestionsRow';
import SettingsSheet from '../components/SettingsSheet';
import DonutProgress from '../components/DonutProgress';
import { useLibrary } from '../hooks/useLibrary';
import { useAI } from '../hooks/useAI';
import { Tile } from '../types';
import CategoryBar from '../components/CategoryBar';
import { categories } from '../data/categories';
import LandscapeGuard from '../components/LandscapeGuard';

export default function MainScreen() {
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

  const [sentence, setSentence] = useState<Tile[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('core');

  const handleTilePress = useCallback((tile: Tile) => {
    setSentence(prev => [...prev, tile]);
  }, []);

  const normalizeForTTS = (text: string) => {
    const lowered = text.toLowerCase();
    const cleaned = lowered.replace(/\s+/g, ' ').trim();
    return cleaned;
  };

  const handleSpeak = useCallback(() => {
    const text = sentence.map(t => t.text).join(' ');
    if (!text.trim()) {
      return;
    }
    const ttsText = normalizeForTTS(text);
    console.log('Speaking sentence:', ttsText);
    Speech.stop();
    Speech.speak(ttsText, { language: 'en-US', pitch: 1, rate: 0.9 });
    recordSentence(sentence.map(t => t.id), text);
    setSentence([]);
  }, [sentence, recordSentence]);

  const handleClear = useCallback(() => {
    setSentence([]);
  }, []);

  const suggestions = useMemo(() => {
    const words = sentence.map(s => s.text);
    const libraryWords = tiles.map(t => t.text);
    return suggestNextWords(words, libraryWords);
  }, [sentence, tiles, suggestNextWords]);

  const onSuggestionPress = useCallback((suggestionText: string) => {
    const found = tiles.find(t => t.text.toLowerCase() === suggestionText.toLowerCase());
    const tile: Tile = found || {
      id: `temp-${suggestionText}-${Date.now()}`,
      text: suggestionText,
      color: colors.backgroundAlt,
      imageUri: undefined,
    };
    setSentence(prev => [...prev, tile]);
  }, [tiles]);

  const visibleTiles = useMemo(() => {
    if (selectedCategory === 'all') return tiles;
    return tiles.filter(t => t.category === selectedCategory);
  }, [tiles, selectedCategory]);

  return (
    <LandscapeGuard>
      <View style={[commonStyles.container, { paddingHorizontal: 10 }]}>
        <View style={[styles.topBar, { marginBottom: 0 }]}>
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
          style={{ marginTop: 0, marginBottom: -2 }}
        />

        <CategoryBar
          categories={categories}
          selectedId={selectedCategory}
          onSelect={setSelectedCategory}
          style={{ marginTop: 0, marginBottom: -2 }}
        />

        <ScrollView
          style={{ flex: 1, marginTop: -2 }}
          contentContainerStyle={{ paddingTop: 0, paddingBottom: 0 }}
          keyboardShouldPersistTaps="handled"
        >
          <CommunicationGrid
            tiles={visibleTiles}
            onPressTile={handleTilePress}
            onPressAdd={() => setAddOpen(true)}
            onRemoveTile={removeTile}
          />
        </ScrollView>

        <SettingsSheet
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          onResetLearning={() => {
            resetLearning();
          }}
          onResetTiles={() => {
            resetTiles();
          }}
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
          }}
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
