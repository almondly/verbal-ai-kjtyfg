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

  // Only render app content in landscape
  if (isLandscape) {
    return <>{children}</>;
  }

  // Render rotate prompt if portrait
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
});
