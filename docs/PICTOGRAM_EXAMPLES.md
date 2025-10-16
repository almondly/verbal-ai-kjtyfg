
# 🎨 Pictogram Examples & Visual Guide

## 📸 Real Examples from the App

This guide shows you actual working examples from the codebase.

---

## ✅ Example 1: The Word "I"

### ARASAAC Search
1. Go to: https://arasaac.org/pictograms/search
2. Search: "I"
3. Click on pictogram showing person pointing to self
4. URL shows: `https://arasaac.org/pictograms/8224`
5. ID is: **8224**

### In Code (data/defaultTiles.ts)

```typescript
const pictograms: Record<string, string> = {
  // ... other pictograms ...
  
  i: 'https://static.arasaac.org/pictograms/8224/8224_2500.png',
  
  // ... more pictograms ...
};

export const defaultTiles: Tile[] = [
  // ... other tiles ...
  
  t('core', 'I'),  // Note: Capital I in tile, lowercase in pictograms
  
  // ... more tiles ...
];
```

### Result
✅ Tile displays with colorful pictogram of person pointing to self

---

## ✅ Example 2: The Word "happy"

### ARASAAC Search
1. Search: "happy"
2. Find colorful smiley face pictogram
3. ID: **7012**

### In Code

```typescript
const pictograms: Record<string, string> = {
  happy: 'https://static.arasaac.org/pictograms/7012/7012_2500.png',
};

export const defaultTiles: Tile[] = [
  t('feelings', 'happy'),
];
```

### Result
✅ Tile displays with colorful happy face pictogram

---

## ✅ Example 3: The Word "pizza"

### ARASAAC Search
1. Search: "pizza"
2. Find pictogram of pizza slice
3. ID: **7987**

### In Code

```typescript
const pictograms: Record<string, string> = {
  pizza: 'https://static.arasaac.org/pictograms/7987/7987_2500.png',
};

export const defaultTiles: Tile[] = [
  t('food', 'pizza'),
];
```

### Result
✅ Tile displays with colorful pizza pictogram

---

## ✅ Example 4: Multi-word Phrase "all done"

### ARASAAC Search
1. Search: "finished" or "done"
2. Find pictogram showing completion
3. ID: **5426**

### In Code

```typescript
const pictograms: Record<string, string> = {
  'all done': 'https://static.arasaac.org/pictograms/5426/5426_2500.png',
  finished: 'https://static.arasaac.org/pictograms/5426/5426_2500.png',  // Same pictogram
};

export const defaultTiles: Tile[] = [
  t('core', 'all done'),
  t('core', 'finished'),
];
```

### Result
✅ Both tiles display with the same "finished" pictogram

---

## ✅ Example 5: Gender-Specific Word "mom"

### ARASAAC Search
1. Search: "mother" or "mom"
2. Find pictogram of female parent
3. ID: **2398**

### In Code

```typescript
const pictograms: Record<string, string> = {
  mom: 'https://static.arasaac.org/pictograms/2398/2398_2500.png',
  dad: 'https://static.arasaac.org/pictograms/2397/2397_2500.png',
};

export const defaultTiles: Tile[] = [
  t('people', 'mom'),
  t('people', 'dad'),
];
```

### Result
✅ "mom" shows female parent pictogram
✅ "dad" shows male parent pictogram

---

## 🆕 Example 6: Adding a New Word "swimming"

### Step-by-Step

#### 1. Find on ARASAAC
```
Search: "swimming"
Found: Person swimming pictogram
ID: 5730
```

#### 2. Add to pictograms object
```typescript
const pictograms: Record<string, string> = {
  // ... existing pictograms ...
  
  // Actions - Gender-neutral
  eat: 'https://static.arasaac.org/pictograms/11936/11936_2500.png',
  drink: 'https://static.arasaac.org/pictograms/5712/5712_2500.png',
  swimming: 'https://static.arasaac.org/pictograms/5730/5730_2500.png',  // ← NEW
  
  // ... more pictograms ...
};
```

#### 3. Add to defaultTiles array
```typescript
export const defaultTiles: Tile[] = [
  // ... existing tiles ...
  
  // Actions
  t('actions', 'eat'),
  t('actions', 'drink'),
  t('actions', 'swimming'),  // ← NEW
  
  // ... more tiles ...
];
```

#### 4. Increment version
```typescript
// In hooks/useLibrary.ts
const CURRENT_SEED_VERSION = 7;  // Changed from 6 to 7
```

#### 5. Result
✅ New "swimming" tile appears in Actions category with pictogram

---

## 🔄 Example 7: Updating an Existing Pictogram

### Scenario
You want to change the "happy" pictogram to a different one.

#### 1. Find new pictogram
```
Search: "happy" or "smile"
Found: Different happy face
New ID: 7021 (example)
```

#### 2. Update pictograms object
```typescript
const pictograms: Record<string, string> = {
  // BEFORE:
  // happy: 'https://static.arasaac.org/pictograms/7012/7012_2500.png',
  
  // AFTER:
  happy: 'https://static.arasaac.org/pictograms/7021/7021_2500.png',
};
```

#### 3. Increment version
```typescript
const CURRENT_SEED_VERSION = 7;  // Increment by 1
```

#### 4. Result
✅ All users see the new "happy" pictogram after app restart

---

## 🎯 Example 8: Category-Specific Pictograms

### Different Categories, Different Colors

```typescript
// Food category (orange)
t('food', 'apple'),    // Orange border
t('food', 'pizza'),    // Orange border

// Actions category (green)
t('actions', 'eat'),   // Green border
t('actions', 'drink'), // Green border

// Feelings category (yellow)
t('feelings', 'happy'), // Yellow border
t('feelings', 'sad'),   // Yellow border
```

