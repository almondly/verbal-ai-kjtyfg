
import { memo, useCallback } from 'react';
import { ScrollView, StyleSheet, View, Platform } from 'react-native';
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
  console.log('🎨 CommunicationGrid rendering with', tiles.length, 'tiles');

  const handleTilePress = useCallback((tile: Tile) => {
    console.log('Tile pressed:', tile.text);
    try {
      onTilePress(tile);
    } catch (error) {
      console.error('Error in onTilePress:', error);
    }
  }, [onTilePress]);

  const handleTileLongPress = useCallback((tile: Tile) => {
    console.log('Tile long pressed:', tile.text);
    try {
      if (onTileLongPress) {
        onTileLongPress(tile);
      }
    } catch (error) {
      console.error('Error in onTileLongPress:', error);
    }
  }, [onTileLongPress]);

  const handleTileEdit = useCallback((tile: Tile) => {
    console.log('Tile edit requested:', tile.text);
    try {
      if (onTileEdit) {
        onTileEdit(tile);
      }
    } catch (error) {
      console.error('Error in onTileEdit:', error);
    }
  }, [onTileEdit]);

  const handleAddTile = useCallback(() => {
    console.log('Add tile pressed');
    try {
      if (onAddTile) {
        onAddTile();
      }
    } catch (error) {
      console.error('Error in onAddTile:', error);
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

  console.log('🎨 Rendering', allTiles.length, 'tiles (including add tile if shown)');

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      // Add web-specific optimizations
      removeClippedSubviews={Platform.OS !== 'web'}
      maxToRenderPerBatch={Platform.OS === 'web' ? 20 : 10}
      updateCellsBatchingPeriod={Platform.OS === 'web' ? 100 : 50}
      initialNumToRender={Platform.OS === 'web' ? 20 : 10}
    >
      <View style={styles.grid}>
        {allTiles.map((tile, index) => {
          try {
            return (
              <TileItem
                key={`${tile.id}-${index}`}
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
            );
          } catch (error) {
            console.error('Error rendering tile:', tile.text, error);
            return null;
          }
        })}
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
