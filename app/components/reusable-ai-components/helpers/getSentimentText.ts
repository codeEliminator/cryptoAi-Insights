import { LocalizationData } from "@/app/types/LocalizationData";

const getSentimentText = (sentiment: number, locale: LocalizationData): string => {
  if (sentiment >= 75) return locale.ai.veryBullish;
  if (sentiment >= 50) return locale.ai.bullish;
  if (sentiment >= 25) return locale.ai.bearish;
  return locale.ai.veryBearish;
};

export default getSentimentText;