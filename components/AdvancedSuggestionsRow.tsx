
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../styles/commonStyles';
import { AdvancedSuggestion } from '../hooks/useAdvancedAI';
import Icon from './Icon';

interface Props {
  suggestions: AdvancedSuggestion[];
  onPressSuggestion: (text: string) => void;
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
  style,
  showDetails = false 
}: Props) {
  if (suggestions.length === 0) {
    return (
      <View style={[styles.emptyContainer, style]}>
        <Text style={styles.emptyText}>
          AI suggestions will appear as you build sentences
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        keyboardShouldPersistTaps="handled"
      >
        {suggestions.slice(0, 10).map((suggestion, index) => {
          const isFullSentence = suggestion.type === 'full_sentence';
          return (
            <TouchableOpacity
              key={`${suggestion.text}-${index}`}
              style={[
                styles.suggestion,
                isFullSentence && styles.fullSentenceSuggestion,
                { borderLeftColor: getConfidenceColor(suggestion.confidence) }
              ]}
              onPress={() => onPressSuggestion(suggestion.text)}
              activeOpacity={0.8}
            >
              <View style={styles.suggestionHeader}>
                <Icon
                  name={getTypeIcon(suggestion.type)}
                  size={14}
                  color={isFullSentence ? colors.primary : colors.textSecondary}
                  style={styles.typeIcon}
                />
                <Text style={[
                  styles.confidenceText,
                  isFullSentence && styles.fullSentenceConfidence
                ]}>
                  {Math.round(suggestion.confidence * 100)}%
                </Text>
              </View>
              <Text 
                style={[
                  styles.suggestionText,
                  isFullSentence && styles.fullSentenceText
                ]} 
                numberOfLines={isFullSentence ? 3 : 2}
              >
                {suggestion.text}
              </Text>
              {isFullSentence && (
                <Text style={styles.fullSentenceLabel}>Full Sentence</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 8,
    boxShadow: '0px 2px 6px rgba(0,0,0,0.06)',
  },
  row: {
    alignItems: 'center',
    gap: 8 as any,
    paddingHorizontal: 4,
  },
  suggestion: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 100,
    maxWidth: 140,
    borderLeftWidth: 3,
    boxShadow: '0px 2px 4px rgba(0,0,0,0.08)',
  },
  fullSentenceSuggestion: {
    minWidth: 180,
    maxWidth: 220,
    backgroundColor: '#EEF2FF',
    borderLeftColor: colors.primary,
    borderLeftWidth: 4,
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  typeIcon: {
    marginRight: 4,
  },
  confidenceText: {
    fontSize: 10,
    color: colors.textSecondary,
    fontFamily: 'Montserrat_600SemiBold',
  },
  fullSentenceConfidence: {
    color: colors.primary,
  },
  suggestionText: {
    fontSize: 13,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
    lineHeight: 16,
  },
  fullSentenceText: {
    fontSize: 12,
    lineHeight: 15,
    color: colors.primary,
  },
  fullSentenceLabel: {
    fontSize: 9,
    fontFamily: 'Montserrat_500Medium',
    color: colors.primary,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  emptyContainer: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 6px rgba(0,0,0,0.06)',
  },
  emptyText: {
    color: colors.textSecondary,
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    textAlign: 'center',
  },
});
