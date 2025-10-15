
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Tile } from '../types';
import { colors } from '../styles/commonStyles';
import Icon from './Icon';

interface Props {
  sentence: Tile[];
  onSpeak: () => void;
  onClear: () => void;
  onBackspace?: () => void;
  onRemove?: (index: number) => void;
}

export default function PhraseBar({ sentence, onSpeak, onClear, onBackspace, onRemove }: Props) {
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
          {onBackspace && (
            <TouchableOpacity 
              style={[styles.actionBtn, styles.backspaceBtn, { opacity: sentence.length > 0 ? 1 : 0.4 }]} 
              onPress={onBackspace} 
              activeOpacity={0.85}
              disabled={sentence.length === 0}
            >
              <Icon name="backspace-outline" size={26} color={colors.text} />
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={[styles.actionBtn, styles.speakBtn]} 
            onPress={onSpeak} 
            activeOpacity={0.85}
          >
            <Icon name="volume-high-outline" size={30} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionBtn, styles.clearBtn]} 
            onPress={onClear} 
            activeOpacity={0.85}
          >
            <Icon name="close-outline" size={30} color="#FFFFFF" />
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
    borderColor: colors.borderLight,
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
  backspaceBtn: {
    backgroundColor: colors.backgroundAlt,
    borderColor: colors.border,
  },
  speakBtn: {
    backgroundColor: colors.primary,
    borderColor: colors.border,
  },
  clearBtn: {
    backgroundColor: colors.danger,
    borderColor: colors.border,
  },
});
