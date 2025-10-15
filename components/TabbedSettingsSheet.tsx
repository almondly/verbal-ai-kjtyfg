
import { useEffect, useMemo, useRef, useState } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView, Alert, Modal } from 'react-native';
import { colors } from '../styles/commonStyles';
import Icon from './Icon';
import EmotionFace from './EmotionFace';
import PictogramSelector from './PictogramSelector';
import * as ImagePicker from 'expo-image-picker';
import { Tile } from '../types';
import { categories } from '../data/categories';
import { defaultTiles } from '../data/defaultTiles';
import { useTTSSettings } from '../hooks/useTTSSettings';
import { useAIPreferences } from '../hooks/useAIPreferences';

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

type TabType = 'emotions' | 'voice' | 'ai' | 'manage' | 'add';

// Get all emotions from the feelings category
const emotionOptions = defaultTiles
  .filter(tile => tile.category === 'feelings')
  .map(tile => tile.text)
  .sort();

export default function TabbedSettingsSheet({
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
  const snapPoints = useMemo(() => ['95%'], []);
  const [activeTab, setActiveTab] = useState<TabType>(mode === 'add' ? 'add' : 'emotions');
  
  // Add tile states
  const [phrase, setPhrase] = useState('');
  const [color, setColor] = useState('#FFFFFF');
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(defaultCategoryId);
  
  // Text input states for preferences
  const [foodInput, setFoodInput] = useState('');
  const [animalInput, setAnimalInput] = useState('');
  
  // Pictogram selector state
  const [showPictogramSelector, setShowPictogramSelector] = useState(false);
  
  const { settings: ttsSettings, availableVoices, updateSettings: updateTTSSettings, speak } = useTTSSettings();
  const { 
    preferenceCategories, 
    savePreference, 
    getPreference, 
    isLoading: aiLoading 
  } = useAIPreferences();

  useEffect(() => {
    if (open && mode === 'add') {
      setSelectedCategory(defaultCategoryId);
      setActiveTab('add');
    } else if (open && mode === 'settings') {
      setActiveTab('emotions');
    }
    
    // Load text preferences
    if (open) {
      const savedFood = getPreference('favourite_food');
      const savedAnimal = getPreference('favourite_animal');
      if (savedFood) setFoodInput(savedFood);
      if (savedAnimal) setAnimalInput(savedAnimal);
    }
  }, [open, mode, defaultCategoryId, getPreference]);

  // Control opening/closing
  useEffect(() => {
    if (open && sheetRef.current) {
      setTimeout(() => sheetRef.current?.snapToIndex(0), 100);
    } else if (!open && sheetRef.current) {
      setTimeout(() => sheetRef.current?.close(), 0);
    }
  }, [open]);

  const tabs: { id: TabType; label: string; icon: string }[] = mode === 'add' 
    ? [{ id: 'add', label: 'Add Tile', icon: 'add-outline' }]
    : [
        { id: 'emotions', label: 'Emotions', icon: 'happy-outline' },
        { id: 'voice', label: 'Voice', icon: 'volume-high-outline' },
        { id: 'ai', label: 'AI Preferences', icon: 'brain-outline' },
        { id: 'manage', label: 'Manage', icon: 'settings-outline' },
      ];

  const pickImage = async () => {
    try {
      const res = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (res.status !== 'granted') {
        console.log('Permission not granted');
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
        setImageUrl(''); // Clear URL if picking from gallery
      }
    } catch (e) {
      console.log('pickImage error', e);
    }
  };

  const handleSelectPictogram = (pictogramUrl: string) => {
    console.log('Pictogram selected:', pictogramUrl);
    setImageUrl(pictogramUrl);
    setImageUri(undefined); // Clear gallery image
    setShowPictogramSelector(false);
  };

  const closeAndReset = () => {
    setPhrase('');
    setColor('#FFFFFF');
    setImageUri(undefined);
    setImageUrl('');
    setShowPictogramSelector(false);
    onClose();
  };

  const handleAddTile = () => {
    if (!phrase.trim()) return;
    const tile: Tile = {
      id: `custom-${Date.now()}`,
      text: phrase.trim(),
      color,
      imageUri,
      imageUrl: imageUrl.trim() || undefined,
      category: selectedCategory,
    };
    onAddTile && onAddTile(tile);
    closeAndReset();
  };

  const handleEmotionSelect = (emotion: string) => {
    console.log('Emotion selected:', emotion);
    onEmotionChange?.(emotion);
  };

  const handleVoiceSelect = async (voiceIdentifier: string, voiceName: string, language: string) => {
    console.log('Voice selected:', { voiceIdentifier, voiceName, language });
    await updateTTSSettings({
      voiceIdentifier,
      voiceName,
      language,
    });
    
    // Test the voice
    await speak('Hello! This is how I sound!');
  };

  const handlePreferenceSelect = async (category: string, key: string, value: string) => {
    console.log('Preference select clicked:', { category, key, value });
    const success = await savePreference(category, key, value);
    console.log('Preference save result:', success);
  };

  const handleTextPreferenceSave = async (category: string, key: string, value: string) => {
    if (value.trim()) {
      console.log('Saving text preference:', { category, key, value });
      await savePreference(category, key, value.trim());
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'emotions':
        return (
          <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Current Emotion</Text>
              <View style={styles.currentEmotionContainer}>
                <EmotionFace emotion={currentEmotion} size={120} />
                <Text style={styles.currentEmotionText}>{currentEmotion}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Choose Your Emotion</Text>
              <Text style={styles.helperText}>Tap an emotion to select it.</Text>
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
                    <EmotionFace emotion={emotion} size={70} />
                    <Text style={styles.emotionOptionText}>{emotion}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        );

      case 'voice':
        return (
          <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Text-to-Speech Voice</Text>
              <View style={styles.currentVoiceContainer}>
                <View style={styles.voiceInfoContainer}>
                  <Text style={styles.currentVoiceText}>Current Voice</Text>
                  <Text style={styles.currentVoiceSubtext}>{ttsSettings.voiceName}</Text>
                  <Text style={styles.currentVoiceLanguage}>{ttsSettings.language}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.testVoiceBtn}
                  onPress={() => speak('Hello! This is how I sound!')}
                  activeOpacity={0.8}
                >
                  <Icon name="volume-high-outline" size={20} color={colors.primary} />
                  <Text style={styles.testVoiceText}>Test</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.voicesContainer}>
                <Text style={styles.voicesTitle}>Available Clear Voices</Text>
                <View style={styles.voicesList}>
                  {availableVoices.map((voice) => (
                    <TouchableOpacity
                      key={voice.identifier}
                      style={[
                        styles.voiceOption,
                        ttsSettings.voiceIdentifier === voice.identifier && styles.voiceOptionSelected,
                      ]}
                      onPress={() => handleVoiceSelect(voice.identifier, voice.name, voice.language)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.voiceInfo}>
                        <Text style={styles.voiceName}>{voice.name}</Text>
                        <Text style={styles.voiceLanguage}>{voice.language}</Text>
                      </View>
                      {ttsSettings.voiceIdentifier === voice.identifier && (
                        <Icon name="checkmark-circle" size={24} color={colors.primary} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Voice Settings</Text>
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>Speech Rate: {ttsSettings.rate.toFixed(1)}</Text>
                <View style={styles.sliderButtons}>
                  <TouchableOpacity 
                    style={styles.sliderBtn}
                    onPress={() => updateTTSSettings({ rate: Math.max(0.1, ttsSettings.rate - 0.1) })}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.sliderBtnText}>-</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.sliderBtn}
                    onPress={() => updateTTSSettings({ rate: Math.min(2.0, ttsSettings.rate + 0.1) })}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.sliderBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>Pitch: {ttsSettings.pitch.toFixed(1)}</Text>
                <View style={styles.sliderButtons}>
                  <TouchableOpacity 
                    style={styles.sliderBtn}
                    onPress={() => updateTTSSettings({ pitch: Math.max(0.5, ttsSettings.pitch - 0.1) })}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.sliderBtnText}>-</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.sliderBtn}
                    onPress={() => updateTTSSettings({ pitch: Math.min(2.0, ttsSettings.pitch + 0.1) })}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.sliderBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        );

      case 'ai':
        return (
          <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
            {Object.entries(preferenceCategories).map(([categoryKey, category]) => (
              <View key={categoryKey} style={styles.section}>
                <View style={styles.categoryHeader}>
                  <Icon name={category.icon as any} size={24} color={colors.primary} />
                  <Text style={styles.sectionTitle}>{category.title}</Text>
                </View>
                
                {category.preferences.map((pref) => {
                  const currentValue = getPreference(pref.key);
                  console.log('Rendering preference:', pref.key, 'current value:', currentValue);
                  
                  // Text input for food and animal
                  if (pref.type === 'text') {
                    const isFood = pref.key === 'favourite_food';
                    const isAnimal = pref.key === 'favourite_animal';
                    const inputValue = isFood ? foodInput : isAnimal ? animalInput : '';
                    const setInputValue = isFood ? setFoodInput : isAnimal ? setAnimalInput : () => {};
                    
                    return (
                      <View key={pref.key} style={styles.preferenceContainer}>
                        <Text style={styles.preferenceQuestion}>{pref.question}</Text>
                        <TextInput
                          style={styles.input}
                          placeholder={pref.placeholder || 'Type here...'}
                          placeholderTextColor="#9CA3AF"
                          value={inputValue}
                          onChangeText={setInputValue}
                          onBlur={() => handleTextPreferenceSave(categoryKey, pref.key, inputValue)}
                          onSubmitEditing={() => handleTextPreferenceSave(categoryKey, pref.key, inputValue)}
                        />
                        {currentValue && (
                          <View style={styles.savedIndicator}>
                            <Icon name="checkmark-circle" size={16} color={colors.success} />
                            <Text style={styles.savedText}>Saved: {currentValue}</Text>
                          </View>
                        )}
                      </View>
                    );
                  }
                  
                  // Button selection for other preferences
                  return (
                    <View key={pref.key} style={styles.preferenceContainer}>
                      <Text style={styles.preferenceQuestion}>{pref.question}</Text>
                      <View style={styles.optionsGrid}>
                        {pref.options?.map((option) => {
                          const isSelected = currentValue === option.value;
                          return (
                            <TouchableOpacity
                              key={option.value}
                              style={[
                                styles.optionButton,
                                isSelected && styles.optionButtonSelected,
                                option.colour && !isSelected && { borderColor: option.colour, borderWidth: 2 }
                              ]}
                              onPress={() => handlePreferenceSelect(categoryKey, pref.key, option.value)}
                              activeOpacity={0.7}
                            >
                              {option.colour && (
                                <View 
                                  style={[styles.colourIndicator, { backgroundColor: option.colour }]} 
                                />
                              )}
                              <Text style={[
                                styles.optionText,
                                isSelected && styles.optionTextSelected
                              ]}>
                                {option.label}
                              </Text>
                              {isSelected && (
                                <Icon name="checkmark-circle" size={20} color={colors.primary} />
                              )}
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                  );
                })}
              </View>
            ))}
          </ScrollView>
        );

      case 'manage':
        return (
          <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Manage Data</Text>
              <View style={styles.row}>
                <TouchableOpacity 
                  style={[styles.action, { backgroundColor: '#FEE2E2' }]} 
                  onPress={onResetLearning} 
                  activeOpacity={0.9}
                >
                  <Text style={[styles.actionText, { color: colors.danger }]}>Reset Learning</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.action, { backgroundColor: '#E0F2FE' }]} 
                  onPress={onResetTiles} 
                  activeOpacity={0.9}
                >
                  <Text style={[styles.actionText, { color: colors.primary }]}>Reset Tiles</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.helper}>Long-press a tile to remove it.</Text>
            </View>
          </ScrollView>
        );

      case 'add':
        return (
          <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
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

              <Text style={styles.sectionTitle}>Colour</Text>
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

              <Text style={styles.sectionTitle}>Pictogram</Text>
              <Text style={styles.helperText}>Browse ARASAAC pictograms or add a custom image</Text>
              
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

              <TouchableOpacity style={styles.addBtn} onPress={handleAddTile} activeOpacity={0.9}>
                <Text style={styles.addBtnText}>Add Tile</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        index={open ? 0 : -1}
        enablePanDownToClose
        onClose={closeAndReset}
        backgroundStyle={{ backgroundColor: colors.backgroundAlt, borderRadius: 0 }}
        handleIndicatorStyle={{ backgroundColor: '#CBD5E1' }}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        style={{ zIndex: 9999 }}
      >
        <BottomSheetView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{title || (mode === 'add' ? 'Add Tile' : 'Settings')}</Text>
            <TouchableOpacity onPress={closeAndReset} style={styles.closeBtn} activeOpacity={0.8}>
              <Icon name="close-outline" size={28} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Tab Navigation */}
          <View style={styles.tabBar}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabBarContent}
            >
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab.id}
                  style={[
                    styles.tab,
                    activeTab === tab.id && styles.tabActive
                  ]}
                  onPress={() => setActiveTab(tab.id)}
                  activeOpacity={0.8}
                >
                  <Icon 
                    name={tab.icon as any} 
                    size={20} 
                    color={activeTab === tab.id ? colors.primary : colors.textSecondary} 
                  />
                  <Text style={[
                    styles.tabText,
                    activeTab === tab.id && styles.tabTextActive
                  ]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Tab Content */}
          <View style={styles.contentContainer}>
            {renderTabContent()}
          </View>
        </BottomSheetView>
      </BottomSheet>

      {/* Pictogram Selector Modal */}
      <Modal
        visible={showPictogramSelector}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPictogramSelector(false)}
      >
        <PictogramSelector
          word={phrase || 'communication'}
          onSelect={handleSelectPictogram}
          onClose={() => setShowPictogramSelector(false)}
        />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 16,
    flex: 1,
    zIndex: 9999,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    zIndex: 9999,
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
  tabBar: {
    marginBottom: 20,
    zIndex: 9999,
  },
  tabBarContent: {
    gap: 8 as any,
    paddingHorizontal: 4,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8 as any,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    minWidth: 120,
  },
  tabActive: {
    backgroundColor: '#EEF2FF',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
  },
  contentContainer: {
    flex: 1,
    zIndex: 9999,
  },
  tabContent: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
    marginBottom: 16,
  },
  helperText: {
    fontSize: 13,
    fontFamily: 'Montserrat_400Regular',
    color: colors.textSecondary,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12 as any,
    marginBottom: 16,
  },
  currentEmotionContainer: {
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    padding: 24,
    marginBottom: 8,
  },
  currentEmotionText: {
    fontSize: 18,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
    marginTop: 12,
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
    marginBottom: 8,
  },
  emotionOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: '#EEF2FF',
  },
  emotionOptionText: {
    fontSize: 11,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
    marginTop: 6,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  currentVoiceContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  voiceInfoContainer: {
    flex: 1,
  },
  currentVoiceText: {
    fontSize: 14,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.textSecondary,
  },
  currentVoiceSubtext: {
    fontSize: 16,
    fontFamily: 'Montserrat_700Bold',
    color: colors.text,
    marginTop: 4,
  },
  currentVoiceLanguage: {
    fontSize: 12,
    fontFamily: 'Montserrat_400Regular',
    color: colors.textSecondary,
    marginTop: 4,
  },
  testVoiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8 as any,
  },
  testVoiceText: {
    fontSize: 14,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.primary,
  },
  voicesContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
  },
  voicesTitle: {
    fontSize: 14,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.textSecondary,
    marginBottom: 16,
  },
  voicesList: {
    maxHeight: 280,
  },
  voiceOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: colors.background,
  },
  voiceOptionSelected: {
    backgroundColor: '#EEF2FF',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  voiceInfo: {
    flex: 1,
  },
  voiceName: {
    fontSize: 16,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
  },
  voiceLanguage: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: colors.textSecondary,
    marginTop: 4,
  },
  sliderContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sliderLabel: {
    fontSize: 16,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
  },
  sliderButtons: {
    flexDirection: 'row',
    gap: 12 as any,
  },
  sliderBtn: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderBtnText: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    color: '#FFFFFF',
  },
  preferenceContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  preferenceQuestion: {
    fontSize: 16,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
    marginBottom: 16,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8 as any,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8 as any,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 8,
    minWidth: '45%',
  },
  optionButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: '#EEF2FF',
  },
  colourIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
    flex: 1,
  },
  optionTextSelected: {
    color: colors.primary,
  },
  row: {
    flexDirection: 'row',
    gap: 16 as any,
    alignItems: 'center',
    marginBottom: 12,
  },
  action: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  actionText: {
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
    fontSize: 16,
  },
  helper: {
    marginTop: 12,
    color: '#6B7280',
    fontSize: 14,
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
    marginBottom: 8,
  },
  colorsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16 as any,
    marginBottom: 8,
  },
  colorDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  imagePreviewContainer: {
    position: 'relative',
    alignSelf: 'center',
    marginBottom: 16,
  },
  imagePreview: {
    width: 120,
    height: 120,
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
  addBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    marginTop: 20,
    alignItems: 'center',
  },
  addBtnText: {
    color: '#fff',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 18,
  },
  catRow: {
    gap: 12 as any,
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 8,
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
  savedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6 as any,
    marginTop: 8,
  },
  savedText: {
    fontSize: 13,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.success,
  },
});
