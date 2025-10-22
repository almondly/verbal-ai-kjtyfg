
import { ReactNode } from 'react';
import { View, Text, useWindowDimensions, StyleSheet } from 'react-native';
import { colors } from '../styles/commonStyles';
import Icon from './Icon';

interface Props {
  children: ReactNode;
}

export default function LandscapeGuard({ children }: Props) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width >= height;

  // Strictly enforce landscape mode - no exceptions
  if (isLandscape) {
    return <>{children}</>;
  }

  // Block all content in portrait mode
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Icon name="phone-landscape-outline" size={64} color={colors.primary} />
        <Text style={styles.title}>Landscape Mode Required</Text>
        <Text style={styles.text}>
          This app only works in landscape orientation.
        </Text>
        <Text style={styles.subtext}>
          Please rotate your device to continue.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 32,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    boxShadow: '0px 10px 30px rgba(0,0,0,0.15)',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  title: {
    fontFamily: 'Montserrat_700Bold',
    color: colors.text,
    fontSize: 24,
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  text: {
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtext: {
    fontFamily: 'Montserrat_400Regular',
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
});
