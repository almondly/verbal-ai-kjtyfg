
export type Tile = {
  id: string;
  text: string;
  color?: string;
  image?: string; // ARASAAC pictogram URL
  imageUri?: string; // Local image URI (from image picker)
  imageUrl?: string; // Custom image URL for tiles
  category?: string; // folder/category id
};

export type Category = {
  id: string;
  label: string;
  color: string;
  icon: string; // Ionicons name
};
