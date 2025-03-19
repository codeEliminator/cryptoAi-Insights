import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import Loading from '@/app/screens/Loading';
import { useLanguage } from '@/app/mobx/LanguageStore/LanguageStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';


interface CoinDetail {
  id: string;
  name: string;
  symbol: string;
  image: { large: string; };
  market_data: {
    current_price: { usd: number; };
    price_change_percentage_24h: number;
    market_cap: { usd: number; };
    total_volume: { usd: number; };
    high_24h: { usd: number; };
    low_24h: { usd: number; };
  };
  description: { en: string; };
}

export default function CoinDetail() { 
  const {id} = useLocalSearchParams();
  const {locale} = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [coin, setCoin] = useState<CoinDetail | null>(null);
  const [change, setChange] = useState(0);

  const fetchCoinData = async () => {
    if(!id) return 
    setLoading(true);
    try {
      const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`);
      setCoin(response.data);
      setChange(response.data.market_data.price_change_percentage_24h);
    } catch (error) {
      console.error('Error fetching coin data:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCoinData();
  }, [id]);

  if(loading){
    return <Loading locale={locale}/>
  } 
  console.log('id')
  return (
    <>
    <LinearGradient
        colors={change > 2 ? ['rgba(19, 23, 34, 0.5)', 'rgb(5, 102, 54)', 'rgb(5, 102, 54)'] : change > 0 ? ['rgba(19, 23, 34, 0.5)', 'rgb(66, 189, 127)', 'rgb(66, 189, 127)'] : ['rgba(19, 23, 34, 0.5)', 'rgb(247, 124, 128)', 'rgb(247, 124, 128)'] }
        style={styles.background}
    />
    <SafeAreaView style={styles.container}>
      
    </SafeAreaView>
    </>
    
  )

}

const styles = StyleSheet.create({
  container: {
    // flex: 1
  },
  background: {
    flex: 1,
  }
})