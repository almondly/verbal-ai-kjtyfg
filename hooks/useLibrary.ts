
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tile } from '../types';
import { defaultTiles } from '../data/defaultTiles';

const LIBRARY_KEY = 'aac_tiles_v1';
const SEED_VERSION_KEY = 'aac_tiles_seed_version';
const CURRENT_SEED_VERSION = 9; // Incremented to refresh pictograms with larger sizes and better loading

function mergeMissingDefaults(stored: Tile[], defaults: Tile[]): Tile[] {
  // Create a map of default tiles by ID for quick lookup
  const defaultsMap = new Map<string, Tile>();
  for (const d of defaults) {
    defaultsMap.set(d.id, d);
  }

  // Update stored tiles with new default properties (especially images)
  const updatedTiles = stored.map(storedTile => {
    const defaultTile = defaultsMap.get(storedTile.id);
    if (defaultTile) {
      // If this is a default tile, update it with the latest default properties
      // Priority: user's custom imageUri > user's custom imageUrl > default image
      const hasCustomImage = storedTile.imageUri || (storedTile.imageUrl && storedTile.imageUrl !== defaultTile.imageUrl);
      
      return {
        ...defaultTile, // Start with all default properties
        // Preserve custom user images if they exist
        imageUri: storedTile.imageUri,
        imageUrl: hasCustomImage ? storedTile.imageUrl : defaultTile.imageUrl,
        // Only override the default image if user has a custom image
        image: hasCustomImage ? undefined : defaultTile.image,
      };
    }
    // Keep custom tiles as-is
    return storedTile;
  });

  // Add any new default tiles that don't exist in stored tiles
  const storedIds = new Set(stored.map(t => t.id));
  for (const defaultTile of defaults) {
    if (!storedIds.has(defaultTile.id)) {
      updatedTiles.push(defaultTile);
    }
  }

  return updatedTiles;
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
          console.log('🎨 Seeding tiles for the first time with colorful ARASAAC pictograms');
          setTiles(defaultTiles);
          await AsyncStorage.setItem(LIBRARY_KEY, JSON.stringify(defaultTiles));
          await AsyncStorage.setItem(SEED_VERSION_KEY, String(CURRENT_SEED_VERSION));
          return;
        }

        if (seedVersion < CURRENT_SEED_VERSION) {
          // Migrate: merge in any missing defaults AND update existing tiles with new images
          console.log(
            `🔄 Migrating tiles: seedVersion ${seedVersion} -> ${CURRENT_SEED_VERSION} - Refreshing pictograms with larger sizes`
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

  const updateTile = (updatedTile: Tile) => {
    setTiles(prev => prev.map(t => t.id === updatedTile.id ? updatedTile : t));
  };

  const removeTile = (id: string) => {
    setTiles(prev => prev.filter(t => t.id !== id));
  };

  const resetTiles = async () => {
    try {
      console.log('🔄 Resetting tiles to colorful ARASAAC pictograms');
      setTiles(defaultTiles);
      await AsyncStorage.setItem(LIBRARY_KEY, JSON.stringify(defaultTiles));
      await AsyncStorage.setItem(SEED_VERSION_KEY, String(CURRENT_SEED_VERSION));
    } catch (e) {
      console.log('reset tiles error', e);
    }
  };

  return { tiles, addTile, updateTile, removeTile, resetTiles };
}
