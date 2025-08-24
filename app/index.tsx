
import { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
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

export default function MainScreen() {
  const {
    tiles,
    addTile,
    removeTile,
    resetTiles,
  } = useLibrary();

  const {
    recordSentence,
    suggestForPrefix,
    dailySentenceCount,
    resetLearning,
  } = useAI();

  const [sentence, setSentence] = useState<Tile[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const handleTilePress = useCallback((tile: Tile) => {
    setSentence(prev => [...prev, tile]);
    Speech.speak(tile.text, { language: 'en-US', pitch: 1, rate: 0.9 });
  }, []);

  const handleSpeak = useCallback(() => {
    const text = sentence.map(t => t.text).join(' ');
    if (!text.trim()) {
      return;
    }
    Speech.speak(text, { language: 'en-US', pitch: 1, rate: 0.9 });
    recordSentence(sentence.map(t => t.id), text);
    setSentence([]);
  }, [sentence, recordSentence]);

  const handleClear = useCallback(() => {
    setSentence([]);
  }, []);

  const suggestions = useMemo(() => {
    const prefix = sentence.map(s => s.text).join(' ');
    return suggestForPrefix(prefix);
  }, [sentence, suggestForPrefix]);

  const onSuggestionPress = useCallback((suggestionText: string) => {
    // Replace current sentence with suggestion
    const words = suggestionText.split(' ');
    // Map words to existing tiles if possible, otherwise create transient tiles
    const mapped: Tile[] = words.map((w, idx) => {
      const found = tiles.find(t => t.text.toLowerCase() === w.toLowerCase());
      if (found) return found;
      return {
        id: `temp-${w}-${idx}`,
        text: w,
        color: colors.backgroundAlt,
        imageUri: undefined,
      };
    });
    setSentence(mapped);
  }, [tiles]);

  return (
    <View style={[commonStyles.container, { paddingHorizontal: 12 }]}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => setSettingsOpen(true)} style={styles.iconBtn} activeOpacity={0.8}>
          <Icon name="settings-outline" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.appTitle}>Speak Buddy</Text>
        <View style={styles.progressWrap}>
          <DonutProgress size={36} strokeWidth={6} progress={Math.min(1, dailySentenceCount / 10)} />
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
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} keyboardShouldPersistTaps="handled">
        <CommunicationGrid
          tiles={tiles}
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
        onClose={() => setAddOpen(false)}
        onAddTile={(tile) => {
          addTile(tile);
          setAddOpen(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  appTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    color: colors.text,
  },
  topBar: {
    width: '100%',
    paddingTop: 8,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBtn: {
    backgroundColor: colors.backgroundAlt,
    padding: 10,
    borderRadius: 10,
    boxShadow: '0px 6px 16px rgba(0,0,0,0.08)',
  },
  progressWrap: {
    backgroundColor: colors.backgroundAlt,
    padding: 6,
    borderRadius: 18,
    boxShadow: '0px 6px 16px rgba(0,0,0,0.08)',
  },
});
