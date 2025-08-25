
import { memo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { Tile } from '../types';
import { colors } from '../styles/commonStyles';
import Icon from './Icon';

interface Props {
  tile: Tile;
  onPress: () => void;
  onLongPress?: () => void;
  isAdd?: boolean;
  itemPercent?: number; // dynamic width from grid for responsive columns
}

const TileItem = memo(function TileItem({ tile, onPress, onLongPress, isAdd, itemPercent = 31 }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 50, bounciness: 8 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 8 }).start();
  };

  const bg = isAdd ? '#F3F4F6' : tile.color || '#FFFFFF';

  return (
    <Animated.View style={[styles.tileWrap, { width: `${itemPercent}%`, transform: [{ scale }] }]}>
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
        style={[styles.tile, { backgroundColor: bg }]}
      >
        <View style={styles.imageWrap}>
          {isAdd ? (
            <Icon name="add-circle-outline" size={28} color={colors.text} />
          ) : tile.imageUri ? (
            <Image source={{ uri: tile.imageUri }} style={styles.image} resizeMode="cover" />
          ) : (
            <Icon name="chatbubble-ellipses-outline" size={28} color={colors.text} />
          )}
        </View>
        <Text style={styles.text}>{tile.text}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

export default TileItem;

const styles = StyleSheet.create({
  tileWrap: {
    paddingHorizontal: 2,
    paddingVertical: 1,
  },
  tile: {
    aspectRatio: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    boxShadow: '0px 8px 16px rgba(0,0,0,0.07)',
  },
  imageWrap: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '70%',
    height: '70%',
    borderRadius: 10,
  },
  text: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 13,
    color: colors.text,
    textAlign: 'center',
    marginTop: 1,
  },
});
