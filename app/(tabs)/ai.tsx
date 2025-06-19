import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../mobx/LanguageStore/LanguageStore';
import { observer } from 'mobx-react-lite';
import Header from '../components/reusable-ai-components/Header';
import getSentimentColor from '../components/reusable-ai-components/helpers/getSentimentColor';
import getSentimentText from '../components/reusable-ai-components/helpers/getSentimentText';
import getActionColor from '../components/reusable-ai-components/helpers/getActionColor';
import getActionText from '../components/reusable-ai-components/helpers/getActionText';
import { AiService } from '@/app/utils/ai/aiService';
import TabContainer from '../components/reusable-ai-components/TabContainer/TabContainer';
import Chat from '../components/reusable-ai-components/Chat/Chat';
import Footer from '../components/Footer';

export interface Message {
  text: string;
  isUser: boolean;
  timestamp: string;
}

interface CryptoOpportunity {
  coinName: string;
  action: 'buy' | 'sell' | 'hold';
  reason: string;
  confidence: number;
}

export interface MarketAnalysis {
  marketSentiment: number;
  sentimentAnalysis: string;
  opportunities: CryptoOpportunity[];
  marketTrends: string;
  timestamp: string;
}

export enum AiTab {
  CHAT = 'chat',
  ANALYSIS = 'analysis',
}

function AiScreenComponent() {
  const { locale, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<AiTab>(AiTab.CHAT);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<MarketAnalysis | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    AiService.loadChatHistory(locale, setMessages);
    AiService.loadAnalysisData(setAnalysisData);
  }, []);

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  useEffect(() => {
    if (!analysisData && !loading) {
      AiService.requestMarketAnalysis({ setError, setLoading, setAnalysisData, language });
    }
  }, [analysisData, loading]);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        clearChatHistory={() => AiService.clearChatHistory(locale, setMessages)}
        locale={locale}
        activeTab={activeTab}
        error={error}
      />
      <TabContainer locale={locale} activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === AiTab.CHAT ? (
        <Chat
          messages={messages}
          inputText={inputText}
          setInputText={setInputText}
          locale={locale}
          setError={setError}
          setLoading={setLoading}
          setMessages={setMessages}
          language={language}
          loading={loading}
        />
      ) : (
        <ScrollView style={styles.analysisContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3498db" />
              <Text style={styles.loadingText}>{locale.ai.loadingAnalysis}</Text>
            </View>
          ) : !analysisData ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{locale.ai.noAnalysisAvailable}</Text>
              <TouchableOpacity
                style={styles.updateButton}
                onPress={() =>
                  AiService.requestMarketAnalysis({
                    setError,
                    setLoading,
                    setAnalysisData,
                    language,
                  })
                }
              >
                <Text style={styles.updateButtonText}>{locale.ai.requestAnalysis}</Text>
                <Ionicons name="analytics-outline" size={18} color="#3498db" />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.analysisHeader}>
                <Text style={styles.analysisTitle}>{locale.ai.marketAnalysis}</Text>
                <TouchableOpacity
                  style={styles.refreshButton}
                  onPress={() =>
                    AiService.requestMarketAnalysis({
                      setError,
                      setLoading,
                      setAnalysisData,
                      language,
                    })
                  }
                  disabled={loading}
                >
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
                      <Text
                        style={[styles.actionText, { color: getActionColor(opportunity.action) }]}
                      >
                        {getActionText(opportunity.action, locale)}
                      </Text>
                    </View>
                    <Text style={styles.reasonText}>{opportunity.reason}</Text>
                    <View style={styles.confidenceContainer}>
                      <Text style={styles.confidenceText}>
                        {locale.ai.confidence}: {opportunity.confidence}%
                      </Text>
                      <View style={styles.confidenceBar}>
                        <View
                          style={[styles.confidenceFill, { width: `${opportunity.confidence}%` }]}
                        />
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{locale.ai.marketTrends}</Text>
                <Text style={styles.analysisText}>{analysisData.marketTrends}</Text>
              </View>
              <Footer locale={locale} language={language} />
            </>
          )}
        </ScrollView>
      )}

      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const AiScreen = observer(AiScreenComponent);
export default AiScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  analysisContainer: {
    flex: 1,
    backgroundColor: '#121212',
    marginBottom: 20,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 16,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#aaaaaa',
    fontSize: 16,
    marginBottom: 16,
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  updateButtonText: {
    color: '#3498db',
    marginRight: 8,
  },
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
