
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

  return (
    <LandscapeGuard>
      <View style={[commonStyles.container, styles.container]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>COMpanion</Text>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Emotion Display */}
          <View style={[styles.emotionSection, { height: height * 0.4 }]}>
            <View style={styles.emotionContainer}>
              <EmotionFace emotion={settings.selectedEmotion} size={Math.min(width * 0.25, height * 0.35)} />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonSection}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.primaryButton]} 
              onPress={handleStartCommunication}
              activeOpacity={0.9}
            >
              <Icon name="grid-outline" size={32} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Start</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.settingsButton} 
              onPress={handleOpenSettings}
              activeOpacity={0.9}
            >
              <Icon name="settings-outline" size={20} color={colors.primary} />
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
    paddingVertical: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 48,
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
  },
  emotionContainer: {
    alignItems: 'center',
    padding: 20,
  },
  buttonSection: {
    marginTop: 20,
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
    gap: 12 as any,
    paddingHorizontal: 32,
    paddingVertical: 20,
    borderRadius: 16,
    boxShadow: '0px 4px 16px rgba(0,0,0,0.12)',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  actionButtonText: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10 as any,
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    boxShadow: '0px 3px 10px rgba(0,0,0,0.08)',
  },
  settingsButtonText: {
    fontSize: 14,
    fontFamily: 'Montserrat_700Bold',
    color: colors.primary,
  },
});
