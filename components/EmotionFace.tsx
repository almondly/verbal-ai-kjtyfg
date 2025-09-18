
import { View, StyleSheet } from 'react-native';
import { colors } from '../styles/commonStyles';
import React from 'react';

interface Props {
  emotion: string;
  size?: number;
}

export default function EmotionFace({ emotion, size = 100 }: Props) {
  const getFaceStyle = () => {
    return {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: colors.backgroundAlt,
      borderWidth: 3,
      borderColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative' as const,
      // Removed any shadow properties
    };
  };

  const getEyeStyle = (isLeft: boolean) => {
    const eyeSize = size * 0.12;
    const eyeOffset = size * 0.15;
    
    let eyeShape = {};
    
    switch (emotion) {
      case 'happy':
      case 'excited':
        eyeShape = {
          width: eyeSize,
          height: eyeSize,
          borderRadius: eyeSize / 2,
          backgroundColor: colors.text,
        };
        break;
      case 'sad':
      case 'disappointed':
        eyeShape = {
          width: eyeSize * 0.8,
          height: eyeSize,
          borderRadius: eyeSize / 2,
          backgroundColor: colors.text,
        };
        break;
      case 'angry':
        eyeShape = {
          width: eyeSize,
          height: eyeSize * 0.6,
          backgroundColor: colors.text,
          transform: [{ rotate: isLeft ? '15deg' : '-15deg' }],
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
    
    switch (emotion) {
      case 'happy':
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
      case 'sad':
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
      case 'angry':
        return {
          position: 'absolute' as const,
          bottom: size * 0.22,
          width: mouthWidth * 0.8,
          height: 4,
          backgroundColor: colors.text,
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
    
    switch (emotion) {
      case 'angry':
        transform = [{ rotate: isLeft ? '-20deg' : '20deg' }];
        break;
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
    switch (emotion) {
      case 'excited':
        // Add sparkles or extra elements
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
  // No styles needed as everything is inline
});
