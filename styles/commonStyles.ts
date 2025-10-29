
import { StyleSheet } from 'react-native';

// Restricted 5-color palette - ONLY these colors allowed!
export const colors = {
  // The 5 approved colors
  color1: '#2faad6',  // Cyan blue
  color2: '#f35e69',  // Coral red
  color3: '#8fd2b0',  // Mint green
  color4: '#fb8d98',  // Pink
  color5: '#f9d809',  // Bright yellow
  
  // Primary colors mapped to the 5-color palette
  primary: '#2faad6',        // Cyan blue
  secondary: '#f35e69',      // Coral red
  accent: '#8fd2b0',         // Mint green
  
  // Background colors - using the 5 colors
  background: '#8fd2b0',     // Mint green background
  backgroundAlt: '#2faad6',  // Cyan blue alt
  surface: '#fb8d98',        // Pink surface
  
  // Text colors - ONLY BLACK
  text: '#000000',           // Black text ONLY
  textSecondary: '#000000',  // Black text ONLY
  textLight: '#000000',      // Black text ONLY (no white!)
  
  // Border and UI elements - using the 5 colors
  border: '#2faad6',         // Cyan blue
  borderDark: '#f35e69',     // Coral red
  borderLight: '#8fd2b0',    // Mint green
  
  // Status colors - using the 5 colors
  success: '#8fd2b0',        // Mint green
  warning: '#f9d809',        // Bright yellow
  danger: '#f35e69',         // Coral red
  error: '#f35e69',          // Coral red
  info: '#2faad6',           // Cyan blue
  
  // AAC Category colors - ONLY using the 5 colors
  categoryCore: '#2faad6',      // Cyan blue - Core vocabulary
  categoryPeople: '#fb8d98',    // Pink - People
  categoryActions: '#8fd2b0',   // Mint green - Actions/Verbs
  categoryFeelings: '#f9d809',  // Bright yellow - Emotions
  categoryFood: '#f35e69',      // Coral red - Food
  categoryHome: '#2faad6',      // Cyan blue - Home
  categorySchool: '#8fd2b0',    // Mint green - School
  categoryBody: '#f9d809',      // Bright yellow - Body
  categoryPlaces: '#fb8d98',    // Pink - Places
  categoryRoutines: '#f35e69',  // Coral red - Routines
  categoryQuestions: '#f9d809', // Bright yellow - Questions
  categoryColours: '#2faad6',   // Cyan blue - Colors
  categoryNumbers: '#8fd2b0',   // Mint green - Numbers
  categoryAnimals: '#fb8d98',   // Pink - Animals
  categoryClothing: '#f35e69',  // Coral red - Clothing
  categoryWeather: '#2faad6',   // Cyan blue - Weather
  categoryTime: '#f9d809',      // Bright yellow - Time
  categoryToys: '#fb8d98',      // Pink - Toys
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
