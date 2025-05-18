import { useCallback, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AIRecommendation } from '../types/types';
import RecommendationCard from './RecommendationCard';
import { useAiRecommendation } from '../hooks/useAiRecommendation';
import { LocalizationData } from '../types/LocalizationData';

const fallbackRecommendations: AIRecommendation[] = [
  {
    coinId: 'bitcoin',
    coinName: 'Bitcoin',
    confidence: 0,
    reason: 'N/A',
    action: 'N/A'
  },
  {
    coinId: 'ethereum',
    coinName: 'Ethereum',
    confidence: 0,
    reason: 'N/A',
    action: 'N/A'
  },
  {
    coinId: 'solana',
    coinName: 'Solana',
    confidence: 0,
    reason: 'N/A',
    action: 'N/A'
  }
];

const AiRecommendations = ({ router, locale, language }: { router: any, locale: LocalizationData, language: string }) => {
  const { recommendations, loading, error, fetchRecommendations } = useAiRecommendation(language);
  const [aiData, setAiData] = useState<AIRecommendation[]>(fallbackRecommendations);

  const navigateToAI = useCallback(() => {
    router.push('/ai');
  }, [router]);

  useEffect(() => {
    const getRecommendations = async () => {
      await fetchRecommendations();
    };
    // getRecommendations();
  }, [fetchRecommendations]);

  useEffect(() => {
    if (recommendations.length > 0) {
      setAiData(recommendations);
    }
  }, [recommendations]);

  return (
    <View style={styles.aiRecommendationsContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{locale.home.aiRecommendations}</Text>
        <Ionicons name="flash" size={20} color="#FFD700" />

        <TouchableOpacity 
          style={styles.refreshButton} 
          disabled={loading}
          onPress={fetchRecommendations}
        >
          <Ionicons name="refresh" size={18} color="#3498db" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>{locale.common?.loading || 'Loading recommendations...'}</Text>
        </View>
      ) : (
        <>
          {aiData.map(recommendation => (
            <RecommendationCard 
              key={recommendation.coinId} 
              recommendation={recommendation}
              onPress={() => router.push(`screens/crypto/${recommendation.coinId}`)}
            />
          ))}

          <TouchableOpacity 
            style={styles.viewMoreButton}
            onPress={navigateToAI}
          >
            <Text style={styles.viewMoreText}>{locale.home.viewMore}</Text>
            <Ionicons name="arrow-forward" size={16} color="#3498db" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  aiRecommendationsContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    flex: 1,
  },
  refreshButton: {
    padding: 5,
    marginLeft: 8,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 10,
  },
  viewMoreButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  viewMoreText: {
    color: '#3498db',
    marginRight: 5,
  },
});

export default AiRecommendations;
