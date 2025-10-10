
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

  // Calculate face size - make it MUCH larger (70% of screen height)
  const faceSize = Math.min(width * 0.5, height * 0.7);

  return (
    <LandscapeGuard>
      <View style={[commonStyles.container, styles.container]}>
        {/* Header - much smaller */}
        <View style={styles.header}>
          <Text style={styles.title}>COMpanion</Text>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Emotion Display - MUCH LARGER */}
          <View style={styles.emotionSection}>
            <View style={styles.emotionContainer}>
              <EmotionFace emotion={settings.selectedEmotion} size={faceSize} />
            </View>
          </View>

          {/* Action Buttons - Much Smaller */}
          <View style={styles.buttonSection}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.primaryButton]} 
              onPress={handleStartCommunication}
              activeOpacity={0.9}
            >
              <Icon name="grid-outline" size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Start</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.settingsButton} 
              onPress={handleOpenSettings}
              activeOpacity={0.9}
            >
              <Icon name="settings-outline" size={14} color={colors.primary} />
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
    paddingVertical: 12,
  },
  header: {
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
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
    marginTop: 8,
    marginBottom: 16,
    alignItems: 'center',
    width: '100%',
    maxWidth: 240,
    gap: 10 as any,
  },
  actionButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8 as any,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    boxShadow: '0px 3px 12px rgba(0,0,0,0.1)',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Montserrat_700Bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6 as any,
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    boxShadow: '0px 2px 8px rgba(0,0,0,0.06)',
  },
  settingsButtonText: {
    fontSize: 11,
    fontFamily: 'Montserrat_700Bold',
    color: colors.primary,
  },
});
