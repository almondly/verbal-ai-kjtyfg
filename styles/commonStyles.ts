
import { StyleSheet } from 'react-native';

// Vibrant AAC color palette - bold, bright, and full of personality!
export const colors = {
  // Primary vibrant colors
  primary: '#FF6B35',        // Vibrant orange
  secondary: '#9B59B6',      // Rich purple
  accent: '#2ECC71',         // Bright green
  
  // Background colors - clean but warm
  background: '#FFFFFF',
  backgroundAlt: '#F8F9FA',
  surface: '#FFFFFF',
  
  // Text colors - high contrast
  text: '#2C3E50',           // Dark blue-gray for readability
  textSecondary: '#7F8C8D',  // Medium gray
  textLight: '#FFFFFF',      // White text
  
  // Border and UI elements
  border: '#BDC3C7',         // Light gray
  borderDark: '#34495E',     // Dark blue-gray
  borderLight: '#ECF0F1',    // Very light gray
  
  // Status colors - vibrant!
  success: '#27AE60',        // Bright green
  warning: '#F39C12',        // Bright orange
  danger: '#E74C3C',         // Bright red
  error: '#E74C3C',
  info: '#3498DB',           // Bright blue
  
  // AAC Category colors - VIBRANT and BOLD!
  categoryCore: '#3498DB',      // Bright blue - Core vocabulary
  categoryPeople: '#9B59B6',    // Rich purple - People
  categoryActions: '#2ECC71',   // Bright green - Actions/Verbs
  categoryFeelings: '#F1C40F',  // Bright yellow - Emotions
  categoryFood: '#E67E22',      // Bright orange - Food
  categoryHome: '#5DADE2',      // Sky blue - Home
  categorySchool: '#52BE80',    // Fresh green - School
  categoryBody: '#F8B739',      // Golden yellow - Body
  categoryPlaces: '#AF7AC5',    // Lavender - Places
  categoryRoutines: '#EC7063',  // Coral - Routines
  categoryQuestions: '#F4D03F', // Gold - Questions
  categoryColours: '#48C9B0',   // Turquoise - Colors
  categoryNumbers: '#5DADE2',   // Sky blue - Numbers
  categoryAnimals: '#EB984E',   // Peach - Animals
  categoryClothing: '#BB8FCE',  // Light purple - Clothing
  categoryWeather: '#85C1E2',   // Light blue - Weather
  categoryTime: '#F1948A',      // Pink - Time
  categoryToys: '#F8B4D9',      // Light pink - Toys
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
