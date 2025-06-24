import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import getSentimentColor from './helpers/getSentimentColor';
import getSentimentText from './helpers/getSentimentText';
import getActionColor from './helpers/getActionColor';
import getActionText from './helpers/getActionText';
import { MarketAnalysis } from '@/app/(tabs)/ai';

interface MarketAnalysisBlockProps {
  analysisData: MarketAnalysis;
  locale: any;
  loading: boolean;
  onRefresh: () => void;
}

const MarketAnalysisBlock: React.FC<MarketAnalysisBlockProps> = ({
  analysisData,
  locale,
  loading,
  onRefresh,
}) => (
  <>
    <View style={styles.analysisHeader}>
      <Text style={styles.analysisTitle}>{locale.ai.marketAnalysis}</Text>
      <TouchableOpacity style={styles.refreshButton} onPress={onRefresh} disabled={loading}>
        <Ionicons name="refresh" size={18} color="#3498db" />
      </TouchableOpacity>
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{locale.ai.marketSentiment}</Text>
      <View style={styles.sentimentContainer}>
        <View
          style={[
            styles.sentimentIndicator,
            { backgroundColor: getSentimentColor(analysisData.marketSentiment) },
          ]}
        />
        <Text style={styles.sentimentText}>
          {getSentimentText(analysisData.marketSentiment, locale)}
        </Text>
      </View>
      <Text style={styles.analysisText}>{analysisData.sentimentAnalysis}</Text>
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{locale.ai.topOpportunities}</Text>
      {analysisData.opportunities.map((opportunity, index) => (
        <View key={`opportunity-${index}`} style={styles.opportunityItem}>
          <View style={styles.opportunityHeader}>
            <Text style={styles.coinName}>{opportunity.coinName}</Text>
            <Text style={[styles.actionText, { color: getActionColor(opportunity.action) }]}>
              {getActionText(opportunity.action, locale)}
            </Text>
          </View>
          <Text style={styles.reasonText}>{opportunity.reason}</Text>
          <View style={styles.confidenceContainer}>
            <Text style={styles.confidenceText}>
              {locale.ai.confidence}: {opportunity.confidence}%
            </Text>
            <View style={styles.confidenceBar}>
              <View style={[styles.confidenceFill, { width: `${opportunity.confidence}%` }]} />
            </View>
          </View>
        </View>
      ))}
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{locale.ai.marketTrends}</Text>
      <Text style={styles.analysisText}>{analysisData.marketTrends}</Text>
    </View>
  </>
);

const styles = StyleSheet.create({
  analysisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  analysisTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  refreshButton: {
    padding: 8,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  sentimentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sentimentIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  sentimentText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  analysisText: {
    fontSize: 14,
    color: '#cccccc',
    lineHeight: 20,
  },
  opportunityItem: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  opportunityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  coinName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  actionText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  reasonText: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 8,
  },
  confidenceContainer: {
    marginTop: 8,
  },
  confidenceText: {
    fontSize: 12,
    color: '#aaaaaa',
    marginBottom: 4,
  },
  confidenceBar: {
    height: 4,
    backgroundColor: '#333333',
    borderRadius: 2,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: '#3498db',
  },
});

export default MarketAnalysisBlock;
