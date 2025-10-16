
# 📸 Pictogram Management Guide

## Complete Guide to Managing ARASAAC Pictograms in Your AAC App

This guide will teach you how to add, update, and manage pictograms in your AAC communication app. You'll learn how to find pictograms on ARASAAC and integrate them into your code.

---

## 🎯 Quick Overview

**What are pictograms?**
Pictograms are visual symbols that represent words or concepts. This app uses high-quality, colorful pictograms from ARASAAC (Aragonese Portal of Augmentative and Alternative Communication).

**Where are pictograms stored?**
All default pictograms are defined in: `data/defaultTiles.ts`

**How do pictograms work?**
Each tile can have an `image` property that contains a URL to an ARASAAC pictogram. The app automatically displays these images on the communication tiles.

---

## 🔍 Finding ARASAAC Pictograms

### Step 1: Visit the ARASAAC Website
Go to: **https://arasaac.org/pictograms/search**

### Step 2: Search for a Word
- Type the word you want in the search box (e.g., "happy", "eat", "mom")
- Press Enter or click Search
- You'll see a grid of pictogram results

### Step 3: Choose the Right Pictogram
- Look for **colorful** pictograms (not black and white)
- Choose **gender-neutral** pictograms unless the word is specifically gendered (like "mom", "dad", "he", "she")
- Click on the pictogram you want

### Step 4: Get the Pictogram ID
When you click a pictogram, look at the URL in your browser:
```
https://arasaac.org/pictograms/8224
                              ^^^^
                         This is the ID!
```

The number at the end is the **Pictogram ID** - write this down!

---

## 🛠️ Adding Pictograms to Your Code

### Method 1: Adding a New Word with a Pictogram

**Step 1:** Open the file `data/defaultTiles.ts`

**Step 2:** Find the `pictograms` object (around line 25)

**Step 3:** Add your new word and pictogram ID:

```typescript
const pictograms: Record<string, string> = {
  // ... existing pictograms ...
  
  // Add your new word here (use lowercase!)
  'your-word': 'https://static.arasaac.org/pictograms/YOUR_ID/YOUR_ID_2500.png',
};
```

**Example:** Adding the word "bicycle"
```typescript
const pictograms: Record<string, string> = {
  // ... existing pictograms ...
  
  bicycle: 'https://static.arasaac.org/pictograms/2723/2723_2500.png',
};
```

**Step 4:** Add the tile to the default tiles list (scroll down to around line 300):

```typescript
export const defaultTiles: Tile[] = [
  // ... existing tiles ...
  
  // Add to the appropriate category
  t('toys', 'bicycle'),  // category, word
];
```

---

### Method 2: Updating an Existing Pictogram

**Step 1:** Open `data/defaultTiles.ts`

**Step 2:** Find the word in the `pictograms` object

**Step 3:** Replace the pictogram ID with your new one:

**Before:**
```typescript
happy: 'https://static.arasaac.org/pictograms/7012/7012_2500.png',
```

**After:**
```typescript
happy: 'https://static.arasaac.org/pictograms/NEW_ID/NEW_ID_2500.png',
```

**Step 4:** Increment the seed version in `hooks/useLibrary.ts`:

Find this line (around line 7):
```typescript
const CURRENT_SEED_VERSION = 6;
```

Change it to:
```typescript
const CURRENT_SEED_VERSION = 7;  // Increment by 1
```

This forces the app to update all tiles with the new pictograms!

---

## 📋 Understanding the URL Format

ARASAAC pictogram URLs follow this pattern:
```
https://static.arasaac.org/pictograms/{ID}/{ID}_2500.png
```

**Breaking it down:**
- `https://static.arasaac.org/pictograms/` - Base URL (always the same)
- `{ID}` - The pictogram ID (e.g., 8224)
- `{ID}_2500.png` - The pictogram ID again + variant + file extension

**Available variants:**
- `_2500.png` - **High resolution color** (RECOMMENDED - this is what we use!)
- `_500.png` - Standard resolution color
- `_300.png` - Low resolution color

**Always use `_2500.png` for the best quality!**

---

## 🎨 Categories and Organization

The app organizes tiles into categories. Here are the available categories:

- **core** - Essential words (I, you, want, need, etc.)
- **people** - Family and people (mom, dad, friend, etc.)
- **actions** - Verbs (eat, drink, play, etc.)
- **feelings** - Emotions (happy, sad, angry, etc.)
- **food** - Food items (apple, pizza, water, etc.)
- **home** - Home items (bed, chair, TV, etc.)
- **school** - School items (book, pencil, teacher, etc.)
- **body** - Body parts (head, hands, feet, etc.)
- **places** - Locations (park, store, hospital, etc.)
- **routines** - Daily routines (breakfast, bedtime, etc.)
- **questions** - Question words (what, where, when, etc.)
- **colours** - Colors (red, blue, green, etc.)
- **numbers** - Numbers (1, 2, 3, etc.)
- **animals** - Animals (dog, cat, bird, etc.)
- **clothing** - Clothes (shirt, pants, shoes, etc.)
- **weather** - Weather (sunny, rainy, cold, etc.)
- **time** - Time words (morning, today, tomorrow, etc.)
- **toys** - Toys (ball, doll, bike, etc.)

---

## 🔧 Complete Example: Adding "Swimming"

Let's walk through adding a complete new word with a pictogram!

