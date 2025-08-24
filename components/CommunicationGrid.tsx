
import { View, StyleSheet } from 'react-native';
import TileItem from './TileItem';
import { Tile } from '../types';
import { colors } from '../styles/commonStyles';

interface Props {
  tiles: Tile[];
  onPressTile: (tile: Tile) => void;
  onPressAdd: () => void;
  onRemoveTile: (id: string) => void;
}

export default function CommunicationGrid({ tiles, onPressTile, onPressAdd, onRemoveTile }: Props) {
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
          />
        ) : (
          <TileItem
            key={tile.id}
            tile={tile}
            onPress={() => onPressTile(tile)}
            onLongPress={() => onRemoveTile(tile.id)}
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
    gap: 12 as any,
    paddingTop: 12,
  },
});
