
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../styles/commonStyles';
import { AdvancedSuggestion } from '../hooks/useAdvancedAI';
import Icon from './Icon';
import TenseSwitcher from './TenseSwitcher';

interface Props {
  suggestions: AdvancedSuggestion[];
  onPressSuggestion: (text: string) => void;
  onRemoveWord?: (word: string) => void;
  style?: any;
  showDetails?: boolean;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'temporal':
      return 'time-outline';
    case 'pattern':
      return 'trending-up-outline';
    case 'contextual':
      return 'search-outline';
    case 'preference':
      return 'heart-outline';
    case 'full_sentence':
      return 'text-outline';
    case 'tense_variation':
      return 'time-outline';
    default:
      return 'bulb-outline';
  }
};

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 0.8) return colors.success;
  if (confidence >= 0.6) return colors.warning;
  return colors.error;
};

export default function AdvancedSuggestionsRow({ 
  suggestions, 
  onPressSuggestion,
  onRemoveWord,
  style,
  showDetails = false 
}: Props) {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  if (suggestions.length === 0) {
    return null;
  }

  const handleTenseSelect = (newWord: string, tense: string) => {
    if (onRemoveWord && selectedWord) {
      onRemoveWord(selectedWord);
    }
    onPressSuggestion(newWord);
    setSelectedWord(null);
  };

  return (
    <View style={[styles.container, style]}>
      {selectedWord && (
        <TenseSwitcher
          word={selectedWord}
          onSelectTense={handleTenseSelect}
          style={styles.tenseSwitcher}
        />
      )}
      
      <ScrollView
        horizontal
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {suggestions.slice(0, 10).map((suggestion, index) => {
          const isFullSentence = suggestion.type === 'full_sentence';
          const isTenseVariation = suggestion.type === 'tense_variation';
          
          return (
            <TouchableOpacity
              key={`${suggestion.text}-${index}`}
              style={[
                styles.suggestion,
                isFullSentence && styles.fullSentenceSuggestion,
                isTenseVariation && styles.tenseVariationSuggestion,
                { borderLeftColor: getConfidenceColor(suggestion.confidence) }
              ]}
              onPress={() => onPressSuggestion(suggestion.text)}
              onLongPress={() => setSelectedWord(suggestion.text)}
              activeOpacity={0.8}
            >
              <View style={styles.suggestionHeader}>
                <Icon
                  name={getTypeIcon(suggestion.type)}
                  size={16}
                  color={isFullSentence ? colors.primary : isTenseVariation ? colors.warning : colors.textSecondary}
                  style={styles.typeIcon}
                />
                <Text style={[
                  styles.confidenceText,
                  isFullSentence && styles.fullSentenceConfidence,
                  isTenseVariation && styles.tenseVariationConfidence
                ]}>
                  {Math.round(suggestion.confidence * 100)}%
                </Text>
              </View>
              <Text 
                style={[
                  styles.suggestionText,
                  isFullSentence && styles.fullSentenceText,
                  isTenseVariation && styles.tenseVariationText
                ]} 
                numberOfLines={2}
              >
                {suggestion.text}
              </Text>
              {isFullSentence && (
                <View style={styles.labelBadge}>
                  <Text style={styles.fullSentenceLabel}>Full Sentence</Text>
                </View>
              )}
              {isTenseVariation && suggestion.context && (
                <View style={styles.labelBadge}>
                  <Text style={styles.tenseLabel}>{suggestion.context}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      
      {selectedWord && (
        <Text style={styles.hintText}>
          Long press a word to change its tense
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  tenseSwitcher: {
    marginBottom: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    gap: 10 as any,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  suggestion: {
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderLeftWidth: 4,
    boxShadow: '0px 2px 6px rgba(0,0,0,0.1)',
    minWidth: 140,
    maxWidth: 200,
  },
  fullSentenceSuggestion: {
    backgroundColor: '#EEF2FF',
    borderLeftColor: colors.primary,
    borderLeftWidth: 5,
    minWidth: 200,
    maxWidth: 280,
  },
  tenseVariationSuggestion: {
    backgroundColor: '#FFF7ED',
    borderLeftColor: colors.warning,
    borderLeftWidth: 4,
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  typeIcon: {
    marginRight: 4,
  },
  confidenceText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontFamily: 'Montserrat_600SemiBold',
  },
  fullSentenceConfidence: {
    color: colors.primary,
  },
  tenseVariationConfidence: {
    color: colors.warning,
  },
  suggestionText: {
    fontSize: 14,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
    lineHeight: 18,
  },
  fullSentenceText: {
    fontSize: 13,
    lineHeight: 17,
    color: colors.primary,
  },
  tenseVariationText: {
    fontSize: 14,
    color: colors.warning,
  },
  labelBadge: {
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  fullSentenceLabel: {
    fontSize: 9,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tenseLabel: {
    fontSize: 9,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.warning,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  hintText: {
    fontSize: 11,
    fontFamily: 'Montserrat_400Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});
