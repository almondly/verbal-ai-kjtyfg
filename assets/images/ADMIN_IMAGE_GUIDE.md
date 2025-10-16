
# Admin Image Management Guide

## Overview
This guide explains how you (the admin) can manage and upload custom images for the app. Users (children) **cannot** upload or modify images - only you can do this through the Settings screen.

## Where to Place Your Custom Images

### Option 1: Local Assets Folder (Recommended for App Distribution)
Place your PNG images in the `assets/images/` directory:

```
assets/
  images/
    your-custom-image-1.png
    your-custom-image-2.png
    bathroom-icon.png
    food-icon.png
    etc.
```

Then reference them in the code using:
```typescript
imageUrl: require('../../assets/images/your-custom-image-1.png')
```

### Option 2: Remote URLs (Recommended for Easy Updates)
Host your images on a CDN or image hosting service and use the direct URL:

```
https://your-cdn.com/images/bathroom-icon.png
https://your-cdn.com/images/food-icon.png
```

Then use these URLs directly in the Settings > Default Tiles editor.

## How to Update Tile Images (Admin Only)

### Method 1: Through Settings Screen
1. Open the app and navigate to **Settings**
2. Go to the **Default Tiles** tab
3. Tap on any tile you want to edit
4. In the Image section, you can:
   - **Enter a direct URL** in the "Image URL (Direct Edit)" field
   - **Browse ARASAAC pictograms** for consistent Baby ARASAAC style images
5. Save your changes

### Method 2: Programmatically Update Default Tiles
Edit the `data/defaultTiles.ts` file to include your custom image URLs:

```typescript
export const defaultTiles: Tile[] = [
  {
    id: 'bathroom',
    text: 'bathroom',
    category: 'home',
    imageUrl: 'https://your-cdn.com/images/bathroom-icon.png',
    // or use local asset:
    // imageUrl: require('../assets/images/bathroom-icon.png')
  },
  // ... more tiles
];
```

## Image Requirements

### Format
- **PNG** format recommended for transparency
- **JPG** also supported for photos

### Size
- Recommended: **256x256 pixels** or **512x512 pixels**
- Maximum: **1024x1024 pixels** (larger images will be scaled down)
- Aspect ratio: **1:1 (square)** works best

### Style Guidelines
- Use clear, simple icons that are easy to recognize
- High contrast for visibility
- Consistent style across all images
- Consider using Baby ARASAAC pictograms for consistency

## User Restrictions

### What Users CANNOT Do:
- ❌ Upload custom images from their device
- ❌ Change existing tile images
- ❌ Access the device photo gallery
- ❌ Modify branding or visual elements

### What Users CAN Do:
- ✅ Select from pre-loaded ARASAAC pictograms (when adding new tiles)
- ✅ Choose colors for tiles
- ✅ Add text phrases
- ✅ Select categories

## ARASAAC Pictogram Integration

The app uses the ARASAAC API to provide consistent pictograms:
- All pictograms use the **Baby ARASAAC** style
- Pictograms are fetched from: `https://api.arasaac.org/v1/pictograms/`
- Users can browse and select from thousands of pictograms
- All pictograms maintain visual consistency

## Best Practices

1. **Consistency**: Use the same style for all custom images
2. **Clarity**: Ensure images are clear and recognizable at small sizes
3. **Testing**: Test images on different screen sizes
4. **Backup**: Keep copies of all custom images in a safe location
5. **Documentation**: Maintain a list of which images are used for which tiles

## Example: Adding a Custom Image Set

1. Create your images (e.g., bathroom.png, kitchen.png, bedroom.png)
2. Upload them to your CDN or place in `assets/images/`
3. Open Settings > Default Tiles
4. For each tile:
   - Tap the tile
   - Enter the image URL or select from pictograms
   - Save changes
5. Test the tiles in the communication screen

## Troubleshooting

### Image Not Displaying
- Check the URL is correct and accessible
- Verify the image format (PNG/JPG)
- Ensure the image is not too large (>2MB)
- Check network connectivity for remote URLs

### Image Quality Issues
- Use higher resolution source images
- Ensure images are square (1:1 aspect ratio)
- Avoid overly complex images with fine details

## Support

For technical assistance with image management, refer to:
- `components/TileEditor.tsx` - Tile editing interface
- `components/TileItem.tsx` - Tile display logic
- `data/defaultTiles.ts` - Default tile definitions
