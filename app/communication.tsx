
import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
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
import AdvancedSuggestionsRow from '../components/AdvancedSuggestionsRow';
import CommunicationGrid from '../components/CommunicationGrid';
import { useAdvancedAI } from '../hooks/useAdvancedAI';
import { useVoiceSettings } from '../hooks/useVoiceSettings';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

export default function CommunicationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    console.log('Communication screen mounted');
    (async () => {
      try {
        if (Platform.OS !== 'web') {
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        }
      } catch (error) {
        console.error('Error locking screen orientation:', error);
      }
    })();
  }, []);

  const { getAdvancedSuggestions, getTimeBasedSuggestions, recordUserInput } = useAdvancedAI();
  const { settings: emotionSettings } = useEmotionSettings();
  const [sentence, setSentence] = useState<Tile[]>([]);
  
  // Initialize selectedCategory from params or default to 'core'
  const initialCategory = (params.category as string) || 'core';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  
  const { tiles, addTile, updateTile, removeTile, resetTiles } = useLibrary();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [advancedSuggestions, setAdvancedSuggestions] = useState<any[]>([]);
  const { speak, stopSpeaking } = useVoiceSettings();
  const [editingTile, setEditingTile] = useState<Tile | null>(null);
  const [lastSpokenText, setLastSpokenText] = useState<string>('');
  const isNavigatingRef = useRef(false);
  const [isLoading, setIsLoading] = useState(true);

  // Update category when params change (coming from keyboard screen)
  useEffect(() => {
    try {
      if (params.category && params.category !== 'keyboard') {
        console.log('📍 Communication screen received category from params:', params.category);
        setSelectedCategory(params.category as string);
      }
    } catch (error) {
      console.error('Error updating category from params:', error);
    }
  }, [params.category]);

  // Stop speech when screen loses focus (e.g., navigating to settings)
  useFocusEffect(
    useCallback(() => {
      console.log('📱 Communication screen focused');
      isNavigatingRef.current = false;
      setIsLoading(false);
      
      // Cleanup function runs when screen loses focus
      return () => {
        console.log('📱 Communication screen unfocused - stopping speech');
        try {
          stopSpeaking();
        } catch (error) {
          console.error('Error stopping speech:', error);
        }
      };
    }, [stopSpeaking])
  );

  // Handle keyboard category selection - redirect to keyboard screen
  useEffect(() => {
    try {
      if (selectedCategory === 'keyboard' && !isNavigatingRef.current) {
        console.log('🔄 Navigating to keyboard screen');
        isNavigatingRef.current = true;
        router.push('/keyboard');
        // Don't reset category here - let it stay as 'keyboard' until we come back
      }
    } catch (error) {
      console.error('Error navigating to keyboard:', error);
    }
  }, [selectedCategory, router]);

  const filteredTiles = useMemo(() => {
    try {
      if (selectedCategory === 'all') return tiles;
      if (selectedCategory === 'keyboard') return [];
      return tiles.filter(t => t.category === selectedCategory);
    } catch (error) {
      console.error('Error filtering tiles:', error);
      return [];
    }
  }, [tiles, selectedCategory]);

  const { resetLearning } = useAI();

  useEffect(() => {
    (async () => {
      try {
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
      } catch (error) {
        console.error('Error updating suggestions:', error);
        setAdvancedSuggestions([]);
      }
    })();
  }, [sentence, tiles, getAdvancedSuggestions, getTimeBasedSuggestions, selectedCategory]);

  const handleTilePress = useCallback((tile: Tile) => {
    try {
      console.log('Tile pressed in communication screen:', tile.text);
      setSentence(prev => [...prev, tile]);
    } catch (error) {
      console.error('Error handling tile press:', error);
    }
  }, []);

  const handleTileLongPress = useCallback((tile: Tile) => {
    try {
      if (tile.id.startsWith('custom-')) {
        removeTile(tile.id);
      }
    } catch (error) {
      console.error('Error handling tile long press:', error);
    }
  }, [removeTile]);

  const handleTileEdit = useCallback((tile: Tile) => {
    try {
      setEditingTile(tile);
    } catch (error) {
      console.error('Error handling tile edit:', error);
    }
  }, []);

  const handleSaveEdit = useCallback((updatedTile: Tile) => {
    try {
      updateTile(updatedTile);
      setEditingTile(null);
    } catch (error) {
      console.error('Error saving tile edit:', error);
    }
  }, [updateTile]);

  const handleRemoveFromSentence = useCallback((index: number) => {
    try {
      setSentence(prev => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error removing from sentence:', error);
    }
  }, []);

  const handleClearSentence = useCallback(() => {
    try {
      setSentence([]);
    } catch (error) {
      console.error('Error clearing sentence:', error);
    }
  }, []);

  const handleDeleteLastWord = useCallback(() => {
    try {
      setSentence(prev => {
        if (prev.length === 0) return prev;
        return prev.slice(0, -1);
      });
    } catch (error) {
      console.error('Error deleting last word:', error);
    }
  }, []);

  const handleReplayLastSentence = useCallback(async () => {
    try {
      if (!lastSpokenText.trim()) return;
      
      const normalized = normalizeForTTS(lastSpokenText);
      await speak(normalized);
    } catch (error) {
      console.error('Error replaying sentence:', error);
    }
  }, [lastSpokenText, speak]);

  const handleSpeak = useCallback(async () => {
    try {
      const text = sentence.map(t => t.text).join(' ');
      if (!text.trim()) return;
      
      const normalized = normalizeForTTS(text);
      await speak(normalized);
      
      setLastSpokenText(text);
      
      const categoryForAI = (selectedCategory !== 'all' && selectedCategory !== 'keyboard') ? selectedCategory : undefined;
      await recordUserInput(text, categoryForAI);
      
      setSentence([]);
    } catch (error) {
      console.error('Error speaking sentence:', error);
    }
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
    try {
      router.push('/main-menu');
    } catch (error) {
      console.error('Error navigating to menu:', error);
    }
  }, [router]);

  const handleOpenSettings = useCallback(() => {
    try {
      router.push('/settings');
    } catch (error) {
      console.error('Error opening settings:', error);
    }
  }, [router]);

  const handleSuggestionPress = useCallback((text: string, isFullSentence: boolean) => {
    try {
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
    } catch (error) {
      console.error('Error handling suggestion press:', error);
    }
  }, [handleTilePress]);

  const handleCategorySelect = useCallback((categoryId: string) => {
    try {
      console.log('🎯 Category selected in communication screen:', categoryId);
      setSelectedCategory(categoryId);
    } catch (error) {
      console.error('Error selecting category:', error);
    }
  }, []);

  const handleSettingsOpen = useCallback(() => {
    try {
      setSettingsOpen(true);
    } catch (error) {
      console.error('Error opening settings sheet:', error);
    }
  }, []);

  const handleSettingsClose = useCallback(() => {
    try {
      setSettingsOpen(false);
    } catch (error) {
      console.error('Error closing settings sheet:', error);
    }
  }, []);

  // Show loading state briefly to prevent crashes
  if (isLoading) {
    return (
      <View style={[commonStyles.container, styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[commonStyles.container, styles.container]}>
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
          <EmotionFace emotion={emotionSettings.selectedEmotion} size={200} />
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
        showsVerticalScrollIndicator={false}
      >
        {advancedSuggestions.length > 0 ? (
          <AdvancedSuggestionsRow
            suggestions={advancedSuggestions}
            onPressSuggestion={handleSuggestionPress}
            onRemoveWord={(word) => {
              try {
                setSentence(prev => {
                  const index = prev.findIndex(t => t.text.toLowerCase() === word.toLowerCase());
                  if (index !== -1) {
                    return prev.filter((_, i) => i !== index);
                  }
                  return prev;
                });
              } catch (error) {
                console.error('Error removing word from suggestion:', error);
              }
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
      <View style={styles.categoryBarContainer}>
        <CategoryBar
          categories={categories}
          selectedId={selectedCategory}
          onSelect={handleCategorySelect}
        />
      </View>

      {/* Tiles Grid */}
      <View style={styles.gridContainer}>
        <ScrollView
          style={styles.gridScrollView}
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
        currentEmotion={emotionSettings.selectedEmotion}
        onEmotionChange={(emotion) => {
          // Update emotion through settings
        }}
      />

      {/* Tile Editor */}
      {editingTile && (
        <TileEditor
          visible={!!editingTile}
          tile={editingTile}
          onSave={handleSaveEdit}
          onClose={() => {
            setEditingTile(null);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.backgroundAlt,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    zIndex: 10,
    elevation: 10,
    minHeight: 100,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8 as any,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  backButtonText: {
    fontSize: 15,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
  },
  emotionContainer: {
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -100 }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsButton: {
    padding: 8,
    backgroundColor: colors.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  phraseBarContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    zIndex: 9,
    elevation: 9,
  },
  predictorContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.backgroundAlt,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    minHeight: 100,
    maxHeight: 120,
    zIndex: 8,
    elevation: 8,
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
    zIndex: 7,
    elevation: 7,
  },
  gridContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    zIndex: 1,
    elevation: 1,
  },
  gridScrollView: {
    flex: 1,
  },
});
