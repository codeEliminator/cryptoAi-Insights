import { useState, useCallback, useEffect } from 'react';
import { bitcoinAnalysis } from '../helpers/fakeTextDataForAIReccom';
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
      const prompt = `Проанализируй текущие рыночные тенденции криптовалюты ${coinId} и оцени её инвестиционный потенциал. Дай краткий, но аргументированный ответ: стоит ли её покупать, держать (если она уже есть) или продавать. Понимаю, что это не финансовый совет, но важно услышать твоё мнение на основе данных. Если ты ничего не знаешь про эту криптовалюту, напиши "Нет рекомендаций по этой криптовалюете "`;

      const text = await useGemini(prompt);
      setRecommendation(text);
    } catch (error) {
      console.error('Error fetching AI info:', error);

      console.log('Using fallback data');
      setTimeout(() => {
        setRecommendation(bitcoinAnalysis);
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
