
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tile } from '../types';
import { defaultTiles } from '../data/defaultTiles';

const LIBRARY_KEY = 'aac_tiles_v1';
const SEED_VERSION_KEY = 'aac_tiles_seed_version';
const CURRENT_SEED_VERSION = 2;

function mergeMissingDefaults(stored: Tile[], defaults: Tile[]): Tile[] {
  // Keep user tiles intact; add any missing defaults by id
  const map = new Map<string, Tile>();
  for (const t of stored) map.set(t.id, t);
  for (const d of defaults) {
    if (!map.has(d.id)) {
      map.set(d.id, d);
    }
  }
  return Array.from(map.values());
}

export function useLibrary() {
  const [tiles, setTiles] = useState<Tile[]>(defaultTiles);

  useEffect(() => {
    (async () => {
      try {
        const [raw, rawSeed] = await Promise.all([
          AsyncStorage.getItem(LIBRARY_KEY),
          AsyncStorage.getItem(SEED_VERSION_KEY),
        ]);

        let loadedTiles: Tile[] | null = null;
        if (raw) {
          try {
            const parsed = JSON.parse(raw) as Tile[];
            if (Array.isArray(parsed)) {
              loadedTiles = parsed;
            }
          } catch (e) {
            console.log('Failed to parse stored tiles, using defaults', e);
          }
        }

        const seedVersion = parseInt(rawSeed || '0', 10) || 0;

        if (!loadedTiles) {
          // No saved tiles: seed with defaults and mark version
          console.log('Seeding tiles for the first time');
          setTiles(defaultTiles);
          await AsyncStorage.setItem(LIBRARY_KEY, JSON.stringify(defaultTiles));
          await AsyncStorage.setItem(SEED_VERSION_KEY, String(CURRENT_SEED_VERSION));
          return;
        }

        if (seedVersion < CURRENT_SEED_VERSION) {
          // Migrate: merge in any missing defaults
          console.log(
            `Migrating tiles: seedVersion ${seedVersion} -> ${CURRENT_SEED_VERSION}`
          );
          const merged = mergeMissingDefaults(loadedTiles, defaultTiles);
          setTiles(merged);
          await AsyncStorage.setItem(LIBRARY_KEY, JSON.stringify(merged));
          await AsyncStorage.setItem(SEED_VERSION_KEY, String(CURRENT_SEED_VERSION));
        } else {
          setTiles(loadedTiles);
        }
      } catch (e) {
        console.log('load tiles error', e);
        // Fallback to defaults if anything goes wrong
        setTiles(defaultTiles);
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

  const resetTiles = async () => {
    try {
      setTiles(defaultTiles);
      await AsyncStorage.setItem(LIBRARY_KEY, JSON.stringify(defaultTiles));
      await AsyncStorage.setItem(SEED_VERSION_KEY, String(CURRENT_SEED_VERSION));
    } catch (e) {
      console.log('reset tiles error', e);
    }
  };

  return { tiles, addTile, removeTile, resetTiles };
}
