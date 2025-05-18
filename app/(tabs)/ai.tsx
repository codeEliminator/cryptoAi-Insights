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
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../mobx/LanguageStore/LanguageStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Constants from 'expo-constants';
import { observer } from 'mobx-react-lite';

interface Message {
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

interface MarketAnalysis {
  marketSentiment: number;
  sentimentAnalysis: string;
  opportunities: CryptoOpportunity[];
  marketTrends: string;
  timestamp: string;
}

const CHAT_HISTORY_KEY = 'ai_chat_history';
const ANALYSIS_DATA_KEY = 'ai_analysis_data';

const SYSTEM_PROMPT = `
Ты — AI-аналитик рынка криптовалют. Твоя задача — отвечать на вопросы пользователей о криптовалютах, 
анализировать рыночные тенденции и предоставлять рекомендации. Твои ответы должны быть информативными, 
но краткими. Используй фактические данные и объясняй свои рассуждения.
`;

const ANALYSIS_PROMPT = `
Проведи анализ текущего рынка криптовалют и предоставь следующую информацию в формате JSON:

1. Общий сентимент рынка (число от 0 до 100, где 100 - максимально бычий)
2. Анализ сентимента (текстовое описание текущего настроения рынка)
3. Топ-3 возможности для инвестирования с указанием:
   - Названия криптовалюты
   - Рекомендуемого действия (buy, sell, hold)
   - Причины рекомендации
   - Уровня уверенности (число от 0 до 100)
4. Описание текущих рыночных трендов

Ответ должен быть в следующем формате JSON:

{
  "marketSentiment": 65,
  "sentimentAnalysis": "Текстовый анализ настроения рынка...",
  "opportunities": [
    {
      "coinName": "Bitcoin",
      "action": "buy",
      "reason": "Причина рекомендации...",
      "confidence": 80
    },
    ...
  ],
  "marketTrends": "Описание текущих трендов рынка...",
  "timestamp": "2023-04-07T12:34:56.789Z"
}

Ответ должен быть только в формате JSON, без дополнительного текста.
`;

enum AiTab {
  CHAT = 'chat',
  ANALYSIS = 'analysis'
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
  const GEMINI_API_KEY = Constants.expoConfig?.extra?.OPENAI_API_KEY;

