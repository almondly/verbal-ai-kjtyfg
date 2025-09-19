
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
          {/* Emotion Display - Takes up 80% of screen height as requested */}
          <View style={[styles.emotionSection, { height: height * 0.8 }]}>
            <View style={styles.emotionContainer}>
              <EmotionFace emotion={settings.selectedEmotion} size={Math.min(width * 0.4, height * 0.6)} />
              <Text style={styles.emotionText}>
                Feeling {settings.selectedEmotion} today, mate!
              </Text>
              <Text style={styles.emotionSubtext}>
                Ready to have a yarn?
              </Text>
            </View>
          </View>

          {/* Start Button - Made smaller as requested */}
          <View style={styles.buttonSection}>
            <TouchableOpacity 
              style={styles.startButton} 
              onPress={handleStartCommunication}
              activeOpacity={0.9}
            >
              <Icon name="chatbubble-outline" size={32} color="#FFFFFF" />
              <Text style={styles.startButtonText}>Start Chatting</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            G'day! Tap the button above to start communicating
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
    backgroundColor: colors.backgroundAlt,
    borderRadius: 32,
    padding: 40,
    boxShadow: '0px 8px 24px rgba(0,0,0,0.1)',
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
  },
  startButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16 as any,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 20,
    boxShadow: '0px 6px 20px rgba(77, 158, 255, 0.3)',
    minWidth: 200,
    justifyContent: 'center',
  },
  startButtonText: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    color: '#FFFFFF',
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
