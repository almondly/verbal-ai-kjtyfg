
import { memo, useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, useWindowDimensions, Image, Platform } from 'react-native';
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
  const dimensions = useWindowDimensions();
  const [pictogramError, setPictogramError] = useState(false);
  const [customImageError, setCustomImageError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [dimensionsReady, setDimensionsReady] = useState(false);

  // Ensure component is mounted and dimensions are ready before rendering
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
      setDimensionsReady(true);
    }, 10);
    
    console.log('TileItem mounted:', tile.text);
    
    return () => {
      clearTimeout(timer);
      console.log('TileItem unmounted:', tile.text);
    };
  }, [tile.text]);

  const handlePressIn = () => {
    try {
      // Disable animations on web to prevent crashes
      if (Platform.OS === 'web') {
        return;
      }
      Animated.spring(scale, { 
        toValue: 0.92, 
        useNativeDriver: true, 
        speed: 50, 
        bounciness: 8 
      }).start();
    } catch (error) {
      console.error('Error in handlePressIn:', error);
    }
  };

  const handlePressOut = () => {
    try {
      // Disable animations on web to prevent crashes
      if (Platform.OS === 'web') {
        return;
      }
      Animated.spring(scale, { 
        toValue: 1, 
        useNativeDriver: true, 
        speed: 50, 
        bounciness: 8 
      }).start();
    } catch (error) {
      console.error('Error in handlePressOut:', error);
    }
  };

  // Get the category color for this tile
  const getCategoryColor = () => {
    try {
      if (isAdd) return colors.borderLight;
      
      // First check if tile has a category and find matching category color
      if (tile.category) {
        const category = categories.find(cat => cat.id === tile.category);
        if (category) return category.color;
      }
      
      // Fallback to tile's own color if set
      if (tile.color) return tile.color;
      
      // Final fallback
      return colors.primary;
    } catch (error) {
      console.error('Error in getCategoryColor:', error);
      return colors.primary;
    }
  };

  // FIXED: Reduced font size for better fit with safe fallback
  const getResponsiveFontSize = () => {
    try {
      if (!dimensionsReady) return 20; // Default size during initial render
      
      const width = dimensions.width || 1024; // Fallback width
      if (width >= 1400) return 30;
      if (width >= 1200) return 28;
      if (width >= 1000) return 26;
      if (width >= 820) return 22;
      if (width >= 680) return 20;
      return 14;
    } catch (error) {
      console.error('Error in getResponsiveFontSize:', error);
      return 20;
    }
  };

  const tileColor = getCategoryColor();
  const fontSize = getResponsiveFontSize();

  // Determine which image to display
  // Priority: tile.image (ARASAAC pictograms) > tile.imageUrl > tile.imageUri > NO FALLBACK (except for Add tile)
  const hasPictogram = !isAdd && tile.image && !pictogramError;
  const hasCustomImage = !isAdd && !hasPictogram && (tile.imageUrl || tile.imageUri) && !customImageError;
  const shouldShowIcon = isAdd; // ONLY show icon for the Add tile

  // On web, don't use Animated.View to prevent crashes
  const WrapperComponent = Platform.OS === 'web' ? View : Animated.View;
  const wrapperStyle = Platform.OS === 'web' 
    ? [styles.tileWrap, { width: `${itemPercent}%` }]
    : [styles.tileWrap, { width: `${itemPercent}%`, transform: [{ scale }] }];

  // Don't render until mounted and dimensions are ready
  if (!isMounted || !dimensionsReady) {
    return (
      <View style={[styles.tileWrap, { width: `${itemPercent}%` }]}>
        <View style={[styles.tile, { backgroundColor: tileColor, borderColor: tileColor, borderWidth: 4 }]} />
      </View>
    );
  }

  return (
    <WrapperComponent style={wrapperStyle}>
      <TouchableOpacity
        onPress={() => {
          try {
            onPress();
          } catch (error) {
            console.error('Error in tile onPress:', error);
          }
        }}
        onLongPress={() => {
          try {
            if (onLongPress) {
              onLongPress();
            }
          } catch (error) {
            console.error('Error in tile onLongPress:', error);
          }
        }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
        style={[
          styles.tile, 
          { 
            backgroundColor: tileColor,
            borderColor: tileColor,
            borderWidth: 4,
          }
        ]}
      >
        <View style={styles.iconWrap}>
          {hasPictogram ? (
            <Image
              source={{ 
                uri: tile.image,
                ...(Platform.OS !== 'web' && { cache: 'force-cache' }),
              }}
              style={styles.pictogramImage}
              resizeMode="contain"
              onError={(error) => {
                console.log('Failed to load ARASAAC pictogram for tile:', tile.text, tile.image);
                setPictogramError(true);
              }}
            />
          ) : hasCustomImage ? (
            <Image
              source={{ 
                uri: tile.imageUrl || tile.imageUri,
                ...(Platform.OS !== 'web' && { cache: 'force-cache' }),
              }}
              style={styles.customImage}
              resizeMode="contain"
              onError={(error) => {
                console.log('Failed to load custom image for tile:', tile.text, tile.imageUrl || tile.imageUri);
                setCustomImageError(true);
              }}
            />
          ) : shouldShowIcon ? (
            <Icon name="add-circle" size={80} color={colors.text} />
          ) : null}
        </View>
        <View style={styles.textContainer}>
          <Text 
            style={[styles.text, { fontSize, color: '#000000' }]} 
            numberOfLines={2} 
            ellipsizeMode="tail"
          >
            {tile.text}
          </Text>
        </View>
      </TouchableOpacity>
    </WrapperComponent>
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
    ...(Platform.OS === 'web' 
      ? { boxShadow: '0px 3px 10px rgba(0,0,0,0.12)' } 
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.12,
          shadowRadius: 10,
          elevation: 5,
        }
    ),
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
    lineHeight: 24,
    paddingHorizontal: 2,
  },
});
