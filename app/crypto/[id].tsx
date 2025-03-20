import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator, Image, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import Loading from '@/app/screens/Loading';
import { useLanguage } from '@/app/mobx/LanguageStore/LanguageStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import FakeCoinData from '../helpers/fakeCoinData';
import { StatusBar } from 'expo-status-bar';
import CryptoChart from './CryptoChart'; 
import TimeframeSelector from './TimeFrameSelector';

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

const systemThickMaterialDark = 'rgba(28, 28, 30, 0.85)'
const screenWidth = Dimensions.get('window').width;

export default function CoinDetail() { 
  const {id} = useLocalSearchParams();
  const {locale, language} = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(false); //switch to true -> dev
  const [coin, setCoin] = useState<CoinDetail | null>(FakeCoinData);
  const [change, setChange] = useState(0);
  const [timeframe, setTimeframe] = useState<'1' | '7' | '30' | '365'>('7');

  const handleTimeframeChange = (newTimeframe: '1' | '7' | '30' | '365') => {
    if (timeframe !== newTimeframe) {
      setTimeframe(newTimeframe);
    }
  };

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

  // useEffect(() => {
  //   fetchCoinData();
  // }, [id]);
  useEffect(() => {

    setChange(coin?.market_data.price_change_percentage_24h || 0);
  })

  if(loading){
    return <Loading locale={locale}/>
  } 
  const chartKey = `chart-${coin?.id}-${timeframe}`;

  return (
    <>
      <StatusBar style="light" />
      <LinearGradient
        colors={change > 2 ? [systemThickMaterialDark, 'rgb(5, 102, 54)', 'rgb(5, 102, 54)'] : 
                change > 0 ? [systemThickMaterialDark, 'rgb(66, 189, 127)', 'rgb(66, 189, 127)'] : 
                [systemThickMaterialDark, 'rgb(247, 124, 128)', 'rgb(247, 124, 128)']}
        style={styles.background}
      >
        
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
              <View style={{marginRight: 10}}>
                <Image source={{ uri: coin?.image.large }} style={{ width: 50, height: 50 }} />
              </View>
              <View>
                <Text style={{fontSize: 24, fontWeight: 'bold', color: 'white'}}>{coin?.name.toUpperCase()}</Text>
                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center',}}>
                  <Text style={{fontSize: 12, color: '#dbdbdb'}}>{coin?.symbol.toUpperCase()}</Text>
                  <Text style={{fontSize: 12, color: '#dbdbdb'}}>USD</Text>
                  <Image source={require('@/assets/images/cy_icon_small.png')} style={{width: 18, height: 18, marginLeft: 5, borderRadius: 20, marginRight: 5}}/>
                  <Text style={{fontSize: 12, color: '#dbdbdb'}}>CRYPTO</Text>
                </View>
              </View>
            </View>
            <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>
              <View style={{marginTop: 20, display: 'flex', flexDirection: 'row',  alignItems: 'baseline',}}>
                <Text style={{fontSize: 26, fontWeight: 'bold', color: 'white'}}>
                  {new Intl.NumberFormat('ru', { maximumFractionDigits: 2 }).format(coin?.market_data.current_price.usd as number)}
                </Text>
                <Text style={{fontSize: 12, color: 'white'}}> USD </Text>
                <Text style={{fontSize: 16, color: 'white', marginRight: 5}}>
                  {new Intl.NumberFormat('ru', { maximumFractionDigits: 2 }).format(coin?.market_data.high_24h.usd! - coin?.market_data.low_24h.usd! as number)}
                </Text>
                <Text style={{fontSize: 16, color: 'white', marginRight: 10}}>
                  ({ coin?.market_data.price_change_percentage_24h.toFixed(2) }%)
                </Text>
              </View>
              <View style={{display:'flex', flexDirection: 'row', alignItems: 'center',}}>
                <View style={{backgroundColor: '#dbdbdb', borderRadius: 3, height: 6, marginRight: 4, width: 6}}></View>
                <Text style={{color: '#dbdbdb'}}>{locale.crypto.marketOpen}</Text>
              </View>
            </View>
            
            <TimeframeSelector 
                selectedTimeframe={timeframe}
                onTimeframeChange={handleTimeframeChange}
                locale={locale}
            />
          <CryptoChart 
              key={chartKey}
              coinId={coin?.id || 'bitcoin'}
              timeframe={timeframe}
              locale={locale}
              language={language}
            />
          </View>
        </SafeAreaView>
      </LinearGradient>

    </>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 60,
  },
  background: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  }

})

