
# 🎨 Pictogram System Overview

## 📚 Complete Documentation Index

This is your central hub for understanding and managing pictograms in the AAC app.

---

## 📖 Available Guides

### 1. **PICTOGRAM_MANAGEMENT_GUIDE.md** 📘
**Complete step-by-step guide for managing pictograms**

**Use this when:**
- Adding new words with pictograms
- Updating existing pictograms
- Learning how the system works
- You need detailed instructions

**Topics covered:**
- Finding pictograms on ARASAAC
- Understanding URL formats
- Adding new words
- Updating existing pictograms
- Categories and organization
- Complete examples
- Best practices

---

### 2. **PICTOGRAM_QUICK_REFERENCE.md** 🚀
**One-page quick reference card**

**Use this when:**
- You know what to do but need a reminder
- Quick lookup of file locations
- Fast reference for URL format
- Checklist for adding pictograms

**Topics covered:**
- File locations
- URL format
- Quick steps for adding/updating
- Category list
- Troubleshooting checklist

---

### 3. **CURRENT_PICTOGRAMS_STATUS.md** 📊
**Status of all pictograms in the app**

**Use this when:**
- Checking which pictograms are working
- Reviewing recent fixes
- Seeing all available words
- Understanding version history

**Topics covered:**
- Recently fixed pictograms
- Complete list by category
- Statistics
- Version history
- Alignment verification

---

### 4. **PICTOGRAM_TROUBLESHOOTING.md** 🔧
**Detailed troubleshooting guide**

**Use this when:**
- Pictograms not showing
- Changes not appearing
- Wrong pictogram displaying
- Any problems or errors

**Topics covered:**
- Step-by-step problem solving
- Common errors and solutions
- Advanced troubleshooting
- Quick fixes table

---

