
import { memo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, useWindowDimensions, Image } from 'react-native';
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
  const [imageError, setImageError] = useState(false);

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
    if (width >= 1400) return 16; // Large tablets/desktops
    if (width >= 1200) return 15; // Medium tablets
    if (width >= 1000) return 14; // Small tablets
    if (width >= 820) return 13;  // Large phones landscape
    if (width >= 680) return 12;  // Medium phones landscape
    return 11; // Small phones
  };

  // Responsive image size based on screen width
  const getResponsiveImageSize = () => {
    if (width >= 1400) return 80; // Large tablets/desktops
    if (width >= 1200) return 70; // Medium tablets
    if (width >= 1000) return 60; // Small tablets
    if (width >= 820) return 55;  // Large phones landscape
    if (width >= 680) return 50;  // Medium phones landscape
    return 45; // Small phones
  };

  const bg = getCategoryColor();
  const fontSize = getResponsiveFontSize();
  const imageSize = getResponsiveImageSize();

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
          ) : tile.imageUri && !imageError ? (
            <Image
              source={{ uri: tile.imageUri }}
              style={{ width: imageSize, height: imageSize }}
              resizeMode="contain"
              onError={(error) => {
                console.log(`Failed to load image for tile: ${tile.text}`, error.nativeEvent.error);
                setImageError(true);
              }}
            />
          ) : (
            <Icon name="chatbubble-ellipses-outline" size={34} color={colors.text} />
          )}
        </View>
        <Text style={[styles.text, { fontSize }]} numberOfLines={2} ellipsizeMode="tail">
          {tile.text}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

export default TileItem;

const styles = StyleSheet.create({
  tileWrap: {
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  tile: {
    aspectRatio: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  imageWrap: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  text: {
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
    textAlign: 'center',
    marginTop: 2,
    lineHeight: 16,
    paddingHorizontal: 2,
  },
});
