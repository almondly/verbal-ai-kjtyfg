
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, TextInput, Image, Alert, Modal } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import Icon from '../components/Icon';
import { commonStyles, colors } from '../styles/commonStyles';
import LandscapeGuard from '../components/LandscapeGuard';
import { useRouter } from 'expo-router';
import EmotionFace from '../components/EmotionFace';
import { useVoiceSettings } from '../hooks/useVoiceSettings';
import { useAIPreferences } from '../hooks/useAIPreferences';
import { useEmotionSettings } from '../hooks/useEmotionSettings';
import { defaultTiles } from '../data/defaultTiles';
import { useLibrary } from '../hooks/useLibrary';
import { useAI } from '../hooks/useAI';
import TileEditor from '../components/TileEditor';
import { Tile } from '../types';
import { categories } from '../data/categories';

type TabType = 'emotions' | 'voice' | 'ai' | 'manage' | 'defaultTiles';

// Define the three emotions with their images
const emotionOptions = [
  { id: 1, label: 'Sad' },
  { id: 2, label: 'Happy' },
  { id: 3, label: 'Angry' },
];

export default function SettingsScreen() {
  console.log('SettingsScreen rendering...');
  
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('emotions');
  const [editingTile, setEditingTile] = useState<Tile | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Text input states for preferences
  const [foodInput, setFoodInput] = useState('');
  const [animalInput, setAnimalInput] = useState('');
  
  const { settings: emotionSettings, updateEmotion } = useEmotionSettings();
  const { settings: voiceSettings, updateSettings: updateVoiceSettings, speak, testVoice, getVoiceCharacteristics } = useVoiceSettings();
  const { 
    preferenceCategories, 
    savePreference, 
    getPreference, 
  } = useAIPreferences();
  const { tiles, updateTile, resetTiles } = useLibrary();
  const { resetLearning } = useAI();

  useEffect(() => {
    // Lock orientation on native platforms only
    if (Platform.OS !== 'web') {
      try {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        console.log('Settings screen orientation locked to landscape');
      } catch (error) {
        console.log('Failed to lock screen orientation in settings screen:', error);
      }
    }
    
    // Load text preferences
    const savedFood = getPreference('favourite_food');
    const savedAnimal = getPreference('favourite_animal');
    if (savedFood) setFoodInput(savedFood);
    if (savedAnimal) setAnimalInput(savedAnimal);
    
    console.log('Settings screen mounted successfully');
  }, []);

  const handleBackToMenu = () => {
    console.log('Going back to main menu');
    router.push('/main-menu');
  };

  const handleEmotionSelect = (emotion: 1 | 2 | 3) => {
    console.log('Emotion selected:', emotion);
    updateEmotion(emotion);
  };

  const handleVoiceSelect = async (voiceType: 'boy' | 'girl') => {
    console.log('Voice selected:', voiceType);
    await updateVoiceSettings({ selectedVoice: voiceType });
    
    // Test the voice
    await testVoice(voiceType);
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

  const handleEditTile = (tile: Tile) => {
    console.log('Editing tile:', tile);
    setEditingTile(tile);
  };

  const handleSaveTile = (updatedTile: Tile) => {
    console.log('Saving tile:', updatedTile);
    updateTile(updatedTile);
    setEditingTile(null);
  };

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'emotions', label: 'Emotions', icon: 'happy-outline' },
    { id: 'voice', label: 'Voice', icon: 'volume-high-outline' },
    { id: 'ai', label: 'AI Preferences', icon: 'brain-outline' },
    { id: 'defaultTiles', label: 'Default Tiles', icon: 'grid-outline' },
    { id: 'manage', label: 'Manage', icon: 'settings-outline' },
  ];

  const filteredTiles = selectedCategory === 'all' 
    ? tiles 
    : tiles.filter(tile => tile.category === selectedCategory);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'emotions':
        return (
          <View style={styles.tabContentWrapper}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Current Emotion</Text>
              <View style={styles.currentEmotionContainer}>
                <EmotionFace emotion={emotionSettings.selectedEmotion} size={120} />
                <Text style={styles.currentEmotionText}>
                  {emotionOptions.find(e => e.id === emotionSettings.selectedEmotion)?.label || 'Happy'}
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Choose Your Emotion</Text>
              <Text style={styles.helperText}>Tap an emotion to select it. The selected emotion will appear on the home page.</Text>
              <View style={styles.emotionGrid}>
                {emotionOptions.map((emotion) => (
                  <TouchableOpacity
                    key={emotion.id}
                    style={[
                      styles.emotionOption,
                      emotionSettings.selectedEmotion === emotion.id && styles.emotionOptionSelected,
                    ]}
                    onPress={() => handleEmotionSelect(emotion.id)}
                    activeOpacity={0.8}
                  >
                    <EmotionFace emotion={emotion.id} size={100} />
                    <Text style={styles.emotionOptionText}>{emotion.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );

      case 'voice':
        return (
          <View style={styles.tabContentWrapper}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Voice Selection</Text>
              <Text style={styles.helperText}>
                Choose between a young boy or young girl voice. These voices are optimized for clarity and have a youthful tone.
              </Text>
              <View style={styles.currentVoiceContainer}>
                <View style={styles.voiceInfoContainer}>
                  <Text style={styles.currentVoiceText}>Current Voice</Text>
                  <Text style={styles.currentVoiceSubtext}>
                    {getVoiceCharacteristics(voiceSettings.selectedVoice).name}
                  </Text>
                  <Text style={styles.currentVoiceLanguage}>
                    {getVoiceCharacteristics(voiceSettings.selectedVoice).description}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.testVoiceBtn}
                  onPress={() => testVoice(voiceSettings.selectedVoice)}
                  activeOpacity={0.8}
                >
                  <Icon name="volume-high-outline" size={20} color={colors.primary} />
                  <Text style={styles.testVoiceText}>Test</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.voicesContainer}>
                <Text style={styles.voicesTitle}>Available Voices</Text>
                <View style={styles.voicesList}>
                  {(['boy', 'girl'] as const).map((voiceType) => {
                    const characteristics = getVoiceCharacteristics(voiceType);
                    const isSelected = voiceSettings.selectedVoice === voiceType;
                    
                    return (
                      <TouchableOpacity
                        key={voiceType}
                        style={[
                          styles.voiceOption,
                          isSelected && styles.voiceOptionSelected,
                        ]}
                        onPress={() => handleVoiceSelect(voiceType)}
                        activeOpacity={0.8}
                      >
                        <View style={styles.voiceInfo}>
                          <Text style={styles.voiceName}>{characteristics.name}</Text>
                          <Text style={styles.voiceLanguage}>{characteristics.description}</Text>
                        </View>
                        {isSelected && (
                          <Icon name="checkmark-circle" size={24} color={colors.primary} />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
          </View>
        );

      case 'ai':
        return (
          <View style={styles.tabContentWrapper}>
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
                          style={styles.textInput}
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
          </View>
        );

      case 'defaultTiles':
        return (
          <View style={styles.tabContentWrapper}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Edit Default Tiles</Text>
              <Text style={styles.helperText}>
                Tap any tile to customize its image using Baby ARASAAC pictograms or custom URL. All pictograms use the Baby ARASAAC style for visual consistency.
              </Text>

              {/* Category Filter */}
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={styles.categoryFilterRow}
              >
                <TouchableOpacity
                  style={[
                    styles.categoryFilterChip,
                    selectedCategory === 'all' && styles.categoryFilterChipActive
                  ]}
                  onPress={() => setSelectedCategory('all')}
                  activeOpacity={0.8}
                >
                  <Icon name="apps-outline" size={18} color={selectedCategory === 'all' ? colors.primary : colors.textSecondary} />
                  <Text style={[
                    styles.categoryFilterText,
                    selectedCategory === 'all' && styles.categoryFilterTextActive
                  ]}>
                    All
                  </Text>
                </TouchableOpacity>
                {categories.filter(c => c.id !== 'all').map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryFilterChip,
                      selectedCategory === cat.id && styles.categoryFilterChipActive,
                      selectedCategory === cat.id && { borderColor: cat.color }
                    ]}
                    onPress={() => setSelectedCategory(cat.id)}
                    activeOpacity={0.8}
                  >
                    <Icon 
                      name={cat.icon as any} 
                      size={18} 
                      color={selectedCategory === cat.id ? cat.color : colors.textSecondary} 
                    />
                    <Text style={[
                      styles.categoryFilterText,
                      selectedCategory === cat.id && { color: cat.color }
                    ]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Tiles Grid */}
              <View style={styles.tilesGrid}>
                {filteredTiles.map((tile) => (
                  <TouchableOpacity
                    key={tile.id}
                    style={styles.tileCard}
                    onPress={() => handleEditTile(tile)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.tileCardContent, { backgroundColor: tile.color || '#F3F4F6' }]}>
                      {(tile.imageUrl || tile.imageUri) ? (
                        <Image
                          source={{ uri: tile.imageUrl || tile.imageUri }}
                          style={styles.tileImage}
                          resizeMode="contain"
                        />
                      ) : (
                        <Icon name="image-outline" size={32} color={colors.textSecondary} />
                      )}
                    </View>
                    <Text style={styles.tileCardText} numberOfLines={2}>
                      {tile.text}
                    </Text>
                    <View style={styles.editBadge}>
                      <Icon name="create-outline" size={14} color={colors.primary} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );

      case 'manage':
        return (
          <View style={styles.tabContentWrapper}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Manage Data</Text>
              <View style={styles.row}>
                <TouchableOpacity 
                  style={[styles.action, { backgroundColor: '#FEE2E2' }]} 
                  onPress={resetLearning} 
                  activeOpacity={0.9}
                >
                  <Text style={[styles.actionText, { color: colors.danger }]}>Reset Learning</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.action, { backgroundColor: '#E0F2FE' }]} 
                  onPress={resetTiles} 
                  activeOpacity={0.9}
                >
                  <Text style={[styles.actionText, { color: colors.primary }]}>Reset Tiles</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.helper}>Long-press a tile to remove it.</Text>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <LandscapeGuard>
      <View style={[commonStyles.container, styles.container]}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={handleBackToMenu} style={styles.iconBtn} activeOpacity={0.8}>
            <Icon name="arrow-back-outline" size={32} color={colors.text} />
          </TouchableOpacity>
          
          <Text style={styles.appTitle}>COMpanion Settings</Text>
          
          <View style={styles.rightSection}>
            <View style={styles.emotionContainer}>
              <EmotionFace emotion={emotionSettings.selectedEmotion} size={60} />
            </View>
          </View>
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

        {/* Tab Content - Single ScrollView wrapper */}
        <ScrollView 
          style={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {renderTabContent()}
        </ScrollView>

        {/* Tile Editor Modal */}
        {editingTile && (
          <TileEditor
            visible={!!editingTile}
            tile={editingTile}
            onSave={handleSaveTile}
            onClose={() => setEditingTile(null)}
          />
        )}
      </View>
    </LandscapeGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  topBar: {
    width: '100%',
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  iconBtn: {
    backgroundColor: colors.backgroundAlt,
    padding: 16,
    borderRadius: 16,
    boxShadow: '0px 6px 14px rgba(0,0,0,0.08)',
    minWidth: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTitle: {
    fontSize: 22,
    fontFamily: 'Montserrat_700Bold',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12 as any,
    minWidth: 64,
    justifyContent: 'center',
  },
  emotionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    marginBottom: 20,
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
  },
  scrollContent: {
    paddingBottom: 40,
  },
  tabContentWrapper: {
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
    gap: 16 as any,
    justifyContent: 'center',
  },
  emotionOption: {
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    width: '28%',
    borderWidth: 3,
    borderColor: 'transparent',
    marginBottom: 8,
  },
  emotionOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: '#EEF2FF',
  },
  emotionOptionText: {
    fontSize: 14,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
    marginTop: 12,
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
  textInput: {
    backgroundColor: colors.background,
    borderColor: '#E5E7EB',
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.text,
    fontSize: 16,
    fontFamily: 'Montserrat_400Regular',
    marginBottom: 8,
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
  categoryFilterRow: {
    gap: 8 as any,
    paddingVertical: 8,
    marginBottom: 16,
  },
  categoryFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6 as any,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryFilterChipActive: {
    backgroundColor: '#EEF2FF',
    borderColor: colors.primary,
  },
  categoryFilterText: {
    fontSize: 13,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.textSecondary,
  },
  categoryFilterTextActive: {
    color: colors.primary,
  },
  tilesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12 as any,
  },
  tileCard: {
    width: '18%',
    marginBottom: 12,
    position: 'relative',
  },
  tileCardContent: {
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  tileImage: {
    width: '80%',
    height: '80%',
  },
  tileCardText: {
    fontSize: 12,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  editBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 6,
    borderWidth: 1,
    borderColor: colors.primary,
  },
});
