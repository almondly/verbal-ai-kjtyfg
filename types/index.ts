
export type Tile = {
  id: string;
  text: string;
  color?: string;
  imageUri?: string;
  imageUrl?: string; // NEW: Custom image URL for tiles
  category?: string; // folder/category id
};

export type Category = {
  id: string;
  label: string;
  color: string;
  icon: string; // Ionicons name
};
