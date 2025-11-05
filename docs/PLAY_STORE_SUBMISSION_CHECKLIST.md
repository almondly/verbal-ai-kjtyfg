
# Play Store Submission Checklist

Use this checklist to track your progress toward submitting COMpanion to the Google Play Store.

## Phase 1: Preparation (Before Building)

### Account Setup
- [ ] Create Google Play Developer account ($25 fee)
- [ ] Create Expo/EAS account (free)
- [ ] Install EAS CLI: `npm install -g eas-cli`
- [ ] Login to EAS: `eas login`

### Project Configuration
- [ ] Review `app.json` configuration
- [ ] Verify package name: `com.companion.aac`
- [ ] Verify app name: "COMpanion"
- [ ] Verify version: "1.0.0"
- [ ] Verify permissions are correct
- [ ] Initialize EAS project: `eas init`
- [ ] Update `app.json` with actual EAS project ID

### Credentials Setup
- [ ] Generate Android keystore: `eas credentials`
- [ ] Download keystore credentials
- [ ] Store keystore credentials in password manager
- [ ] Backup keystore credentials to secure location
- [ ] **CRITICAL**: Never lose these credentials!

## Phase 2: Build & Test

### Preview Build
- [ ] Build preview APK: `eas build --platform android --profile preview`
- [ ] Download APK from EAS dashboard
- [ ] Install on test device
- [ ] Test all core features:
  - [ ] Communication tiles work
  - [ ] Keyboard input works
  - [ ] AI suggestions appear
  - [ ] Voice output works
  - [ ] Custom tile creation works
  - [ ] Image picker works
  - [ ] Settings save correctly
  - [ ] Emotion faces display
  - [ ] Category switching works
  - [ ] App doesn't crash
- [ ] Test on multiple devices (if possible)
- [ ] Test on different Android versions (if possible)

### Production Build
- [ ] Build production AAB: `eas build --platform android --profile production`
- [ ] Download AAB from EAS dashboard
- [ ] Verify AAB file size is reasonable (should be 30-60 MB)

## Phase 3: Store Assets

### Required Graphics
- [ ] App icon (512x512 PNG) - Current: `./assets/images/natively-dark.png`
- [ ] Feature graphic (1024x500 PNG) - **NEEDS CREATION**
- [ ] At least 2 phone screenshots - **NEEDS CREATION**
- [ ] Recommended: 4-8 phone screenshots
- [ ] Optional: Tablet screenshots (recommended for landscape app)

### Screenshots to Capture
- [ ] Home screen with "Start" button
- [ ] Main communication grid with tiles
- [ ] Keyboard screen with AI suggestions
- [ ] Settings screen
- [ ] Custom tile creation
- [ ] Emotion selection
- [ ] Category view

### Store Listing Text
- [ ] Short description (80 chars max)
- [ ] Full description (4000 chars max) - Template provided in docs
- [ ] Release notes for v1.0.0

## Phase 4: Legal & Policy

### Privacy Policy
- [ ] Customize privacy policy template (see `PRIVACY_POLICY_TEMPLATE.md`)
- [ ] Host privacy policy on public URL
- [ ] Test privacy policy URL is accessible
- [ ] Add privacy policy URL to Play Console

### Content Rating
- [ ] Complete content rating questionnaire in Play Console
- [ ] Select appropriate category (Education or Medical)
- [ ] Answer all questions honestly
- [ ] Receive content rating

### Data Safety
- [ ] Complete Data Safety form in Play Console
- [ ] Declare what data is collected
- [ ] Declare how data is used
- [ ] Declare if data is shared
- [ ] Explain data security measures
- [ ] Explain data deletion process

## Phase 5: Play Console Setup

### App Details
- [ ] Create new app in Play Console
- [ ] Set app name: "COMpanion"
- [ ] Set default language: English (United States)
- [ ] Select app type: App (not game)
- [ ] Select free or paid: Free
- [ ] Accept developer declarations

### Store Listing
- [ ] Upload app icon
- [ ] Upload feature graphic
- [ ] Upload screenshots
- [ ] Add short description
- [ ] Add full description
- [ ] Select app category: Education or Medical
- [ ] Add tags: AAC, Communication, Accessibility, Education
- [ ] Add contact email
- [ ] Add website URL (if available)

### App Content
- [ ] Complete privacy policy section
- [ ] Complete ads declaration (No ads)
- [ ] Complete content rating
- [ ] Complete target audience
- [ ] Complete data safety
- [ ] Complete app access (if any features need special access)

### Release Setup
- [ ] Go to Production → Releases
- [ ] Create new release
- [ ] Upload AAB file
- [ ] Add release notes
- [ ] Set rollout percentage (start with 100%)

## Phase 6: Pre-Submission Review

### Technical Checklist
- [ ] App builds successfully
- [ ] App installs on test devices
- [ ] No crashes during testing
- [ ] All features work as expected
- [ ] Permissions are requested appropriately
- [ ] Text-to-speech works
- [ ] Images load correctly
- [ ] AI suggestions appear
- [ ] Data persists correctly

