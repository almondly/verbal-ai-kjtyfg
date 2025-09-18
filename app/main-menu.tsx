
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles } from '../styles/commonStyles';
import EmotionFace from '../components/EmotionFace';
import Icon from '../components/Icon';
import LandscapeGuard from '../components/LandscapeGuard';
import { useEmotionSettings } from '../hooks/useEmotionSettings';
import * as ScreenOrientation from 'expo-screen-orientation';

export default function MainMenu() {
  const router = useRouter();
  const { settings, isLoading } = useEmotionSettings();
  const [bounceAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    console.log('MainMenu mounted');
    
    // Only try to lock orientation on native platforms
    if (Platform.OS !== 'web') {
      try {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        console.log('Screen orientation locked to landscape');
      } catch (error) {
        console.log('Failed to lock screen orientation:', error);
      }
    } else {
      console.log('Skipping screen orientation lock on web platform');
    }
    
    // Start bounce animation
    const bounce = () => {
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Repeat the animation
        setTimeout(bounce, 2000);
      });
    };
    
    bounce();
  }, []);

  const handleStartCommunication = () => {
    console.log('Starting communication board');
    router.push('/communication');
  };

  if (isLoading) {
    return (
      <LandscapeGuard>
        <View style={[commonStyles.container, styles.loadingContainer]}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </LandscapeGuard>
    );
  }

  return (
    <LandscapeGuard>
      <View style={[commonStyles.container, styles.container]}>
        <View style={styles.header}>
          <Text style={styles.title}>Speak Buddy</Text>
          <Text style={styles.subtitle}>Communication Made Easy</Text>
        </View>

        <View style={styles.emotionContainer}>
          <Animated.View style={[styles.emotionWrapper, { transform: [{ scale: bounceAnim }] }]}>
            <EmotionFace emotion={settings.selectedEmotion} size={240} />
          </Animated.View>
          <Text style={styles.emotionLabel}>
            I&apos;m feeling {settings.selectedEmotion}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.startButton} 
            onPress={handleStartCommunication}
            activeOpacity={0.8}
          >
            <Icon name="chatbubbles-outline" size={28} color="#FFFFFF" />
            <Text style={styles.startButtonText}>Start Communicating</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Tap the button above to begin using your communication board
          </Text>
        </View>
      </View>
    </LandscapeGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
  },
  header: {
    alignItems: 'center',
    marginTop: 16,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Montserrat_700Bold',
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Montserrat_400Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  emotionContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  emotionWrapper: {
    marginBottom: 24,
    boxShadow: '0px 8px 20px rgba(0,0,0,0.1)',
  },
  emotionLabel: {
    fontSize: 20,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  startButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 24,
    minWidth: 320,
    boxShadow: '0px 6px 16px rgba(77, 158, 255, 0.3)',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    marginLeft: 16,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 300,
  },
});
