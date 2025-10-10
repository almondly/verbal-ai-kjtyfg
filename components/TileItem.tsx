
import { memo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, useWindowDimensions } from 'react-native';
import { Tile } from '../types';
import { colors } from '../styles/commonStyles';
import { categories } from '../data/categories';
import Icon from './Icon';

interface Props {
  tile: Tile;
  onPress: () => void;
  onLongPress?: () => void;
  isAdd?: boolean;
  itemPercent?: number;
}

const TileItem = memo(function TileItem({
  tile,
  onPress,
  onLongPress,
  isAdd,
  itemPercent = 33.33,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const { width } = useWindowDimensions();

  const handlePressIn = () => {
    Animated.spring(scale, { 
      toValue: 0.92, 
      useNativeDriver: true, 
      speed: 50, 
      bounciness: 8 
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { 
      toValue: 1, 
      useNativeDriver: true, 
      speed: 50, 
      bounciness: 8 
    }).start();
  };

  // Get the category color for this tile
  const getCategoryColor = () => {
    if (isAdd) return colors.borderLight;
    if (tile.color) return tile.color;
    if (tile.category) {
      const category = categories.find(cat => cat.id === tile.category);
      if (category) return category.color;
    }
    return colors.primary;
  };

  // Get icon name based on tile text (simple pictogram mapping)
  const getIconName = () => {
    const text = tile.text.toLowerCase();
    
    // Core words
    if (text === 'i' || text === 'me') return 'person';
    if (text === 'you') return 'person-outline';
    if (text === 'he') return 'man';
    if (text === 'she') return 'woman';
    if (text === 'we' || text === 'they') return 'people';
    if (text === 'want') return 'hand-right';
    if (text === 'need') return 'alert-circle';
    if (text === 'like' || text === 'love') return 'heart';
    if (text === "don't" || text === 'no') return 'close-circle';
    if (text === 'help') return 'hand-left';
    if (text === 'more') return 'add-circle';
    if (text === 'yes') return 'checkmark-circle';
    if (text === 'please' || text === 'thank you') return 'happy';
    if (text === 'go') return 'arrow-forward';
    if (text === 'stop') return 'stop';
    if (text === 'look') return 'eye';
    if (text === 'open') return 'folder-open';
    if (text === 'close') return 'folder';
    if (text === 'all done' || text === 'finished') return 'checkmark-done';
    
    // People
    if (text === 'mom' || text === 'mother') return 'woman';
    if (text === 'dad' || text === 'father') return 'man';
    if (text === 'baby') return 'person';
    if (text === 'friend') return 'people';
    if (text === 'teacher') return 'school';
    if (text === 'family') return 'home';
    
    // Actions
    if (text === 'eat') return 'restaurant';
    if (text === 'drink') return 'water';
    if (text === 'sleep') return 'bed';
    if (text === 'play') return 'game-controller';
    if (text === 'walk') return 'walk';
    if (text === 'run') return 'fitness';
    if (text === 'sit') return 'person';
    if (text === 'stand') return 'person';
    if (text === 'read') return 'book';
    if (text === 'write') return 'create';
    if (text === 'draw') return 'brush';
    if (text === 'sing' || text === 'music') return 'musical-notes';
    if (text === 'watch') return 'eye';
    if (text === 'listen') return 'ear';
    if (text === 'talk') return 'chatbubbles';
    
    // Feelings
    if (text === 'happy') return 'happy';
    if (text === 'sad') return 'sad';
    if (text === 'angry') return 'flame';
    if (text === 'scared') return 'warning';
    if (text === 'excited') return 'star';
    if (text === 'tired') return 'moon';
    if (text === 'sick') return 'medical';
    if (text === 'hurt') return 'bandage';
    
    // Food
    if (text === 'apple' || text === 'banana' || text === 'food') return 'nutrition';
    if (text === 'water' || text === 'juice' || text === 'milk') return 'water';
    if (text === 'cookie' || text === 'cake' || text === 'snack') return 'ice-cream';
    if (text === 'pizza') return 'pizza';
    
    // Home
    if (text === 'house' || text === 'home') return 'home';
    if (text === 'bed' || text === 'bedroom') return 'bed';
    if (text === 'bathroom') return 'water';
    if (text === 'tv') return 'tv';
    if (text === 'phone') return 'call';
    if (text === 'computer' || text === 'tablet') return 'laptop';
    
    // School
    if (text === 'school') return 'school';
    if (text === 'book') return 'book';
    if (text === 'pencil' || text === 'pen' || text === 'crayon') return 'pencil';
    if (text === 'backpack') return 'bag';
    
    // Body
    if (text === 'head' || text === 'face') return 'person-circle';
    if (text === 'eyes') return 'eye';
    if (text === 'ears') return 'ear';
    if (text === 'mouth') return 'chatbubble';
    if (text === 'hands' || text === 'fingers') return 'hand-left';
    if (text === 'feet') return 'footsteps';
    
    // Places
    if (text === 'park') return 'leaf';
    if (text === 'store') return 'storefront';
    if (text === 'hospital' || text === 'doctor') return 'medical';
    if (text === 'car') return 'car';
    if (text === 'bus') return 'bus';
    if (text === 'train') return 'train';
    if (text === 'airplane') return 'airplane';
    
    // Routines
    if (text === 'wake up') return 'alarm';
    if (text === 'breakfast' || text === 'lunch' || text === 'dinner') return 'restaurant';
    if (text === 'bath time') return 'water';
    if (text === 'bedtime') return 'bed';
    if (text === 'brush teeth') return 'water';
    if (text === 'potty') return 'water';
    
    // Questions
    if (text === 'what') return 'help-circle';
    if (text === 'where') return 'location';
    if (text === 'when') return 'time';
    if (text === 'who') return 'person';
    if (text === 'why' || text === 'how') return 'help';
    
    // Numbers
    if (/^\d+$/.test(text)) return 'calculator';
    
    // Colors
    if (text === 'red' || text === 'blue' || text === 'yellow' || text === 'green' || 
        text === 'orange' || text === 'purple' || text === 'pink' || text === 'black' || 
        text === 'white' || text === 'brown') return 'color-palette';
    
    // Animals
    if (text === 'dog' || text === 'cat' || text === 'bird' || text === 'fish' || 
        text === 'horse' || text === 'cow' || text === 'pig' || text === 'chicken' ||
        text === 'duck' || text === 'rabbit' || text === 'bear' || text === 'lion' ||
        text === 'elephant' || text === 'monkey') return 'paw';
    
    // Clothing
    if (text === 'shirt' || text === 'pants' || text === 'dress' || text === 'shoes' ||
        text === 'socks' || text === 'coat' || text === 'hat' || text === 'gloves') return 'shirt';
    
    // Weather
    if (text === 'sunny' || text === 'hot') return 'sunny';
    if (text === 'cloudy') return 'cloudy';
    if (text === 'rainy') return 'rainy';
    if (text === 'snowy' || text === 'cold') return 'snow';
    if (text === 'windy') return 'cloudy';
    
    // Time
    if (text === 'morning' || text === 'afternoon' || text === 'evening' || text === 'night') return 'time';
    if (text === 'today' || text === 'tomorrow' || text === 'yesterday') return 'calendar';
    if (text === 'now' || text === 'later') return 'time';
    
    // Toys
    if (text === 'ball') return 'football';
    if (text === 'doll') return 'person';
    if (text === 'blocks' || text === 'puzzle') return 'cube';
    if (text === 'car' || text === 'truck') return 'car';
    if (text === 'bike') return 'bicycle';
    if (text === 'swing' || text === 'slide') return 'happy';
    
    // Default
    return 'chatbubble-ellipses';
  };

  // Responsive font size - larger and bolder
  const getResponsiveFontSize = () => {
    if (width >= 1400) return 20;
    if (width >= 1200) return 19;
    if (width >= 1000) return 18;
    if (width >= 820) return 17;
    if (width >= 680) return 16;
    return 15;
  };

  // Responsive icon size - larger for better visibility
  const getResponsiveIconSize = () => {
    if (width >= 1400) return 70;
    if (width >= 1200) return 65;
    if (width >= 1000) return 60;
    if (width >= 820) return 55;
    if (width >= 680) return 50;
    return 45;
  };

  const borderColor = getCategoryColor();
  const fontSize = getResponsiveFontSize();
  const iconSize = getResponsiveIconSize();
  const iconName = isAdd ? 'add-circle' : getIconName();

  return (
    <Animated.View
      style={[
        styles.tileWrap,
        { width: `${itemPercent}%`, transform: [{ scale }] },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
        style={[
          styles.tile, 
          { 
            backgroundColor: colors.surface,
            borderColor: borderColor,
            borderWidth: 5,
          }
        ]}
      >
        <View style={styles.iconWrap}>
          <Icon name={iconName} size={iconSize} color={borderColor} />
        </View>
        <View style={styles.textContainer}>
          <Text 
            style={[styles.text, { fontSize, color: colors.text }]} 
            numberOfLines={2} 
            ellipsizeMode="tail"
          >
            {tile.text}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

export default TileItem;

const styles = StyleSheet.create({
  tileWrap: {
    padding: 6,
  },
  tile: {
    aspectRatio: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    boxShadow: '0px 4px 8px rgba(0,0,0,0.18)',
  },
  iconWrap: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  text: {
    fontFamily: 'Montserrat_700Bold',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 4,
  },
});
