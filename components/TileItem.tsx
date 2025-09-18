
import { memo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
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

  const bg = getCategoryColor();

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
            boxShadow: `0px 0px 15px ${bg}`,
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
              // Add loading fallback and error handling for better UX
              onError={() => console.log(`Failed to load image for tile: ${tile.text}`)}
            />
          ) : (
            <Icon name="chatbubble-ellipses-outline" size={34} color={colors.text} />
          )}
        </View>
        <Text style={styles.text} numberOfLines={2}>
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
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
    marginTop: 2,
    lineHeight: 14,
  },
});
