
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
      Animated.timing(scaleAnim, { toValue: 1.15, duration: 100, useNativeDriver: true }),
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
                marginRight: index < categories.length - 1 ? 12 : 0,
              }}
            >
              <TouchableOpacity
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? cat.color : colors.backgroundAlt,
                    borderColor: active ? cat.color : colors.border,
                    borderWidth: active ? 3 : 1,
                    boxShadow: active ? `0px 0px 25px ${cat.color}` : '0px 2px 6px rgba(0,0,0,0.08)',
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
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: colors.background,
    borderRadius: 16,
    boxShadow: '0px 2px 8px rgba(0,0,0,0.06)',
  },
  row: {
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  chip: {
    width: 70,
    height: 70,
    borderRadius: 16,
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
