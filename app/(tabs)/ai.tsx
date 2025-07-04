import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useLanguageStore, useWalletStore } from '../mobx/MainStore';
import { observer } from 'mobx-react-lite';
import Header from '../components/reusable-ai-components/Header';
import { AiService } from '@/app/utils/ai/aiService';
import TabContainer from '../components/reusable-ai-components/TabContainer/TabContainer';
import Chat from '../components/reusable-ai-components/Chat/Chat';
import Footer from '../components/Footer';
import MarketAnalysisBlock from '../components/reusable-ai-components/MarketAnalysisBlock';

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
  const { locale, language } = useLanguageStore();
  const [activeTab, setActiveTab] = useState<AiTab>(AiTab.CHAT);
  const { tokens } = useWalletStore();
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
      AiService.requestMarketAnalysis({ setError, setLoading, setAnalysisData, language, tokens });
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
          flatListRef={flatListRef}
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
                    tokens,
                  })
                }
              >
                <Text style={styles.updateButtonText}>{locale.ai.requestAnalysis}</Text>
                <Ionicons name="analytics-outline" size={18} color="#3498db" />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <MarketAnalysisBlock
                analysisData={analysisData}
                locale={locale}
                loading={loading}
                onRefresh={() =>
                  AiService.requestMarketAnalysis({
                    setError,
                    setLoading,
                    setAnalysisData,
                    language,
                    tokens,
                  })
                }
              />

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
});
