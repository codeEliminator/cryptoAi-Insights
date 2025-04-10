import { useState, useCallback, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Constants from 'expo-constants';
import { bitcoinAnalysis } from "../helpers/fakeTextDataForAIReccom";

const useAIInfo = (language = 'en', coinId = '') => {
  const [loadingAiInfo, setLoadingAiInfo] = useState(false);
  const [errorAiInfo, setErrorAiInfo] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<string | null>(null);

  const fetchAIInfo = useCallback(async () => {
    if (!coinId || coinId.length === 0) {
      console.log("CoinID is empty, not fetching AI info");
      return;
    }

    console.log("Starting AI fetch for coinId:", coinId);
    setLoadingAiInfo(true);
    setErrorAiInfo(null);
    
    try {
      const OPENAI_API_KEY = Constants.expoConfig?.extra?.OPENAI_API_KEY;
      
      if (!OPENAI_API_KEY) {
        throw new Error("API key not found");
      }

      const prompt = `Проанализируй текущие рыночные тенденции криптовалюты ${coinId} и оцени её инвестиционный потенциал. Дай краткий, но аргументированный ответ: стоит ли её покупать, держать (если она уже есть) или продавать. Понимаю, что это не финансовый совет, но важно услышать твоё мнение на основе данных.`;
      
      const genAI = new GoogleGenerativeAI(OPENAI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt + ` на языке ${language}`);
      const response = await result.response;
      const text = response.text();
      setRecommendation(text);
    } 
    catch (error) {
      console.error("Error fetching AI info:", error);
      
      console.log("Using fallback data");
      setTimeout(() => {
        setRecommendation(bitcoinAnalysis);
      }, 1000);
      
      setErrorAiInfo('Ошибка при получении данных');
    } 
    finally {
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