
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../styles/commonStyles';
import Icon from './Icon';
import { useEffect, useState } from 'react';
import { getLearningStatistics } from '../utils/enhancedLearningEngine';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 600,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  wordList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  wordChip: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  wordText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
  },
  intentBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  intentLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    width: 100,
  },
  intentBarFill: {
    flex: 1,
    height: 24,
    backgroundColor: colors.primary + '40',
    borderRadius: 4,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  intentCount: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default function LearningInsights({ visible, onClose }: Props) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      loadStats();
    }
  }, [visible]);

  const loadStats = async () => {
    setLoading(true);
    const data = await getLearningStatistics();
    setStats(data);
    setLoading(false);
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>🧠 Learning Insights</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="x" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {loading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Loading insights...</Text>
            </View>
          ) : !stats || stats.totalInteractions === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                Start using the app to see your learning insights!
                {'\n\n'}
                The AI will learn from your choices and provide better suggestions over time.
              </Text>
            </View>
          ) : (
            <>
              {/* Overall Stats */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>📊 Overall Performance</Text>
                
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Total Interactions</Text>
                  <Text style={styles.statValue}>{stats.totalInteractions}</Text>
                </View>
                
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Selection Rate</Text>
                  <Text style={styles.statValue}>
                    {(stats.selectionRate * 100).toFixed(1)}%
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[styles.progressFill, { width: `${stats.selectionRate * 100}%` }]} 
                  />
                </View>
                
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Model Accuracy</Text>
                  <Text style={styles.statValue}>
                    {(stats.modelAccuracy * 100).toFixed(1)}%
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[styles.progressFill, { width: `${stats.modelAccuracy * 100}%` }]} 
                  />
                </View>
              </View>

              {/* Top Selected Words */}
              {stats.topSelectedWords.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>⭐ Your Favorite Words</Text>
                  <View style={styles.wordList}>
                    {stats.topSelectedWords.slice(0, 10).map((word: string, index: number) => (
                      <View key={index} style={styles.wordChip}>
                        <Text style={styles.wordText}>{word}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Intent Distribution */}
              {Object.keys(stats.intentDistribution).length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>💭 Communication Patterns</Text>
                  {Object.entries(stats.intentDistribution)
                    .sort(([, a], [, b]) => (b as number) - (a as number))
                    .map(([intent, count]) => {
                      const total = Object.values(stats.intentDistribution).reduce(
                        (sum: number, c) => sum + (c as number), 
                        0
                      );
                      const percentage = ((count as number) / total) * 100;
                      
                      return (
                        <View key={intent} style={styles.intentBar}>
                          <Text style={styles.intentLabel}>
                            {intent.charAt(0).toUpperCase() + intent.slice(1)}
                          </Text>
                          <View style={[styles.intentBarFill, { width: `${percentage}%` }]}>
                            <Text style={styles.intentCount}>{count}</Text>
                          </View>
                        </View>
                      );
                    })}
                </View>
              )}

              {/* Learning Progress */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>📈 Learning Progress</Text>
                <Text style={styles.emptyText}>
                  The AI is continuously learning from your interactions.
                  {'\n\n'}
                  As you use the app more, suggestions will become more personalized and accurate.
                  {'\n\n'}
                  Current accuracy: {(stats.modelAccuracy * 100).toFixed(1)}%
                  {stats.modelAccuracy < 0.5 && '\n\nKeep using the app to improve accuracy!'}
                  {stats.modelAccuracy >= 0.5 && stats.modelAccuracy < 0.7 && '\n\nGood progress! The AI is learning your patterns.'}
                  {stats.modelAccuracy >= 0.7 && '\n\nExcellent! The AI knows your communication style well.'}
                </Text>
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
