
import { memo, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
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

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.grid}>
        {tiles.map((tile) => (
          <TileItem
            key={tile.id}
            tile={tile}
            onPress={() => onTilePress(tile)}
            onLongPress={() => handleTileLongPress(tile)}
            itemPercent={20}
          />
        ))}
        {selectedCategory && selectedCategory !== 'all' && onAddTile && (
          <TileItem
            tile={{
              id: 'add-tile',
              text: 'Add Tile',
              color: '#E5E7EB',
            }}
            onPress={onAddTile}
            isAdd
            itemPercent={20}
          />
        )}
      </View>
    </ScrollView>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
});
