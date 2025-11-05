
# Quick Start: Deploy to Play Store in 1 Day

This is a streamlined guide to get your COMpanion app on the Play Store as quickly as possible.

## Prerequisites (30 minutes)

1. **Google Play Developer Account** - $25 one-time fee
   - Sign up: https://play.google.com/console/signup
   - Complete registration and payment

2. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   eas login
   ```

## Step 1: Configure & Build (1 hour)

### Initialize EAS
```bash
cd /path/to/your/project
eas init
```

Copy the project ID and update `app.json`:
```json
"extra": {
  "eas": {
    "projectId": "paste-your-project-id-here"
  }
}
```

### Set Up Keystore
```bash
eas credentials
```
- Select: Android
- Select: Set up a new keystore
- **IMPORTANT**: Download and save credentials securely!

### Build Production AAB
```bash
eas build --platform android --profile production
```

Wait 15-20 minutes for build to complete. Download the AAB file when ready.

## Step 2: Create Store Assets (2-3 hours)

### Required Assets

1. **App Icon** (512x512 PNG)
   - You already have: `./assets/images/natively-dark.png`
   - Verify it's 512x512 pixels

2. **Feature Graphic** (1024x500 PNG)
   - Create using Canva, Figma, or Photoshop
   - Should showcase your app's main feature
   - Template: https://www.canva.com/templates/

3. **Screenshots** (Minimum 2, recommended 4-8)
   - Open your app on Android device/emulator
   - Take screenshots of:
     - Home screen
     - Communication grid
     - Keyboard with AI suggestions
     - Settings screen
   - Resize to meet requirements (16:9 or 9:16 aspect ratio)

### Quick Screenshot Guide
```bash
# Start your app
npm run android

# Navigate to key screens and take screenshots
# On Android: Press Power + Volume Down
# On Emulator: Click camera icon in toolbar
```

## Step 3: Create Privacy Policy (1 hour)

### Option 1: Use Generator (Fastest)
1. Go to: https://www.privacypolicygenerator.info/
2. Fill in your app details:
   - App name: COMpanion
   - App type: Mobile app
   - Data collected: User preferences, communication patterns
   - Data usage: Improve AI suggestions
3. Generate and download

### Option 2: Use Template
1. Open `docs/PRIVACY_POLICY_TEMPLATE.md`
2. Replace all placeholders with your information
3. Save as HTML file

### Host Privacy Policy (Free)
**GitHub Pages** (Recommended):
1. Create new GitHub repository: `companion-privacy`
2. Create `index.html` with your privacy policy
3. Go to Settings → Pages
4. Enable GitHub Pages
5. Your URL: `https://[username].github.io/companion-privacy/`

**Alternative**: Use https://www.freeprivacypolicy.com/ (free hosting)

## Step 4: Play Console Setup (1-2 hours)

### Create App
1. Go to: https://play.google.com/console
2. Click "Create app"
3. Fill in:
   - App name: **COMpanion**
   - Default language: **English (United States)**
   - App or game: **App**
   - Free or paid: **Free**
4. Accept declarations

### Complete Required Sections

#### 1. Store Listing
- Upload app icon (512x512)
- Upload feature graphic (1024x500)
- Upload screenshots (minimum 2)
- Short description: "AI-powered AAC app for non-verbal communication"
- Full description: Use template from `ANDROID_DEPLOYMENT_GUIDE.md`
- App category: **Education** or **Medical**
- Contact email: Your email

#### 2. Privacy Policy
- Add your privacy policy URL
- Click "Save"

#### 3. Content Rating
- Click "Start questionnaire"
- Select category: **Education** or **Utility**
- Answer questions honestly:
  - Violence: No
  - Sexual content: No
  - Profanity: No
  - Controlled substances: No
  - User interaction: No (unless you add social features)
- Submit and receive rating (likely "Everyone")

#### 4. Target Audience
- Select age groups: **All ages** (or specific age groups)
- Explain: "App is designed for non-verbal individuals of all ages"

