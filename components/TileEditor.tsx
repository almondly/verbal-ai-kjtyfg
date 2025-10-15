
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Modal, ScrollView, Alert } from 'react-native';
import { colors } from '../styles/commonStyles';
import Icon from './Icon';
import PictogramSelector from './PictogramSelector';
import * as ImagePicker from 'expo-image-picker';
import { Tile } from '../types';
import { categories } from '../data/categories';

interface Props {
  visible: boolean;
  tile: Tile;
  onSave: (updatedTile: Tile) => void;
  onClose: () => void;
}

export default function TileEditor({ visible, tile, onSave, onClose }: Props) {
  const [text, setText] = useState(tile.text);
  const [color, setColor] = useState(tile.color || '#FFFFFF');
  const [imageUri, setImageUri] = useState(tile.imageUri);
  const [imageUrl, setImageUrl] = useState(tile.imageUrl || '');
  const [selectedCategory, setSelectedCategory] = useState(tile.category);
  const [showPictogramSelector, setShowPictogramSelector] = useState(false);

  useEffect(() => {
    if (visible) {
      setText(tile.text);
      setColor(tile.color || '#FFFFFF');
      setImageUri(tile.imageUri);
      setImageUrl(tile.imageUrl || '');
      setSelectedCategory(tile.category);
    }
  }, [visible, tile]);

  const pickImage = async () => {
    try {
      const res = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (res.status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to access your photo library.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });
      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        setImageUrl('');
      }
    } catch (e) {
      console.log('pickImage error', e);
    }
  };

  const handleSelectPictogram = (pictogramUrl: string) => {
    console.log('Pictogram selected:', pictogramUrl);
    setImageUrl(pictogramUrl);
    setImageUri(undefined);
    setShowPictogramSelector(false);
  };

  const handleSave = () => {
    if (!text.trim()) {
      Alert.alert('Error', 'Please enter text for the tile');
      return;
    }

    const updatedTile: Tile = {
      ...tile,
      text: text.trim(),
      color,
      imageUri,
      imageUrl: imageUrl.trim() || undefined,
      category: selectedCategory,
    };

    onSave(updatedTile);
    onClose();
  };

  return (
    <>
      <Modal
        visible={visible && !showPictogramSelector}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Edit Tile</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.8}>
              <Icon name="close-outline" size={28} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Text</Text>
              <TextInput
                placeholder="Enter tile text"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
                value={text}
                onChangeText={setText}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Category</Text>
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
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Color</Text>
              <View style={styles.colorsRow}>
                {['#FFFFFF', '#FEF3C7', '#DBEAFE', '#DCFCE7', '#FDE68A', '#FECACA', '#E9D5FF', '#FED7AA'].map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.colorDot, { backgroundColor: c, borderColor: c === '#FFFFFF' ? '#E5E7EB' : c }]}
                    onPress={() => setColor(c)}
                  >
                    {color === c ? <View style={styles.colorDotInner} /> : null}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Image</Text>
              <Text style={styles.helperText}>Choose a pictogram, add a custom URL, or pick from gallery</Text>
              
              <View style={styles.imageOptionsRow}>
                <TouchableOpacity 
                  style={[styles.imageOptionBtn, { flex: 1 }]} 
                  onPress={() => setShowPictogramSelector(true)} 
                  activeOpacity={0.9}
                >
                  <Icon name="images-outline" size={20} color={colors.primary} />
                  <Text style={styles.imageOptionText}>Browse Pictograms</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.imageOptionBtn, { flex: 1 }]} 
                  onPress={pickImage} 
                  activeOpacity={0.9}
                >
                  <Icon name="image-outline" size={20} color={colors.primary} />
                  <Text style={styles.imageOptionText}>Pick from Gallery</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.urlInputContainer}>
                <Text style={styles.urlInputLabel}>Or enter custom image URL:</Text>
                <TextInput
                  placeholder="https://example.com/image.png"
                  placeholderTextColor="#9CA3AF"
                  style={styles.urlInput}
                  value={imageUrl}
                  onChangeText={(text) => {
                    setImageUrl(text);
                    if (text.trim()) {
                      setImageUri(undefined);
                    }
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {(imageUri || imageUrl) && (
                <View style={styles.imagePreviewContainer}>
                  <Image 
                    source={{ uri: imageUri || imageUrl }} 
                    style={styles.imagePreview} 
                    resizeMode="contain"
                  />
                  <TouchableOpacity 
                    style={styles.removeImageButton}
                    onPress={() => {
                      setImageUri(undefined);
                      setImageUrl('');
                    }}
                    activeOpacity={0.8}
                  >
                    <Icon name="close-circle" size={24} color={colors.danger} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity 
              style={[styles.footerBtn, styles.cancelBtn]} 
              onPress={onClose}
              activeOpacity={0.9}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.footerBtn, styles.saveBtn]} 
              onPress={handleSave}
              activeOpacity={0.9}
            >
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Pictogram Selector Modal */}
      <Modal
        visible={showPictogramSelector}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPictogramSelector(false)}
      >
        <PictogramSelector
          word={text || 'communication'}
          onSelect={handleSelectPictogram}
          onClose={() => setShowPictogramSelector(false)}
        />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
    marginBottom: 12,
  },
  helperText: {
    fontSize: 13,
    fontFamily: 'Montserrat_400Regular',
    color: colors.textSecondary,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: colors.text,
    fontSize: 16,
    fontFamily: 'Montserrat_400Regular',
  },
  catRow: {
    gap: 12 as any,
    paddingVertical: 4,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8 as any,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  catChipText: {
    color: colors.text,
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
  },
  colorsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12 as any,
  },
  colorDot: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorDotInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#111827',
  },
  imageOptionsRow: {
    flexDirection: 'row',
    gap: 12 as any,
    marginBottom: 16,
  },
  imageOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8 as any,
    backgroundColor: '#EEF2FF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  imageOptionText: {
    fontSize: 14,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.primary,
  },
  urlInputContainer: {
    marginBottom: 16,
  },
  urlInputLabel: {
    fontSize: 14,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
    marginBottom: 8,
  },
  urlInput: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.text,
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
  },
  imagePreviewContainer: {
    position: 'relative',
    alignSelf: 'center',
    marginTop: 8,
  },
  imagePreview: {
    width: 140,
    height: 140,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    boxShadow: '0px 2px 8px rgba(0,0,0,0.15)',
  },
  footer: {
    flexDirection: 'row',
    gap: 12 as any,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    backgroundColor: '#F3F4F6',
  },
  cancelBtnText: {
    fontSize: 16,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
  },
  saveBtn: {
    backgroundColor: colors.primary,
  },
  saveBtnText: {
    fontSize: 16,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#FFFFFF',
  },
});