  useEffect(() => {
    loadChatHistory();
    loadAnalysisData();
  }, []);

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const chatHistory = await AsyncStorage.getItem(CHAT_HISTORY_KEY);
      if (chatHistory) {
        setMessages(JSON.parse(chatHistory));
      } else {
        const welcomeMessage: Message = {
          text: locale.ai.welcomeMessage,
          isUser: false,
          timestamp: new Date().toISOString()
        };
        setMessages([welcomeMessage]);
        await AsyncStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify([welcomeMessage]));
      }
    } catch (e) {
      console.error('Ошибка загрузки истории чата:', e);
    }
  };

  const loadAnalysisData = async () => {
    try {
      const analysisDataStr = await AsyncStorage.getItem(ANALYSIS_DATA_KEY);
      if (analysisDataStr) {
        setAnalysisData(JSON.parse(analysisDataStr));
      }
    } catch (e) {
      console.error('Ошибка загрузки данных анализа:', e);
    }
  };

  const sendMessage = async () => {
    if (inputText.trim() === '' || loading) return;
    
    const trimmedText = inputText.trim();
    setInputText('');
    setLoading(true);
    setError(null);

    const userMessage: Message = {
      text: trimmedText,
      isUser: true,
      timestamp: new Date().toISOString()
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    
    try {
      await AsyncStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(updatedMessages));
    } catch (e) {
      console.error('Ошибка сохранения истории чата:', e);
    }

    try {
      if (!GEMINI_API_KEY) {
        throw new Error("API ключ не настроен");
      }
      
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const recentMessages = [...updatedMessages.slice(-10)]
        .map(msg => msg.isUser ? `Пользователь: ${msg.text}` : `AI: ${msg.text}`)
        .join('\n');
      
      const prompt = `${SYSTEM_PROMPT}\n\nИстория диалога:\n${recentMessages}\n\nОтвечай на языке ${language}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiText = response.text();

      const aiMessage: Message = {
        text: aiText,
        isUser: false,
        timestamp: new Date().toISOString()
      };
      
      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
      
      await AsyncStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(finalMessages));
    } catch (e) {
      console.error('Ошибка при отправке сообщения AI:', e);
      setError("Не удалось получить ответ от AI");
      
      const errorMessage: Message = {
        text: locale.ai.errorMessage,
        isUser: false,
        timestamp: new Date().toISOString()
      };
      
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      
      await AsyncStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(finalMessages));
    } finally {
      setLoading(false);
    }
  };

  const requestMarketAnalysis = async () => {
    if (!GEMINI_API_KEY) {
      setError("API ключ не настроен");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const analysisPrompt = `${ANALYSIS_PROMPT}\nЯзык ответа: ${language}`;
      
      const result = await model.generateContent(analysisPrompt);
      const response = await result.response;
      const text = response.text();

      try {
        const cleanedText = text.replace(/```json|```/g, "").trim();
        const parsedData = JSON.parse(cleanedText);
        
        if (!parsedData.timestamp) {
          parsedData.timestamp = new Date().toISOString();
        }
        
        setAnalysisData(parsedData);
        
        await AsyncStorage.setItem(ANALYSIS_DATA_KEY, JSON.stringify(parsedData));
      } catch (parseError) {
        console.error("Ошибка парсинга AI ответа:", parseError);
        setError("Ошибка парсинга AI анализа");
      }
    } catch (e) {
      console.error('Ошибка при запросе анализа рынка:', e);
      setError("Не удалось получить анализ рынка");
    } finally {
      setLoading(false);
    }
  };

  const clearChatHistory = async () => {
    try {
      await AsyncStorage.removeItem(CHAT_HISTORY_KEY);
      
      const welcomeMessage: Message = {
        text: locale.ai.welcomeMessage,
        isUser: false,
        timestamp: new Date().toISOString()
      };
      
      setMessages([welcomeMessage]);
      await AsyncStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify([welcomeMessage]));
    } catch (e) {
      console.error('Ошибка при очистке истории чата:', e);
    }
  };

  const renderMessageItem = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageBubble,
      item.isUser ? styles.userMessage : styles.aiMessage
    ]}>
      <Text style={styles.messageText}>{item.text}</Text>
      {item.timestamp && (
        <Text style={styles.timestampText}>
          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      )}
    </View>
  );

  const getSentimentColor = (sentiment: number): string => {
    if (sentiment >= 75) return '#4CAF50';
    if (sentiment >= 50) return '#8BC34A';
    if (sentiment >= 25) return '#FFC107';
    return '#FF5722';
  };

  const getSentimentText = (sentiment: number): string => {
    if (sentiment >= 75) return locale.ai.veryBullish;
    if (sentiment >= 50) return locale.ai.bullish;
    if (sentiment >= 25) return locale.ai.bearish;
    return locale.ai.veryBearish;
  };

  const getActionColor = (action: string): string => {
    switch (action) {
      case 'buy': return '#4CAF50';
      case 'sell': return '#FF5722';
      case 'hold': return '#FFC107';
      default: return '#FFFFFF';
    }
  };

  const getActionText = (action: string): string => {
    switch (action) {
      case 'buy': return locale.ai.actions.buy;
      case 'sell': return locale.ai.actions.sell;
      case 'hold': return locale.ai.actions.hold;
      default: return action;
    }
  };

  useEffect(() => {
    if (!analysisData && !loading) {
      requestMarketAnalysis();
    }
  }, [analysisData, loading]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{locale.ai.title}</Text>
        <View style={styles.headerActions}>
          {activeTab === AiTab.CHAT && (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={clearChatHistory}
            >
              <Ionicons name="trash-outline" size={22} color="#3498db" />
            </TouchableOpacity>
          )}
          {error && (
            <View style={styles.errorIndicator}>
              <Ionicons name="alert-circle" size={22} color="#FF5722" />
            </View>
          )}
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === AiTab.CHAT && styles.activeTab]}
          onPress={() => setActiveTab(AiTab.CHAT)}
        >
          <Ionicons 
            name="chatbubble-ellipses-outline" 
            size={20} 
            color={activeTab === AiTab.CHAT ? '#3498db' : '#aaaaaa'} 
          />
          <Text style={[
            styles.tabText,
            activeTab === AiTab.CHAT && styles.activeTabText
          ]}>
            {locale.ai.chat}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === AiTab.ANALYSIS && styles.activeTab]}
          onPress={() => setActiveTab(AiTab.ANALYSIS)}
        >
          <Ionicons 
            name="analytics-outline" 
            size={20} 
            color={activeTab === AiTab.ANALYSIS ? '#3498db' : '#aaaaaa'} 
          />
          <Text style={[
            styles.tabText,
            activeTab === AiTab.ANALYSIS && styles.activeTabText
          ]}>
            {locale.ai.analysis}
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === AiTab.CHAT ? (
        <KeyboardAvoidingView
          style={styles.chatContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={0}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessageItem}
            keyExtractor={(item, index) => `message-${index}`}
            style={styles.messageList}
            contentContainerStyle={styles.messageListContent}
          />
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder={locale.ai.askAboutCrypto}
              placeholderTextColor="#666"
              multiline
              maxLength={500}
            />
            <TouchableOpacity 
              style={[styles.sendButton, (!inputText.trim() || loading) && styles.disabledButton]} 
              onPress={sendMessage}
              disabled={!inputText.trim() || loading}
            >
              {loading ? (
                <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
              ) : (
                <Ionicons name="send" size={24} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
                onPress={requestMarketAnalysis}
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
                  onPress={requestMarketAnalysis}
                  disabled={loading}
                >
                  <Ionicons name="refresh" size={18} color="#3498db" />
                </TouchableOpacity>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{locale.ai.marketSentiment}</Text>
                <View style={styles.sentimentContainer}>
                  <View style={[
                    styles.sentimentIndicator, 
                    { backgroundColor: getSentimentColor(analysisData.marketSentiment) }
                  ]} />
                  <Text style={styles.sentimentText}>{getSentimentText(analysisData.marketSentiment)}</Text>
                </View>
                <Text style={styles.analysisText}>{analysisData.sentimentAnalysis}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{locale.ai.topOpportunities}</Text>
                {analysisData.opportunities.map((opportunity, index) => (
                  <View key={`opportunity-${index}`} style={styles.opportunityItem}>
                    <View style={styles.opportunityHeader}>
                      <Text style={styles.coinName}>{opportunity.coinName}</Text>
                      <Text style={[
                        styles.actionText,
                        { color: getActionColor(opportunity.action) }
                      ]}>
                        {getActionText(opportunity.action)}
                      </Text>
                    </View>
                    <Text style={styles.reasonText}>{opportunity.reason}</Text>
                    <View style={styles.confidenceContainer}>
                      <Text style={styles.confidenceText}>
                        {locale.ai.confidence}: {opportunity.confidence}%
                      </Text>
                      <View style={styles.confidenceBar}>
                        <View 
                          style={[
                            styles.confidenceFill,
                            { width: `${opportunity.confidence}%` }
                          ]} 
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

              <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Powered by Crypto Insights • {locale.common.refreshed} {new Date().toLocaleTimeString(language + '-' + language.toUpperCase(), { hour12: false })}
                </Text>
              </View>
            </>
          )}
        </ScrollView>
      )}

      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const AiScreen = observer(AiScreenComponent);
export default AiScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  errorIndicator: {
    padding: 8,
    marginLeft: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#1a1a1a',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3498db',
  },
  tabText: {
    color: '#aaaaaa',
    marginLeft: 8,
  },
  activeTabText: {
    color: '#3498db',
    fontWeight: 'bold',
  },
  
  chatContainer: {
    flex: 1,
    backgroundColor: '#121212',
    marginBottom: 30,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
    marginBottom: 8,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#3498db',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  aiMessage: {
    backgroundColor: '#2a2a2a',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    color: '#ffffff',
    fontSize: 16,
  },
  timestampText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#1a1a1a',
  },
  input: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#ffffff',
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#1f5a8a',
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
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666666',
  },
});