#### 5. Data Safety
- Does your app collect data? **Yes** (if using Supabase) or **No** (if local only)
- If Yes:
  - Data types: User preferences, app interactions
  - Data usage: App functionality, personalization
  - Data sharing: No third-party sharing
  - Data security: Encrypted in transit
  - Data deletion: Users can delete data
- Click "Save"

#### 6. App Access
- Are all features available without restrictions? **Yes**
- Click "Save"

#### 7. Ads
- Does your app contain ads? **No**
- Click "Save"

### Upload AAB
1. Go to: **Production** → **Releases**
2. Click "Create new release"
3. Upload your AAB file (downloaded from EAS)
4. Release notes: "Initial release of COMpanion - AI-powered AAC communication app"
5. Click "Save"

## Step 5: Final Review & Submit (30 minutes)

### Pre-Submission Checklist
- [ ] All sections in Play Console have green checkmarks
- [ ] Privacy policy URL is accessible
- [ ] Screenshots look professional
- [ ] Description has no typos
- [ ] AAB is uploaded
- [ ] Release notes are added

### Submit for Review
1. Review all sections one final time
2. Click "Review release"
3. Review summary
4. Click "Start rollout to Production"
5. Confirm submission

**Done!** 🎉

## What Happens Next?

### Review Timeline
- **Typical**: 1-3 days
- **Maximum**: Up to 7 days
- **Rare cases**: Up to 2 weeks

### During Review
- Monitor your email for updates
- Check Play Console for status changes
- Be ready to respond to any feedback

### After Approval
- You'll receive email notification
- App will be live on Play Store within a few hours
- Play Store URL: `https://play.google.com/store/apps/details?id=com.companion.aac`

## If Rejected

Don't panic! Rejections are common for first submissions.

1. **Read the rejection reason carefully**
2. **Fix the issue** (common issues below)
3. **Resubmit** (usually reviewed faster the second time)

### Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Privacy policy not accessible | Verify URL works in incognito browser |
| Misleading content | Ensure screenshots match actual app |
| Permissions not explained | Add permission explanations to description |
| Broken functionality | Test app thoroughly before resubmitting |
| Content rating incorrect | Redo content rating questionnaire |

## Post-Launch Checklist

After your app is approved:

- [ ] Test downloading from Play Store
- [ ] Share Play Store link with testers
- [ ] Monitor reviews and ratings
- [ ] Respond to user feedback
- [ ] Plan first update based on feedback

## Time Breakdown

| Task | Time |
|------|------|
| Prerequisites | 30 min |
| Configure & Build | 1 hour |
| Create Store Assets | 2-3 hours |
| Create Privacy Policy | 1 hour |
| Play Console Setup | 1-2 hours |
| Final Review & Submit | 30 min |
| **Total Active Work** | **6-8 hours** |
| **Google Review** | **1-7 days** |

## Tips for Success

1. **Don't Rush**: Take time to create quality screenshots and descriptions
2. **Test Thoroughly**: Install the preview build and test all features
3. **Be Honest**: Answer all questionnaires truthfully
4. **Professional Assets**: Use high-quality images and clear descriptions
5. **Backup Credentials**: Store keystore credentials in multiple secure locations
6. **Read Guidelines**: Familiarize yourself with Play Store policies

## Resources

- **Full Guide**: `ANDROID_DEPLOYMENT_GUIDE.md`
- **Build Commands**: `BUILD_COMMANDS_REFERENCE.md`
- **Privacy Template**: `PRIVACY_POLICY_TEMPLATE.md`
- **Detailed Checklist**: `PLAY_STORE_SUBMISSION_CHECKLIST.md`

## Need Help?

- **EAS Issues**: https://expo.dev/support
- **Play Store Issues**: https://support.google.com/googleplay/android-developer
- **Community**: https://forums.expo.dev/

## Quick Command Reference

```bash
# Setup
eas login
eas init
eas credentials

# Build
eas build --platform android --profile production

# Check status
eas build:list

# Submit (optional - automated)
eas submit --platform android --profile production
```

---

## Ready to Start?

Follow the steps above in order. Set aside a full day (or weekend) to complete the process without rushing.

**Good luck! 🚀**

Your app will be helping non-verbal individuals communicate in no time!
