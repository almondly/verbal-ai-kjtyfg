
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import TileItem from './TileItem';
import { Tile } from '../types';

interface Props {
  tiles: Tile[];
  onPressTile: (tile: Tile) => void;
  onPressAdd: () => void;
  onRemoveTile: (id: string) => void;
}

function getColumns(width: number): number {
  // Reduce columns to make tiles larger at each breakpoint
  if (width >= 1400) return 8;
  if (width >= 1200) return 7;
  if (width >= 1000) return 6;
  if (width >= 820) return 5;
  if (width >= 680) return 4;
  return 3;
}

export default function CommunicationGrid({ tiles, onPressTile, onPressAdd, onRemoveTile }: Props) {
  const { width } = useWindowDimensions();
  const columns = getColumns(width);
  const itemPercent = 100 / columns; // exact percentage; gutters handled by child padding

  // Show an "Add" tile
  const addTile: Tile = {
    id: '__add__',
    text: 'Add',
    color: '#E5E7EB',
  };

  const items = [addTile, ...tiles];

  return (
    <View style={styles.grid}>
      {items.map((tile) =>
        tile.id === '__add__' ? (
          <TileItem
            key={tile.id}
            tile={tile}
            onPress={() => onPressAdd()}
            isAdd
            itemPercent={itemPercent}
          />
        ) : (
          <TileItem
            key={tile.id}
            tile={tile}
            onPress={() => onPressTile(tile)}
            onLongPress={() => onRemoveTile(tile.id)}
            itemPercent={itemPercent}
          />
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -1, // match TileItem horizontal padding for ultra-tight gutters
    marginTop: -12, // pull grid closer to the CategoryBar
  },
});