### Result
✅ Each category has its own color
✅ Pictograms are colorful and match the word
✅ Consistent visual organization

---

## 📊 Example 9: Complete Tile Object

### What a Tile Looks Like

```typescript
{
  id: 'food-pizza',
  text: 'pizza',
  category: 'food',
  color: '#E67E22',  // Orange
  image: 'https://static.arasaac.org/pictograms/7987/7987_2500.png'
}
```

### How It's Created

```typescript
// Using the helper function
t('food', 'pizza')

// Expands to:
{
  id: 'food-pizza',                    // Auto-generated
  text: 'pizza',                       // From parameter
  category: 'food',                    // From parameter
  color: categoryColor['food'],        // Auto-assigned (#E67E22)
  image: pictograms['pizza'],          // Auto-assigned from pictograms object
}
```

---

## 🎨 Example 10: URL Variants Comparison

### Same Pictogram, Different Sizes

```typescript
// High resolution (RECOMMENDED)
'https://static.arasaac.org/pictograms/8224/8224_2500.png'
// File size: ~150KB, Quality: Excellent

// Standard resolution
'https://static.arasaac.org/pictograms/8224/8224_500.png'
// File size: ~30KB, Quality: Good

// Low resolution
'https://static.arasaac.org/pictograms/8224/8224_300.png'
// File size: ~15KB, Quality: Fair
```

### Recommendation
✅ Always use `_2500.png` for best quality on all devices

---

## 🔍 Example 11: Debugging a Pictogram

### Problem: Pictogram not showing for "bicycle"

#### Step 1: Check the code
```typescript
const pictograms: Record<string, string> = {
  bicycle: 'https://static.arasaac.org/pictograms/2723/2723_2500.png',
};
```

#### Step 2: Test the URL
Open in browser: `https://static.arasaac.org/pictograms/2723/2723_2500.png`

#### Step 3: Check console
```javascript
console.log('Tile:', tile);
console.log('Image:', tile.image);
```

#### Step 4: Verify case
```typescript
// pictograms object uses lowercase
bicycle: '...',  // ✅ Correct

// tile can use any case
t('toys', 'bicycle'),  // ✅ Correct
t('toys', 'Bicycle'),  // ✅ Also works
```

---

## 📝 Example 12: Common Patterns

### Pattern 1: Synonyms Share Pictograms
```typescript
const pictograms: Record<string, string> = {
  'all done': 'https://static.arasaac.org/pictograms/5426/5426_2500.png',
  finished: 'https://static.arasaac.org/pictograms/5426/5426_2500.png',
};
```

### Pattern 2: Related Words, Different Pictograms
```typescript
const pictograms: Record<string, string> = {
  happy: 'https://static.arasaac.org/pictograms/7012/7012_2500.png',
  sad: 'https://static.arasaac.org/pictograms/7013/7013_2500.png',
  angry: 'https://static.arasaac.org/pictograms/7014/7014_2500.png',
};
```

### Pattern 3: Number Sequence
```typescript
const pictograms: Record<string, string> = {
  '1': 'https://static.arasaac.org/pictograms/7994/7994_2500.png',
  '2': 'https://static.arasaac.org/pictograms/7995/7995_2500.png',
  '3': 'https://static.arasaac.org/pictograms/7996/7996_2500.png',
  // Sequential IDs for sequential numbers
};
```

---

## ✨ Example 13: Before and After

### Before (No Pictogram)
```typescript
const pictograms: Record<string, string> = {
  // "bicycle" not defined
};

export const defaultTiles: Tile[] = [
  t('toys', 'bicycle'),  // Shows fallback icon
];
```

**Result:** 🔵 Generic icon displayed

### After (With Pictogram)
```typescript
const pictograms: Record<string, string> = {
  bicycle: 'https://static.arasaac.org/pictograms/2723/2723_2500.png',
};

export const defaultTiles: Tile[] = [
  t('toys', 'bicycle'),  // Shows bicycle pictogram
];
```

**Result:** 🚲 Colorful bicycle pictogram displayed

---

## 🎓 Example 14: Full Workflow

### Adding "swimming" from Start to Finish

```typescript
// 1. BEFORE - No swimming tile exists
// data/defaultTiles.ts
const pictograms: Record<string, string> = {
  play: 'https://static.arasaac.org/pictograms/2691/2691_2500.png',
  // No swimming yet
};

// 2. SEARCH ARASAAC
// Found: ID 5730 for swimming

// 3. ADD TO PICTOGRAMS
const pictograms: Record<string, string> = {
  play: 'https://static.arasaac.org/pictograms/2691/2691_2500.png',
  swimming: 'https://static.arasaac.org/pictograms/5730/5730_2500.png',  // ← ADDED
};

// 4. ADD TO TILES
export const defaultTiles: Tile[] = [
  t('actions', 'play'),
  t('actions', 'swimming'),  // ← ADDED
];

// 5. INCREMENT VERSION
// hooks/useLibrary.ts
const CURRENT_SEED_VERSION = 7;  // Was 6, now 7

// 6. RESULT
// ✅ "swimming" tile appears in Actions category
// ✅ Shows colorful swimming pictogram
// ✅ All users get the update
```

---

## 🎉 Summary

You've seen:
- ✅ Real working examples from the codebase
- ✅ Step-by-step addition process
- ✅ Update procedures
- ✅ Common patterns
- ✅ Debugging techniques
- ✅ Before/after comparisons
- ✅ Complete workflows

**Now you're ready to manage pictograms like a pro! 🚀**
