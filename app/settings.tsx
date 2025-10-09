
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, TextInput, Image } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import Icon from '../components/Icon';
import { commonStyles, colors } from '../styles/commonStyles';
import LandscapeGuard from '../components/LandscapeGuard';
import { useRouter } from 'expo-router';
import EmotionFace from '../components/EmotionFace';
import { useTTSSettings } from '../hooks/useTTSSettings';
import { useAIPreferences } from '../hooks/useAIPreferences';
import { useEmotionSettings } from '../hooks/useEmotionSettings';
import { defaultTiles } from '../data/defaultTiles';
import { useLibrary } from '../hooks/useLibrary';
import { useAI } from '../hooks/useAI';

type TabType = 'emotions' | 'voice' | 'ai' | 'manage';

// Get all emotions from the feelings category
const emotionOptions = defaultTiles
  .filter(tile => tile.category === 'feelings')
  .map(tile => tile.text)
  .sort();

export default function SettingsScreen() {
  console.log('SettingsScreen rendering...');
  
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('emotions');
  
  const { settings: emotionSettings, updateEmotion } = useEmotionSettings();
  const { settings: ttsSettings, availableVoices, updateSettings: updateTTSSettings, speak } = useTTSSettings();
  const { 
    preferenceCategories, 
    savePreference, 
    getPreference, 
  } = useAIPreferences();
  const { resetTiles } = useLibrary();
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
    
    console.log('Settings screen mounted successfully');
  }, []);

  const handleBackToMenu = () => {
    console.log('Going back to main menu');
    router.push('/main-menu');
  };

  const handleEmotionSelect = (emotion: string) => {
    console.log('Emotion selected:', emotion);
    updateEmotion(emotion);
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
    console.log('Preference selected:', { category, key, value });
    await savePreference(category, key, value);
  };

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'emotions', label: 'Emotions', icon: 'happy-outline' },
    { id: 'voice', label: 'Voice', icon: 'volume-high-outline' },
    { id: 'ai', label: 'AI Preferences', icon: 'brain-outline' },
    { id: 'manage', label: 'Manage', icon: 'settings-outline' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'emotions':
        return (
          <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Current Emotion</Text>
              <View style={styles.currentEmotionContainer}>
                <EmotionFace emotion={emotionSettings.selectedEmotion} size={120} />
                <Text style={styles.currentEmotionText}>{emotionSettings.selectedEmotion}</Text>
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
                      emotionSettings.selectedEmotion === emotion && styles.emotionOptionSelected,
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
                  return (
                    <View key={pref.key} style={styles.preferenceContainer}>
                      <Text style={styles.preferenceQuestion}>{pref.question}</Text>
                      <View style={styles.optionsGrid}>
                        {pref.options.map((option) => (
                          <TouchableOpacity
                            key={option.value}
                            style={[
                              styles.optionButton,
                              currentValue === option.value && styles.optionButtonSelected,
                              option.colour && { borderColor: option.colour }
                            ]}
                            onPress={() => handlePreferenceSelect(categoryKey, pref.key, option.value)}
                            activeOpacity={0.8}
                          >
                            {option.colour && (
                              <View 
                                style={[styles.colourIndicator, { backgroundColor: option.colour }]} 
                              />
                            )}
                            <Text style={[
                              styles.optionText,
                              currentValue === option.value && styles.optionTextSelected
                            ]}>
                              {option.label}
                            </Text>
                            {currentValue === option.value && (
                              <Icon name="checkmark-circle" size={20} color={colors.primary} />
                            )}
                          </TouchableOpacity>
                        ))}
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
          </ScrollView>
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

        {/* Tab Content */}
        <View style={styles.contentContainer}>
          {renderTabContent()}
        </View>
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
});
