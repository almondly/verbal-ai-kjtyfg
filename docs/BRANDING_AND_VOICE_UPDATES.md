
# Branding and Voice Updates - Implementation Guide

## Overview

This document describes the recent updates to image handling and text-to-speech (TTS) voice configuration in the COMpanion app. These changes enhance security, consistency, and accessibility by removing user-controlled image uploads and fixing voice selection issues.

## Changes Implemented

### 1. Image Handling Overhaul

#### Removed Features
- ✅ **Removed "Branding" tab** from Settings menu
- ✅ **Disabled all user image upload** functionality
- ✅ **Removed custom emotion image uploads** - emotions now use fixed programmatic designs
- ✅ **Removed front page image picker** from settings

#### New Features
- ✅ **Admin-controlled branding images** stored in `assets/images/`
- ✅ **Fixed logo display** on main menu using `natively-dark.png`
- ✅ **Programmatic emotion faces** that cannot be modified by users
- ✅ **Branding guide** documentation in `assets/images/BRANDING_GUIDE.md`

#### Benefits
- **Security**: Users cannot upload inappropriate images
- **Consistency**: All users see the same branding and visual design
- **Performance**: Images are bundled at build time, no runtime loading
- **Accessibility**: Fixed designs ensure proper contrast and visibility

### 2. Text-to-Speech (TTS) Voice Fixes

#### Issues Resolved
- ✅ **Fixed male voice** - now properly uses male-sounding system voices
- ✅ **Fixed female voice** - now properly uses female-sounding system voices
- ✅ **Fixed neutral voice** - uses default system voice
- ✅ **Platform-specific voice selection** for iOS and Android

#### Implementation Details

**Voice Mapping System:**
```typescript
// iOS Voice Identifiers
- Male: Alex, Daniel
- Female: Samantha, Karen, Victoria
- Neutral: System default

// Android Voice Identifiers
- Male: Enhanced quality male voices
- Female: Female-labeled voices
- Neutral: System default
```

**Voice Selection Logic:**
1. User selects "Male", "Female", or "Neutral" in settings
2. System finds best matching voice from available system voices
3. Falls back to default voice if specific voice not found
4. Applies pitch and rate settings consistently

#### Benefits
- **Clarity**: Distinct male, female, and neutral voice options
- **Reliability**: Proper voice selection on both iOS and Android
- **Accessibility**: Clear voice differentiation for users
- **Consistency**: Same voice experience across sessions

### 3. Color Label Fix

#### Issue Resolved
- ✅ **Fixed yellow/orange swap** in AI Preferences

