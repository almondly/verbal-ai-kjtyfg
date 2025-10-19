
import { useCallback, useMemo, useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { commonStyles, colors } from '../styles/commonStyles';
import { categories } from '../data/categories';
import { Tile } from '../types';
import { useLibrary } from '../hooks/useLibrary';
import { useAI } from '../hooks/useAI';
import { useEnhancedAI } from '../hooks/useEnhancedAI';
import { useEmotionSettings } from '../hooks/useEmotionSettings';
import { useTTSSettings } from '../hooks/useTTSSettings';
import LandscapeGuard from '../components/LandscapeGuard';
import CategoryBar from '../components/CategoryBar';
import CommunicationGrid from '../components/CommunicationGrid';
import PhraseBar from '../components/PhraseBar';
import AdvancedSuggestionsRow from '../components/AdvancedSuggestionsRow';
import EmotionFace from '../components/EmotionFace';
import Icon from '../components/Icon';
import TabbedSettingsSheet from '../components/TabbedSettingsSheet';
import TileEditor from '../components/TileEditor';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  backButton: {
    padding: 8,
  },
  settingsButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  content: {
    flex: 1,
  },
  intentionPredictions: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  intentionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  intentionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  intentionChip: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  intentionText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
  },
  statsButton: {
    padding: 8,
  },
  statsIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
});

