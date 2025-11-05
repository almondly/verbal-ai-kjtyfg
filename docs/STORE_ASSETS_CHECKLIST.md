
# Play Store Assets Checklist

Use this checklist to ensure you have all required assets ready for your Play Store submission.

## Required Assets

### App Icon
- [ ] 512x512 pixels
- [ ] PNG format (32-bit with alpha channel)
- [ ] No rounded corners (Google Play adds them automatically)
- [ ] Current file: `./assets/images/natively-dark.png`

### Feature Graphic
- [ ] 1024x500 pixels
- [ ] PNG or JPEG format
- [ ] Showcases your app's key feature or branding
- [ ] No text that duplicates the app name

### Screenshots (Phone)
- [ ] Minimum 2 screenshots (recommended 4-8)
- [ ] JPEG or PNG format
- [ ] 16:9 or 9:16 aspect ratio
- [ ] Minimum dimension: 320px
- [ ] Maximum dimension: 3840px
- [ ] Show key features of your app

**Recommended Screenshots:**
1. Main communication screen with tiles
2. Keyboard input screen with AI suggestions
3. Settings/customization screen
4. Category selection view
5. Emotion expression feature
6. Custom tile creation

### Screenshots (Tablet) - Optional but Recommended
- [ ] 7-inch tablet screenshots (same requirements as phone)
- [ ] 10-inch tablet screenshots (same requirements as phone)
- [ ] Since your app is landscape-oriented, tablet screenshots are highly recommended

## Store Listing Text

### Short Description
- [ ] Maximum 80 characters
- [ ] Compelling one-liner about your app
- [ ] Example: "AI-powered AAC app for non-verbal communication"

### Full Description
- [ ] Maximum 4000 characters
- [ ] Clearly explains what your app does
- [ ] Lists key features
- [ ] Mentions target audience
- [ ] Includes privacy/security information
- [ ] See template in ANDROID_DEPLOYMENT_GUIDE.md

### Release Notes
- [ ] What's new in this version
- [ ] Maximum 500 characters
- [ ] For version 1.0.0: "Initial release with AI-powered communication features"

## Legal & Policy

### Privacy Policy
- [ ] Publicly accessible URL
- [ ] Explains what data you collect
- [ ] Explains how data is used
- [ ] Explains how data is protected
- [ ] Contact information included

**Quick Privacy Policy Generator:**
- https://www.privacypolicygenerator.info/
- https://app-privacy-policy-generator.firebaseapp.com/

### Content Rating
- [ ] Complete content rating questionnaire
- [ ] Be honest about app content
- [ ] Recommended category: Education or Medical
- [ ] Likely rating: Everyone

## App Information

### Categorization
- [ ] App category: Education or Medical
- [ ] Tags: AAC, Communication, Accessibility, Education, Special Needs

### Contact Details
- [ ] Email address (required)
- [ ] Website URL (optional but recommended)
- [ ] Phone number (optional)

### Target Audience
- [ ] Age groups your app is designed for
- [ ] For AAC app: All ages, but primarily children and adults with special needs

## Data Safety

Complete the Data Safety form in Play Console:

### Data Collection
- [ ] Does your app collect user data? (Yes/No)
- [ ] What types of data? (If using Supabase: user preferences, communication patterns)
- [ ] Is data encrypted in transit? (Yes, if using HTTPS/Supabase)
- [ ] Is data encrypted at rest? (Yes, if using Supabase)

### Data Sharing
- [ ] Do you share data with third parties? (Likely No)
- [ ] If yes, with whom and why?

### Data Deletion
- [ ] Can users request data deletion? (Should be Yes)
- [ ] How can they request it? (Provide instructions)

## Testing

### Pre-Submission Testing
- [ ] Test on multiple Android devices
- [ ] Test on different screen sizes
- [ ] Test all core features
- [ ] Test offline functionality
- [ ] Test permissions (camera, storage, microphone)
- [ ] Test text-to-speech functionality
- [ ] Test AI suggestions
- [ ] Test custom tile creation

### Internal Testing (Recommended)
- [ ] Upload to internal testing track first
- [ ] Test with real users
- [ ] Gather feedback
- [ ] Fix any issues before production release

## Build Files

### Production Build
- [ ] AAB file generated via EAS Build
- [ ] Signed with production keystore
- [ ] Version code: 1
- [ ] Version name: 1.0.0

### Keystore
- [ ] Keystore generated and backed up securely
- [ ] Keystore password stored safely
- [ ] Key alias and password stored safely
- [ ] **CRITICAL**: Never lose these credentials!

## Promotional Materials (Optional)

### Promotional Graphic
- [ ] 180x120 pixels
- [ ] PNG or JPEG
- [ ] Used in Play Store promotions

### Promotional Video
- [ ] YouTube video URL
- [ ] Shows app in action
- [ ] 30 seconds to 2 minutes recommended

## Launch Preparation

### Pre-Launch Checklist
- [ ] All required assets uploaded
- [ ] Store listing complete
- [ ] Privacy policy published
- [ ] Content rating completed
- [ ] Data safety form completed
- [ ] AAB uploaded
- [ ] Release notes added
- [ ] All Play Console sections show green checkmarks

### Post-Launch Preparation
- [ ] Plan for monitoring reviews
- [ ] Plan for responding to user feedback
- [ ] Plan for future updates
- [ ] Marketing strategy (social media, website, etc.)

## Screenshot Capture Tips

Since your app is landscape-oriented:

1. **Use Android Emulator or Real Device**
   - Open your app in landscape mode
   - Navigate to key screens
   - Take screenshots (Power + Volume Down on most devices)

2. **Key Screens to Capture**
   - Home screen with "Start" button
   - Main communication grid with tiles
   - Keyboard screen with AI suggestions
   - Settings screen showing customization options
   - Emotion selection
   - Custom tile creation

3. **Screenshot Best Practices**
   - Use consistent device/emulator for all screenshots
   - Show the app in use (not empty states)
   - Highlight key features
   - Use real, meaningful content (not lorem ipsum)
   - Consider adding text overlays to highlight features (optional)

4. **Tools for Screenshot Enhancement**
   - [Figma](https://www.figma.com/) - Add device frames and annotations
   - [Canva](https://www.canva.com/) - Create promotional graphics
   - [Shotbot](https://shotbot.io/) - Generate app store screenshots

## Asset Storage

Recommended folder structure:
```
store-assets/
├── icon/
│   └── icon-512x512.png
├── feature-graphic/
│   └── feature-graphic-1024x500.png
├── screenshots/
│   ├── phone/
│   │   ├── 01-home.png
│   │   ├── 02-communication.png
│   │   ├── 03-keyboard.png
│   │   └── 04-settings.png
│   └── tablet/
│       ├── 01-home.png
│       └── 02-communication.png
└── promotional/
    └── promo-video-script.txt
```

## Timeline Estimate

- Asset creation: 2-4 hours
- Privacy policy creation: 1 hour
- Play Console setup: 1-2 hours
- Build generation: 20-30 minutes
- Upload and submission: 30 minutes
- **Total**: 5-8 hours of work
- **Review time**: 1-7 days (Google's review)

---

**Tip**: Start with the required assets first, then add optional ones if time permits. You can always update your store listing after launch with better assets.
