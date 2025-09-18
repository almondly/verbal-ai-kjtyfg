
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

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  suggestion: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    minWidth: 120,
    borderWidth: 1,
    borderColor: colors.border,
  },
  suggestionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  confidenceBar: {
    height: 3,
    backgroundColor: colors.border,
    borderRadius: 2,
    flex: 1,
    marginRight: 8,
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 2,
  },
  confidenceText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  typeIcon: {
    marginRight: 4,
  },
  typeText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  reasoning: {
    fontSize: 10,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'temporal':
      return 'clock';
    case 'pattern':
      return 'trending-up';
    case 'contextual':
      return 'search';
    default:
      return 'lightbulb';
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
  showDetails = true 
}: Props) {
  if (suggestions.length === 0) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Start typing to see AI-powered suggestions based on your patterns
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.container, style]}
    >
      {suggestions.map((suggestion, index) => (
        <TouchableOpacity
          key={index}
          style={styles.suggestion}
          onPress={() => onPressSuggestion(suggestion.text)}
          activeOpacity={0.7}
        >
          <Text style={styles.suggestionText} numberOfLines={2}>
            {suggestion.text}
          </Text>
          
          {showDetails && (
            <>
              <View style={styles.confidenceContainer}>
                <View style={styles.confidenceBar}>
                  <View
                    style={[
                      styles.confidenceFill,
                      {
                        width: `${suggestion.confidence * 100}%`,
                        backgroundColor: getConfidenceColor(suggestion.confidence),
                      },
                    ]}
                  />
                </View>
                <Text style={styles.confidenceText}>
                  {Math.round(suggestion.confidence * 100)}%
                </Text>
              </View>

              <View style={styles.typeContainer}>
                <Icon
                  name={getTypeIcon(suggestion.type)}
                  size={12}
                  color={colors.textSecondary}
                  style={styles.typeIcon}
                />
                <Text style={styles.typeText}>{suggestion.type}</Text>
              </View>

              {suggestion.reasoning && (
                <Text style={styles.reasoning} numberOfLines={2}>
                  {suggestion.reasoning}
                </Text>
              )}
            </>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
