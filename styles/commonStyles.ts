
import { StyleSheet } from 'react-native';

// Restricted 5-color palette - ONLY these colors allowed for colored elements!
export const colors = {
  // The 5 approved colors
  color1: '#2faad6',  // Cyan blue
  color2: '#f35e69',  // Coral red
  color3: '#8fd2b0',  // Mint green
  color4: '#f271ab',  // Pink (UPDATED)
  color5: '#f9d809',  // Bright yellow
  
  // Primary colors mapped to the 5-color palette
  primary: '#2faad6',        // Cyan blue
  secondary: '#f35e69',      // Coral red
  accent: '#8fd2b0',         // Mint green
  
  // Background colors - WHITE backgrounds restored
  background: '#FFFFFF',     // White background
  backgroundAlt: '#F5F5F5',  // Light gray for phrase bar and suggestions (ORIGINAL COLOR)
  surface: '#FFFFFF',        // White surface for suggestions (ORIGINAL COLOR)
  
  // Text colors - ONLY BLACK
  text: '#000000',           // Black text ONLY
  textSecondary: '#666666',  // Dark gray for secondary text
  textLight: '#999999',      // Light gray for hints
  white: '#FFFFFF',          // White for buttons
  
  // Border and UI elements - using the 5 colors for tiles/categories
  border: '#E0E0E0',         // Light gray border (ORIGINAL COLOR)
  borderDark: '#CCCCCC',     // Darker gray border (ORIGINAL COLOR)
  borderLight: '#F0F0F0',    // Very light gray border (ORIGINAL COLOR)
  
  // Status colors - using the 5 colors
  success: '#8fd2b0',        // Mint green
  warning: '#f9d809',        // Bright yellow
  danger: '#f35e69',         // Coral red
  error: '#f35e69',          // Coral red
  info: '#2faad6',           // Cyan blue
  
  // AAC Category colors - ONLY using the 5 colors for tiles and category bar
  categoryCore: '#2faad6',      // Cyan blue - Core vocabulary
  categoryPeople: '#f271ab',    // Pink - People (UPDATED)
  categoryActions: '#8fd2b0',   // Mint green - Actions/Verbs
  categoryFeelings: '#f9d809',  // Bright yellow - Emotions
  categoryFood: '#f35e69',      // Coral red - Food
  categoryHome: '#2faad6',      // Cyan blue - Home
  categorySchool: '#8fd2b0',    // Mint green - School
  categoryBody: '#f9d809',      // Bright yellow - Body
  categoryPlaces: '#f271ab',    // Pink - Places (UPDATED)
  categoryRoutines: '#f35e69',  // Coral red - Routines
  categoryQuestions: '#f9d809', // Bright yellow - Questions
  categoryColours: '#2faad6',   // Cyan blue - Colors
  categoryNumbers: '#8fd2b0',   // Mint green - Numbers
  categoryAnimals: '#f271ab',   // Pink - Animals (UPDATED)
  categoryClothing: '#f35e69',  // Coral red - Clothing
  categoryWeather: '#2faad6',   // Cyan blue - Weather
  categoryTime: '#f9d809',      // Bright yellow - Time
  categoryToys: '#f271ab',      // Pink - Toys (UPDATED)
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
    boxShadow: '0px 3px 6px rgba(0,0,0,0.16)',
  },
  shadowLarge: {
    boxShadow: '0px 6px 12px rgba(0,0,0,0.2)',
  },
});
