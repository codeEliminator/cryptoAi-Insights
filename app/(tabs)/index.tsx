import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useLanguage } from '../mobx/LanguageStore/LanguageStore';
import { CryptoCurrency } from '../types/types';
import Heatmap from '../components/reusable-home-components/Heatmap';
import TrendingCoins from '../components/reusable-home-components/TrendingCoins';
import AiRecommendations from '../components/reusable-home-components/AiRecommendations';
import Header from '../components/reusable-home-components/Header';
import { useCryptoData } from '../hooks/useCryptoData';
import { StatusBar } from 'expo-status-bar';
import Loading from '../screens/Loading';
import { fakeData } from '../helpers/fakeData';
import { observer } from 'mobx-react-lite';
import Footer from '../components/Footer';

const HomeScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false); //true default -> dev
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [cryptoData, setCryptoData] = useState<CryptoCurrency[]>(fakeData);
  const [marketTrend, setMarketTrend] = useState<'up' | 'down' | 'neutral'>('neutral');
  const { locale, language } = useLanguage();

  const { formattedDate, fetchCryptoData } = useCryptoData(
    setCryptoData,
    setMarketTrend,
    setLoading,
    setRefreshing,
    page,
    refreshing
  );

  // useEffect(() => {
  //   // fetchCryptoData();
  // }, [fetchCryptoData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // fetchCryptoData(true);
  }, [fetchCryptoData]);

  if (loading && !refreshing) {
    return <Loading locale={locale} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        formattedDate={formattedDate}
        marketTrend={marketTrend}
        locale={locale}
        router={router}
      />
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            colors={['#3498db']}
            tintColor="#ffffff"
            onRefresh={onRefresh}
          />
        }
      >
        <Heatmap cryptoData={cryptoData} locale={locale} />
        <TrendingCoins cryptoData={cryptoData} locale={locale} router={router} />
        <AiRecommendations locale={locale} router={router} language={language} />
        <View style={styles.footer}>
          <Footer locale={locale} language={language} />
        </View>
      </ScrollView>
      <StatusBar style="light" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollView: {
    flex: 1,
  },
  footer: {
    marginBottom: 20,
  },
});

const HomeScreenObserver = observer(HomeScreen);

export default React.memo(HomeScreenObserver);
