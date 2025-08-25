
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../styles/commonStyles';
import Icon from './Icon';
import { Category } from '../types';

interface Props {
  categories: Category[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function CategoryBar({ categories, selectedId, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={{ marginBottom: 10 }}
    >
      {categories.map((cat) => {
        const active = cat.id === selectedId;
        return (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.chip,
              { backgroundColor: active ? cat.color : colors.backgroundAlt, borderColor: cat.color },
            ]}
            onPress={() => onSelect(cat.id)}
            activeOpacity={0.9}
          >
            <Icon name={cat.icon as any} size={18} color={colors.text} />
            <Text style={styles.chipText}>{cat.label}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 8,
    gap: 8 as any,
    alignItems: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6 as any,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    boxShadow: '0px 8px 18px rgba(0,0,0,0.06)',
  },
  chipText: {
    color: colors.text,
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 13,
  },
});
