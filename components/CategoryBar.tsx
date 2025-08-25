
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
      style={styles.container}
      contentContainerStyle={styles.row}
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
            <Icon name={cat.icon as any} size={16} color={colors.text} />
            <Text style={styles.chipText}>{cat.label}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 2,
    marginBottom: 2,
    paddingVertical: 0,
  },
  row: {
    paddingVertical: 0,
    gap: 4 as any,
    alignItems: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4 as any,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    boxShadow: '0px 4px 10px rgba(0,0,0,0.04)',
  },
  chipText: {
    color: colors.text,
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 12,
  },
});
