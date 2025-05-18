import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AIRecommendation } from "../types/types";
import { useLanguage } from "../mobx/LanguageStore/LanguageStore";

const RecommendationCard = React.memo(({ recommendation, onPress }: 
  { recommendation: AIRecommendation; onPress?: () => void }) => {
  const { locale } = useLanguage();
  
  const getActionColor = () => {
    switch(recommendation.action) {
      case 'buy': return '#4CAF50';
      case 'sell': return '#FF6B6B';
      case 'N/A': return '#000'
      default: return '#FFD700';
    }
  };
  
  const getActionText = () => {
    switch(recommendation.action) {
      case 'buy': return locale.ai.actions.buy;
      case 'sell': return locale.ai.actions.sell;
      case 'N/A': return 'N/A'
      default: return locale.ai.actions.hold;
    }
  };
  
  return (
    <TouchableOpacity 
      style={styles.recommendationCard}
      onPress={onPress}
    >
      <View style={styles.recommendationHeader}>
        <Text style={styles.recommendationCoin}>{recommendation.coinName}</Text>
        <View style={[styles.actionBadge, { backgroundColor: getActionColor() }]}>
          <Text style={styles.actionText}>{getActionText()}</Text>
        </View>
      </View>
      
      <Text style={styles.recommendationReason}>{recommendation.reason}</Text>
      
      <View style={styles.confidenceBar}>
        <View style={[styles.confidenceFill, { width: `${recommendation.confidence}%` }]} />
          <Text style={styles.confidenceText}>{locale.ai.confidence}: {recommendation.confidence}%</Text>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  recommendationCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  recommendationCoin: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  actionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  actionText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  recommendationReason: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 10,
  },
  confidenceBar: {
    height: 20,
    backgroundColor: '#333',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  confidenceFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: '#3498db',
    borderRadius: 10,
  },
  confidenceText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 12,
    color: '#ffffff',
  },
});

export default RecommendationCard;