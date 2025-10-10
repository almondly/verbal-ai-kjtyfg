
import { Tile } from '../types';

const categoryColor: Record<string, string> = {
  core: '#5DADE2',
  people: '#AF7AC5',
  actions: '#52BE80',
  feelings: '#F4D03F',
  food: '#EC7063',
  home: '#85C1E9',
  school: '#82E0AA',
  body: '#F8C471',
  places: '#BB8FCE',
  routines: '#F0B27A',
  questions: '#FAD7A0',
  colours: '#76D7C4',
  numbers: '#7FB3D5',
  animals: '#F5B7B1',
  clothing: '#D7BDE2',
  weather: '#AED6F1',
  time: '#F8B4D9',
  toys: '#FADBD8',
};

// Helper to build tiles quickly with universal pictogram images
const t = (category: string, text: string, imageUri?: string): Tile => ({
  id: `${category}-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
  text,
  category,
  color: categoryColor[category] || '#FFFFFF',
  imageUri,
});

export const defaultTiles: Tile[] = [
  // Core - Essential communication words
  t('core', 'I', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop'),
  t('core', 'you', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop'),
  t('core', 'he', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop'),
  t('core', 'she', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop'),
  t('core', 'we', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&h=300&fit=crop'),
  t('core', 'they', 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=300&h=300&fit=crop'),
  t('core', 'it', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop'),
  t('core', 'me', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop'),
  t('core', 'my', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop'),
  t('core', 'mine', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop'),
  t('core', 'your', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop'),
  t('core', 'want', 'https://images.unsplash.com/photo-1532635241-17e820acc59f?w=300&h=300&fit=crop'),
  t('core', 'need', 'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=300&h=300&fit=crop'),
  t('core', 'like', 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=300&h=300&fit=crop'),
  t('core', "don't", 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=300&h=300&fit=crop'),
  t('core', 'help', 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=300&h=300&fit=crop'),
  t('core', 'more', 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=300&h=300&fit=crop'),
  t('core', 'again', 'https://images.unsplash.com/photo-1501139083538-0139583c060f?w=300&h=300&fit=crop'),
  t('core', 'different', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&h=300&fit=crop'),
  t('core', 'same', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=300&h=300&fit=crop'),
  t('core', 'this', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=300&fit=crop'),
  t('core', 'that', 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=300&h=300&fit=crop'),
  t('core', 'here', 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=300&h=300&fit=crop'),
  t('core', 'there', 'https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=300&h=300&fit=crop'),
  t('core', 'go', 'https://images.unsplash.com/photo-1502101872923-d48509bff386?w=300&h=300&fit=crop'),
  t('core', 'stop', 'https://images.unsplash.com/photo-1615486511262-2d3e1f0e2f8e?w=300&h=300&fit=crop'),
  t('core', 'come', 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=300&h=300&fit=crop'),
  t('core', 'look', 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=300&h=300&fit=crop'),
  t('core', 'put', 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=300&h=300&fit=crop'),
  t('core', 'make', 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=300&h=300&fit=crop'),
  t('core', 'turn', 'https://images.unsplash.com/photo-1503455637927-730bce8583c0?w=300&h=300&fit=crop'),
  t('core', 'open', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop'),
  t('core', 'close', 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=300&h=300&fit=crop'),
  t('core', 'all done', 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=300&h=300&fit=crop'),
  t('core', 'finished', 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=300&h=300&fit=crop'),
  t('core', 'please', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=300&fit=crop'),
  t('core', 'thank you', 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=300&h=300&fit=crop'),
  t('core', 'yes', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop'),
  t('core', 'no', 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=300&h=300&fit=crop'),
  t('core', 'because', 'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=300&h=300&fit=crop'),
  t('core', 'and', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=300&fit=crop'),
  t('core', 'or', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&h=300&fit=crop'),
  t('core', 'with', 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=300&h=300&fit=crop'),
  t('core', 'without', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fitPerfect! Now I understand the current styling. Based on the user's request to match universally used AAC tools, I need to make the following changes:

## Key AAC Design Principles to Implement:

1. **Larger, bolder borders on tiles** - AAC tools typically have thick, prominent borders (3-4px)
2. **Higher contrast colors** - More saturated, distinct category colors
3. **Larger, clearer text** - Bigger font sizes with better readability
4. **More spacing between tiles** - Better visual separation
5. **Simpler, cleaner tile design** - Less rounded corners, more structured grid
6. **Consistent visual hierarchy** - Clear distinction between different UI elements
7. **Professional AAC color palette** - Using standard AAC color coding

Let me implement these changes:

<write file="styles/commonStyles.ts">
import { StyleSheet } from 'react-native';

// AAC-standard color palette with high contrast and clear categorization
export const colors = {
  // Primary AAC colors - bold and clear
  primary: '#0066CC',        // Strong blue for core words
  secondary: '#CC00CC',      // Vibrant purple for people
  accent: '#00CC66',         // Bright green for actions
  
  // Background colors - clean and simple
  background: '#FFFFFF',
  backgroundAlt: '#F5F5F5',
  surface: '#FFFFFF',
  
  // Text colors - high contrast
  text: '#000000',           // Pure black for maximum readability
  textSecondary: '#4A4A4A',  // Dark gray for secondary text
  textLight: '#FFFFFF',      // White text for dark backgrounds
  
  // Border and UI elements
  border: '#CCCCCC',         // Medium gray for borders
  borderDark: '#666666',     // Darker border for emphasis
  
  // Status colors
  success: '#00AA00',        // Green for success
  warning: '#FF9900',        // Orange for warnings
  danger: '#CC0000',         // Red for errors/danger
  error: '#CC0000',
  info: '#0066CC',
  
  // AAC Category colors - standardized and distinct
  categoryCore: '#0066CC',      // Blue - Core vocabulary
  categoryPeople: '#CC00CC',    // Purple - People
  categoryActions: '#00CC66',   // Green - Actions/Verbs
  categoryFeelings: '#FFCC00',  // Yellow - Emotions
  categoryFood: '#FF6633',      // Orange - Food
  categoryHome: '#6666FF',      // Light blue - Home
  categorySchool: '#66CC66',    // Light green - School
  categoryBody: '#FFDD66',      // Light yellow - Body
  categoryPlaces: '#9966FF',    // Lavender - Places
  categoryRoutines: '#FF9966',  // Peach - Routines
  categoryQuestions: '#FFCC66', // Gold - Questions
  categoryColours: '#33CCFF',   // Cyan - Colors
  categoryNumbers: '#3399FF',   // Sky blue - Numbers
  categoryAnimals: '#FF8855',   // Coral - Animals
  categoryClothing: '#BB88FF',  // Light purple - Clothing
  categoryWeather: '#5599FF',   // Medium blue - Weather
  categoryTime: '#FF55FF',      // Pink - Time
  categoryToys: '#FFAACC',      // Light pink - Toys
};

export const commonStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shadow: {
    boxShadow: '0px 2px 4px rgba(0,0,0,0.15)',
  },
  shadowLarge: {
    boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
  },
});