### Play Console Checklist
- [ ] All required sections completed (green checkmarks)
- [ ] No warnings or errors in Play Console
- [ ] Privacy policy URL is valid
- [ ] Content rating is complete
- [ ] Data safety form is complete
- [ ] Store listing looks professional
- [ ] Screenshots are clear and representative
- [ ] Description is accurate and compelling

### Legal Checklist
- [ ] Privacy policy is accurate
- [ ] Privacy policy is publicly accessible
- [ ] Content rating is appropriate
- [ ] All declarations are truthful
- [ ] Permissions are justified
- [ ] No copyright violations in content
- [ ] No trademark violations

## Phase 7: Submission

### Final Review
- [ ] Review entire Play Console listing one more time
- [ ] Check for typos in description
- [ ] Verify all images look good
- [ ] Verify AAB is uploaded
- [ ] Verify release notes are added

### Submit
- [ ] Click "Review release" in Play Console
- [ ] Review summary of changes
- [ ] Click "Start rollout to Production"
- [ ] Confirm submission

### Post-Submission
- [ ] Note submission date and time
- [ ] Monitor email for updates from Google Play
- [ ] Check Play Console for review status
- [ ] Prepare to respond to any review feedback

## Phase 8: Post-Launch

### Monitoring
- [ ] Check Play Console daily for review status
- [ ] Respond to any review feedback within 24 hours
- [ ] Monitor crash reports in Play Console
- [ ] Monitor user reviews and ratings
- [ ] Respond to user reviews

### Marketing (Optional)
- [ ] Share Play Store link on social media
- [ ] Create website or landing page
- [ ] Reach out to AAC communities
- [ ] Contact special education organizations
- [ ] Submit to app review sites

### Planning Next Steps
- [ ] Collect user feedback
- [ ] Plan feature updates
- [ ] Fix any reported bugs
- [ ] Prepare for version 1.0.1

## Timeline Estimates

| Phase | Estimated Time |
|-------|----------------|
| Phase 1: Preparation | 1-2 hours |
| Phase 2: Build & Test | 2-3 hours |
| Phase 3: Store Assets | 2-4 hours |
| Phase 4: Legal & Policy | 1-2 hours |
| Phase 5: Play Console Setup | 1-2 hours |
| Phase 6: Pre-Submission Review | 1 hour |
| Phase 7: Submission | 30 minutes |
| **Total Active Work** | **8-14 hours** |
| **Google Review Time** | **1-7 days** |

## Common Rejection Reasons

Be prepared to address these common issues:

1. **Missing Privacy Policy**
   - Solution: Ensure privacy policy URL is valid and accessible

2. **Inappropriate Content Rating**
   - Solution: Complete content rating questionnaire accurately

3. **Permissions Not Explained**
   - Solution: Ensure all permissions are justified in description

4. **Misleading Store Listing**
   - Solution: Ensure screenshots and description accurately represent app

5. **Broken Functionality**
   - Solution: Test thoroughly before submission

6. **Copyright/Trademark Issues**
   - Solution: Ensure all content is original or properly licensed

## Emergency Contacts

- **EAS Support**: https://expo.dev/support
- **Google Play Support**: https://support.google.com/googleplay/android-developer
- **Expo Forums**: https://forums.expo.dev/

## Resources

- [ ] Read: `ANDROID_DEPLOYMENT_GUIDE.md`
- [ ] Read: `STORE_ASSETS_CHECKLIST.md`
- [ ] Read: `BUILD_COMMANDS_REFERENCE.md`
- [ ] Read: `PRIVACY_POLICY_TEMPLATE.md`
- [ ] Bookmark: [Play Console](https://play.google.com/console)
- [ ] Bookmark: [EAS Dashboard](https://expo.dev/)

## Notes Section

Use this space to track important information:

**EAS Project ID**: ___________________________

**Keystore Password**: (Store in password manager, not here!)

**Play Store URL** (after approval): ___________________________

**Submission Date**: ___________________________

**Approval Date**: ___________________________

**Important Dates**:
- ___________________________
- ___________________________

**Issues Encountered**:
- ___________________________
- ___________________________

**Lessons Learned**:
- ___________________________
- ___________________________

---

## Quick Start Command Sequence

For quick reference, here's the command sequence to get from zero to submission:

```bash
# 1. Setup
npm install -g eas-cli
eas login
eas init
eas credentials  # Set up keystore

# 2. Preview build (test first!)
eas build --platform android --profile preview
# Download, install, and test thoroughly

# 3. Production build
eas build --platform android --profile production
# Download AAB

# 4. Submit
# Upload AAB to Play Console manually
# OR
eas submit --platform android --profile production
```

---

**Good luck with your submission! 🚀**

Remember: Take your time, test thoroughly, and don't rush the submission. A well-prepared submission is more likely to be approved quickly.
