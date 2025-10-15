
# Admin Branding Images Guide

This folder contains the fixed branding images used throughout the COMpanion app. Users (children) cannot modify or upload their own images - only administrators can update these files.

## How to Add Your Own Branding Images

### 1. Main Logo / Front Page Image

**File Location:** `assets/images/natively-dark.png`

**Usage:** This image appears on the main menu screen when the app starts.

**Specifications:**
- Format: PNG (recommended for transparency)
- Recommended size: 512x512 pixels or larger
- Aspect ratio: Square or landscape (16:9)
- File size: Keep under 5MB for optimal performance

**To Update:**
1. Replace the `natively-dark.png` file with your own PNG image
2. Keep the same filename, or update the import in `app/main-menu.tsx`:
   ```typescript
   const ADMIN_LOGO = require('../assets/images/your-logo-name.png');
   ```

### 2. Additional Branding Images

You can add more branding images for different sections of the app:

**Example locations:**
- `assets/images/branding/home-background.png` - Background for home screen
- `assets/images/branding/communication-header.png` - Header for communication screen
- `assets/images/branding/settings-icon.png` - Custom settings icon

**To Use Additional Images:**
1. Place your PNG files in `assets/images/` or `assets/images/branding/`
2. Import them in the relevant component file:
   ```typescript
   const CUSTOM_IMAGE = require('../assets/images/branding/your-image.png');
   ```
3. Display using the Image component:
   ```typescript
   <Image 
     source={CUSTOM_IMAGE} 
     style={{ width: 200, height: 200 }}
     resizeMode="contain"
   />
   ```

## Image Best Practices

### File Formats
- **PNG**: Best for logos, icons, and images with transparency
- **JPG**: Good for photos and complex images without transparency
- **SVG**: Not directly supported in React Native (convert to PNG)

### Optimization
- Use image compression tools to reduce file size
- Recommended tools:
  - TinyPNG (https://tinypng.com/)
  - ImageOptim (Mac)
  - Squoosh (https://squoosh.app/)

### Responsive Design
- Provide high-resolution images (2x or 3x) for retina displays
- Use `resizeMode` prop to control how images scale:
  - `contain`: Fit entire image within bounds
  - `cover`: Fill entire space, may crop
  - `stretch`: Stretch to fill (may distort)

### Accessibility
- Ensure sufficient contrast for visibility
- Test images on both light and dark backgrounds
- Consider color-blind users when choosing colors

## Current Branding Images

### Main Logo
- **File:** `natively-dark.png`
- **Used in:** Main menu screen
- **Size:** Scales to 70% of screen height
- **Purpose:** Primary app branding and identity

### Emotion Faces
- **Implementation:** Programmatic (code-based, not image files)
- **Location:** `components/EmotionFace.tsx`
- **Purpose:** Display user's current emotional state
- **Note:** These are NOT customizable via image upload - they use fixed code-based designs

## Security Notes

- Users (children) cannot upload or modify these images through the app interface
- All branding images must be added by administrators with file system access
- The "Branding" settings tab has been removed to prevent user modifications
- Images are bundled with the app at build time for security and consistency

## Need Help?

If you need assistance adding or updating branding images:
1. Ensure your images meet the specifications above
2. Test images on multiple screen sizes
3. Verify images display correctly in both portrait and landscape orientations
4. Check console logs for any image loading errors

## Version History

- **v1.0** - Initial branding system with fixed admin-controlled images
- Removed user image upload functionality
- Implemented secure, consistent branding across all screens
