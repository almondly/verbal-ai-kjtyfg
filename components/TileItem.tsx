
import { memo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, useWindowDimensions, Image } from 'react-native';
import { Tile } from '../types';
import { colors } from '../styles/commonStyles';
import { categories } from '../data/categories';
import Icon from './Icon';
import { getUnsplashImageUrl } from '../utils/unsplashImages';

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
  itemPercent = 20,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const { width } = useWindowDimensions();
  const [imageError, setImageError] = useState(false);
  const [unsplashError, setUnsplashError] = useState(false);

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
    if (text === 'it') return 'ellipse';
    if (text === 'my' || text === 'mine') return 'hand-right';
    if (text === 'your') return 'hand-left';
    if (text === 'want') return 'hand-right';
    if (text === 'need') return 'alert-circle';
    if (text === 'like' || text === 'love') return 'heart';
    if (text === "don't" || text === 'no') return 'close-circle';
    if (text === 'help') return 'hand-left';
    if (text === 'more') return 'add-circle';
    if (text === 'again') return 'refresh';
    if (text === 'different') return 'swap-horizontal';
    if (text === 'same') return 'copy';
    if (text === 'this' || text === 'that') return 'finger-print';
    if (text === 'here') return 'location';
    if (text === 'there') return 'navigate';
    if (text === 'yes') return 'checkmark-circle';
    if (text === 'please' || text === 'thank you') return 'happy';
    if (text === 'go' || text === 'come') return 'arrow-forward';
    if (text === 'stop') return 'stop';
    if (text === 'look' || text === 'watch') return 'eye';
    if (text === 'put') return 'arrow-down';
    if (text === 'make') return 'construct';
    if (text === 'turn') return 'sync';
    if (text === 'open') return 'folder-open';
    if (text === 'close') return 'folder';
    if (text === 'all done' || text === 'finished') return 'checkmark-done';
    if (text === 'because') return 'help-circle';
    if (text === 'and') return 'add';
    if (text === 'or') return 'git-branch';
    if (text === 'with') return 'people';
    if (text === 'without') return 'remove-circle';
    
    // People
    if (text === 'mom' || text === 'mother') return 'woman';
    if (text === 'dad' || text === 'father') return 'man';
    if (text === 'brother') return 'man';
    if (text === 'sister') return 'woman';
    if (text === 'baby') return 'person';
    if (text === 'friend') return 'people';
    if (text === 'teacher') return 'school';
    if (text === 'family') return 'home';
    if (text === 'boy') return 'man';
    if (text === 'girl') return 'woman';
    if (text === 'man') return 'man';
    if (text === 'woman') return 'woman';
    if (text === 'grandma') return 'woman';
    if (text === 'grandpa') return 'man';
    
    // Actions
    if (text === 'eat') return 'restaurant';
    if (text === 'drink') return 'water';
    if (text === 'sleep') return 'bed';
    if (text === 'play') return 'game-controller';
    if (text === 'walk') return 'walk';
    if (text === 'run') return 'fitness';
    if (text === 'jump') return 'arrow-up';
    if (text === 'sit') return 'person';
    if (text === 'stand') return 'person';
    if (text === 'read') return 'book';
    if (text === 'write') return 'create';
    if (text === 'draw') return 'brush';
    if (text === 'sing' || text === 'music') return 'musical-notes';
    if (text === 'dance') return 'musical-note';
    if (text === 'listen') return 'ear';
    if (text === 'talk') return 'chatbubbles';
    if (text === 'give') return 'gift';
    if (text === 'take') return 'hand-right';
    if (text === 'throw') return 'baseball';
    if (text === 'catch') return 'hand-left';
    if (text === 'push') return 'arrow-forward';
    if (text === 'pull') return 'arrow-back';
    if (text === 'wash' || text === 'clean') return 'water';
    
    // Feelings
    if (text === 'happy') return 'happy';
    if (text === 'sad') return 'sad';
    if (text === 'angry') return 'flame';
    if (text === 'scared') return 'warning';
    if (text === 'excited') return 'star';
    if (text === 'tired') return 'moon';
    if (text === 'sick') return 'medical';
    if (text === 'hurt') return 'bandage';
    if (text === 'worried') return 'alert';
    if (text === 'calm') return 'leaf';
    if (text === 'surprised') return 'bulb';
    
    // Food
    if (text === 'apple' || text === 'banana' || text === 'food') return 'nutrition';
    if (text === 'bread') return 'restaurant';
    if (text === 'cheese') return 'nutrition';
    if (text === 'water' || text === 'juice' || text === 'milk') return 'water';
    if (text === 'cookie' || text === 'cake' || text === 'snack') return 'ice-cream';
    if (text === 'pizza') return 'pizza';
    if (text === 'sandwich') return 'fast-food';
    if (text === 'egg') return 'egg';
    if (text === 'chicken' || text === 'fish') return 'fish';
    if (text === 'carrot') return 'leaf';
    
    // Home
    if (text === 'house' || text === 'home') return 'home';
    if (text === 'bed' || text === 'bedroom') return 'bed';
    if (text === 'chair') return 'person';
    if (text === 'table') return 'grid';
    if (text === 'door') return 'exit';
    if (text === 'window') return 'square';
    if (text === 'bathroom') return 'water';
    if (text === 'kitchen') return 'restaurant';
    if (text === 'living room') return 'tv';
    if (text === 'tv') return 'tv';
    if (text === 'phone') return 'call';
    if (text === 'computer' || text === 'tablet') return 'laptop';
    
    // School
    if (text === 'school') return 'school';
    if (text === 'book') return 'book';
    if (text === 'pencil' || text === 'pen') return 'pencil';
    if (text === 'paper') return 'document';
    if (text === 'crayon') return 'color-palette';
    if (text === 'scissors') return 'cut';
    if (text === 'glue') return 'water';
    if (text === 'backpack') return 'bag';
    if (text === 'lunch') return 'restaurant';
    if (text === 'recess') return 'game-controller';
    if (text === 'class') return 'people';
    
    // Body
    if (text === 'head' || text === 'face') return 'person-circle';
    if (text === 'eyes') return 'eye';
    if (text === 'ears') return 'ear';
    if (text === 'nose') return 'triangle';
    if (text === 'mouth') return 'chatbubble';
    if (text === 'teeth') return 'grid';
    if (text === 'hair') return 'person';
    if (text === 'hands' || text === 'fingers') return 'hand-left';
    if (text === 'arms') return 'hand-right';
    if (text === 'legs') return 'walk';
    if (text === 'feet') return 'footsteps';
    if (text === 'tummy') return 'ellipse';
    
    // Places
    if (text === 'park') return 'leaf';
    if (text === 'store') return 'storefront';
    if (text === 'library') return 'library';
    if (text === 'hospital' || text === 'doctor') return 'medical';
    if (text === 'playground') return 'game-controller';
    if (text === 'restaurant') return 'restaurant';
    if (text === 'car') return 'car';
    if (text === 'bus') return 'bus';
    if (text === 'train') return 'train';
    if (text === 'airplane') return 'airplane';
    if (text === 'beach') return 'water';
    
    // Routines
    if (text === 'wake up') return 'alarm';
    if (text === 'breakfast' || text === 'lunch' || text === 'dinner') return 'restaurant';
    if (text === 'snack time') return 'ice-cream';
    if (text === 'bath time') return 'water';
    if (text === 'bedtime') return 'bed';
    if (text === 'brush teeth') return 'water';
    if (text === 'get dressed') return 'shirt';
    if (text === 'potty') return 'water';
    
    // Questions
    if (text === 'what') return 'help-circle';
    if (text === 'where') return 'location';
    if (text === 'when') return 'time';
    if (text === 'who') return 'person';
    if (text === 'why' || text === 'how') return 'help';
    if (text === 'which') return 'finger-print';
    
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
    if (text === 'train') return 'train';
    if (text === 'bike') return 'bicycle';
    if (text === 'swing' || text === 'slide') return 'happy';
    
    // Default
    return 'chatbubble-ellipses';
  };

  // Responsive font size - adjusted for smaller tiles
  const getResponsiveFontSize = () => {
    if (width >= 1400) return 16;
    if (width >= 1200) return 15;
    if (width >= 1000) return 14;
    if (width >= 820) return 13;
    if (width >= 680) return 12;
    return 11;
  };

  // Responsive icon size - adjusted for smaller tiles
  const getResponsiveIconSize = () => {
    if (width >= 1400) return 55;
    if (width >= 1200) return 50;
    if (width >= 1000) return 45;
    if (width >= 820) return 42;
    if (width >= 680) return 38;
    return 35;
  };

  const tileColor = getCategoryColor();
  const fontSize = getResponsiveFontSize();
  const iconSize = getResponsiveIconSize();
  const iconName = isAdd ? 'add-circle' : getIconName();

  // Determine which image to display (priority: custom imageUrl/imageUri > Unsplash > pictogram icon)
  const hasCustomImage = !isAdd && (tile.imageUrl || tile.imageUri) && !imageError;
  const unsplashImageUrl = !isAdd && !hasCustomImage && !unsplashError ? getUnsplashImageUrl(tile.text) : null;

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
            backgroundColor: '#FFFFFF',
            borderColor: tileColor,
            borderWidth: 4,
          }
        ]}
      >
        <View style={styles.iconWrap}>
          {hasCustomImage ? (
            <Image
              source={{ uri: tile.imageUrl || tile.imageUri }}
              style={styles.customImage}
              resizeMode="contain"
              onError={() => {
                console.log('Failed to load custom image for tile:', tile.text);
                setImageError(true);
              }}
            />
          ) : unsplashImageUrl ? (
            <Image
              source={{ uri: unsplashImageUrl }}
              style={styles.customImage}
              resizeMode="cover"
              onError={() => {
                console.log('Failed to load Unsplash image for tile:', tile.text);
                setUnsplashError(true);
              }}
            />
          ) : (
            <Icon name={iconName} size={iconSize} color={tileColor} />
          )}
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
    padding: 4,
  },
  tile: {
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
  },
  iconWrap: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  customImage: {
    width: '100%',
    height: '100%',
    maxWidth: 60,
    maxHeight: 60,
    borderRadius: 6,
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 32,
  },
  text: {
    fontFamily: 'Montserrat_700Bold',
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 2,
  },
});
