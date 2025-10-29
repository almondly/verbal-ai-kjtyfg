
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../styles/commonStyles';

interface Props {
  suggestions: string[];
  onPressSuggestion: (text: string) => void;
  style?: any;
}

export default function SuggestionsRow({ suggestions, onPressSuggestion, style }: Props) {
  if (!suggestions || suggestions.length === 0) {
    return (
      <View style={[styles.emptyContainer, style]}>
        <Text style={styles.emptyText}>Start building a sentence to see suggestions</Text>
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
        {suggestions.slice(0, 8).map((s, index) => (
          <TouchableOpacity
            key={`${s}-${index}`}
            style={styles.suggestion}
            onPress={() => onPressSuggestion(s)}
            activeOpacity={0.8}
          >
            <Text style={styles.text} numberOfLines={1}>{s}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 8,
    boxShadow: '0px 2px 6px rgba(0,0,0,0.06)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    alignItems: 'center',
    gap: 8 as any,
    paddingHorizontal: 4,
  },
  suggestion: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 4px rgba(0,0,0,0.08)',
  },
  text: {
    color: colors.white,
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 13,
    lineHeight: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 6px rgba(0,0,0,0.06)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyText: {
    color: colors.textSecondary,
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    textAlign: 'center',
  },
});
