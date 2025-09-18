
import { ReactNode } from 'react';
import { View, Text, useWindowDimensions, StyleSheet, Platform } from 'react-native';
import { colors } from '../styles/commonStyles';
import Icon from './Icon';

interface Props {
  children: ReactNode;
}

export default function LandscapeGuard({ children }: Props) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width >= height;

  // On web, we'll be more lenient and show a message instead of blocking
  if (Platform.OS === 'web') {
    if (isLandscape) {
      return <>{children}</>;
    }
    
    // Show a less intrusive message on web
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Icon name="phone-landscape-outline" size={48} color={colors.text} />
          <Text style={styles.title}>Better in Landscape</Text>
          <Text style={styles.text}>
            This app works best in landscape mode. Please rotate your device or resize your browser window for the optimal experience.
          </Text>
          <View style={styles.webFallback}>
            <Text style={styles.webFallbackText}>
              You can continue in portrait mode, but some features may not display optimally.
            </Text>
            <View style={styles.appContainer}>
              {children}
            </View>
          </View>
        </View>
      </View>
    );
  }

  // On mobile, enforce landscape more strictly
  if (isLandscape) {
    return <>{children}</>;
  }

  // Render rotate prompt if portrait on mobile
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Icon name="phone-landscape-outline" size={48} color={colors.text} />
        <Text style={styles.title}>Rotate Device</Text>
        <Text style={styles.text}>
          Please rotate your device to landscape to use the app.
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
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    width: '80%',
    maxWidth: 520,
    alignItems: 'center',
    boxShadow: '0px 10px 24px rgba(0,0,0,0.10)',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  title: {
    fontFamily: 'Montserrat_700Bold',
    color: colors.text,
    fontSize: 20,
    marginTop: 10,
    marginBottom: 6,
    textAlign: 'center',
  },
  text: {
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
  webFallback: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  webFallbackText: {
    fontFamily: 'Montserrat_400Regular',
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 16,
  },
  appContainer: {
    width: '100%',
    height: 400,
    overflow: 'hidden',
    borderRadius: 8,
    backgroundColor: colors.background,
  },
});
