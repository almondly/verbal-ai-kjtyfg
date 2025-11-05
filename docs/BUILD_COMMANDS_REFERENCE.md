
# Build Commands Reference

Quick reference for building and deploying your COMpanion AAC app.

## Initial Setup

### 1. Install EAS CLI
```bash
npm install -g eas-cli
```

### 2. Login to EAS
```bash
eas login
```

### 3. Initialize EAS Project
```bash
eas init
```

This creates a project ID. Update `app.json` with the generated project ID.

### 4. Configure Credentials
```bash
eas credentials
```

Select Android → Set up a new keystore

**IMPORTANT**: Download and backup your keystore credentials!

## Build Commands

### Development Build (APK)
For testing on physical devices:
```bash
eas build --platform android --profile development
```

### Preview Build (APK)
For internal testing:
```bash
eas build --platform android --profile preview
```

### Production Build (AAB)
For Play Store submission:
```bash
eas build --platform android --profile production
```

## Build Profiles Explained

### Development
- Creates APK file
- Includes development tools
- Larger file size
- For testing during development

### Preview
- Creates APK file
- Production-like build
- For internal testing before release
- Smaller than development build

### Production
- Creates AAB (Android App Bundle)
- Optimized for Play Store
- Smallest download size for users
- Required for Play Store submission

## Checking Build Status

### View All Builds
```bash
eas build:list
```

### View Specific Build
```bash
eas build:view [BUILD_ID]
```

### View Build Logs
Logs are automatically shown during build, or view in dashboard:
https://expo.dev/accounts/[your-account]/projects/[your-project]/builds

## Submission Commands

### Submit to Play Store (Manual)
1. Download AAB from EAS dashboard
2. Upload to Play Console manually

### Submit to Play Store (Automated)
```bash
eas submit --platform android --profile production
```

**Requirements for automated submission:**
- Service account JSON key file
- File saved as `service-account-key.json`
- File path configured in `eas.json`

## Version Management

### Update Version
Edit `app.json`:
```json
{
  "expo": {
    "version": "1.0.1"
  }
}
```

Version code auto-increments with `autoIncrement: true` in `eas.json`.

### Check Current Version
```bash
cat app.json | grep version
```

## Troubleshooting Commands

### Clear Build Cache
```bash
eas build --platform android --profile production --clear-cache
```

### View Credentials
```bash
eas credentials
```

### Update Credentials
```bash
eas credentials
```
Select Android → Update credentials

### View Project Configuration
```bash
eas config
```

## Local Development

### Start Development Server
```bash
npm run dev
```

### Start on Android Device
```bash
npm run android
```

### Prebuild Android Native Project
```bash
npm run build:android
```

## Testing Builds

### Install APK on Device
1. Download APK from EAS dashboard
2. Transfer to Android device
3. Enable "Install from unknown sources" in device settings
4. Open APK file to install

### Test AAB Locally
AAB files cannot be installed directly. Options:
1. Upload to Play Console internal testing track
2. Use bundletool to generate APK from AAB:
```bash
bundletool build-apks --bundle=app.aab --output=app.apks
bundletool install-apks --apks=app.apks
```

## Build Time Estimates

- Development build: 10-15 minutes
- Preview build: 10-15 minutes
- Production build: 15-20 minutes

Times may vary based on:
- Project size
- Dependencies
- EAS server load

## Build Artifacts

### Development/Preview (APK)
- File size: 50-100 MB
- Can be installed directly on devices
- Single file for all architectures

### Production (AAB)
- File size: 30-60 MB
- Cannot be installed directly
- Play Store generates optimized APKs for each device
- Users download smaller, device-specific APKs (typically 20-40 MB)

## Common Build Errors

### "No valid credentials found"
**Solution**: Run `eas credentials` and set up keystore

### "Build failed: Gradle build failed"
**Solution**: Check dependencies, ensure all packages are compatible

### "Expo SDK version mismatch"
**Solution**: Ensure all expo packages match SDK version (53 in your case)

### "Out of memory"
**Solution**: Add to `eas.json`:
```json
{
  "build": {
    "production": {
      "android": {
        "gradleCommand": ":app:bundleRelease",
        "buildType": "aab",
        "env": {
          "GRADLE_OPTS": "-Xmx4096m"
        }
      }
    }
  }
}
```

## Best Practices

1. **Always test preview builds** before production builds
2. **Keep keystore credentials safe** - store in password manager
3. **Use semantic versioning** (1.0.0, 1.0.1, 1.1.0, 2.0.0)
4. **Test on multiple devices** before submitting to Play Store
5. **Monitor build logs** for warnings and errors
6. **Keep dependencies updated** but test thoroughly after updates

## Quick Start Workflow

For first-time deployment:

```bash
# 1. Setup
eas login
eas init
eas credentials  # Set up keystore

# 2. Test build
eas build --platform android --profile preview

# 3. Test on device
# Download and install APK from EAS dashboard

# 4. Production build
eas build --platform android --profile production

# 5. Submit
# Download AAB and upload to Play Console
# OR
eas submit --platform android --profile production
```

## Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [EAS Dashboard](https://expo.dev/)
- [Build Troubleshooting](https://docs.expo.dev/build-reference/troubleshooting/)

---

**Pro Tip**: Save your most-used commands in a `Makefile` or npm scripts for quick access!
