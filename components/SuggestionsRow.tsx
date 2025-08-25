
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../styles/commonStyles';

interface Props {
  suggestions: string[];
  onPressSuggestion: (text: string) => void;
  style?: any;
}

export default function SuggestionsRow({ suggestions, onPressSuggestion, style }: Props) {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.container, style]}
      contentContainerStyle={styles.row}
      keyboardShouldPersistTaps="handled"
    >
      {suggestions.slice(0, 7).map((s) => (
        <TouchableOpacity
          key={s}
          style={styles.suggestion}
          onPress={() => onPressSuggestion(s)}
          activeOpacity={0.9}
        >
          <Text style={styles.text} numberOfLines={1}>{s}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    marginBottom: 0,
    paddingVertical: 0,
  },
  row: {
    paddingVertical: 0,
    gap: 2 as any,
    alignItems: 'center',
  },
  suggestion: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 0,
    boxShadow: '0px 2px 4px rgba(0,0,0,0.03)',
  },
  text: {
    color: colors.text,
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 9,
    lineHeight: 11,
  },
});
