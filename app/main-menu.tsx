
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import Icon from '../components/Icon';
import EmotionFace from '../components/EmotionFace';
import LandscapeGuard from '../components/LandscapeGuard';
import { colors, commonStyles } from '../styles/commonStyles';
import { useEmotionSettings } from '../hooks/useEmotionSettings';

export default function MainMenu() {
  const router = useRouter();
  const { settings } = useEmotionSettings();
  const { width, height } = useWindowDimensions();

  useEffect(() => {
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

  // Calculate face size - make it much larger (60% of screen height)
  const faceSize = Math.min(width * 0.4, height * 0.6);

  return (
    <LandscapeGuard>
      <View style={[commonStyles.container, styles.container]}>
        {/* Header - smaller */}
        <View style={styles.header}>
          <Text style={styles.title}>COMpanion</Text>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Emotion Display - Much Larger */}
          <View style={styles.emotionSection}>
            <View style={styles.emotionContainer}>
              <EmotionFace emotion={settings.selectedEmotion} size={faceSize} />
            </View>
          </View>

          {/* Action Buttons - Smaller */}
          <View style={styles.buttonSection}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.primaryButton]} 
              onPress={handleStartCommunication}
              activeOpacity={0.9}
            >
              <Icon name="grid-outline" size={24} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Start</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.settingsButton} 
              onPress={handleOpenSettings}
              activeOpacity={0.9}
            >
              <Icon name="settings-outline" size={16} color={colors.primary} />
              <Text style={styles.settingsButtonText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LandscapeGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Montserrat_700Bold',
    color: colors.primary,
    textAlign: 'center',
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
  buttonSection: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
    width: '100%',
    maxWidth: 300,
    gap: 12 as any,
  },
  actionButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10 as any,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    boxShadow: '0px 4px 16px rgba(0,0,0,0.12)',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: 'Montserrat_700Bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8 as any,
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    boxShadow: '0px 3px 10px rgba(0,0,0,0.08)',
  },
  settingsButtonText: {
    fontSize: 12,
    fontFamily: 'Montserrat_700Bold',
    color: colors.primary,
  },
});
