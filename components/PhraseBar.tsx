
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Tile } from '../types';
import { colors } from '../styles/commonStyles';
import Icon from './Icon';

interface Props {
  sentence: Tile[];
  onSpeak: () => void;
  onClear: () => void;
}

export default function PhraseBar({ sentence, onSpeak, onClear }: Props) {
  const text = sentence.map(s => s.text).join(' ');
  return (
    <View style={styles.bar}>
      <ScrollView
        horizontal
        contentContainerStyle={{ alignItems: 'center' }}
        showsHorizontalScrollIndicator={false}
      >
        <Text style={styles.text}>{text || 'Tap tiles to build a sentence'}</Text>
      </ScrollView>
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.secondary }]} onPress={onSpeak} activeOpacity={0.9}>
          <Icon name="volume-high-outline" size={22} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.accent }]} onPress={onClear} activeOpacity={0.9}>
          <Icon name="close-outline" size={26} color={colors.text} />
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
    paddingVertical: 8,
    paddingHorizontal: 12,
    boxShadow: '0px 6px 12px rgba(0,0,0,0.06)',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 16,
  },
  text: {
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
    fontSize: 16,
  },
  actions: {
    marginLeft: 'auto',
    flexDirection: 'row',
    gap: 8 as any,
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
