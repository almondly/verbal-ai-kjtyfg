
import { memo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, useWindowDimensions } from 'react-native';
import { Tile } from '../types';
import { colors } from '../styles/commonStyles';
import { categories } from '../data/categories';
import Icon from './Icon';

interface Props {
  tile: Tile;
  onPress: () => void;
  onLongPress?: () => void;
  isAdd?: boolean;
  itemPercent?: number; // dynamic width from grid for responsive columns
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
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 50, bounciness: 8 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 8 }).start();
  };

  // Get the category color for this tile
  const getCategoryColor = () => {
    if (isAdd) return '#F3F4F6';
    if (tile.color) return tile.color; // Use tile's color if it has one
    if (tile.category) {
      const category = categories.find(cat => cat.id === tile.category);
      if (category) return category.color;
    }
    return '#FFFFFF'; // fallback
  };

  // Responsive font size based on screen width
  const getResponsiveFontSize = () => {
    if (width >= 1400) return 18; // Large tablets/desktops
    if (width >= 1200) return 17; // Medium tablets
    if (width >= 1000) return 16; // Small tablets
    if (width >= 820) return 15;  // Large phones landscape
    if (width >= 680) return 14;  // Medium phones landscape
    return 13; // Small phones
  };

  const bg = getCategoryColor();
  const fontSize = getResponsiveFontSize();

  return (
    <Animated.View
      style={[
        styles.tileWrap,
        { width: `${itemPercent}%`, transform: [{ scale }] },
        { position: 'relative', zIndex: 10 }, // bring in front
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
            backgroundColor: bg,
            borderColor: bg,
            borderWidth: 2,
          }
        ]}
      >
        <View style={styles.imageWrap}>
          {isAdd ? (
            <Icon name="add-circle-outline" size={34} color={colors.text} />
          ) : tile.imageUri ? (
            <Image 
              source={{ uri: tile.imageUri }} 
              style={styles.image} 
              resizeMode="cover"
              onError={() => console.log(`Failed to load image for tile: ${tile.text}`)}
            />
          ) : (
            <Icon name="chatbubble-ellipses-outline" size={34} color={colors.text} />
          )}
        </View>
        <Text style={[styles.text, { fontSize }]} numberOfLines={2}>
          {tile.text}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

export default TileItem;

const styles = StyleSheet.create({
  tileWrap: {
    paddingHorizontal: 1,
    paddingVertical: 1,
  },
  tile: {
    aspectRatio: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  imageWrap: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  image: {
    width: '80%',
    height: '80%',
    borderRadius: 8,
    backgroundColor: '#f0f0f0', // Light background for loading state
  },
  text: {
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
    textAlign: 'center',
    marginTop: 2,
    lineHeight: 18,
  },
});
