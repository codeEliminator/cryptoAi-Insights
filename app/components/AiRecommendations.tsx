import { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AIRecommendation } from '../types/types';
import RecommendationCard from './RecommendationCard';

const aiRecommendations: AIRecommendation[] = [
  {
    coinId: 'bitcoin',
    coinName: 'Bitcoin',
    confidence: 87,
    reason: 'Повышенный объем транзакций и институциональный интерес',
    action: 'buy'
  },
  {
    coinId: 'ethereum',
    coinName: 'Ethereum',
    confidence: 75,
    reason: 'Рост активности в DeFi и недавнее обновление сети',
    action: 'hold'
  },
  {
    coinId: 'solana',
    coinName: 'Solana',
    confidence: 92,
    reason: 'Быстрорастущая экосистема и повышенная активность разработчиков',
    action: 'buy'
  }
];

const AiRecommendations = ({router, locale}: {router: any, locale: any}) => {
    
  const navigateToAI = useCallback(() => {
    router.push('/ai');
  }, [router]);
  
  return (
    <View style={styles.aiRecommendationsContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{locale.home.aiRecommendations}</Text>
        <Ionicons name="flash" size={20} color="#FFD700" />
      </View>
      
      {aiRecommendations.map(recommendation => (
        <RecommendationCard 
          key={recommendation.coinId} 
          recommendation={recommendation}
          // Uncomment when ready to implement navigation
          // onPress={() => router.push(`/crypto/${recommendation.coinId}`)}
        />
      ))}
      
      <TouchableOpacity 
        style={styles.viewMoreButton}
        onPress={navigateToAI}
      >
        <Text style={styles.viewMoreText}>{locale.home.viewMore}</Text>
        <Ionicons name="arrow-forward" size={16} color="#3498db" />
      </TouchableOpacity>
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