
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import { colors } from '../styles/commonStyles';
import Icon from './Icon';

interface Props {
  word: string;
  onSelect: (pictogramUrl: string) => void;
  onClose: () => void;
}

interface Pictogram {
  _id: number;
  keywords: { keyword: string }[];
}

type PictogramVariant = '500' | '2500' | '2500_n';

export default function PictogramSelector({ word, onSelect, onClose }: Props) {
  const [searchQuery, setSearchQuery] = useState(word);
  const [pictograms, setPictograms] = useState<Pictogram[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<PictogramVariant>('2500');

  useEffect(() => {
    searchPictograms(word);
  }, [word]);

  const searchPictograms = async (query: string) => {
    if (!query.trim()) {
      setPictograms([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // ARASAAC API endpoint for searching pictograms
      const response = await fetch(
        `https://api.arasaac.org/api/pictograms/en/search/${encodeURIComponent(query.toLowerCase())}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch pictograms');
      }

      const data = await response.json();
      console.log('ARASAAC pictograms search results:', data.length, 'pictograms found for', query);
      setPictograms(data.slice(0, 30)); // Increased to 30 results for better selection
    } catch (err) {
      console.error('Error fetching pictograms:', err);
      setError('Failed to load pictograms. Please try again.');
      Alert.alert('Error', 'Failed to load pictograms. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    searchPictograms(searchQuery);
  };

  const handleSelectPictogram = (pictogramId: number) => {
    // Use the selected variant for the pictogram
    const pictogramUrl = `https://static.arasaac.org/pictograms/${pictogramId}/${pictogramId}_${selectedVariant}.png`;
    console.log('Selected ARASAAC pictogram:', pictogramUrl, 'variant:', selectedVariant);
    onSelect(pictogramUrl);
  };

  const getVariantLabel = (variant: PictogramVariant): string => {
    switch (variant) {
      case '2500':
        return 'Detailed (Color)';
      case '2500_n':
        return 'Detailed (Skin)';
      case '500':
        return 'Standard (Color)';
      default:
        return 'Detailed';
    }
  };

  const getVariantDescription = (variant: PictogramVariant): string => {
    switch (variant) {
      case '2500':
        return 'Very detailed colored pictograms (recommended)';
      case '2500_n':
        return 'Very detailed with skin tones (for people)';
      case '500':
        return 'Standard colored pictograms';
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Pictogram for &quot;{word}&quot;</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.8}>
          <Icon name="close-outline" size={28} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for pictograms..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity 
          style={styles.searchBtn} 
          onPress={handleSearch}
          activeOpacity={0.8}
        >
          <Icon name="search-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.variantSelector}>
        <Text style={styles.variantLabel}>Pictogram Style:</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.variantButtons}
        >
          {(['2500', '2500_n', '500'] as PictogramVariant[]).map((variant) => (
            <TouchableOpacity
              key={variant}
              style={[
                styles.variantBtn,
                selectedVariant === variant && styles.variantBtnActive
              ]}
              onPress={() => setSelectedVariant(variant)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.variantBtnText,
                selectedVariant === variant && styles.variantBtnTextActive
              ]}>
                {getVariantLabel(variant)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <Text style={styles.helperText}>
        {getVariantDescription(selectedVariant)}
      </Text>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Searching pictograms...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={48} color={colors.danger} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryBtn} 
            onPress={() => searchPictograms(searchQuery)}
            activeOpacity={0.8}
          >
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && pictograms.length === 0 && (
        <View style={styles.emptyContainer}>
          <Icon name="images-outline" size={64} color={colors.textSecondary} />
          <Text style={styles.emptyText}>No pictograms found</Text>
          <Text style={styles.emptySubtext}>Try a different search term</Text>
        </View>
      )}

      {!loading && !error && pictograms.length > 0 && (
        <ScrollView 
          style={styles.resultsContainer}
          contentContainerStyle={styles.resultsContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.pictogramGrid}>
            {pictograms.map((pictogram) => {
              // Use the selected variant
              const pictogramUrl = `https://static.arasaac.org/pictograms/${pictogram._id}/${pictogram._id}_${selectedVariant}.png`;
              const keywords = pictogram.keywords.map(k => k.keyword).join(', ');
              
              return (
                <TouchableOpacity
                  key={pictogram._id}
                  style={styles.pictogramCard}
                  onPress={() => handleSelectPictogram(pictogram._id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.pictogramImageContainer}>
                    <Image
                      source={{ uri: pictogramUrl }}
                      style={styles.pictogramImage}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.pictogramKeywords} numberOfLines={2}>
                    {keywords}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    color: colors.text,
    flex: 1,
  },
  closeBtn: {
    backgroundColor: '#F3F4F6',
    padding: 10,
    borderRadius: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.text,
    fontSize: 16,
    fontFamily: 'Montserrat_400Regular',
  },
  searchBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  variantSelector: {
    marginBottom: 12,
  },
  variantLabel: {
    fontSize: 14,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
    marginBottom: 8,
  },
  variantButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  variantBtn: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  variantBtnActive: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
  },
  variantBtnText: {
    fontSize: 13,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.textSecondary,
  },
  variantBtnTextActive: {
    color: colors.primary,
  },
  helperText: {
    fontSize: 12,
    fontFamily: 'Montserrat_400Regular',
    color: colors.textSecondary,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.danger,
    textAlign: 'center',
  },
  retryBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  retryBtnText: {
    fontSize: 16,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: colors.textSecondary,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsContent: {
    paddingBottom: 20,
  },
  pictogramGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  pictogramCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.primary,
    boxShadow: '0px 3px 8px rgba(0,0,0,0.12)',
  },
  pictogramImageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pictogramImage: {
    width: '100%',
    height: '100%',
  },
  pictogramKeywords: {
    fontSize: 12,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
    textAlign: 'center',
  },
});
