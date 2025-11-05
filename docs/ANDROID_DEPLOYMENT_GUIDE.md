
# Android Play Store Deployment Guide

This guide will walk you through the process of deploying your COMpanion AAC app to the Google Play Store.

## Prerequisites

Before you begin, ensure you have:

1. **Google Play Developer Account** ($25 one-time fee)
   - Sign up at: https://play.google.com/console/signup

2. **EAS Account** (Expo Application Services)
   - Sign up at: https://expo.dev/signup
   - Install EAS CLI: `npm install -g eas-cli`
   - Login: `eas login`

3. **App Store Assets Ready**
   - App icon (512x512 PNG)
   - Feature graphic (1024x500 PNG)
   - Screenshots (at least 2, recommended 4-8)
   - App description and promotional text

## Step 1: Configure Your EAS Project

1. Initialize EAS in your project:
   ```bash
   eas init
   ```

2. This will create a project ID. Update `app.json` with your actual project ID:
   ```json
   "extra": {
     "eas": {
       "projectId": "your-actual-eas-project-id"
     }
   }
   ```

## Step 2: Generate Android Keystore

Your app needs to be signed with a keystore. EAS can generate one for you:

```bash
eas credentials
```

Select:
- Platform: Android
- Action: "Set up a new keystore"

**IMPORTANT**: Download and securely backup your keystore credentials. You'll need them for all future updates.

## Step 3: Build Your Production AAB

Build an Android App Bundle (AAB) for production:

```bash
eas build --platform android --profile production
```

This will:
- Build your app in the cloud
- Sign it with your keystore
- Generate an AAB file ready for Play Store upload

The build typically takes 10-20 minutes. You'll receive a download link when complete.

## Step 4: Prepare Play Store Listing

### Required Information:

1. **App Details**
   - App name: COMpanion
   - Short description (80 chars max): "AI-powered AAC app for non-verbal communication"
   - Full description (4000 chars max): See template below
   - Category: Education or Medical
   - Content rating: Everyone

2. **Privacy Policy**
   - You MUST provide a privacy policy URL
   - Create one at: https://www.privacypolicygenerator.info/
   - Host it on your website or use GitHub Pages

3. **Store Listing Assets**
   - App icon: 512x512 PNG (32-bit with alpha)
   - Feature graphic: 1024x500 PNG
   - Phone screenshots: At least 2 (recommended 4-8)
     - Dimensions: 16:9 or 9:16 aspect ratio
     - Min: 320px, Max: 3840px
   - 7-inch tablet screenshots: Optional but recommended
   - 10-inch tablet screenshots: Optional but recommended

### Description Template:

```
COMpanion - AI-Powered AAC Communication

COMpanion is an innovative Augmentative and Alternative Communication (AAC) app designed specifically for non-verbal students and individuals who need assistance with communication.

KEY FEATURES:
• AI-Powered Suggestions: Advanced AI learns your communication patterns and provides intelligent word and sentence suggestions
• Customizable Tiles: Create personalized communication tiles with text and images
• Category Organization: Organize communication tiles by categories for easy access
• Voice Output: Text-to-speech functionality with customizable voice settings
• Emotion Expression: Built-in emotion faces to help express feelings
• Learning Engine: The app learns from your usage to improve suggestions over time
• Offline Support: Works without internet connection for core features
• Landscape Mode: Optimized for tablet use in landscape orientation

PERFECT FOR:
• Non-verbal students
• Individuals with autism spectrum disorder
• People with speech impairments
• Anyone needing AAC support

PRIVACY & SECURITY:
• Your data stays on your device
• Optional cloud sync for backup
• No ads or tracking

COMpanion empowers communication and helps users express themselves more effectively with the power of AI assistance.
```

## Step 5: Create Play Store Listing

1. Go to Google Play Console: https://play.google.com/console
2. Click "Create app"
3. Fill in:
   - App name: COMpanion
   - Default language: English (United States)
   - App or game: App
   - Free or paid: Free
   - Accept declarations

4. Complete all required sections:
   - **Store listing**: Add description, graphics, categorization
   - **Content rating**: Complete questionnaire (select Education/Medical)
   - **Target audience**: Select appropriate age groups
   - **Privacy policy**: Add your privacy policy URL
   - **App access**: Explain if any features require special access
   - **Ads**: Declare if your app contains ads (No for this app)
   - **Data safety**: Complete data safety form

## Step 6: Upload Your AAB

1. In Play Console, go to "Production" → "Releases"
2. Click "Create new release"
3. Upload the AAB file you downloaded from EAS
4. Add release notes (what's new in this version)
5. Review and roll out to production

## Step 7: Submit for Review

1. Review all sections in Play Console
2. Ensure all required items are complete (green checkmarks)
3. Click "Send for review"

**Review Timeline**: Typically 1-7 days, but can take up to 2 weeks

## Step 8: Post-Submission

After approval:
- Your app will be live on the Play Store
- Monitor reviews and ratings
- Respond to user feedback
- Plan updates based on user needs

## Future Updates

To release updates:

1. Update version in `app.json`:
   ```json
   "version": "1.0.1"
   ```
   (versionCode will auto-increment with `autoIncrement: true`)

2. Build new AAB:
   ```bash
   eas build --platform android --profile production
   ```

3. Upload to Play Console under "Production" → "Create new release"

## Automated Submission (Optional)

You can automate submission using EAS Submit:

1. Create a service account in Google Cloud Console
2. Download the JSON key file
3. Save it as `service-account-key.json` in your project root
4. Add to `.gitignore` to keep it secure
5. Run:
   ```bash
   eas submit --platform android --profile production
   ```

## Troubleshooting

### Common Issues:

1. **Build fails**
   - Check your dependencies are compatible
   - Ensure all required permissions are declared
   - Review build logs in EAS dashboard

2. **App rejected**
   - Review rejection reason in Play Console
   - Common issues: Missing privacy policy, inappropriate content rating, permissions not explained
   - Fix issues and resubmit

3. **Keystore issues**
   - Never lose your keystore! You can't update your app without it
   - Store it securely (password manager, encrypted backup)

## Important Notes

- **Package Name**: `com.companion.aac` - This cannot be changed after first upload
- **Keystore**: Keep your keystore credentials safe - you'll need them for all future updates
- **Privacy Policy**: Required by Google Play - must be publicly accessible URL
- **Testing**: Test thoroughly before submission - use internal testing track first
- **Content Rating**: Complete honestly - incorrect rating can lead to removal
- **Permissions**: Only request permissions you actually use

## Resources

- [Google Play Console](https://play.google.com/console)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [Play Store Launch Checklist](https://developer.android.com/distribute/best-practices/launch/launch-checklist)
- [App Store Asset Requirements](https://support.google.com/googleplay/android-developer/answer/9866151)

## Support

If you encounter issues:
- EAS Support: https://expo.dev/support
- Google Play Support: https://support.google.com/googleplay/android-developer
- Expo Forums: https://forums.expo.dev/

---

**Ready to deploy?** Start with Step 1 and work through each step carefully. Good luck with your launch! 🚀