## 🎯 How the Pictogram System Works

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    ARASAAC Website                      │
│         https://arasaac.org/pictograms/search           │
│                                                         │
│  1. Search for word                                     │
│  2. Find pictogram                                      │
│  3. Get ID from URL                                     │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              data/defaultTiles.ts                       │
│                                                         │
│  const pictograms = {                                   │
│    word: 'https://static.arasaac.org/.../ID_2500.png'  │
│  }                                                      │
│                                                         │
│  export const defaultTiles = [                          │
│    t('category', 'word')                                │
│  ]                                                      │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              hooks/useLibrary.ts                        │
│                                                         │
│  - Loads tiles from storage                             │
│  - Merges with defaults                                 │
│  - Checks CURRENT_SEED_VERSION                          │
│  - Updates tiles if version changed                     │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              components/TileItem.tsx                    │
│                                                         │
│  - Displays tile with pictogram                         │
│  - Priority: image > imageUrl > imageUri > icon         │
│  - Handles loading errors                               │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   User sees tile                        │
│              with colorful pictogram!                   │
└─────────────────────────────────────────────────────────┘
```

---

## 🔑 Key Concepts

### 1. Pictogram Object
Stores the mapping between words and ARASAAC URLs:
```typescript
const pictograms: Record<string, string> = {
  'word': 'https://static.arasaac.org/pictograms/ID/ID_2500.png',
};
```

### 2. Tile Helper Function
Creates tiles with automatic pictogram assignment:
```typescript
const t = (category: string, text: string): Tile => ({
  id: `${category}-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
  text,
  category,
  color: categoryColor[category],
  image: pictograms[text.toLowerCase()],  // ← Auto-assigned!
});
```

### 3. Seed Version
Forces updates when pictograms change:
```typescript
const CURRENT_SEED_VERSION = 6;  // Increment to force update
```

### 4. Image Priority
The app displays images in this order:
1. `tile.image` (ARASAAC pictograms) ← **Highest priority**
2. `tile.imageUrl` (Custom web images)
3. `tile.imageUri` (Local device images)
4. Fallback icon (if no image)

---

## 📁 File Structure

```
your-app/
├── data/
│   └── defaultTiles.ts          ← Pictogram URLs and tile definitions
├── hooks/
│   └── useLibrary.ts            ← Tile loading and version management
├── components/
│   ├── TileItem.tsx             ← Tile display with pictogram
│   ├── TileEditor.tsx           ← Edit tiles and pictograms
│   └── PictogramSelector.tsx    ← Search and select pictograms
├── docs/
│   ├── PICTOGRAM_MANAGEMENT_GUIDE.md      ← Complete guide
│   ├── PICTOGRAM_QUICK_REFERENCE.md       ← Quick reference
│   ├── CURRENT_PICTOGRAMS_STATUS.md       ← Status and history
│   ├── PICTOGRAM_TROUBLESHOOTING.md       ← Problem solving
│   └── PICTOGRAM_SYSTEM_OVERVIEW.md       ← This file!
└── types/
    └── index.ts                 ← Tile type definition
```

---

## 🔄 Workflow: Adding a New Pictogram

```
1. Find pictogram on ARASAAC
   ↓
2. Get pictogram ID from URL
   ↓
3. Add to pictograms object in defaultTiles.ts
   ↓
4. Add tile to defaultTiles array
   ↓
5. Increment CURRENT_SEED_VERSION in useLibrary.ts
   ↓
6. Save files
   ↓
7. Restart app
   ↓
8. Test and verify
```

---

## 🎨 ARASAAC Integration

### What is ARASAAC?
**ARASAAC** (Aragonese Portal of Augmentative and Alternative Communication) is a free, open-source pictogram library designed for AAC communication.

### Why ARASAAC?
- ✅ Free and open-source
- ✅ High-quality, colorful pictograms
- ✅ Designed specifically for AAC
- ✅ Large library (thousands of pictograms)
- ✅ Multiple languages supported
- ✅ Regularly updated
- ✅ Gender-neutral options available

### URL Structure
```
https://static.arasaac.org/pictograms/{ID}/{ID}_{VARIANT}.png

Components:
- static.arasaac.org  = CDN domain
- pictograms          = Resource type
- {ID}                = Unique pictogram identifier
- {VARIANT}           = Image size/style (_2500, _500, _300)
- .png                = File format
```

---

## 🛠️ Maintenance Tasks

### Regular Maintenance
- ✅ Review pictograms for accuracy
- ✅ Update pictograms when better options available
- ✅ Add new words as needed
- ✅ Check for broken links
- ✅ Verify gender-neutral options

### When to Increment Seed Version
Increment `CURRENT_SEED_VERSION` when you:
- Update existing pictogram URLs
- Fix broken pictograms
- Change pictogram IDs
- Want to force update for all users

**Don't increment when:**
- Adding new tiles (they'll appear automatically)
- Changing tile text or colors
- Modifying categories

---

## 📊 Current Status (Version 6)

### ✅ Working Correctly
- All 248 pictograms verified
- High-resolution color images (_2500.png)
- Gender-neutral where appropriate
- Aligned with ARASAAC database

### 🔧 Recent Fixes
- Fixed "I" pictogram (ID: 8224)
- Fixed "you" pictogram (ID: 1262)
- Fixed "he" pictogram (ID: 1885)
- Added "all" pictogram (ID: 2544)

---

## 🎓 Learning Path

### Beginner
1. Read **PICTOGRAM_MANAGEMENT_GUIDE.md** (sections 1-4)
2. Try adding one new pictogram
3. Use **PICTOGRAM_QUICK_REFERENCE.md** as a cheat sheet

### Intermediate
1. Update multiple existing pictograms
2. Understand the seed version system
3. Use **PICTOGRAM_TROUBLESHOOTING.md** when needed

### Advanced
1. Customize the pictogram system
2. Add custom image support
3. Modify the tile display logic
4. Create custom categories

---

## 🚀 Quick Start

**Want to add a pictogram right now?**

1. Go to https://arasaac.org/pictograms/search
2. Search for your word
3. Click a pictogram and note the ID
4. Open `data/defaultTiles.ts`
5. Add: `word: 'https://static.arasaac.org/pictograms/ID/ID_2500.png',`
6. Add: `t('category', 'word'),`
7. Open `hooks/useLibrary.ts`
8. Change: `const CURRENT_SEED_VERSION = 7;`
9. Save and restart!

---

## 📞 Support Resources

### Documentation
- **Complete Guide:** PICTOGRAM_MANAGEMENT_GUIDE.md
- **Quick Reference:** PICTOGRAM_QUICK_REFERENCE.md
- **Status:** CURRENT_PICTOGRAMS_STATUS.md
- **Troubleshooting:** PICTOGRAM_TROUBLESHOOTING.md

### External Resources
- **ARASAAC Website:** https://arasaac.org
- **Pictogram Search:** https://arasaac.org/pictograms/search
- **ARASAAC API Docs:** https://arasaac.org/developers/api

### Code References
- **Tile Type:** `types/index.ts`
- **Pictograms:** `data/defaultTiles.ts`
- **Display Logic:** `components/TileItem.tsx`
- **Version Control:** `hooks/useLibrary.ts`

---

## ✨ Best Practices Summary

1. **Always use _2500.png** for high quality
2. **Lowercase in pictograms object** for consistency
3. **Increment seed version** after updates
4. **Test thoroughly** before deploying
5. **Use gender-neutral** pictograms by default
6. **Document changes** in version history
7. **Verify on ARASAAC** before adding
8. **Keep URLs consistent** with the format

---

## 🎉 You're Ready!

You now have everything you need to manage pictograms in your AAC app:

- ✅ Complete documentation
- ✅ Quick reference cards
- ✅ Troubleshooting guides
- ✅ Working examples
- ✅ Best practices

**Happy pictogram managing! 🎨✨**