export default function CommunicationEnhancedScreen() {
  const router = useRouter();
  const { tiles, addTile, updateTile, categoryTiles } = useLibrary();
  const { speak } = useTTSSettings();
  const { currentEmotion, setCurrentEmotion } = useEmotionSettings();
  const { getAISuggestions } = useAI();
  const enhancedAI = useEnhancedAI();
  
  const [sentence, setSentence] = useState<Tile[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editingTile, setEditingTile] = useState<Tile | null>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [currentSuggestions, setCurrentSuggestions] = useState<any[]>([]);

  // Lock to landscape on mount
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  }, []);

  // Get enhanced suggestions when sentence changes
  useEffect(() => {
    const getSuggestions = async () => {
      if (sentence.length === 0) {
        setSuggestions([]);
        setCurrentSuggestions([]);
        return;
      }

      const words = sentence.map(t => t.word);
      const availableWords = tiles.map(t => t.word);
      
      // Get enhanced suggestions
      const enhanced = await enhancedAI.getEnhancedSuggestions(
        words,
        availableWords,
        10,
        selectedCategory,
        Object.entries(categoryTiles).flatMap(([cat, tiles]) =>
          tiles.map(t => ({ text: t.word, category: cat }))
        )
      );
      
      setSuggestions(enhanced);
      setCurrentSuggestions(enhanced);
    };

    getSuggestions();
  }, [sentence, tiles, selectedCategory, categoryTiles, enhancedAI]);

  // Handle tile press
  const handleTilePress = useCallback(async (tile: Tile) => {
    console.log('Tile pressed:', tile.word);
    
    // Check if we should replace partial text with full sentence
    const lastSelected = enhancedAI.getLastSelectedSuggestion();
    if (lastSelected && lastSelected.isFullSentence) {
      // Replace entire sentence with the full sentence
      const fullSentenceWords = lastSelected.text.split(' ');
      const newSentence = fullSentenceWords.map(word => {
        const matchingTile = tiles.find(t => t.word.toLowerCase() === word.toLowerCase());
        return matchingTile || { id: Math.random().toString(), word, category: 'core' };
      });
      setSentence(newSentence as Tile[]);
      enhancedAI.clearLastSelectedSuggestion();
    } else {
      // Add tile to sentence
      setSentence(prev => [...prev, tile]);
    }
    
    // Track that suggestions were ignored (user chose a tile instead)
    if (currentSuggestions.length > 0) {
      await enhancedAI.onSuggestionsIgnored(
        currentSuggestions,
        sentence.map(t => t.word),
        selectedCategory
      );
    }
  }, [sentence, tiles, currentSuggestions, selectedCategory, enhancedAI]);

  // Handle suggestion press
  const handleSuggestionPress = useCallback(async (text: string, isFullSentence: boolean) => {
    console.log('Suggestion pressed:', text, 'isFullSentence:', isFullSentence);
    
    // Find the suggestion that was selected
    const selectedSuggestion = currentSuggestions.find(s => s.text === text);
    
    if (selectedSuggestion) {
      // Track the selection
      await enhancedAI.onSuggestionSelected(
        selectedSuggestion,
        sentence.map(t => t.word),
        selectedCategory
      );
    }
    
    if (isFullSentence) {
      // Replace entire sentence
      const words = text.split(' ');
      const newSentence = words.map(word => {
        const matchingTile = tiles.find(t => t.word.toLowerCase() === word.toLowerCase());
        return matchingTile || { id: Math.random().toString(), word, category: 'core' };
      });
      setSentence(newSentence as Tile[]);
    } else {
      // Add word to sentence
      const matchingTile = tiles.find(t => t.word.toLowerCase() === text.toLowerCase());
      const newTile = matchingTile || { id: Math.random().toString(), word: text, category: 'core' };
      setSentence(prev => [...prev, newTile as Tile]);
    }
  }, [sentence, tiles, currentSuggestions, selectedCategory, enhancedAI]);

  // Handle speak
  const handleSpeak = useCallback(async () => {
    if (sentence.length === 0) return;
    
    const text = sentence.map(t => t.word).join(' ');
    const normalizedText = normalizeForTTS(text);
    
    console.log('Speaking:', normalizedText);
    await speak(normalizedText);
    
    // Track sentence completion
    await enhancedAI.onSentenceCompleted(text);
    
    // Clear sentence after speaking
    setSentence([]);
  }, [sentence, speak, enhancedAI]);

  // Handle clear
  const handleClear = useCallback(() => {
    setSentence([]);
    enhancedAI.clearLastSelectedSuggestion();
  }, [enhancedAI]);

  // Handle remove word
  const handleRemoveWord = useCallback((index: number) => {
    setSentence(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Normalize text for TTS
  const normalizeForTTS = (text: string): string => {
    return text
      .replace(/\bi\b/gi, 'I')
      .replace(/\bi'm\b/gi, 'I\'m')
      .replace(/\bi've\b/gi, 'I\'ve')
      .replace(/\bi'll\b/gi, 'I\'ll')
      .replace(/\bi'd\b/gi, 'I\'d');
  };

  // Filter tiles by category
  const filteredTiles = useMemo(() => {
    if (selectedCategory === 'all') return tiles;
    if (selectedCategory === 'keyboard') return [];
    return categoryTiles[selectedCategory] || [];
  }, [tiles, selectedCategory, categoryTiles]);

  // Handle back
  const handleBackToMenu = useCallback(() => {
    router.push('/main-menu');
  }, [router]);

  return (
    <LandscapeGuard>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={handleBackToMenu} style={styles.backButton}>
              <Icon name="arrow-left" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.title}>Communication</Text>
          </View>
          
          <View style={styles.headerRight}>
            <EmotionFace 
              emotion={currentEmotion} 
              size={40}
              onPress={() => setSettingsOpen(true)}
            />
            <TouchableOpacity 
              onPress={() => enhancedAI.loadLearningStats()} 
              style={styles.statsButton}
            >
              <Icon name="chart-line" size={24} color={colors.text} />
              {enhancedAI.learningStats && enhancedAI.learningStats.selectionRate > 0.5 && (
                <View style={styles.statsIndicator} />
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSettingsOpen(true)} style={styles.settingsButton}>
              <Icon name="settings" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Category Bar */}
        <CategoryBar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Phrase Bar */}
        <PhraseBar
          sentence={sentence}
          onSpeak={handleSpeak}
          onClear={handleClear}
          onRemoveWord={handleRemoveWord}
        />

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <AdvancedSuggestionsRow
            suggestions={suggestions}
            onPressSuggestion={handleSuggestionPress}
            showDetails={true}
          />
        )}

        {/* Intention Predictions */}
        {enhancedAI.nextIntentionPredictions.length > 0 && sentence.length === 0 && (
          <View style={styles.intentionPredictions}>
            <Text style={styles.intentionTitle}>💡 You might want to say:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.intentionRow}>
                {enhancedAI.nextIntentionPredictions.map((prediction, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.intentionChip}
                    onPress={() => handleSuggestionPress(prediction, true)}
                  >
                    <Text style={styles.intentionText}>{prediction}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Communication Grid */}
        <View style={styles.content}>
          <CommunicationGrid
            tiles={filteredTiles}
            onTilePress={handleTilePress}
            onTileLongPress={(tile) => setEditingTile(tile)}
          />
        </View>

        {/* Settings Sheet */}
        <TabbedSettingsSheet
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          title="Settings"
          mode="settings"
          currentEmotion={currentEmotion}
          onEmotionChange={setCurrentEmotion}
        />

        {/* Tile Editor */}
        {editingTile && (
          <TileEditor
            visible={true}
            tile={editingTile}
            onSave={(updatedTile) => {
              updateTile(updatedTile);
              setEditingTile(null);
            }}
            onClose={() => setEditingTile(null)}
          />
        )}
      </View>
    </LandscapeGuard>
  );
}
