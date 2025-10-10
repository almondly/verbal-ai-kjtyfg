
import { StyleSheet } from 'react-native';

export const colors = {
  // AAC-style color palette - more muted and accessible
  primary: '#4A90E2',        // Softer blue
  secondary: '#E85D75',      // Softer pink/red
  accent: '#50C878',         // Softer green
  background: '#F5F5F5',     // Light grey background
  backgroundAlt: '#FFFFFF',  // Pure white for tiles
  surface: '#FFFFFF',
  text: '#2C3E50',           // Dark blue-grey for better readability
  textSecondary: '#7F8C8D',
  border: '#34495E',         // Dark border for AAC style
  borderLight: '#BDC3C7',    // Lighter border option
  success: '#27AE60',
  warning: '#F39C12',
  danger: '#E74C3C',
  error: '#E74C3C',
  info: '#3498DB',
  
  // Category colors - more muted and accessible
  categoryCore: '#5DADE2',
  categoryPeople: '#AF7AC5',
  categoryActions: '#52BE80',
  categoryFeelings: '#F4D03F',
  categoryFood: '#EC7063',
  categoryHome: '#85C1E9',
  categorySchool: '#82E0AA',
  categoryBody: '#F8C471',
  categoryPlaces: '#BB8FCE',
  categoryRoutines: '#F0B27A',
  categoryQuestions: '#FAD7A0',
  categoryColours: '#76D7C4',
  categoryNumbers: '#7FB3D5',
  categoryAnimals: '#F5B7B1',
  categoryClothing: '#D7BDE2',
  categoryWeather: '#AED6F1',
  categoryTime: '#F8B4D9',
  categoryToys: '#FADBD8',
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
