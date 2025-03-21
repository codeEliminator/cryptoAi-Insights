import { useState, useCallback } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { OPENAI_API_KEY } from '@env';
import { bitcoinAnalysis } from "../helpers/fakeTextDataForAIReccom";

const useAIInfo = (language: string, coinId: string) => {
  const [loadingAiInfo, setLoadingAiInfo] = useState(true);
  const [errorAiInfo, setErrorAiInfo] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<string | null>(null);

  const fetchAIInfo = useCallback(async () => {
    const prompt = `Проанализируй текущие рыночные тенденции криптовалюты ${coinId} и оцени её инвестиционный потенциал. Дай краткий, но аргументированный ответ: стоит ли её покупать, держать (если она уже есть) или продавать. Понимаю, что это не финансовый совет, но важно услышать твоё мнение на основе данных.`  
    setLoadingAiInfo(true);
    setErrorAiInfo(null);

    try{
      // if(coinId.length === 0) return 
      // const genAI = new GoogleGenerativeAI(OPENAI_API_KEY);
      // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      // const result = await model.generateContent(prompt + ` на языке ${language}`);
      // const response = await result.response;
      // const text = response.text();

      // setRecommendation(text);
      setTimeout(() => {
        setRecommendation(bitcoinAnalysis)  
      }, 2000)
      
    }
    catch (fetchError) {
      console.log(fetchError)

      setErrorAiInfo('ОШибка')
    }
    finally {
      setLoadingAiInfo(false);
    }
  }, [language, coinId])

  return { loadingAiInfo, errorAiInfo, recommendation, fetchAIInfo }
}

export default useAIInfo