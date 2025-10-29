
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Tile } from '../types';
import { colors } from '../styles/commonStyles';
import Icon from './Icon';

interface Props {
  sentence: Tile[];
  onSpeak: () => void;
  onClear: () => void;
  onDeleteWord?: () => void;
  onReplay?: () => void;
  hasLastSpoken?: boolean;
  onRemove?: (index: number) => void;
}

export default function PhraseBar({ 
  sentence, 
  onSpeak, 
  onClear, 
  onDeleteWord, 
  onReplay, 
  hasLastSpoken = false,
  onRemove 
}: Props) {
  const text = sentence.map(s => s.text).join(' ');
  
  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <ScrollView 
          style={styles.textScrollContainer}
          contentContainerStyle={styles.textContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.text}>{text || 'Tap tiles to build a sentence'}</Text>
        </ScrollView>
        <View style={styles.actions}>
          {onDeleteWord && (
            <TouchableOpacity 
              style={[styles.actionBtn, styles.deleteWordBtn, { opacity: sentence.length > 0 ? 1 : 0.4 }]} 
              onPress={onDeleteWord} 
              activeOpacity={0.85}
              disabled={sentence.length === 0}
            >
              <Icon name="backspace-outline" size={24} color={colors.text} />
            </TouchableOpacity>
          )}
          {onReplay && (
            <TouchableOpacity 
              style={[styles.actionBtn, styles.replayBtn, { opacity: hasLastSpoken ? 1 : 0.4 }]} 
              onPress={onReplay} 
              activeOpacity={0.85}
              disabled={!hasLastSpoken}
            >
              <Icon name="play-outline" size={24} color={colors.text} />
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={[styles.actionBtn, styles.speakBtn]} 
            onPress={onSpeak} 
            activeOpacity={0.85}
          >
            <Icon name="volume-high-outline" size={30} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionBtn, styles.clearBtn]} 
            onPress={onClear} 
            activeOpacity={0.85}
          >
            <Icon name="close-outline" size={30} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  bar: {
    width: '100%',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    boxShadow: '0px 2px 6px rgba(0,0,0,0.15)',
    borderWidth: 2,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 80,
    maxHeight: 120,
  },
  textScrollContainer: {
    flex: 1,
    paddingRight: 12,
  },
  textContainer: {
    justifyContent: 'center',
    minHeight: 48,
  },
  text: {
    fontFamily: 'Montserrat_700Bold',
    color: colors.text,
    fontSize: 18,
    lineHeight: 24,
    flexWrap: 'wrap',
  },
  actions: {
    flexDirection: 'row',
    gap: 8 as any,
    alignItems: 'center',
  },
  actionBtn: {
    width: 56,
    height: 56,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    boxShadow: '0px 2px 4px rgba(0,0,0,0.15)',
  },
  deleteWordBtn: {
    backgroundColor: colors.backgroundAlt,
    borderColor: colors.border,
  },
  replayBtn: {
    backgroundColor: colors.backgroundAlt,
    borderColor: colors.border,
  },
  speakBtn: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  clearBtn: {
    backgroundColor: '#F44336',
    borderColor: '#F44336',
  },
});
