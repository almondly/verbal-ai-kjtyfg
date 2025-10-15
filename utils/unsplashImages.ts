
/**
 * Unsplash Image Fetcher
 * Fetches relevant images from Unsplash for pictogram tiles
 */

const UNSPLASH_ACCESS_KEY = 'your_unsplash_access_key_here'; // Note: In production, use environment variables

interface UnsplashImage {
  id: string;
  urls: {
    small: string;
    regular: string;
    thumb: string;
  };
  alt_description: string;
}

/**
 * Fetch an Unsplash image for a given word
 * Uses a free public API endpoint that doesn't require authentication
 */
export async function fetchUnsplashImage(word: string): Promise<string | null> {
  try {
    // Use Unsplash Source API (no authentication required)
    // This provides a random image matching the query
    const imageUrl = `https://source.unsplash.com/300x300/?${encodeURIComponent(word)}`;
    
    console.log('Fetching Unsplash image for:', word, '→', imageUrl);
    return imageUrl;
  } catch (error) {
    console.error('Error fetching Unsplash image:', error);
    return null;
  }
}

/**
 * Fetch Unsplash images for multiple words in batch
 */
export async function fetchUnsplashImagesForTiles(words: string[]): Promise<Map<string, string>> {
  const imageMap = new Map<string, string>();
  
  for (const word of words) {
    const imageUrl = await fetchUnsplashImage(word);
    if (imageUrl) {
      imageMap.set(word.toLowerCase(), imageUrl);
    }
  }
  
  return imageMap;
}

/**
 * Get a cached or fetch new Unsplash image URL
 */
export function getUnsplashImageUrl(word: string): string {
  // Generate a consistent Unsplash Source URL for the word
  // This ensures the same word always gets a similar image
  const cleanWord = word.toLowerCase().trim();
  return `https://source.unsplash.com/300x300/?${encodeURIComponent(cleanWord)}`;
}

/**
 * Preload Unsplash images for better performance
 */
export async function preloadUnsplashImages(words: string[]): Promise<void> {
  const promises = words.map(word => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.src = getUnsplashImageUrl(word);
      img.onload = () => resolve();
      img.onerror = () => resolve(); // Resolve even on error to not block
    });
  });
  
  await Promise.all(promises);
  console.log('Preloaded', words.length, 'Unsplash images');
}
