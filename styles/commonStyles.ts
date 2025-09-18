
import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#4D9EFF',
  secondary: '#FF77FF',
  accent: '#00FFA5',
  background: '#FFFFFF',
  backgroundAlt: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  error: '#EF4444',
  info: '#3B82F6',
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
    boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
  },
  shadowLarge: {
    boxShadow: '0px 8px 24px rgba(0,0,0,0.15)',
  },
});
