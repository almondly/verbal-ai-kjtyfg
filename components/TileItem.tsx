
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
  const [imageError, setImageError] = useState(false);

  const handlePressIn = () => {
    Animated.spring(scale, { 
      toValue: 0.95, 
      useNativeDriver: true, 
      speed: 50, 
      bounciness: 4 
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { 
      toValue: 1, 
      useNativeDriver: true, 
      speed: 50, 
      bounciness: 4 
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
    return colors.borderLight;
  };

  // Responsive font size - AAC style (larger and bolder)
  const getResponsiveFontSize = () => {
    if (width >= 1400) return 18;
    if (width >= 1200) return 17;
    if (width >= 1000) return 16;
    if (width >= 820) return 15;
    if (width >= 680) return 14;
    return 13;
  };

  // Responsive image size - AAC style (larger images)
  const getResponsiveImageSize = () => {
    if (width >= 1400) return 90;
    if (width >= 1200) return 80;
    if (width >= 1000) return 70;
    if (width >= 820) return 65;
    if (width >= 680) return 60;
    return 55;
  };

  const borderColor = getCategoryColor();
  const fontSize = getResponsiveFontSize();
  const imageSize = getResponsiveImageSize();

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
        activeOpacity={0.85}
        style={[
          styles.tile, 
          { 
            backgroundColor: colors.backgroundAlt,
            borderColor: borderColor,
            borderWidth: 3,
          }
        ]}
      >
        <View style={styles.imageWrap}>
          {isAdd ? (
            <Icon name="add-circle-outline" size={imageSize * 0.6} color={colors.text} />
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
            <Icon name="chatbubble-ellipses-outline" size={imageSize * 0.6} color={colors.textSecondary} />
          )}
        </View>
        <View style={styles.textContainer}>
          <Text 
            style={[styles.text, { fontSize }]} 
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
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    boxShadow: '0px 2px 4px rgba(0,0,0,0.15)',
  },
  imageWrap: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
  },
  text: {
    fontFamily: 'Montserrat_700Bold',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 4,
  },
});
