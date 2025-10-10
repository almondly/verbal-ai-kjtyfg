
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
  borderLight: '#E0E0E0',    // Light border for subtle separation
  
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
