
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '../styles/commonStyles';
import Icon from './Icon';
import { getVerbFormForContext, isLikelyVerb, getBaseForm } from '../utils/wordVariations';

interface Props {
  word: string;
  onSelectTense: (newWord: string, tense: string) => void;
  style?: any;
}

export default function TenseSwitcher({ word, onSelectTense, style }: Props) {
  const lowerWord = word.toLowerCase();
  
  // Check if the word is likely a verb
  if (!isLikelyVerb(lowerWord)) {
    return null;
  }

  const baseForm = getBaseForm(lowerWord);
  
  // Generate tense variations
  const tenses = [
    { label: 'Present', tense: 'present', word: getVerbFormForContext(baseForm, 'present') },
    { label: 'Past', tense: 'past', word: getVerbFormForContext(baseForm, 'past') },
    { label: 'Future', tense: 'future', word: getVerbFormForContext(baseForm, 'future') },
  ];

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Icon name="time-outline" size={16} color="#000000" />
        <Text style={styles.headerText}>Change Tense</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tenseRow}
      >
        {tenses.map((tenseOption) => (
          <TouchableOpacity
            key={tenseOption.tense}
            style={[
              styles.tenseButton,
              tenseOption.word.toLowerCase() === lowerWord && styles.tenseButtonActive
            ]}
            onPress={() => onSelectTense(tenseOption.word, tenseOption.tense)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.tenseLabel,
              tenseOption.word.toLowerCase() === lowerWord && styles.tenseLabelActive
            ]}>
              {tenseOption.label}
            </Text>
            <Text style={[
              styles.tenseWord,
              tenseOption.word.toLowerCase() === lowerWord && styles.tenseWordActive
            ]}>
              {tenseOption.word}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 12,
    boxShadow: '0px 2px 6px rgba(0,0,0,0.08)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8 as any,
    marginBottom: 8,
  },
  headerText: {
    fontSize: 13,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#000000',
  },
  tenseRow: {
    flexDirection: 'row',
    gap: 8 as any,
  },
  tenseButton: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 100,
  },
  tenseButtonActive: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
  },
  tenseLabel: {
    fontSize: 11,
    fontFamily: 'Montserrat_500Medium',
    color: '#000000',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  tenseLabelActive: {
    color: '#000000',
  },
  tenseWord: {
    fontSize: 14,
    fontFamily: 'Montserrat_700Bold',
    color: '#000000',
  },
  tenseWordActive: {
    color: '#000000',
  },
});
