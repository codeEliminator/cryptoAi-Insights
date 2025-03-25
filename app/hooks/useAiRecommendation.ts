import { useState, useCallback } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Constants from 'expo-constants';
import { AIRecommendation } from '../types/types';

const SYSTEM_PROMPT = `
Ты — AI-аналитик рынка криптовалют. Твоя задача — анализировать текущие рыночные тенденции и предоставлять рекомендации по покупке, удержанию или продаже криптовалют, включая объяснение причин и уровень уверенности в процентах. Рекомендации должны быть представлены в следующем формате:

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const OPENAI_API_KEY = Constants.expoConfig!.extra!.OPENAI_API_KEY;
  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (!OPENAI_API_KEY) {
        throw new Error("Not Available(No API Key)");
      }
      const genAI = new GoogleGenerativeAI(OPENAI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(SYSTEM_PROMPT + ` на языке ${language}`);
      const response = await result.response;
      const text = response.text();

      try {
        const cleanedText = text.replace(/```json|```/g, "").trim();
        const parsedData = JSON.parse(cleanedText);
        
        if (Array.isArray(parsedData)) {
          setRecommendations(parsedData);
        } else {
          throw new Error("AI вернул некорректные данные");
        }
      } catch (parseError) {
        console.error("Ошибка парсинга AI ответа:", parseError);
        setError("Ошибка парсинга AI рекомендаций");
      }
    } catch (fetchError) {
      console.error("Ошибка получения AI рекомендаций:", fetchError);
      setError("Ошибка получения AI рекомендаций");
    } finally {
      setLoading(false);
    }
  }, [language]);

  return {
    recommendations,
    loading,
    error,
    fetchRecommendations
  };
};
