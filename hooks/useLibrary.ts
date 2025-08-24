
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tile } from '../types';
import { defaultTiles } from '../data/defaultTiles';

const LIBRARY_KEY = 'aac_tiles_v1';

export function useLibrary() {
  const [tiles, setTiles] = useState<Tile[]>(defaultTiles);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(LIBRARY_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Tile[];
          if (Array.isArray(parsed)) {
            setTiles(parsed);
          }
        }
      } catch (e) {
        console.log('load tiles error', e);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(LIBRARY_KEY, JSON.stringify(tiles));
      } catch (e) {
        console.log('save tiles error', e);
      }
    })();
  }, [tiles]);

  const addTile = (tile: Tile) => {
    setTiles(prev => [tile, ...prev]);
  };

  const removeTile = (id: string) => {
    setTiles(prev => prev.filter(t => t.id !== id));
  };

  const resetTiles = () => {
    setTiles(defaultTiles);
  };

  return { tiles, addTile, removeTile, resetTiles };
}
