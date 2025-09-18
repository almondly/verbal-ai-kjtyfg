
import Icon from '../components/Icon';
import EmotionFace from '../components/EmotionFace';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useEmotionSettings } from '../hooks/useEmotionSettings';
import { View, Text, StyleSheet, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import React, { useEffect, useState } from 'react';
import LandscapeGuard from '../components/LandscapeGuard';
import { useRouter } from 'expo-router';

export default function MainMenu() {
  const { settings } = useEmotionSettings();
  const router = useRouter();
  const { height } = useWindowDimensions();

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

  // Calculate emotion face size to be 80% of screen height
  const emotionSize = Math.min(height * 0.8, 400); // Cap at 400 for very large screens

  return (
    <LandscapeGuard>
      <View style={[commonStyles.container, styles.container]}>
        <View style={styles.content}>
          {/* Large Emotion Face - 80% of screen height */}
          <View style={styles.emotionContainer}>
            <EmotionFace emotion={settings.selectedEmotion} size={emotionSize} />
          </View>

          {/* App Title */}
          <Text style={styles.title}>ComPanion</Text>
          <Text style={styles.subtitle}>Tap to start communicating</Text>

          {/* Start Button - Smaller */}
          <TouchableOpacity 
            style={styles.startButton} 
            onPress={handleStartCommunication}
            activeOpacity={0.8}
          >
            <Icon name="chatbubbles-outline" size={24} color="#FFFFFF" />
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
    gap: 16 as any,
  },
  emotionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
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
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 12 as any,
    marginTop: 8,
    minWidth: 200,
    boxShadow: '0px 4px 12px rgba(59, 130, 246, 0.3)',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Montserrat_600SemiBold',
  },
});