**Before:**
- Yellow label showed orange color (#FFA07A)
- Orange label showed yellow color (#F7DC6F)

**After:**
- Yellow label correctly shows yellow color (#F7DC6F)
- Orange label correctly shows orange color (#FFA07A)

## File Changes Summary

### Modified Files

1. **app/settings.tsx**
   - Removed "Branding" tab from settings
   - Removed image upload functionality
   - Removed front page image picker
   - Cleaned up unused imports

2. **app/main-menu.tsx**
   - Updated to use fixed admin logo from assets
   - Removed AsyncStorage image loading
   - Simplified image display logic

3. **hooks/useTTSSettings.ts**
   - Added system voice detection
   - Implemented voice mapping for male/female/neutral
   - Added platform-specific voice selection
   - Improved voice testing functionality

4. **hooks/useAIPreferences.ts**
   - Fixed yellow/orange color values
   - Corrected color labels in preferences

5. **components/EmotionFace.tsx**
   - Removed custom image upload support
   - Simplified to use only programmatic designs
   - Removed AsyncStorage custom emotion loading

### New Files

1. **assets/images/BRANDING_GUIDE.md**
   - Complete guide for administrators
   - Instructions for adding custom branding images
   - Best practices and specifications
   - Security notes

2. **docs/BRANDING_AND_VOICE_UPDATES.md**
   - This file - implementation documentation
   - Change summary and benefits
   - Usage instructions

## How to Add Custom Branding Images

### For Administrators

1. **Prepare Your Images**
   - Format: PNG (recommended)
   - Size: 512x512 pixels or larger
   - Keep file size under 5MB
   - Ensure high contrast for visibility

2. **Add to Assets Folder**
   ```
   assets/
     images/
       your-logo.png
       branding/
         header-image.png
         background.png
   ```

3. **Update Code References**
   
   In `app/main-menu.tsx`:
   ```typescript
   const ADMIN_LOGO = require('../assets/images/your-logo.png');
   ```

4. **Test on Multiple Devices**
   - Check landscape and portrait orientations
   - Verify on different screen sizes
   - Test in light and dark modes

### Image Specifications

**Main Logo (Main Menu):**
- Location: `assets/images/natively-dark.png`
- Display size: 70% of screen height
- Aspect ratio: Square or landscape
- Format: PNG with transparency

**Additional Branding:**
- Place in `assets/images/branding/`
- Use descriptive filenames
- Follow same specifications as main logo

## TTS Voice Configuration

### For Users

1. **Open Settings**
   - Navigate to Settings → Voice tab

2. **Select Voice Type**
   - Choose from: Male, Female, or Neutral
   - Tap "Test" button to hear voice

3. **Adjust Settings**
   - Speech Rate: 0.1 to 2.0 (default: 1.0)
   - Pitch: 0.5 to 2.0 (default: 1.0)

### For Developers

**Voice Selection Process:**
```typescript
// 1. User selects voice type
handleVoiceSelect('male', 'Male Voice', 'en-US');

// 2. System finds best matching voice
const voiceIdentifier = findBestVoice('male');

// 3. Voice is applied to speech
Speech.speak(text, {
  voice: voiceIdentifier,
  pitch: 1.0,
  rate: 1.0,
  language: 'en-US'
});
```

**Adding More Voice Options:**
```typescript
// In hooks/useTTSSettings.ts
const SIMPLIFIED_VOICES: TTSVoice[] = [
  { identifier: 'neutral', name: 'Neutral Voice', language: 'en-US' },
  { identifier: 'female', name: 'Female Voice', language: 'en-US' },
  { identifier: 'male', name: 'Male Voice', language: 'en-US' },
  // Add more voice types here
];
```

## Testing Checklist

### Image Testing
- [ ] Main logo displays correctly on main menu
- [ ] Logo scales properly on different screen sizes
- [ ] Images load quickly without lag
- [ ] No broken image icons or errors
- [ ] Branding tab removed from settings
- [ ] Users cannot upload images

### Voice Testing
- [ ] Male voice sounds distinctly male
- [ ] Female voice sounds distinctly female
- [ ] Neutral voice uses system default
- [ ] Voice persists across app restarts
- [ ] Test button plays correct voice
- [ ] Pitch and rate adjustments work
- [ ] Voice works on both iOS and Android

### Color Testing
- [ ] Yellow shows correct yellow color
- [ ] Orange shows correct orange color
- [ ] All color labels match their colors
- [ ] Color selection saves correctly

## Troubleshooting

### Images Not Displaying

**Problem:** Logo doesn't appear on main menu

**Solutions:**
1. Check file path in `app/main-menu.tsx`
2. Verify image file exists in `assets/images/`
3. Ensure image format is supported (PNG, JPG)
4. Check console for image loading errors
5. Try rebuilding the app

### Voice Not Working

**Problem:** Selected voice sounds the same as others

**Solutions:**
1. Check system voices: `Speech.getAvailableVoicesAsync()`
2. Verify platform-specific voice identifiers
3. Test on physical device (not simulator)
4. Check TTS permissions in device settings
5. Try different voice types

### Color Labels Wrong

**Problem:** Color labels don't match displayed colors

**Solutions:**
1. Verify color values in `hooks/useAIPreferences.ts`
2. Check hex color codes are correct
3. Clear app cache and restart
4. Verify AsyncStorage is working

## Future Enhancements

### Potential Improvements
- [ ] Multiple logo options for different screens
- [ ] Seasonal branding themes
- [ ] More voice customization options
- [ ] Voice preview in settings
- [ ] Animated emotion faces
- [ ] Custom color themes

### Requested Features
- [ ] Admin panel for image management
- [ ] Voice recording for custom phrases
- [ ] Emotion face customization (admin only)
- [ ] Branding presets

## Support

For questions or issues:
1. Check console logs for errors
2. Review this documentation
3. Test on multiple devices
4. Verify file paths and imports
5. Check AsyncStorage data

## Version History

**v1.0.0** - Initial Implementation
- Removed user image upload functionality
- Fixed TTS voice selection
- Corrected color label swap
- Added admin branding system
- Created documentation

---

**Last Updated:** 2024
**Maintained By:** COMpanion Development Team
