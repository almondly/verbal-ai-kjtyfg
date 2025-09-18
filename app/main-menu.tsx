
import Icon from '../components/Icon';
import EmotionFace from '../components/EmotionFace';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useEmotionSettings } from '../hooks/useEmotionSettings';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import React, { useEffect, useState } from 'react';
import LandscapeGuard from '../components/LandscapeGuard';
import { useRouter } from 'expo-router';

export default function MainMenu() {
  const { settings } = useEmotionSettings();
  const router = useRouter();

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
    console.log('Starting communication screen');
    router.push('/communication');
  };

  return (
    <LandscapeGuard>
      <View style={[commonStyles.container, styles.container]}>
        <View style={styles.content}>
          {/* Large Emotion Face - No drop shadow, super large */}
          <View style={styles.emotionContainer}>
            <EmotionFace emotion={settings.selectedEmotion} size={200} />
          </View>

          {/* App Title */}
          <Text style={styles.title}>Speak Buddy</Text>
          <Text style={styles.subtitle}>Tap to start communicating</Text>

          {/* Start Button - Bigger */}
          <TouchableOpacity 
            style={styles.startButton} 
            onPress={handleStartCommunication}
            activeOpacity={0.8}
          >
            <Icon name="chatbubbles-outline" size={40} color="#FFFFFF" />
            <Text style={styles.startButtonText}>Start Communication</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LandscapeGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  content: {
    alignItems: 'center',
    gap: 24 as any,
  },
  emotionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    // Removed drop shadow
  },
  title: {
    fontSize: 48,
    fontFamily: 'Montserrat_700Bold',
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontFamily: 'Montserrat_400Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: -8,
  },
  startButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 24,
    gap: 16 as any,
    marginTop: 16,
    minWidth: 280,
    boxShadow: '0px 8px 20px rgba(59, 130, 246, 0.3)',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Montserrat_600SemiBold',
  },
});
