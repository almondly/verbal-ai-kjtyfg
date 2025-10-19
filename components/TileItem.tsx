
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
  itemPercent = 20,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const { width } = useWindowDimensions();
  const [pictogramError, setPictogramError] = useState(false);
  const [customImageError, setCustomImageError] = useState(false);

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

  // Responsive font size - SIGNIFICANTLY INCREASED for better readability
  const getResponsiveFontSize = () => {
    if (width >= 1400) return 40;
    if (width >= 1200) return 38;
    if (width >= 1000) return 36;
    if (width >= 820) return 30;
    if (width >= 680) return 29;
    return 16;
  };

  const tileColor = getCategoryColor();
  const fontSize = getResponsiveFontSize();

  // Determine which image to display
  // Priority: tile.image (ARASAAC pictograms) > tile.imageUrl > tile.imageUri > NO FALLBACK (except for Add tile)
  const hasPictogram = !isAdd && tile.image && !pictogramError;
  const hasCustomImage = !isAdd && !hasPictogram && (tile.imageUrl || tile.imageUri) && !customImageError;
  const shouldShowIcon = isAdd; // ONLY show icon for the Add tile

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
            borderWidth: 40,
          }
        ]}
      >
        <View style={styles.iconWrap}>
          {hasPictogram ? (
            <Image
              source={{ uri: tile.image }}
              style={styles.pictogramImage}
              resizeMode="contain"
              onError={(error) => {
                console.log('Failed to load ARASAAC pictogram for tile:', tile.text, tile.image, error.nativeEvent.error);
                setPictogramError(true);
              }}
            />
          ) : hasCustomImage ? (
            <Image
              source={{ uri: tile.imageUrl || tile.imageUri }}
              style={styles.customImage}
              resizeMode="contain"
              onError={(error) => {
                console.log('Failed to load custom image for tile:', tile.text, tile.imageUrl || tile.imageUri, error.nativeEvent.error);
                setCustomImageError(true);
              }}
            />
          ) : shouldShowIcon ? (
            <Icon name="add-circle" size={80} color={tileColor} />
          ) : null}
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
    padding: 3,
  },
  tile: {
    aspectRatio: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 6,
    boxShadow: '0px 3px 10px rgba(0,0,0,0.12)',
  },
  iconWrap: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  pictogramImage: {
    width: '100%',
    height: '100%',
    maxWidth: 200,
    maxHeight: 200,
  },
  customImage: {
    width: '100%',
    height: '100%',
    maxWidth: 200,
    maxHeight: 200,
    borderRadius: 8,
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 30,
  },
  text: {
    fontFamily: 'Montserrat_700Bold',
    textAlign: 'center',
    lineHeight: 70,
    paddingHorizontal: 2,
  },
});
