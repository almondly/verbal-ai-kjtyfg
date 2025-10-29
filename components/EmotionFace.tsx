
import { View, StyleSheet, Image } from 'react-native';
import { colors } from '../styles/commonStyles';
import React from 'react';

interface Props {
  emotion: string;
  size?: number;
}

// Emotion images mapping
const EMOTION_IMAGES: Record<string, any> = {
  'happy': require('../assets/images/aa6987ad-e069-467f-a6b3-06402e1d3639.png'),
  'sad': require('../assets/images/ed60f147-9a17-4a92-932b-837c02d96ac0.png'),
  'angry': require('../assets/images/9fa5e61e-7f9c-4c8a-a2d1-bedfe2f9e48a.png'),
};

// EmotionFace component now uses the provided emotion images
export default function EmotionFace({ emotion, size = 100 }: Props) {
  const normalizedEmotion = emotion?.toLowerCase() || 'happy';
  
  console.log('EmotionFace rendering:', { emotion, normalizedEmotion, size });
  
  const imageSource = EMOTION_IMAGES[normalizedEmotion];

  // If we have an image for this emotion, use it
  if (imageSource) {
    console.log('Using image for emotion:', normalizedEmotion);
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
            console.log('Emotion image loaded successfully:', normalizedEmotion);
          }}
        />
      </View>
    );
  }

  console.log('Using fallback rendering for emotion:', normalizedEmotion);

  // Fallback to programmatic rendering for other emotions
  const getFaceStyle = () => {
    return {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: 'transparent',
      borderWidth: 0,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative' as const,
    };
  };

  const getEyeStyle = (isLeft: boolean) => {
    const eyeSize = size * 0.12;
    const eyeOffset = size * 0.15;
    
    let eyeShape = {};
    
    switch (normalizedEmotion) {
      case 'excited':
        eyeShape = {
          width: eyeSize,
          height: eyeSize,
          borderRadius: eyeSize / 2,
          backgroundColor: colors.text,
        };
        break;
      case 'disappointed':
        eyeShape = {
          width: eyeSize * 0.8,
          height: eyeSize,
          borderRadius: eyeSize / 2,
          backgroundColor: colors.text,
        };
        break;
      case 'surprised':
        eyeShape = {
          width: eyeSize * 1.3,
          height: eyeSize * 1.3,
          borderRadius: (eyeSize * 1.3) / 2,
          backgroundColor: colors.text,
        };
        break;
      case 'worried':
        eyeShape = {
          width: eyeSize,
          height: eyeSize,
          borderRadius: eyeSize / 2,
          backgroundColor: colors.text,
        };
        break;
      default:
        eyeShape = {
          width: eyeSize,
          height: eyeSize,
          borderRadius: eyeSize / 2,
          backgroundColor: colors.text,
        };
    }

    return {
      ...eyeShape,
      position: 'absolute' as const,
      top: size * 0.3,
      [isLeft ? 'left' : 'right']: eyeOffset,
    };
  };

  const getMouthStyle = () => {
    const mouthWidth = size * 0.3;
    const mouthHeight = size * 0.15;
    
    switch (normalizedEmotion) {
      case 'excited':
        return {
          position: 'absolute' as const,
          bottom: size * 0.25,
          width: mouthWidth,
          height: mouthHeight,
          borderBottomLeftRadius: mouthWidth / 2,
          borderBottomRightRadius: mouthWidth / 2,
          borderWidth: 3,
          borderTopWidth: 0,
          borderColor: colors.text,
        };
      case 'disappointed':
        return {
          position: 'absolute' as const,
          bottom: size * 0.2,
          width: mouthWidth,
          height: mouthHeight,
          borderTopLeftRadius: mouthWidth / 2,
          borderTopRightRadius: mouthWidth / 2,
          borderWidth: 3,
          borderBottomWidth: 0,
          borderColor: colors.text,
        };
      case 'surprised':
        return {
          position: 'absolute' as const,
          bottom: size * 0.25,
          width: mouthWidth * 0.6,
          height: mouthWidth * 0.6,
          borderRadius: (mouthWidth * 0.6) / 2,
          borderWidth: 3,
          borderColor: colors.text,
        };
      case 'worried':
        return {
          position: 'absolute' as const,
          bottom: size * 0.22,
          width: mouthWidth * 0.7,
          height: mouthHeight * 0.8,
          borderTopLeftRadius: (mouthWidth * 0.7) / 2,
          borderTopRightRadius: (mouthWidth * 0.7) / 2,
          borderWidth: 2,
          borderBottomWidth: 0,
          borderColor: colors.text,
        };
      default:
        return {
          position: 'absolute' as const,
          bottom: size * 0.25,
          width: mouthWidth,
          height: 3,
          backgroundColor: colors.text,
        };
    }
  };

  const getEyebrowStyle = (isLeft: boolean) => {
    const browWidth = size * 0.15;
    const browHeight = 3;
    const browOffset = size * 0.12;
    
    let transform = [];
    
    switch (normalizedEmotion) {
      case 'worried':
        transform = [{ rotate: isLeft ? '10deg' : '-10deg' }];
        break;
      case 'surprised':
        return {
          position: 'absolute' as const,
          top: size * 0.2,
          [isLeft ? 'left' : 'right']: browOffset,
          width: browWidth,
          height: browHeight,
          backgroundColor: colors.text,
          transform: [{ rotate: isLeft ? '15deg' : '-15deg' }],
        };
      default:
        return null;
    }

    return {
      position: 'absolute' as const,
      top: size * 0.22,
      [isLeft ? 'left' : 'right']: browOffset,
      width: browWidth,
      height: browHeight,
      backgroundColor: colors.text,
      transform,
    };
  };

  const getSpecialFeatures = () => {
    switch (normalizedEmotion) {
      case 'excited':
        return (
          <>
            <View style={{
              position: 'absolute',
              top: size * 0.1,
              right: size * 0.1,
              width: size * 0.08,
              height: size * 0.08,
              backgroundColor: colors.primary,
              borderRadius: (size * 0.08) / 2,
            }} />
            <View style={{
              position: 'absolute',
              top: size * 0.15,
              left: size * 0.05,
              width: size * 0.06,
              height: size * 0.06,
              backgroundColor: colors.primary,
              borderRadius: (size * 0.06) / 2,
            }} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View style={getFaceStyle()}>
      {/* Left eyebrow */}
      {getEyebrowStyle(true) && <View style={getEyebrowStyle(true)} />}
      
      {/* Right eyebrow */}
      {getEyebrowStyle(false) && <View style={getEyebrowStyle(false)} />}
      
      {/* Left eye */}
      <View style={getEyeStyle(true)} />
      
      {/* Right eye */}
      <View style={getEyeStyle(false)} />
      
      {/* Mouth */}
      <View style={getMouthStyle()} />
      
      {/* Special features */}
      {getSpecialFeatures()}
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
