
import { useEffect, useMemo, useRef, useState } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView } from 'react-native';
import { colors } from '../styles/commonStyles';
import Icon from './Icon';
import EmotionFace from './EmotionFace';
import * as ImagePicker from 'expo-image-picker';
import { Tile } from '../types';
import { categories } from '../data/categories';
import { defaultTiles } from '../data/defaultTiles';

interface Props {
  open: boolean;
  onClose: () => void;
  onResetLearning?: () => void;
  onResetTiles?: () => void;
  title?: string;
  mode?: 'settings' | 'add';
  onAddTile?: (tile: Tile) => void;
  defaultCategoryId?: string;
  currentEmotion?: string;
  onEmotionChange?: (emotion: string) => void;
}

// Get all emotions from the feelings category
const emotionOptions = defaultTiles
  .filter(tile => tile.category === 'feelings')
  .map(tile => tile.text)
  .sort();

export default function SettingsSheet({
  open,
  onClose,
  onResetLearning,
  onResetTiles,
  title,
  mode = 'settings',
  onAddTile,
  defaultCategoryId,
  currentEmotion = 'happy',
  onEmotionChange,
}: Props) {
  const sheetRef = useRef<BottomSheet>(null);
  // Make it full screen by using 100% as the only snap point
  const snapPoints = useMemo(() => ['100%'], []);
  const [phrase, setPhrase] = useState('');
  const [color, setColor] = useState('#FFFFFF');
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(defaultCategoryId);

  useEffect(() => {
    if (open && mode === 'add') {
      setSelectedCategory(defaultCategoryId);
    }
  }, [open, mode, defaultCategoryId]);

  // Control opening/closing - snap to index 0 since we only have one snap point
  if (open && sheetRef.current) {
    setTimeout(() => sheetRef.current?.snapToIndex(0), 0);
  } else if (!open && sheetRef.current) {
    setTimeout(() => sheetRef.current?.close(), 0);
  }

  const pickImage = async () => {
    try {
      const res = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (res.status !== 'granted') {
        console.log('Permission not granted');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });
      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (e) {
      console.log('pickImage error', e);
    }
  };

  const closeAndReset = () => {
    setPhrase('');
    setColor('#FFFFFF');
    setImageUri(undefined);
    onClose();
  };

  const handleAddTile = () => {
    if (!phrase.trim()) return;
    const tile: Tile = {
      id: `custom-${Date.now()}`,
      text: phrase.trim(),
      color,
      imageUri,
      category: selectedCategory,
    };
    onAddTile && onAddTile(tile);
    closeAndReset();
  };

  const handleEmotionSelect = (emotion: string) => {
    console.log('Emotion selected:', emotion);
    onEmotionChange?.(emotion);
  };

  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={snapPoints}
      index={open ? 0 : -1}
      enablePanDownToClose
      onClose={closeAndReset}
      backgroundStyle={{ backgroundColor: colors.backgroundAlt, borderRadius: 0 }}
      handleIndicatorStyle={{ backgroundColor: '#CBD5E1' }}
    >
      <BottomSheetView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title || (mode === 'add' ? 'Add Tile' : 'Settings')}</Text>
          <TouchableOpacity onPress={closeAndReset} style={styles.closeBtn} activeOpacity={0.8}>
            <Icon name="close-outline" size={28} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {mode === 'settings' ? (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Current Emotion</Text>
                <View style={styles.currentEmotionContainer}>
                  <EmotionFace emotion={currentEmotion} size={140} />
                  <Text style={styles.currentEmotionText}>{currentEmotion}</Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Choose Your Emotion</Text>
                <View style={styles.emotionGrid}>
                  {emotionOptions.map((emotion) => (
                    <TouchableOpacity
                      key={emotion}
                      style={[
                        styles.emotionOption,
                        currentEmotion === emotion && styles.emotionOptionSelected,
                      ]}
                      onPress={() => handleEmotionSelect(emotion)}
                      activeOpacity={0.8}
                    >
                      <EmotionFace emotion={emotion} size={80} />
                      <Text style={styles.emotionOptionText}>{emotion}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Manage</Text>
                <View style={styles.row}>
                  <TouchableOpacity style={[styles.action, { backgroundColor: '#FEE2E2' }]} onPress={onResetLearning} activeOpacity={0.9}>
                    <Text style={[styles.actionText, { color: colors.danger }]}>Reset Learning</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.action, { backgroundColor: '#E0F2FE' }]} onPress={onResetTiles} activeOpacity={0.9}>
                    <Text style={[styles.actionText, { color: colors.primary }]}>Reset Tiles</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.helper}>Long-press a tile to remove it.</Text>
              </View>
            </>
          ) : (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Folder</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
                {categories.filter(c => c.id !== 'all').map((c) => {
                  const active = selectedCategory === c.id;
                  return (
                    <TouchableOpacity
                      key={c.id}
                      style={[
                        styles.catChip,
                        { backgroundColor: active ? c.color : '#F3F4F6', borderColor: c.color },
                      ]}
                      onPress={() => setSelectedCategory(c.id)}
                      activeOpacity={0.9}
                    >
                      <Icon name={c.icon as any} size={18} color={colors.text} />
                      <Text style={styles.catChipText}>{c.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <Text style={styles.sectionTitle}>Phrase</Text>
              <TextInput
                placeholder="e.g., I want water"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
                value={phrase}
                onChangeText={setPhrase}
              />

              <Text style={styles.sectionTitle}>Color</Text>
              <View style={styles.colorsRow}>
                {['#FFFFFF', '#FEF3C7', '#DBEAFE', '#DCFCE7', '#FDE68A', '#FECACA'].map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.colorDot, { backgroundColor: c, borderColor: c === '#FFFFFF' ? '#E5E7EB' : c }]}
                    onPress={() => setColor(c)}
                  >
                    {color === c ? <View style={styles.colorDotInner} /> : null}
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.sectionTitle}>Image</Text>
              <View style={styles.row}>
                <TouchableOpacity style={[styles.action, { backgroundColor: '#EEF2FF' }]} onPress={pickImage} activeOpacity={0.9}>
                  <Text style={styles.actionText}>Pick from Gallery</Text>
                </TouchableOpacity>
                {imageUri ? (
                  <Image source={{ uri: imageUri }} style={{ width: 56, height: 56, borderRadius: 12 }} />
                ) : null}
              </View>

              <TouchableOpacity style={styles.addBtn} onPress={handleAddTile} activeOpacity={0.9}>
                <Text style={styles.addBtnText}>Add Tile</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
    color: colors.text,
  },
  closeBtn: {
    backgroundColor: '#F3F4F6',
    padding: 10,
    borderRadius: 12,
  },
  section: {
    marginTop: 16,
    gap: 16 as any,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
    marginTop: 8,
  },
  currentEmotionContainer: {
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    padding: 24,
  },
  currentEmotionText: {
    fontSize: 20,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
    marginTop: 16,
    textTransform: 'capitalize',
  },
  emotionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12 as any,
    justifyContent: 'space-between',
  },
  emotionOption: {
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 12,
    width: '23%',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  emotionOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: '#EEF2FF',
  },
  emotionOptionText: {
    fontSize: 12,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
    marginTop: 8,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  row: {
    flexDirection: 'row',
    gap: 12 as any,
    alignItems: 'center',
  },
  action: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  actionText: {
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
    fontSize: 16,
  },
  helper: {
    marginTop: 8,
    color: '#6B7280',
    fontSize: 14,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.text,
    fontSize: 16,
  },
  colorsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12 as any,
  },
  colorDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorDotInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#111827',
  },
  addBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  addBtnText: {
    color: '#fff',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 18,
  },
  catRow: {
    gap: 10 as any,
    alignItems: 'center',
    paddingVertical: 4,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8 as any,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
  },
  catChipText: {
    color: colors.text,
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
  },
});
