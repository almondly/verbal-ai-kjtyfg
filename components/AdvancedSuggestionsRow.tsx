
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../styles/commonStyles';
import { AdvancedSuggestion } from '../hooks/useAdvancedAI';
import Icon from './Icon';
import TenseSwitcher from './TenseSwitcher';

interface Props {
  suggestions: AdvancedSuggestion[];
  onPressSuggestion: (text: string, isFullSentence: boolean) => void;
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
    case 'common_phrase':
      return 'star-outline';
    case 'category_contextual':
      return 'folder-outline';
    case 'polite_ending':
      return 'happy-outline';
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
    onPressSuggestion(newWord, false);
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
          const isCategoryContextual = suggestion.type === 'category_contextual';
          const isPoliteEnding = suggestion.type === 'polite_ending';
          const isGrammarCorrection = suggestion.context?.toLowerCase().includes('grammar');
          
          return (
            <TouchableOpacity
              key={`${suggestion.text}-${index}`}
              style={[
                styles.suggestion,
                isFullSentence && styles.fullSentenceSuggestion,
                isTenseVariation && styles.tenseVariationSuggestion,
                isCategoryContextual && styles.categoryContextualSuggestion,
                isPoliteEnding && styles.politeEndingSuggestion,
                isGrammarCorrection && styles.grammarCorrectionSuggestion,
                { borderLeftColor: getConfidenceColor(suggestion.confidence) }
              ]}
              onPress={() => onPressSuggestion(suggestion.text, isFullSentence)}
              onLongPress={() => !isFullSentence && setSelectedWord(suggestion.text)}
              activeOpacity={0.8}
            >
              <View style={styles.suggestionHeader}>
                <Icon
                  name={getTypeIcon(suggestion.type)}
                  size={14}
                  color="#000000"
                  style={styles.typeIcon}
                />
                <Text style={[
                  styles.confidenceText,
                  isGrammarCorrection && styles.grammarCorrectionConfidence,
                  isFullSentence && styles.fullSentenceConfidence,
                  isTenseVariation && styles.tenseVariationConfidence,
                  isCategoryContextual && styles.categoryContextualConfidence,
                  isPoliteEnding && styles.politeEndingConfidence
                ]}>
                  {Math.round(suggestion.confidence * 100)}%
                </Text>
              </View>
              <Text 
                style={[
                  styles.suggestionText,
                  isGrammarCorrection && styles.grammarCorrectionText,
                  isFullSentence && styles.fullSentenceText,
                  isTenseVariation && styles.tenseVariationText,
                  isCategoryContextual && styles.categoryContextualText,
                  isPoliteEnding && styles.politeEndingText
                ]} 
                numberOfLines={2}
              >
                {suggestion.text}
              </Text>
              {isGrammarCorrection && (
                <View style={styles.labelBadge}>
                  <Text style={styles.grammarLabel}>✓ Grammar Fix</Text>
                </View>
              )}
              {isFullSentence && !isGrammarCorrection && (
                <View style={styles.labelBadge}>
                  <Text style={styles.fullSentenceLabel}>Full Sentence</Text>
                </View>
              )}
              {isTenseVariation && suggestion.context && (
                <View style={styles.labelBadge}>
                  <Text style={styles.tenseLabel}>{suggestion.context}</Text>
                </View>
              )}
              {isCategoryContextual && suggestion.context && (
                <View style={styles.labelBadge}>
                  <Text style={styles.categoryLabel}>{suggestion.context}</Text>
                </View>
              )}
              {isPoliteEnding && (
                <View style={styles.labelBadge}>
                  <Text style={styles.politeLabel}>Polite</Text>
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
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  tenseSwitcher: {
    marginBottom: 6,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    gap: 8 as any,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  suggestion: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderLeftWidth: 3,
    boxShadow: '0px 2px 4px rgba(0,0,0,0.08)',
    minWidth: 90,
    maxWidth: 140,
  },
  grammarCorrectionSuggestion: {
    backgroundColor: '#FFFFFF',
    borderLeftColor: '#8fd2b0',
    borderLeftWidth: 4,
    minWidth: 140,
    maxWidth: 200,
  },
  fullSentenceSuggestion: {
    backgroundColor: '#FFFFFF',
    borderLeftColor: colors.primary,
    borderLeftWidth: 4,
    minWidth: 140,
    maxWidth: 200,
  },
  tenseVariationSuggestion: {
    backgroundColor: '#FFFFFF',
    borderLeftColor: colors.warning,
    borderLeftWidth: 3,
  },
  categoryContextualSuggestion: {
    backgroundColor: '#FFFFFF',
    borderLeftColor: '#8fd2b0',
    borderLeftWidth: 3,
  },
  politeEndingSuggestion: {
    backgroundColor: '#FFFFFF',
    borderLeftColor: '#f9d809',
    borderLeftWidth: 3,
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  typeIcon: {
    marginRight: 3,
  },
  confidenceText: {
    fontSize: 9,
    color: '#000000',
    fontFamily: 'Montserrat_600SemiBold',
  },
  grammarCorrectionConfidence: {
    color: '#000000',
  },
  fullSentenceConfidence: {
    color: '#000000',
  },
  tenseVariationConfidence: {
    color: '#000000',
  },
  categoryContextualConfidence: {
    color: '#000000',
  },
  politeEndingConfidence: {
    color: '#000000',
  },
  suggestionText: {
    fontSize: 12,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#000000',
    lineHeight: 16,
  },
  grammarCorrectionText: {
    fontSize: 11,
    lineHeight: 15,
    color: '#000000',
  },
  fullSentenceText: {
    fontSize: 11,
    lineHeight: 15,
    color: '#000000',
  },
  tenseVariationText: {
    fontSize: 12,
    color: '#000000',
  },
  categoryContextualText: {
    fontSize: 12,
    color: '#000000',
  },
  politeEndingText: {
    fontSize: 12,
    color: '#000000',
  },
  labelBadge: {
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  grammarLabel: {
    fontSize: 8,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fullSentenceLabel: {
    fontSize: 8,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tenseLabel: {
    fontSize: 8,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  categoryLabel: {
    fontSize: 8,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  politeLabel: {
    fontSize: 8,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  hintText: {
    fontSize: 10,
    fontFamily: 'Montserrat_400Regular',
    color: '#000000',
    textAlign: 'center',
    marginTop: 6,
    fontStyle: 'italic',
  },
});
