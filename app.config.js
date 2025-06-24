import 'dotenv/config';
export default {
  expo: {
    name: 'CryptoAiInsights',
    slug: 'CryptoAiInsights',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'cryptoaiinsights',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'io.cryptoaiinsights',
      config: {
        usesNonExemptEncryption: false,
      },
      infoPlist: {
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: ['cryptoaiinsights'],
          },
        ],
        LSApplicationQueriesSchemes: ['metamask', 'trust', 'safe', 'rainbow', 'uniswap'],
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      plugins: ['./queries.js'],
      intentFilters: [
        {
          action: 'VIEW',
          autoVerify: true,
          data: [
            {
              scheme: 'cryptoaiinsights',
            },
          ],
          category: ['BROWSABLE', 'DEFAULT'],
        },
      ],
      package: 'io.cryptoaiinsights',
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
        },
      ],
      'expo-localization',
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      PROJECT_ID: process.env.PROJECT_ID,
      MORALIS_API_KEY: process.env.MORALIS_API_KEY,
      eas: {
        projectId: process.env.EAS_PROJECT_ID,
      },
    },
  },
};
