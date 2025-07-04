import Constants from 'expo-constants';

export const GEMINI_API_KEY = Constants.expoConfig?.extra?.OPENAI_API_KEY;
export const Moralis_API_KEY = Constants.expoConfig?.extra?.MORALIS_API_KEY;
export const PROJECTID = Constants.expoConfig?.extra?.PROJECT_ID;

export const metadata = {
  name: 'CryptoAi Insights',
  description: 'AI-powered crypto analytics and insights',
  url: 'https://reown.com/appkit',
  icons: ['https://imgur.com/a/qvUyFQZ'],
  redirect: {
    native: 'cryptoaiinsights://',
  },
};
