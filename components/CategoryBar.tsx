
import React from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Category } from '../types';
import { colors } from '../styles/commonStyles';
import Icon from './Icon';

interface Props {
  categories: Category[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function CategoryBar({ categories, selectedId, onSelect }: Props) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {categories.map((category) => {
          const isSelected = category.id === selectedId;
          return (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                isSelected && styles.categoryButtonSelected,
                isSelected && { 
                  backgroundColor: category.color,
                  boxShadow: `0px 0px 20px ${category.color}`,
                }
              ]}
              onPress={() => onSelect(category.id)}
              activeOpacity={0.8}
            >
              <Icon 
                name={category.icon} 
                size={24} 
                color={isSelected ? '#FFFFFF' : colors.text} 
              />
              <Text style={[
                styles.categoryLabel,
                isSelected && styles.categoryLabelSelected
              ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.background,
    paddingVertical: 4,
    borderBottomWidth: 2,
    borderBottomColor: colors.backgroundAlt,
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 8,
    gap: 8 as any,
    alignItems: 'center',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8 as any,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.backgroundAlt,
    minWidth: 100,
    justifyContent: 'center',
  },
  categoryButtonSelected: {
    transform: [{ scale: 1.05 }],
  },
  categoryLabel: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: colors.text,
  },
  categoryLabelSelected: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat_700Bold',
  },
});
