
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../styles/commonStyles';
import Icon from './Icon';

interface Props {
  currentTime: string;
  commonSentences: string[];
  onSelectSentence: (sentence: string) => void;
  style?: any;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerIcon: {
    marginRight: 8,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  timeText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  sentenceItem: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sentenceText: {
    fontSize: 14,
    color: colors.text,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 8,
  },
});

export default function TemporalInsights({ 
  currentTime, 
  commonSentences, 
  onSelectSentence, 
  style 
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Icon
          name="clock"
          size={20}
          color={colors.primary}
          style={styles.headerIcon}
        />
        <Text style={styles.headerText}>Temporal Context</Text>
      </View>
      
      <Text style={styles.timeText}>
        Currently {currentTime}
      </Text>

      <Text style={styles.sectionTitle}>
        Common sentences at this time:
      </Text>

      {commonSentences.length > 0 ? (
        commonSentences.map((sentence, index) => (
          <TouchableOpacity
            key={index}
            style={styles.sentenceItem}
            onPress={() => onSelectSentence(sentence)}
            activeOpacity={0.7}
          >
            <Text style={styles.sentenceText}>{sentence}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.emptyText}>
          No common patterns found for this time yet. Keep using the app to build your temporal patterns!
        </Text>
      )}
    </View>
  );
}
