
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Tile } from '../types';
import { colors } from '../styles/commonStyles';
import Icon from './Icon';

interface Props {
  sentence: Tile[];
  onSpeak: () => void;
  onClear: () => void;
  onBackspace?: () => void;
}

export default function PhraseBar({ sentence, onSpeak, onClear, onBackspace }: Props) {
  const text = sentence.map(s => s.text).join(' ');
  return (
    <View style={styles.bar}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{text || 'Tap tiles to build a sentence'}</Text>
      </View>
      <View style={styles.actions}>
        {onBackspace && (
          <TouchableOpacity 
            style={[styles.actionBtn, styles.backspaceBtn, { opacity: sentence.length > 0 ? 1 : 0.5 }]} 
            onPress={onBackspace} 
            activeOpacity={0.9}
            disabled={sentence.length === 0}
          >
            <Icon name="backspace-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.secondary }]} onPress={onSpeak} activeOpacity={0.9}>
          <Icon name="volume-high-outline" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.accent }]} onPress={onClear} activeOpacity={0.9}>
          <Icon name="close-outline" size={32} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    width: '100%',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    boxShadow: '0px 6px 12px rgba(0,0,0,0.06)',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    minHeight: 60,
  },
  textContainer: {
    flex: 1,
    paddingRight: 12,
    justifyContent: 'center',
    minHeight: 44,
  },
  text: {
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
    fontSize: 16,
    lineHeight: 22,
    flexWrap: 'wrap',
  },
  actions: {
    flexDirection: 'row',
    gap: 8 as any,
    alignItems: 'center',
  },
  actionBtn: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backspaceBtn: {
    backgroundColor: colors.backgroundAlt,
    borderWidth: 2,
    borderColor: colors.primary + '40',
  },
});