### Step 1: Find the Pictogram
1. Go to https://arasaac.org/pictograms/search
2. Search for "swimming"
3. Click on a colorful pictogram you like
4. Note the ID from the URL (let's say it's 5730)

### Step 2: Add to Pictograms Object
Open `data/defaultTiles.ts` and add:

```typescript
const pictograms: Record<string, string> = {
  // ... existing pictograms ...
  
  // Actions - Gender-neutral
  eat: 'https://static.arasaac.org/pictograms/11936/11936_2500.png',
  drink: 'https://static.arasaac.org/pictograms/5712/5712_2500.png',
  swimming: 'https://static.arasaac.org/pictograms/5730/5730_2500.png',  // ← ADD THIS
  
  // ... more pictograms ...
};
```

### Step 3: Add to Default Tiles
Scroll down and add to the actions category:

```typescript
export const defaultTiles: Tile[] = [
  // ... existing tiles ...
  
  // Actions
  t('actions', 'eat'),
  t('actions', 'drink'),
  t('actions', 'sleep'),
  t('actions', 'play'),
  t('actions', 'swimming'),  // ← ADD THIS
  
  // ... more tiles ...
];
```

### Step 4: Force Update
Open `hooks/useLibrary.ts` and increment the version:

```typescript
const CURRENT_SEED_VERSION = 7;  // Changed from 6 to 7
```

### Step 5: Test
Restart your app and look for "swimming" in the Actions category!

---

## 🚨 Common Issues and Solutions

### Issue 1: Pictogram Not Showing
**Problem:** The tile shows an icon instead of the pictogram.

**Solutions:**
1. Check that the pictogram ID is correct
2. Verify the URL format: `https://static.arasaac.org/pictograms/{ID}/{ID}_2500.png`
3. Make sure the word in the `pictograms` object is **lowercase**
4. Check the browser console for error messages

### Issue 2: Changes Not Appearing
**Problem:** You updated the code but the app still shows old pictograms.

**Solutions:**
1. Increment `CURRENT_SEED_VERSION` in `hooks/useLibrary.ts`
2. Clear the app's storage (Settings → Reset Tiles)
3. Restart the app completely

### Issue 3: Word and Pictogram Don't Match
**Problem:** The pictogram doesn't match the word on the tile.

**Solutions:**
1. Search ARASAAC again for a better match
2. Try different search terms (e.g., "automobile" instead of "car")
3. Check if the pictogram is gender-neutral when it should be

### Issue 4: Pictogram ID Doesn't Exist
**Problem:** The pictogram URL returns a 404 error.

**Solutions:**
1. Double-check the ID from the ARASAAC website
2. Make sure you're using the correct URL format
3. Try a different pictogram

---

## 📝 Best Practices

### 1. Use Colorful Pictograms
Always use the `_2500.png` variant for high-quality, colorful images.

### 2. Keep Words Lowercase in Pictograms Object
```typescript
// ✅ CORRECT
i: 'https://static.arasaac.org/pictograms/8224/8224_2500.png',

// ❌ WRONG
I: 'https://static.arasaac.org/pictograms/8224/8224_2500.png',
```

### 3. Match Case in Tiles
```typescript
// The tile text can have any case
t('core', 'I'),  // This is fine!
```

### 4. Gender-Neutral by Default
Use gender-neutral pictograms unless the word specifically refers to a gender:
- ✅ Gender-neutral: "friend", "teacher", "doctor"
- ✅ Gendered: "mom", "dad", "he", "she", "brother", "sister"

### 5. Increment Seed Version After Changes
Every time you update pictograms, increment the `CURRENT_SEED_VERSION` to ensure all users get the updates.

### 6. Test Your Changes
Always test new pictograms in the app to make sure they:
- Display correctly
- Match the word meaning
- Are appropriate for the audience

---

## 🎓 Advanced: Custom Images

You can also use custom images (not from ARASAAC) by using the `imageUrl` or `imageUri` properties:

```typescript
const customTile: Tile = {
  id: 'custom-photo',
  text: 'My Photo',
  category: 'people',
  color: '#9B59B6',
  imageUrl: 'https://example.com/my-photo.jpg',  // Custom URL
  // OR
  imageUri: 'file:///path/to/local/image.jpg',  // Local file
};
```

**Note:** The app prioritizes images in this order:
1. `image` (ARASAAC pictograms) - **Highest priority**
2. `imageUrl` (Custom web images)
3. `imageUri` (Local device images)
4. Fallback icon (if no image is provided)

---

## 📞 Need Help?

If you're stuck or need assistance:

1. **Check the console logs** - Look for error messages about failed image loads
2. **Verify the pictogram ID** - Visit the ARASAAC URL directly in your browser
3. **Review this guide** - Make sure you followed all steps correctly
4. **Reset and try again** - Use Settings → Reset Tiles to start fresh

---

## 🎉 Summary Checklist

When adding or updating pictograms:

- [ ] Find the pictogram on ARASAAC website
- [ ] Note the pictogram ID from the URL
- [ ] Add/update the entry in the `pictograms` object (lowercase!)
- [ ] Use the format: `https://static.arasaac.org/pictograms/{ID}/{ID}_2500.png`
- [ ] Add the tile to `defaultTiles` array (if new word)
- [ ] Increment `CURRENT_SEED_VERSION` in `hooks/useLibrary.ts`
- [ ] Test in the app
- [ ] Verify the pictogram displays correctly

---

**Happy pictogram managing! 🎨✨**
