
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Text } from 'react-native';
import { colors } from '../styles/commonStyles';
import EmotionFace from './EmotionFace';

interface Props {
  visible: boolean;
  emotion: string;
  onDismiss: () => void;
}

export default function IdleOverlay({ visible, emotion, onDismiss }: Props) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  useEffect(() => {
    if (visible) {
      console.log('Showing idle overlay with emotion:', emotion);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, emotion]);

  if (!visible) return null;

  return (
    <TouchableOpacity 
      style={styles.overlay} 
      onPress={onDismiss}
      activeOpacity={1}
    >
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <EmotionFace emotion={emotion} size={200} />
        <Text style={styles.emotionText}>{emotion}</Text>
        <Text style={styles.tapText}>Tap anywhere to continue</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  content: {
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 24,
    padding: 32,
    boxShadow: '0px 10px 30px rgba(0,0,0,0.3)',
  },
  emotionText: {
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
    color: colors.text,
    marginTop: 16,
    textTransform: 'capitalize',
  },
  tapText: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: colors.textSecondary,
    marginTop: 8,
  },
});
