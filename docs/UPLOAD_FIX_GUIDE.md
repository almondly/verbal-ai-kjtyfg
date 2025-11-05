
# Upload Fix Guide - COMpanion AAC App

## Issues Fixed

### 1. **Android Package Name**
- **Problem**: Package name `com.COMpanion.COMpanion` contained uppercase letters
- **Fix**: Changed to `com.companion.aac` (all lowercase)
- **Impact**: Android package names must be lowercase only

### 2. **App Name Consistency**
- **Problem**: App was named `verbal-ai-kjtyfg` in config files
- **Fix**: Changed to `COMpanion` throughout
- **Impact**: Better branding and consistency

### 3. **EAS Project ID**
- **Problem**: Placeholder project ID in app.json
- **Fix**: Added a valid UUID format (you'll need to replace with your actual EAS project ID)
- **Impact**: Required for EAS Build to work

### 4. **Removed Problematic Dependencies**
- **Problem**: `react-native-maps`, `eas`, `eas-cli`, `react-router-dom`, and `montserrat` link were causing issues
- **Fix**: Removed from package.json
- **Impact**: Cleaner build without unsupported dependencies

### 5. **Simplified EAS Submit Config**
- **Problem**: Referenced non-existent service account key file
- **Fix**: Simplified submit configuration
- **Impact**: You can add service account later when ready

## Next Steps to Upload

### Step 1: Get Your EAS Project ID

Run this command to create/link your EAS project:

```bash
npx eas-cli@latest init
```

This will give you a project ID. Update `app.json` with the real project ID:

```json
"extra": {
  "eas": {
    "projectId": "YOUR-ACTUAL-PROJECT-ID-HERE"
  }
}
```

### Step 2: Build for Android

For internal testing (APK):
```bash
npx eas-cli@latest build --platform android --profile preview
```

For Play Store submission (AAB):
```bash
npx eas-cli@latest build --platform android --profile production
```

### Step 3: Download and Test

After the build completes:
1. Download the APK/AAB from the EAS dashboard
2. Test the APK on a physical device
3. Verify all features work correctly

### Step 4: Prepare for Play Store

Before submitting to Google Play Store, you need:

1. **App Icon** (512x512 PNG)
   - High-resolution version of your app icon
   - No transparency, no rounded corners

2. **Feature Graphic** (1024x500 PNG)
   - Banner image for your store listing

3. **Screenshots** (at least 2)
   - Phone: 16:9 or 9:16 aspect ratio
   - Tablet: 16:9 or 9:16 aspect ratio
   - Minimum 320px on shortest side

4. **Privacy Policy URL**
   - Required for apps that access sensitive data
   - See `docs/PRIVACY_POLICY_TEMPLATE.md`

5. **App Description**
   - Short description (80 characters max)
   - Full description (4000 characters max)

### Step 5: Submit to Play Store

#### Option A: Manual Upload
1. Go to [Google Play Console](https://play.google.com/console)
2. Create a new app
3. Upload the AAB file
4. Fill in store listing details
5. Submit for review

#### Option B: Using EAS Submit (Requires Service Account)
1. Create a service account in Google Cloud Console
2. Download the JSON key file
3. Save it as `service-account-key.json` in your project root
4. Update `eas.json`:
```json
"submit": {
  "production": {
    "android": {
      "serviceAccountKeyPath": "./service-account-key.json",
      "track": "internal"
    }
  }
}
```
5. Run: `npx eas-cli@latest submit --platform android`

## Common Issues and Solutions

### Issue: "Package name already exists"
**Solution**: The package name `com.companion.aac` might be taken. Change it to something unique like:
- `com.yourname.companion`
- `com.companion.aac.yourname`

Update in `app.json`:
```json
"android": {
  "package": "com.yourname.companion"
},
"ios": {
  "bundleIdentifier": "com.yourname.companion"
}
```

### Issue: "Build fails with dependency errors"
**Solution**: Clear cache and reinstall:
```bash
rm -rf node_modules
npm install
npx expo-cli@latest prebuild --clean
```

### Issue: "App crashes on startup"
**Solution**: Check these common causes:
1. Missing fonts - ensure Montserrat fonts are loaded
2. Supabase configuration - verify client.ts has correct URL and key
3. Check logs: `npx eas-cli@latest build:view --platform android`

### Issue: "Version code must be incremented"
**Solution**: The `autoIncrement: true` in eas.json should handle this automatically. If not, manually increment in app.json:
```json
"android": {
  "versionCode": 2
}
```

## Testing Checklist

Before uploading, test these features:

- [ ] App launches without crashing
- [ ] Main menu displays correctly
- [ ] Communication screen works
- [ ] Keyboard screen works
- [ ] Settings can be opened and saved
- [ ] Tiles can be added/edited
- [ ] Voice/TTS works
- [ ] Emotions can be changed
- [ ] AI suggestions appear
- [ ] Camera/photo picker works
- [ ] App works in landscape orientation
- [ ] No console errors in production build

## Version Management

For future updates:

1. **Increment version in app.json**:
```json
"version": "1.0.1"
```

2. **Android versionCode auto-increments** with `autoIncrement: true`

3. **iOS buildNumber** should also increment (or use autoIncrement)

## Support Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)

## Quick Command Reference

```bash
# Check EAS configuration
npx eas-cli@latest config

# Build for Android (preview)
npx eas-cli@latest build -p android --profile preview

# Build for Android (production)
npx eas-cli@latest build -p android --profile production

# Build for iOS
npx eas-cli@latest build -p ios --profile production

# Submit to Play Store
npx eas-cli@latest submit -p android

# Check build status
npx eas-cli@latest build:list

# View build logs
npx eas-cli@latest build:view
```

## Important Notes

1. **First Upload**: The first upload to Play Store can take 1-3 days for review
2. **Updates**: Subsequent updates typically review faster (hours to 1 day)
3. **Package Name**: Cannot be changed after first upload - choose carefully!
4. **Testing**: Always test on physical devices before submitting
5. **Backup**: Keep a copy of your keystore and service account credentials safe

## Contact

If you encounter issues not covered here, check:
- EAS Build logs in the Expo dashboard
- Google Play Console error messages
- Runtime logs with `npx expo start`
