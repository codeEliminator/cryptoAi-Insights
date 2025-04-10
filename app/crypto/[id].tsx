import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator, Image, Dimensions, TouchableOpacity } from 'react-native';
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
import { Ionicons } from '@expo/vector-icons';
import abbreviateNumber from '../helpers/abbreviateNumber';
import useAIInfo from '../hooks/useAIInfo';
import AiRecommendationCard from './components/AiReccomendationCard';
import BrowserView from './components/BrowserView';
import { CoinDetail } from '../types/types';
import CryptoInfoCard from './helpers/CryptoInfoCard';
import CryptoPriceDisplay from './helpers/CryptoPriceDetails';


const systemThickMaterialDark = 'rgba(28, 28, 30, 0.85)'

export default function Coin() { 
  const {id} = useLocalSearchParams();
  const {locale, language} = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(true); //switch to true -> dev
  const [coin, setCoin] = useState<CoinDetail | null>(null);
  const [change, setChange] = useState(0);
  const [timeframe, setTimeframe] = useState<'1' | '7' | '30' | '365'>('7');
  const [showWebView, setShowWebView] = useState(false);

  const { loadingAiInfo, errorAiInfo, recommendation } = useAIInfo(language, id?.toString() || '');

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

  useEffect(() => {
    fetchCoinData();
  }, [id]);

  if(loading || loadingAiInfo){
    return <Loading locale={locale}/>
  } 
  
  const chartKey = `chart-${coin?.id}-${timeframe}`;
  
  const getCardBackgroundColor = () => {
    if (change > 2) return "rgb(5, 102, 54)";
    if (change > 0) return "rgb(66, 189, 127)";
    return "rgb(247, 124, 128)";
  };

  return (
    <>
      <StatusBar style="light" />
      <LinearGradient
        colors={change > 2 
          ? [systemThickMaterialDark, 'rgb(5, 102, 54)', 'rgb(5, 102, 54)'] 
          : change > 0 
            ? [systemThickMaterialDark, 'rgb(66, 189, 127)', 'rgb(66, 150, 127)'] 
            : [systemThickMaterialDark, 'rgb(247, 124, 128)', 'rgb(247, 124, 128)']}
        style={styles.background}
      >
        <ScrollView>
          <SafeAreaView style={styles.container}>
            <View style={styles.content}>
              <View style={styles.coinHeaderContainer}>
                <View style={styles.coinImageContainer}>
                  <Image source={{ uri: coin?.image.large }} style={styles.coinImage} />
                </View>
                <View>
                  <Text style={styles.coinName}>{coin?.name.toUpperCase()}</Text>
                  <View style={styles.coinMetaContainer}>
                    <Text style={styles.metaText}>{coin?.symbol.toUpperCase()}</Text>
                    <Text style={styles.metaText}>USD</Text>
                    <Image source={require('@/assets/images/cy_icon_small.png')} style={styles.metaIcon}/>
                    <Text style={styles.metaText}>CRYPTO</Text>
                  </View>
                </View>
              </View>
              
              <CryptoPriceDisplay 
                coin={coin} 
                locale={locale} 
              />
              
              <View>
                <TimeframeSelector 
                  selectedTimeframe={timeframe}
                  onTimeframeChange={handleTimeframeChange}
                  locale={locale}
                />
              </View>
              
              <View>
                <CryptoChart 
                  key={chartKey}
                  coinId={coin?.id || 'bitcoin'}
                  timeframe={timeframe}
                  locale={locale}
                  language={language}
                />
              </View>
              
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeaderContainer}>
                  <Text style={styles.headerText}>{locale.crypto.statistics}</Text>
                </View>
                <CryptoInfoCard 
                  coin={coin} 
                  locale={locale} 
                  abbreviateNumber={abbreviateNumber} 
                />
              </View>
              
              <View style={styles.aiSection}>
                <Text style={styles.headerText}>{locale.crypto.aiRecommendation}</Text>
                <View style={styles.aiCardContainer}>
                  <AiRecommendationCard
                    loadingAiInfo={loadingAiInfo}
                    recommendation={recommendation}
                    locale={locale}
                  />
                </View>
              </View>
              
              <View>
                <Text style={styles.headerText}>
                  {locale.crypto.about} {coin?.id}
                </Text>
                <View style={[styles.blockShadow, 
                  { backgroundColor: getCardBackgroundColor(), height: 'auto' }]}>
                  <View>
                    <Text style={styles.descriptionText}>{coin?.description.en}</Text>
                  </View>
                  <View style={styles.linkContainer}>            
                    <TouchableOpacity onPress={() => setShowWebView(true)}>
                      <View style={styles.linkButton}>
                        <Ionicons name='earth' size={24} color='#dfdfdf' style={styles.linkIcon}/>
                        <Text style={styles.linkButtonText}>{locale.crypto.officialLink}</Text>
                      </View>                      
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </ScrollView>
      </LinearGradient>
      <BrowserView link={coin?.links.homepage[0] || ''} showWebView={showWebView} setShowWebView={setShowWebView} />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },
  background: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  blockShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
    height: 150,
    display: "flex",
    justifyContent: "space-between",
  },
  loadingContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#FFF',
  },
  headerText: {
    fontSize: 22, 
    fontWeight: 'bold', 
    color: 'white', 
    marginRight: 5
  },
  linkText: {
    color: '#007AFF',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  webviewContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  header: {
    height: 50,
    backgroundColor: '#f8f8f8',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    color: '#007AFF',
    fontSize: 16,
    padding: 5,
  },
  webview: {
    flex: 1,
  },
  // New optimized styles
  coinHeaderContainer: {
    display: 'flex', 
    flexDirection: 'row', 
    alignItems: 'center'
  },
  coinImageContainer: {
    marginRight: 10
  },
  coinImage: { 
    width: 50, 
    height: 50 
  },
  coinName: {
    fontSize: 24, 
    fontWeight: 'bold', 
    color: 'white'
  },
  coinMetaContainer: {
    display: 'flex', 
    flexDirection: 'row', 
    alignItems: 'center'
  },
  metaText: {
    fontSize: 12, 
    color: '#dbdbdb'
  },
  metaIcon: {
    width: 18, 
    height: 18, 
    marginLeft: 5, 
    borderRadius: 20, 
    marginRight: 5
  },
  sectionContainer: {
    display: 'flex', 
    flexDirection: 'column'
  },
  sectionHeaderContainer: {
    display: 'flex', 
    flexDirection: 'row', 
    alignItems: 'center'
  },
  aiSection: {
    marginTop: 15
  },
  aiCardContainer: {
    display: 'flex', 
    justifyContent: 'flex-start', 
    alignItems: 'center'
  },
  descriptionText: {
    color: '#fff', 
    fontSize: 12
  },
  linkContainer: {
    marginTop: 10, 
    display: 'flex', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 10
  },
  linkButton: {
    padding: 5, 
    backgroundColor: 'rgba(0,0,0,0.1)', 
    borderRadius: 15, 
    width: 170, 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    flexDirection: 'row'
  },
  linkIcon: {
    marginRight: 5
  },
  linkButtonText: {
    color: '#dfdfdf', 
    fontSize: 18
  }
});