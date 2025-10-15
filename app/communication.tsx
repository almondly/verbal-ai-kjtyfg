
import { useCallback, useMemo, useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
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

export default function CommunicationScreen() {
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      }
    })();
  }, []);

  const { getAdvancedSuggestions, getTimeBasedSuggestions, recordUserInput } = useAdvancedAI();
  const { currentEmotion, setCurrentEmotion } = useEmotionSettings();
  const [sentence, setSentence] = useState<Tile[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { tiles, addTile, updateTile, removeTile, resetTiles } = useLibrary();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [advancedSuggestions, setAdvancedSuggestions] = useState<any[]>([]);
  const { speak } = useTTSSettings();
  const [editingTile, setEditingTile] = useState<Tile | null>(null);

  const filteredTiles = useMemo(() => {
    if (selectedCategory === 'all') return tiles;
    return tiles.filter(t => t.category === selectedCategory);
  }, [tiles, selectedCategory]);

  const { resetLearning } = useAI();

  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (sentence.length === 0) {
        setAdvancedSuggestions([]);
        return;
      }

      const words = sentence.map(t => t.text);
      const [advanced, timeBased] = await Promise.all([
        getAdvancedSuggestions(words),
        getTimeBasedSuggestions(words),
      ]);

      const combined = [...advanced, ...timeBased]
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 8);

      setAdvancedSuggestions(combined);
    })();
  }, [sentence, tiles, getAdvancedSuggestions, getTimeBasedSuggestions]);

  const handleTilePress = useCallback((tile: Tile) => {
    setSentence(prev => [...prev, tile]);
  }, []);

  const handleTileLongPress = useCallback((tile: Tile) => {
    if (tile.id.startsWith('custom-')) {
      removeTile(tile.id);
    }
  }, [removeTile]);

  const handleTileEdit = useCallback((tile: Tile) => {
    setEditingTile(tile);
  }, []);

  const handleSaveEdit = useCallback((updatedTile: Tile) => {
    updateTile(updatedTile);
    setEditingTile(null);
  }, [updateTile]);

  const handleRemoveFromSentence = useCallback((index: number) => {
    setSentence(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleClearSentence = useCallback(() => {
    setSentence([]);
  }, []);

  const handleSpeak = useCallback(async () => {
    const text = sentence.map(t => t.text).join(' ');
    if (!text.trim()) return;
    
    const normalized = normalizeForTTS(text);
    await speak(normalized);
    
    // Record the sentence for AI learning
    await recordUserInput(text, selectedCategory !== 'all' ? selectedCategory : undefined);
  }, [sentence, speak, recordUserInput, selectedCategory]);

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

  return (
    <LandscapeGuard>
      <View style={[commonStyles.container, styles.container]}>
        {/* Top Bar */}
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

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Left Side - Tiles */}
          <View style={styles.leftPanel}>
            <CategoryBar
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
            <CommunicationGrid
              tiles={filteredTiles}
              onTilePress={handleTilePress}
              onTileLongPress={handleTileLongPress}
              onTileEdit={handleTileEdit}
              onAddTile={() => setSettingsOpen(true)}
              selectedCategory={selectedCategory}
            />
          </View>

          {/* Right Side - Phrase Bar & Suggestions */}
          <View style={styles.rightPanel}>
            <PhraseBar
              sentence={sentence}
              onRemove={handleRemoveFromSentence}
              onClear={handleClearSentence}
              onSpeak={handleSpeak}
            />
            
            {advancedSuggestions.length > 0 && (
              <AdvancedSuggestionsRow
                suggestions={advancedSuggestions}
                onPressSuggestion={(text) => {
                  const tile: Tile = {
                    id: `suggestion-${Date.now()}`,
                    text,
                    color: colors.primary,
                  };
                  handleTilePress(tile);
                }}
                onRemoveWord={(word) => {
                  // Remove the word from the sentence when tense is changed
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
            )}
          </View>
        </View>

        {/* Settings Sheet - Only for adding tiles */}
        <TabbedSettingsSheet
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          onResetLearning={resetLearning}
          onResetTiles={resetTiles}
          mode="add"
          onAddTile={addTile}
          defaultCategoryId={selectedCategory !== 'all' ? selectedCategory : undefined}
          currentEmotion={currentEmotion}
          onEmotionChange={setCurrentEmotion}
        />

        {/* Tile Editor */}
        {editingTile && (
          <TileEditor
            visible={!!editingTile}
            tile={editingTile}
            onSave={handleSaveEdit}
            onClose={() => setEditingTile(null)}
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.backgroundAlt,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8 as any,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
  },
  emotionContainer: {
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -25 }],
  },
  settingsButton: {
    padding: 10,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    gap: 16 as any,
    padding: 16,
  },
  leftPanel: {
    flex: 2,
    gap: 12 as any,
  },
  rightPanel: {
    flex: 1,
    gap: 12 as any,
  },
  suggestions: {
    flex: 1,
  },
});
