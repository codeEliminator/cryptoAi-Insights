import React, { useCallback, useMemo, Suspense } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useLanguageStore } from '../mobx/MainStore';
import Heatmap from '../components/reusable-home-components/Heatmap';
import TrendingCoins from '../components/reusable-home-components/TrendingCoins';
import AiRecommendations from '../components/reusable-home-components/AiRecommendations';
import Header from '../components/reusable-home-components/Header';
import { StatusBar } from 'expo-status-bar';
import Loading from '../screens/Loading';
import { observer } from 'mobx-react-lite';
import Footer from '../components/Footer';
import formattedDate from '../helpers/fomattedDate';
import { useCryptoStore } from '../mobx/MainStore';

const HomeScreen = () => {
  const router = useRouter();
  const { cryptoData, loading, refreshing, marketTrend, loadMore, refresh } = useCryptoStore();
  const { locale, language } = useLanguageStore();

  const newFormattedDate = useMemo(() => formattedDate(language), [language]);

  const onRefresh = useCallback(() => {
    refresh();
  }, [refresh]);

  if (loading) {
    return <Loading locale={locale} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Suspense fallback={<Loading locale={locale} />}>
        <Header
          formattedDate={newFormattedDate}
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
          <Heatmap cryptoData={cryptoData} locale={locale} loadMore={loadMore} />
          <TrendingCoins cryptoData={cryptoData} locale={locale} router={router} />
          <AiRecommendations locale={locale} router={router} language={language} />
          <View style={styles.footer}>
            <Footer locale={locale} language={language} />
          </View>
        </ScrollView>
        <StatusBar style="light" />
      </Suspense>
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

export default observer(HomeScreen);
