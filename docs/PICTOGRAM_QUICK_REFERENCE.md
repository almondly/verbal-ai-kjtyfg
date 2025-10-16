
# 🚀 Pictogram Quick Reference Card

## 📍 File Locations
- **Pictograms:** `data/defaultTiles.ts` (line ~25)
- **Tiles:** `data/defaultTiles.ts` (line ~300)
- **Version:** `hooks/useLibrary.ts` (line ~7)

---

## 🔗 ARASAAC URL Format
```
https://static.arasaac.org/pictograms/{ID}/{ID}_2500.png
```

**Example:**
```
https://static.arasaac.org/pictograms/8224/8224_2500.png
```

---

## ➕ Add New Pictogram (3 Steps)

### 1️⃣ Add to pictograms object (lowercase!)
```typescript
const pictograms: Record<string, string> = {
  'word': 'https://static.arasaac.org/pictograms/ID/ID_2500.png',
};
```

### 2️⃣ Add to defaultTiles array
```typescript
t('category', 'Word'),
```

### 3️⃣ Increment version
```typescript
const CURRENT_SEED_VERSION = 7;  // +1
```

---

## 🔄 Update Existing Pictogram (2 Steps)

### 1️⃣ Change URL in pictograms object
```typescript
word: 'https://static.arasaac.org/pictograms/NEW_ID/NEW_ID_2500.png',
```

### 2️⃣ Increment version
```typescript
const CURRENT_SEED_VERSION = 7;  // +1
```

---

## 🎨 Categories
`core` `people` `actions` `feelings` `food` `home` `school` `body` `places` `routines` `questions` `colours` `numbers` `animals` `clothing` `weather` `time` `toys`

---

## 🔍 Find Pictograms
**Website:** https://arasaac.org/pictograms/search

**Get ID from URL:**
```
https://arasaac.org/pictograms/8224
                              ^^^^
                           This is the ID!
```

---

## ✅ Checklist
- [ ] Find pictogram on ARASAAC
- [ ] Get ID from URL
- [ ] Add to `pictograms` object (lowercase)
- [ ] Add to `defaultTiles` array (if new)
- [ ] Increment `CURRENT_SEED_VERSION`
- [ ] Test in app

---

## 🚨 Troubleshooting
- **Not showing?** → Check ID, URL format, lowercase
- **Not updating?** → Increment version, restart app
- **Wrong image?** → Search ARASAAC again
- **404 error?** → Verify ID exists on ARASAAC

---

## 📖 Full Guide
See `docs/PICTOGRAM_MANAGEMENT_GUIDE.md` for complete instructions!
