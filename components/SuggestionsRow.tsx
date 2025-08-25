
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
      contentContainerStyle={styles.row}
      style={{ marginBottom: 4 }}
    >
      {suggestions.slice(0, 6).map((s) => (
        <TouchableOpacity
          key={s}
          style={styles.suggestion}
          onPress={() => onPressSuggestion(s)}
          activeOpacity={0.9}
        >
          <Text style={styles.text}>{s}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 4,
    gap: 6 as any,
  },
  suggestion: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    boxShadow: '0px 6px 14px rgba(0,0,0,0.06)',
  },
  text: {
    color: colors.text,
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 13,
  },
});
