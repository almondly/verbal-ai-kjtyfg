
import { memo, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Tile } from '../types';
import TileItem from './TileItem';

interface Props {
  tiles: Tile[];
  onTilePress: (tile: Tile) => void;
  onTileLongPress?: (tile: Tile) => void;
  onTileEdit?: (tile: Tile) => void;
  onAddTile?: () => void;
  selectedCategory?: string;
}

const CommunicationGrid = memo(function CommunicationGrid({
  tiles,
  onTilePress,
  onTileLongPress,
  onTileEdit,
  onAddTile,
  selectedCategory,
}: Props) {
  const handleTileLongPress = useCallback((tile: Tile) => {
    if (tile.id.startsWith('custom-')) {
      Alert.alert(
        'Tile Options',
        'What would you like to do with this tile?',
        [
          {
            text: 'Edit',
            onPress: () => onTileEdit?.(tile),
          },
          {
            text: 'Delete',
            onPress: () => onTileLongPress?.(tile),
            style: 'destructive',
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    } else {
      // For default tiles, allow editing to add pictograms
      Alert.alert(
        'Edit Tile',
        'Would you like to customize this tile?',
        [
          {
            text: 'Edit',
            onPress: () => onTileEdit?.(tile),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    }
  }, [onTileLongPress, onTileEdit]);

  // PERFORMANCE: Add "Add Tile" button to the data array
  const dataWithAddButton = selectedCategory && selectedCategory !== 'all' && onAddTile
    ? [...tiles, {
        id: 'add-tile',
        text: 'Add Tile',
        color: '#E5E7EB',
      } as Tile]
    : tiles;

  // PERFORMANCE: Use FlatList for better performance with many tiles
  const renderItem = useCallback(({ item }: { item: Tile }) => {
    if (item.id === 'add-tile') {
      return (
        <TileItem
          tile={item}
          onPress={onAddTile!}
          isAdd
          itemPercent={20}
        />
      );
    }
    
    return (
      <TileItem
        key={item.id}
        tile={item}
        onPress={() => onTilePress(item)}
        onLongPress={() => handleTileLongPress(item)}
        itemPercent={20}
      />
    );
  }, [onTilePress, handleTileLongPress, onAddTile]);

  const keyExtractor = useCallback((item: Tile) => item.id, []);

  return (
    <FlatList
      data={dataWithAddButton}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={5}
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      // PERFORMANCE: Optimize rendering
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      initialNumToRender={15}
      windowSize={5}
      // PERFORMANCE: Use getItemLayout for better scrolling performance
      getItemLayout={(data, index) => ({
        length: 120, // Approximate item height
        offset: 120 * Math.floor(index / 5),
        index,
      })}
    />
  );
});

export default CommunicationGrid;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 30,
    paddingTop: 8,
  },
});
