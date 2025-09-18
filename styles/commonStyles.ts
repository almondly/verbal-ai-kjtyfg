import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#3D7EFF', // vibrant blue
  secondary: '#00E5FF', // bright cyan
  accent: '#FFD700', // neon yellow
  background: '#F5F9FF', // keep original
  backgroundAlt: '#FFFFFF', // keep original
  text: '#1F2937', // same dark text for readability
  grey: '#A3A3A3', // slightly brighter grey
  card: '#FFFFFF', // keep original
  danger: '#FF4C4C', // vibrant red
  success: '#32CD32', // bright green
};

export const buttonStyles = StyleSheet.create({
  instructionsButton: {
    backgroundColor: colors.primary,
    alignSelf: 'center',
    width: '100%',
  },
  backButton: {
    backgroundColor: colors.secondary,
    alignSelf: 'center',
    width: '100%',
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 24,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    width: '100%',
    boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.08)',
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: '#111827',
  },
});
