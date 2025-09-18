
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../styles/commonStyles';

interface Props {
  emotion: string;
  size?: number;
}

export default function EmotionFace({ emotion, size = 120 }: Props) {
  console.log('Rendering EmotionFace:', emotion);

  const getFaceStyle = () => {
    const baseStyle = {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: '#FFE4B5',
      borderWidth: 3,
      borderColor: '#DEB887',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative' as const,
    };
    return baseStyle;
  };

  const getEyeStyle = (isLeft: boolean) => {
    const eyeSize = size * 0.15;
    return {
      width: eyeSize,
      height: eyeSize,
      borderRadius: eyeSize / 2,
      backgroundColor: '#2C3E50',
      position: 'absolute' as const,
      top: size * 0.25,
      [isLeft ? 'left' : 'right']: size * 0.25,
    };
  };

  const getMouthStyle = () => {
    const mouthWidth = size * 0.4;
    const mouthHeight = size * 0.2;
    
    switch (emotion.toLowerCase()) {
      case 'happy':
      case 'excited':
      case 'proud':
      case 'silly':
      case 'loved':
      case 'grateful':
        return {
          width: mouthWidth,
          height: mouthHeight,
          borderBottomLeftRadius: mouthWidth / 2,
          borderBottomRightRadius: mouthWidth / 2,
          borderWidth: 3,
          borderColor: '#E74C3C',
          borderTopWidth: 0,
          position: 'absolute' as const,
          bottom: size * 0.25,
        };
      
      case 'sad':
      case 'hurt':
      case 'lonely':
        return {
          width: mouthWidth,
          height: mouthHeight,
          borderTopLeftRadius: mouthWidth / 2,
          borderTopRightRadius: mouthWidth / 2,
          borderWidth: 3,
          borderColor: '#E74C3C',
          borderBottomWidth: 0,
          position: 'absolute' as const,
          bottom: size * 0.2,
        };
      
      case 'mad':
      case 'angry':
      case 'frustrated':
        return {
          width: mouthWidth * 0.8,
          height: size * 0.08,
          backgroundColor: '#E74C3C',
          borderRadius: 4,
          position: 'absolute' as const,
          bottom: size * 0.25,
        };
      
      case 'surprised':
        return {
          width: size * 0.15,
          height: size * 0.2,
          borderRadius: size * 0.075,
          backgroundColor: '#E74C3C',
          position: 'absolute' as const,
          bottom: size * 0.25,
        };
      
      case 'scared':
      case 'worried':
      case 'nervous':
        return {
          width: size * 0.12,
          height: size * 0.12,
          borderRadius: size * 0.06,
          backgroundColor: '#E74C3C',
          position: 'absolute' as const,
          bottom: size * 0.25,
        };
      
      case 'tired':
      case 'bored':
        return {
          width: mouthWidth * 0.6,
          height: size * 0.06,
          backgroundColor: '#E74C3C',
          borderRadius: 3,
          position: 'absolute' as const,
          bottom: size * 0.25,
        };
      
      case 'okay':
      case 'calm':
        return {
          width: mouthWidth * 0.7,
          height: size * 0.06,
          backgroundColor: '#E74C3C',
          borderRadius: 3,
          position: 'absolute' as const,
          bottom: size * 0.25,
        };
      
      default:
        return {
          width: mouthWidth * 0.7,
          height: size * 0.06,
          backgroundColor: '#E74C3C',
          borderRadius: 3,
          position: 'absolute' as const,
          bottom: size * 0.25,
        };
    }
  };

  const getEyebrowStyle = (isLeft: boolean) => {
    const eyebrowWidth = size * 0.2;
    const eyebrowHeight = size * 0.04;
    
    const baseStyle = {
      width: eyebrowWidth,
      height: eyebrowHeight,
      backgroundColor: '#8B4513',
      position: 'absolute' as const,
      top: size * 0.15,
      [isLeft ? 'left' : 'right']: size * 0.2,
    };

    switch (emotion.toLowerCase()) {
      case 'mad':
      case 'angry':
      case 'frustrated':
        return {
          ...baseStyle,
          transform: [{ rotate: isLeft ? '20deg' : '-20deg' }],
          top: size * 0.12,
        };
      
      case 'sad':
      case 'hurt':
      case 'lonely':
        return {
          ...baseStyle,
          transform: [{ rotate: isLeft ? '-10deg' : '10deg' }],
        };
      
      case 'surprised':
        return {
          ...baseStyle,
          top: size * 0.1,
        };
      
      default:
        return baseStyle;
    }
  };

  const getSpecialFeatures = () => {
    switch (emotion.toLowerCase()) {
      case 'sick':
        return (
          <View style={{
            width: size * 0.08,
            height: size * 0.08,
            borderRadius: size * 0.04,
            backgroundColor: '#FF6B6B',
            position: 'absolute',
            top: size * 0.35,
            right: size * 0.15,
          }} />
        );
      
      case 'hot':
        return (
          <View style={{
            width: size * 0.06,
            height: size * 0.15,
            backgroundColor: '#FF4757',
            borderRadius: 3,
            position: 'absolute',
            top: size * 0.05,
            left: size * 0.47,
          }} />
        );
      
      case 'cold':
        return (
          <>
            <View style={{
              width: size * 0.03,
              height: size * 0.03,
              borderRadius: size * 0.015,
              backgroundColor: '#74B9FF',
              position: 'absolute',
              top: size * 0.1,
              left: size * 0.3,
            }} />
            <View style={{
              width: size * 0.03,
              height: size * 0.03,
              borderRadius: size * 0.015,
              backgroundColor: '#74B9FF',
              position: 'absolute',
              top: size * 0.08,
              right: size * 0.35,
            }} />
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={getFaceStyle()}>
        {/* Left eyebrow */}
        <View style={getEyebrowStyle(true)} />
        {/* Right eyebrow */}
        <View style={getEyebrowStyle(false)} />
        
        {/* Left eye */}
        <View style={getEyeStyle(true)} />
        {/* Right eye */}
        <View style={getEyeStyle(false)} />
        
        {/* Mouth */}
        <View style={getMouthStyle()} />
        
        {/* Special features */}
        {getSpecialFeatures()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
