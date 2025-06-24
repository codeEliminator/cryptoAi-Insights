import { useState, useCallback } from 'react';
import useGemini from './useGemini';
import { useCryptoStore } from '../mobx/MainStore';

import { AIRecommendation } from '../types/types';

const SYSTEM_PROMPT = `
Ты — AI-аналитик рынка криптовалют. Прими во внимания растущие и падающие криптовалюты на сегодня. 
 Твоя задача — анализировать текущие рыночные тенденции и предоставлять рекомендации по покупке, удержанию или продаже криптовалют, включая объяснение причин и уровень уверенности в процентах. Рекомендации должны быть представлены в следующем формате и не давай больше информации, не говори ничего кроме этого ответа:


[
  {
    "coinId": "bitcoin",
    "coinName": "Bitcoin",
    "confidence": 85,
    "reason": "Увеличение институциональных инвестиций и позитивные новости",
    "action": "buy"
  },
  {
    "coinId": "ethereum",
    "coinName": "Ethereum",
    "confidence": 75,
    "reason": "Рост активности в DeFi и недавнее обновление сети",
    "action": "hold"
  },
  {
    "coinId": "solana",
    "coinName": "Solana",
    "confidence": 65,
    "reason": "Проблемы с масштабируемостью и недавние перебои в работе сети",
    "action": "sell"
  }
]

`;

export const useAiRecommendation = (language: string) => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const cryptoStore = useCryptoStore();
  const { cryptoData } = cryptoStore;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const text = await useGemini(
        SYSTEM_PROMPT +
          ` на языке ${language} и растущие криптовалюты: ${cryptoData
            .filter(coin => coin.price_change_percentage_24h > 0)
            .map(coin => coin.name)
            .join(', ')}`
      );
      try {
        const cleanedText = text.replace(/```json|```/g, '').trim();
        const parsedData = JSON.parse(cleanedText);

        if (Array.isArray(parsedData)) {
          setRecommendations(parsedData);
        } else {
          throw new Error('AI вернул некорректные данные');
        }
      } catch (parseError) {
        console.error('Ошибка парсинга AI ответа:', parseError);
        setError('Ошибка парсинга AI рекомендаций');
      }
    } catch (fetchError) {
      console.error('Ошибка получения AI рекомендаций:', fetchError);
      setError('Ошибка получения AI рекомендаций');
    } finally {
      setLoading(false);
    }
  }, [language]);

  return {
    recommendations,
    loading,
    error,
    fetchRecommendations,
  };
};
