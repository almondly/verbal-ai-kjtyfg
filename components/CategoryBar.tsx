
import { ScrollView, Text, TouchableOpacity, StyleSheet, View, Animated } from 'react-native';
import { useRef } from 'react';
import Icon from './Icon';
import { Category } from '../types';

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
      <View style={styles.backgroundBox} />
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
                marginRight: index < categories.length - 1 ? 10 : 0,
              }}
            >
              <TouchableOpacity
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? cat.color : '#FFFFFF',
                    borderColor: cat.color,
                    shadowColor: active ? cat.color : 'transparent',
                    shadowOpacity: active ? 0.8 : 0,
                    shadowRadius: active ? 10 : 0,
                    elevation: active ? 10 : 0,
                  },
                ]}
                onPress={() => {
                  onSelect(cat.id);
                  animatePop();
                }}
                activeOpacity={0.8}
              >
                <Icon name={cat.icon as any} size={28} color="#000" />
                <Text style={[styles.chipText, { color: '#000' }]}>{cat.label}</Text>
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
    position: 'absolute',
    top: 280,
    left: 0,
    right: 0,
    zIndex: 2,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  backgroundBox: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  row: {
    alignItems: 'center',
  },
  chip: {
    width: 80,
    height: 80,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
});
