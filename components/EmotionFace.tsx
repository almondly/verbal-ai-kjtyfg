
import { View, StyleSheet, Image } from 'react-native';
import React from 'react';

interface Props {
  emotion: 1 | 2 | 3 | string; // Support both number IDs and legacy string names
  size?: number;
}

// Emotion images mapping - 1: sad, 2: happy, 3: angry
const EMOTION_IMAGES: Record<number, any> = {
  1: require('../assets/images/62b9172b-58c2-4814-be9d-60c275fd2e92.png'), // sad
  2: require('../assets/images/b95a3a5f-4816-4328-950c-7eff482324d4.png'), // happy
  3: require('../assets/images/ef57b3c2-1e89-4be5-848f-1cd098364957.png'), // angry
};

// Legacy string to number mapping for backwards compatibility
const LEGACY_EMOTION_MAP: Record<string, number> = {
  'sad': 1,
  'happy': 2,
  'angry': 3,
};

export default function EmotionFace({ emotion, size = 100 }: Props) {
  // Convert emotion to number ID
  let emotionId: number;
  
  if (typeof emotion === 'number') {
    emotionId = emotion;
  } else if (typeof emotion === 'string') {
    const normalized = emotion.toLowerCase();
    emotionId = LEGACY_EMOTION_MAP[normalized] || 2; // Default to happy
  } else {
    emotionId = 2; // Default to happy
  }
  
  // Ensure emotionId is valid (1, 2, or 3)
  if (![1, 2, 3].includes(emotionId)) {
    emotionId = 2; // Default to happy
  }
  
  console.log('EmotionFace rendering:', { emotion, emotionId, size });
  
  const imageSource = EMOTION_IMAGES[emotionId];

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Image
        source={imageSource}
        style={[styles.image, { width: size, height: size }]}
        resizeMode="contain"
        onError={(error) => {
          console.log('Error loading emotion image:', error);
        }}
        onLoad={() => {
          console.log('Emotion image loaded successfully:', emotionId);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
