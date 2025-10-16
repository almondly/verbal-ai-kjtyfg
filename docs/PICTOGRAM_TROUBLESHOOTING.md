
# 🔧 Pictogram Troubleshooting Guide

## 🚨 Problem: Pictogram Not Showing

### Step 1: Check the Console
Open your browser's developer console (F12) and look for errors.

**Common error messages:**
```
Failed to load ARASAAC pictogram for tile: [word]
```

---

### Step 2: Verify the Pictogram ID

1. Open `data/defaultTiles.ts`
2. Find your word in the `pictograms` object
3. Copy the ID from the URL

**Example:**
```typescript
happy: 'https://static.arasaac.org/pictograms/7012/7012_2500.png',
                                              ^^^^
                                           Copy this ID
```

4. Visit this URL in your browser:
```
https://arasaac.org/pictograms/7012
```

5. Does the pictogram load?
   - ✅ **YES** → Go to Step 3
   - ❌ **NO** → The ID doesn't exist. Find a new pictogram on ARASAAC.

---

### Step 3: Check the URL Format

Your URL should look **exactly** like this:
```
https://static.arasaac.org/pictograms/{ID}/{ID}_2500.png
```

**Common mistakes:**
```
❌ https://arasaac.org/pictograms/8224/8224_2500.png
   (Missing "static.")

❌ https://static.arasaac.org/pictograms/8224/8224_500.png
   (Wrong variant - should be _2500)

❌ https://static.arasaac.org/pictograms/8224/8224.png
   (Missing variant)

✅ https://static.arasaac.org/pictograms/8224/8224_2500.png
   (CORRECT!)
```

---

### Step 4: Check Word Case

In the `pictograms` object, words must be **lowercase**:

```typescript
// ✅ CORRECT
const pictograms: Record<string, string> = {
  i: 'https://static.arasaac.org/pictograms/8224/8224_2500.png',
  you: 'https://static.arasaac.org/pictograms/1262/1262_2500.png',
};

// ❌ WRONG
const pictograms: Record<string, string> = {
  I: 'https://static.arasaac.org/pictograms/8224/8224_2500.png',
  You: 'https://static.arasaac.org/pictograms/1262/1262_2500.png',
};
```

**Note:** The tile text can have any case:
```typescript
t('core', 'I'),  // This is fine!
```

---

### Step 5: Check for Typos

Common typos to look for:
- Missing `https://`
- Wrong domain (should be `static.arasaac.org`)
- Missing `/pictograms/`
- ID mismatch (ID appears twice in URL)
- Missing `_2500.png`
- Extra spaces or characters

---

### Step 6: Force Update

If the URL is correct but the pictogram still doesn't show:

1. Open `hooks/useLibrary.ts`
2. Find this line:
```typescript
const CURRENT_SEED_VERSION = 6;
```
3. Increment it:
```typescript
const CURRENT_SEED_VERSION = 7;
```
4. Save the file
5. Restart the app completely

---

## 🔄 Problem: Changes Not Appearing

### Solution 1: Increment Seed Version
```typescript
// In hooks/useLibrary.ts
const CURRENT_SEED_VERSION = 7;  // Increase by 1
```

### Solution 2: Clear App Storage
1. Go to Settings in the app
2. Tap "Reset Tiles to Defaults"
3. Restart the app

### Solution 3: Hard Refresh
- **Web:** Press Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- **Mobile:** Close the app completely and reopen

---

## 🎨 Problem: Wrong Pictogram Showing

### Solution 1: Search Again
The pictogram might not be the best match. Try:
1. Different search terms on ARASAAC
2. Synonyms (e.g., "automobile" instead of "car")
3. Simpler terms (e.g., "eat" instead of "eating")

### Solution 2: Check Gender Neutrality
Make sure you're using:
- ✅ Gender-neutral for general words
- ✅ Gendered only for specific words (mom, dad, he, she)

---

## 🌐 Problem: Pictogram Loads Slowly

### Possible Causes:
1. **Slow internet connection** - ARASAAC images are loaded from the web
2. **Large image size** - Using _2500.png (high resolution)

### Solutions:
1. **Wait a moment** - Images cache after first load
2. **Check internet** - Ensure stable connection
3. **Use lower resolution** (not recommended):
   ```typescript
   // Change _2500.png to _500.png (lower quality)
   word: 'https://static.arasaac.org/pictograms/8224/8224_500.png',
   ```

---

## 🔍 Problem: Can't Find Pictogram on ARASAAC

### Solution 1: Try Different Search Terms
```
Instead of:        Try:
"automobile"   →   "car"
"physician"    →   "doctor"
"beverage"     →   "drink"
"happy"        →   "smile"
```

### Solution 2: Browse Categories
On ARASAAC, use the category filters to browse pictograms by topic.

### Solution 3: Use Similar Pictogram
If you can't find an exact match, use a similar concept:
```
"bicycle"      →   "bike"
"photograph"   →   "picture"
"instructor"   →   "teacher"
```

---

## 📱 Problem: Pictogram Looks Different on Mobile

### Cause:
Different screen sizes and resolutions.

### Solution:
This is normal! The pictograms are responsive and adapt to screen size. The _2500.png variant ensures they look good on all devices.

---

## 🎯 Problem: Multiple Words, One Pictogram

### Example:
"all" and "they" use the same pictogram (group of people).

### Solution:
This is intentional! Some concepts share pictograms. If you want different pictograms:

1. Search ARASAAC for alternatives
2. Update the pictogram ID for one of the words
3. Increment the seed version

---

## 🛠️ Advanced Troubleshooting

### Check Image Load in Browser
1. Copy the full pictogram URL
2. Paste it directly in your browser
3. Does the image load?
   - ✅ **YES** → Problem is in the app code
   - ❌ **NO** → Problem is with the URL or ARASAAC

### Check Network Tab
1. Open browser DevTools (F12)
2. Go to Network tab
3. Filter by "Img"
4. Look for failed requests (red)
5. Click on failed request to see error details

### Check Tile Object
Add this to your code temporarily:
```typescript
console.log('Tile data:', tile);
console.log('Image URL:', tile.image);
```

This will show you exactly what data the tile has.

---

## 📞 Still Stuck?

### Checklist:
- [ ] Verified pictogram ID exists on ARASAAC
- [ ] Checked URL format is correct
- [ ] Confirmed word is lowercase in pictograms object
- [ ] Incremented CURRENT_SEED_VERSION
- [ ] Restarted app completely
- [ ] Checked browser console for errors
- [ ] Tried resetting tiles to defaults

### If all else fails:
1. Check `docs/PICTOGRAM_MANAGEMENT_GUIDE.md` for detailed instructions
2. Review `docs/CURRENT_PICTOGRAMS_STATUS.md` for working examples
3. Compare your code with working pictograms

---

## ✅ Quick Fixes Summary

| Problem | Quick Fix |
|---------|-----------|
| Not showing | Check URL format, increment version |
| Not updating | Increment CURRENT_SEED_VERSION |
| Wrong image | Search ARASAAC again |
| Slow loading | Wait for cache, check internet |
| Can't find | Try different search terms |
| 404 error | Verify ID on ARASAAC website |

---

**Remember:** Always increment `CURRENT_SEED_VERSION` after making changes!
