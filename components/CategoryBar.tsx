import { ScrollView, Text, TouchableOpacity, StyleSheet, View, Animated } from 'react-native';
import { useRef } from 'react';
import Icon from './Icon';
import { Category } from '../types';
import { colors } from '../styles/commonStyles';

interface Props {
  categories: Category[];
  selectedId: string;
  onSelect: (id: string) => void;
  style?: any;
}

export default function CategoryBar({ categories, selectedId, onSelect, style }: Props) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animatePop = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.5, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  return (
    <View style={[styles.wrapper, style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        keyboardShouldPersistTaps="handled"
      >
        {categories.map((cat, index) => {
          const active = cat.id === selectedId;

          return (
            <Animated.View
              key={cat.id}
              style={{
                transform: [{ scale: active ? scaleAnim : 1 }],
                marginRight: index < categories.length - 1 ? 14 : 0, // a bit more spacing
              }}
            >
              <TouchableOpacity
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? cat.color : colors.backgroundAlt,
                    borderColor: cat.color,
                    borderWidth: active ? 3 : 2,

                    // ✅ Glow all around (spread more vertically too)
                    shadowColor: cat.color,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: active ? 0.35 : 0.15,
                    shadowRadius: active ? 14 : 7,
                    elevation: active ? 8 : 3,
                  },
                ]}
                onPress={() => {
                  onSelect(cat.id);
                  animatePop();
                }}
                activeOpacity={0.8}
              >
                <Icon 
                  name={cat.icon as any} 
                  size={24} 
                  color={colors.text} 
                />
                <Text style={[
                  styles.chipText, 
                  { color: colors.text }
                ]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    paddingHorizontal: 14,
    paddingVertical: 16, // ✅ more vertical breathing space
    backgroundColor: colors.background,
    borderRadius: 16, // ✅ slightly rounder frame

    // subtle wrapper shadow (so chip glow dominates)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  row: {
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 6, // ✅ stop clipping vertical glow
  },
  chip: {
    width: 72,
    height: 72,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipText: {
    fontSize: 11,
    fontFamily: 'Montserrat_600SemiBold',
    marginTop: 3,
    textAlign: 'center',
  },
});
