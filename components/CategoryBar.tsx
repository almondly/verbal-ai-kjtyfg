
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
      Animated.timing(scaleAnim, { toValue: 1.1, duration: 100, useNativeDriver: true }),
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
                    backgroundColor: cat.color,
                    borderColor: active ? cat.color : colors.border,
                    borderWidth: active ? 6 : 2,
                    opacity: active ? 1 : 0.85,
                    boxShadow: active ? `0px 0px 12px ${cat.color}` : '0px 3px 6px rgba(0,0,0,0.15)',
                  },
                ]}
                onPress={() => {
                  onSelect(cat.id);
                  animatePop();
                }}
                activeOpacity={0.9}
              >
                <Icon 
                  name={cat.icon as any} 
                  size={28} 
                  color="#000000" 
                />
                <Text style={[
                  styles.chipText, 
                  { 
                    color: '#000000',
                    fontFamily: active ? 'Montserrat_700Bold' : 'Montserrat_600SemiBold'
                  }
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
    paddingVertical: 10,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.borderLight,
    boxShadow: '0px 2px 6px rgba(0,0,0,0.12)',
  },
  row: {
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  chip: {
    width: 80,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipText: {
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
});
