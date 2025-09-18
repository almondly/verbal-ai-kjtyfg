
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
        {suggestions.slice(0, 6).map((suggestion, index) => (
          <TouchableOpacity
            key={`${suggestion.text}-${index}`}
            style={[
              styles.suggestion,
              { borderLeftColor: getConfidenceColor(suggestion.confidence) }
            ]}
            onPress={() => onPressSuggestion(suggestion.text)}
            activeOpacity={0.8}
          >
            <View style={styles.suggestionHeader}>
              <Icon
                name={getTypeIcon(suggestion.type)}
                size={14}
                color={colors.textSecondary}
                style={styles.typeIcon}
              />
              <Text style={styles.confidenceText}>
                {Math.round(suggestion.confidence * 100)}%
              </Text>
            </View>
            <Text style={styles.suggestionText} numberOfLines={2}>
              {suggestion.text}
            </Text>
          </TouchableOpacity>
        ))}
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
  suggestionText: {
    fontSize: 13,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
    lineHeight: 16,
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
