
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
          <Text style={styles.title}>ComPanion</Text>
          <Text style={styles.subtitle}>Your Communication Mate</Text>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Emotion Display */}
          <View style={[styles.emotionSection, { height: height * 0.5 }]}>
            <View style={styles.emotionContainer}>
              <EmotionFace emotion={settings.selectedEmotion} size={Math.min(width * 0.3, height * 0.4)} />
              <Text style={styles.emotionText}>
                Feeling {settings.selectedEmotion} today, mate!
              </Text>
              <Text style={styles.emotionSubtext}>
                Ready to have a yarn?
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonSection}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.primaryButton]} 
              onPress={handleStartCommunication}
              activeOpacity={0.9}
            >
              <Icon name="grid-outline" size={40} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Start Communicating</Text>
              <Text style={styles.actionButtonSubtext}>Use tiles or keyboard</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.settingsButton} 
              onPress={handleOpenSettings}
              activeOpacity={0.9}
            >
              <Icon name="settings-outline" size={24} color={colors.primary} />
              <Text style={styles.settingsButtonText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            G&apos;day! Choose how you want to communicate
          </Text>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.textSecondary,
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
    padding: 40,
    minWidth: 400,
  },
  emotionText: {
    fontSize: 28,
    fontFamily: 'Montserrat_700Bold',
    color: colors.text,
    textAlign: 'center',
    marginTop: 24,
    textTransform: 'capitalize',
  },
  emotionSubtext: {
    fontSize: 18,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
  },
  buttonSection: {
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
    maxWidth: 600,
    gap: 20 as any,
  },
  actionButton: {
    width: '100%',
    alignItems: 'center',
    gap: 12 as any,
    paddingHorizontal: 40,
    paddingVertical: 32,
    borderRadius: 20,
    boxShadow: '0px 6px 20px rgba(0,0,0,0.15)',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  actionButtonText: {
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  actionButtonSubtext: {
    fontSize: 16,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12 as any,
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    boxShadow: '0px 4px 12px rgba(0,0,0,0.08)',
  },
  settingsButtonText: {
    fontSize: 16,
    fontFamily: 'Montserrat_700Bold',
    color: colors.primary,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
