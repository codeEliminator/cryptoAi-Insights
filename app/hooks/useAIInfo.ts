import { useState, useCallback, useEffect } from 'react';
import useGemini from './useGemini';

const useAIInfo = (language = 'en', coinId = '') => {
  const [loadingAiInfo, setLoadingAiInfo] = useState(false);
  const [errorAiInfo, setErrorAiInfo] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<string | null>(null);

  const fetchAIInfo = useCallback(async () => {
    if (!coinId || coinId.length === 0) {
      console.log('CoinID is empty, not fetching AI info');
      return;
    }

    console.log('Starting AI fetch for coinId:', coinId);
    setLoadingAiInfo(true);
    setErrorAiInfo(null);

    try {
      const prompt = `Проанализируй текущие рыночные тенденции криптовалюты ${coinId} и оцени её инвестиционный потенциал. Дай краткий, но аргументированный ответ: стоит ли её покупать, держать (если она уже есть) или продавать. Понимаю, что это не финансовый совет, но важно услышать твоё мнение на основе данных. Если ты ничего не знаешь про эту криптовалюту, напиши "Нет рекомендаций по этой криптовалюете. Не добавляй никаких вступлений, пояснений, заголовков."`;

      const text = await useGemini(prompt + '\nЯзык ответа: ' + language);
      setRecommendation(text);
    } catch (error) {
      console.error('Error fetching AI info:', error);

      console.log('Using fallback data in useAIInfo');
      setTimeout(() => {
        setRecommendation('Ai doesnt know about this coin. But you can still buy it');
      }, 1000);

      setErrorAiInfo('Error fetching AI response');
    } finally {
      setLoadingAiInfo(false);
    }
  }, [language, coinId]);

  useEffect(() => {
    if (coinId && coinId.length > 0) {
      fetchAIInfo();
    }
  }, [coinId, fetchAIInfo]);

  return { loadingAiInfo, errorAiInfo, recommendation, fetchAIInfo };
};

export default useAIInfo;
