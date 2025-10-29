
import { memo, useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
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
  const handleTilePress = useCallback((tile: Tile) => {
    onTilePress(tile);
  }, [onTilePress]);

  const handleTileLongPress = useCallback((tile: Tile) => {
    if (onTileLongPress) {
      onTileLongPress(tile);
    }
  }, [onTileLongPress]);

  const handleTileEdit = useCallback((tile: Tile) => {
    if (onTileEdit) {
      onTileEdit(tile);
    }
  }, [onTileEdit]);

  const handleAddTile = useCallback(() => {
    if (onAddTile) {
      onAddTile();
    }
  }, [onAddTile]);

  // Add tile for adding new tiles (only show in specific categories, not 'all' or 'keyboard')
  const showAddTile = selectedCategory && selectedCategory !== 'all' && selectedCategory !== 'keyboard';
  const addTile: Tile = {
    id: 'add-tile',
    text: 'Add Tile',
    color: '#E0E0E0',
    category: selectedCategory || 'core',
  };

  const allTiles = showAddTile ? [...tiles, addTile] : tiles;

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      onScroll={() => {
        // This will be handled by the parent's PanResponder
        // The parent component should pass resetTimer as a prop if needed
      }}
      scrollEventThrottle={16}
    >
      <View style={styles.grid}>
        {allTiles.map((tile) => (
          <TileItem
            key={tile.id}
            tile={tile}
            onPress={() => {
              if (tile.id === 'add-tile') {
                handleAddTile();
              } else {
                handleTilePress(tile);
              }
            }}
            onLongPress={() => {
              if (tile.id !== 'add-tile') {
                handleTileEdit(tile);
              }
            }}
            isAdd={tile.id === 'add-tile'}
            itemPercent={20}
          />
        ))}
      </View>
    </ScrollView>
  );
});

export default CommunicationGrid;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
});
