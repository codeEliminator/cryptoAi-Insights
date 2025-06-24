import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message } from '@/app/(tabs)/ai';
import { LocalizationData } from '@/app/types/LocalizationData';
import { MarketAnalysis } from '@/app/(tabs)/ai';
import { ANALYSIS_PROMPT, SYSTEM_PROMPT } from '@/app/services/Prompts';
import useGemini from '@/app/hooks/useGemini';

interface AiMarketAnalysisProps {
  setError: (error: string) => void;
  setLoading: (loading: boolean) => void;
  setAnalysisData: (analysisData: MarketAnalysis) => void;
  language: string;
}

interface AiSendMessageProps {
  inputText: string;
  locale: LocalizationData;
  setError: (error: string) => void;
  setLoading: (loading: boolean) => void;
  setMessages: (messages: Message[]) => void;
  language: string;
  loading: boolean;
  setInputText: (inputText: string) => void;
  messages: Message[];
}

export class AiService {
  public static CHAT_HISTORY_KEY = 'ai_chat_history';
  public static ANALYSIS_DATA_KEY = 'ai_analysis_data';
  public static generateAiResponse = useGemini;

  public AiTab = {
    CHAT: 'chat',
    ANALYSIS: 'analysis',
  };

  public static async loadAnalysisData(
    setAnalysisData: (analysisData: MarketAnalysis) => void
  ): Promise<void> {
    try {
      const analysisDataStr = await AsyncStorage.getItem(AiService.ANALYSIS_DATA_KEY);
      if (analysisDataStr) {
        setAnalysisData(JSON.parse(analysisDataStr));
      }
    } catch (e) {
      console.error('Ошибка загрузки данных анализа:', e);
    }
  }

  public static async clearChatHistory(
    locale: LocalizationData,
    setMessages: (messages: Message[]) => void
  ): Promise<void> {
    try {
      await AsyncStorage.removeItem(AiService.CHAT_HISTORY_KEY);

      const welcomeMessage: Message = {
        text: locale.ai.welcomeMessage,
        isUser: false,
        timestamp: new Date().toISOString(),
      };

      setMessages([welcomeMessage]);
      await AsyncStorage.setItem(AiService.CHAT_HISTORY_KEY, JSON.stringify([welcomeMessage]));
    } catch (e) {
      console.error('Ошибка при очистке истории чата:', e);
    }
  }

  public static async loadChatHistory(
    locale: LocalizationData,
    setMessages: (messages: Message[]) => void
  ): Promise<void> {
    try {
      const chatHistory = await AsyncStorage.getItem(AiService.CHAT_HISTORY_KEY);
      if (chatHistory) {
        setMessages(JSON.parse(chatHistory));
      } else {
        const welcomeMessage: Message = {
          text: locale.ai.welcomeMessage,
          isUser: false,
          timestamp: new Date().toISOString(),
        };
        await AsyncStorage.setItem(AiService.CHAT_HISTORY_KEY, JSON.stringify([welcomeMessage]));
        setMessages([welcomeMessage]);
      }
    } catch (e) {
      console.error('Ошибка загрузки истории чата:', e);
    }
  }

  public static async requestMarketAnalysis(props: AiMarketAnalysisProps): Promise<void> {
    const { setError, setLoading, setAnalysisData, language } = props;
    setLoading(true);
    setError('');
    try {
      const text = await AiService.generateAiResponse(
        `${ANALYSIS_PROMPT}\nЯзык ответа: ${language}`
      );

      try {
        const cleanedText = text.replace(/```json|```/g, '').trim();
        const parsedData = JSON.parse(cleanedText);

        if (!parsedData.timestamp) {
          parsedData.timestamp = new Date().toISOString();
        }
        setAnalysisData(parsedData);
        await AsyncStorage.setItem(AiService.ANALYSIS_DATA_KEY, JSON.stringify(parsedData));
      } catch (parseError) {
        console.error('Ошибка парсинга AI ответа:', parseError);
        setError('Ai failed to analyze the market');
      }
    } catch (e) {
      console.error('Ошибка при запросе анализа рынка:', e);
      setError('Failed to get market analysis');
    } finally {
      setLoading(false);
    }
  }

  public static async sendMessage(props: AiSendMessageProps): Promise<void> {
    const {
      inputText,
      setError,
      setLoading,
      setMessages,
      language,
      loading,
      setInputText,
      messages,
      locale,
    } = props;
    if (inputText.trim() === '' || loading) return;

    const trimmedText = inputText.trim();
    setInputText('');
    setLoading(true);
    setError('');

    const userMessage: Message = {
      text: trimmedText,
      isUser: true,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    try {
      await AsyncStorage.setItem(AiService.CHAT_HISTORY_KEY, JSON.stringify(updatedMessages));
    } catch (e) {
      console.error('Ошибка сохранения истории чата:', e);
    }

    try {
      const recentMessages = [...updatedMessages.slice(-10)]
        .map(msg => (msg.isUser ? `Пользователь: ${msg.text}` : `AI: ${msg.text}`))
        .join('\n');

      const prompt = `${SYSTEM_PROMPT}\n\nИстория диалога:\n${recentMessages}\n\nОтвечай на языке ${language}`;

      const aiText = await AiService.generateAiResponse(prompt);

      const aiMessage: Message = {
        text: aiText,
        isUser: false,
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);

      await AsyncStorage.setItem(AiService.CHAT_HISTORY_KEY, JSON.stringify(finalMessages));
    } catch (e) {
      console.error('Ошибка при отправке сообщения AI:', e);
      setError('Не удалось получить ответ от AI');

      const errorMessage: Message = {
        text: locale.ai.errorMessage,
        isUser: false,
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);

      await AsyncStorage.setItem(AiService.CHAT_HISTORY_KEY, JSON.stringify(finalMessages));
    } finally {
      setLoading(false);
    }
  }
}
