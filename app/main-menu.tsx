
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import Icon from '../components/Icon';
import EmotionFace from '../components/EmotionFace';
import { colors, commonStyles } from '../styles/commonStyles';
import { useEmotionSettings } from '../hooks/useEmotionSettings';

export default function MainMenu() {
  const router = useRouter();
  const { settings, isLoading } = useEmotionSettings();
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    console.log('Main menu mounted');
    console.log('Current emotion:', settings.selectedEmotion);
    console.log('Window dimensions:', { width, height });
    
    // Lock orientation on native platforms only
    if (Platform.OS !== 'web') {
      try {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        console.log('Main menu orientation locked to landscape');
      } catch (error) {
        console.log('Failed to lock screen orientation in main menu:', error);
      }
    }
  }, []);

  const handleStartCommunication = () => {
    console.log('Starting communication');
    router.push('/communication');
  };

  const handleOpenSettings = () => {
    console.log('Opening settings');
    router.push('/settings');
  };

  // Calculate face size - make it MUCH larger (70% of screen height)
  const faceSize = Math.min(width * 0.9, height * 1.1);

  // Show loading state
  if (isLoading) {
    console.log('Loading emotion settings...');
    return (
      <View style={[commonStyles.container, styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  console.log('Rendering main menu with emotion:', settings.selectedEmotion);

  return (
    <View style={[commonStyles.container, styles.container]}>
      {/* Header - Slightly smaller */}
      <View style={styles.header}>
        <Text style={styles.title}>COMpanion</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Emotion Display - MUCH LARGER */}
        <View style={styles.emotionSection}>
          <View style={styles.emotionContainer}>
            {/* Display selected emotion face */}
            <EmotionFace 
              emotion={settings.selectedEmotion} 
              size={faceSize * 1.2}
            />
          </View>
        </View>

        {/* Action Buttons - Slightly smaller */}
        <View style={styles.buttonSection}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryButton]} 
            onPress={handleStartCommunication}
            activeOpacity={0.9}
          >
            <Icon name="grid-outline" size={36} color="#000000" />
            <Text style={styles.actionButtonText}>Start</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingsButton} 
            onPress={handleOpenSettings}
            activeOpacity={0.9}
          >
            <Icon name="settings-outline" size={24} color="#000000" />
            <Text style={styles.settingsButtonText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 48, // Slightly smaller - reduced from 56 to 48
    fontFamily: 'Montserrat_700Bold',
    color: '#000000',
    textAlign: 'center',
    letterSpacing: 2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emotionSection: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    flex: 1,
  },
  emotionContainer: {
    alignItems: 'center',
    padding: 10,
  },
  logoImage: {
    maxWidth: '100%',
    maxHeight: '100%',
  },
  buttonSection: {
    marginTop: 16,
    marginBottom: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    gap: 16 as any,
  },
  actionButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16 as any,
    paddingHorizontal: 40,
    paddingVertical: 24,
    borderRadius: 16,
    boxShadow: '0px 4px 16px rgba(0,0,0,0.15)',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  actionButtonText: {
    fontSize: 28, // Slightly smaller - reduced from 32 to 28
    fontFamily: 'Montserrat_700Bold',
    color: '#000000',
    textAlign: 'center',
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10 as any,
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    boxShadow: '0px 3px 10px rgba(0,0,0,0.08)',
  },
  settingsButtonText: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    color: '#000000',
  },
});
