
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../styles/commonStyles';

interface Props {
  suggestions: string[];
  onPressSuggestion: (text: string) => void;
}

export default function SuggestionsRow({ suggestions, onPressSuggestion }: Props) {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.row}
    >
      {suggestions.slice(0, 6).map((s) => (
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
    minHeight: 26,
  },
  row: {
    paddingVertical: 0,
    gap: 3 as any,
    alignItems: 'center',
  },
  suggestion: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    boxShadow: '0px 3px 8px rgba(0,0,0,0.04)',
  },
  text: {
    color: colors.text,
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 11,
    lineHeight: 13,
  },
});
