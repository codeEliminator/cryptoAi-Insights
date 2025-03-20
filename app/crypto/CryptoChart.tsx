import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, ActivityIndicator, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';
import Loading from '../screens/Loading';
import { LocalizationData } from '../types/LocalizationData';
import { FakeCoinChartData } from '../helpers/fakeCoinChartData';

interface CryptoChartProps {
  coinId: string;
  timeframe?: '1' | '7' | '30' | '365'; // дни для отображения
  chartStyle?: any;
  chartHeight?: number;
  chartWidth?: number;
  locale: LocalizationData;
  language: 'en' | 'fr' | 'ru';
}

const screenWidth = Dimensions.get('window').width;

const CryptoChart: React.FC<CryptoChartProps> = ({ 
                                              coinId, 
                                              timeframe = '7',
                                              chartStyle = {},
                                              chartHeight = 250,
                                              chartWidth = screenWidth - 40,
                                              locale,
                                              language
                                            }) => {
  const [chartData, setChartData] = useState<{
                                            labels: string[];
                                            datasets: { data: number[] }[];
  }>({ labels: [], datasets: [{ data: [0] }]});
  const getLocalizedDays = () => {
    const lang = language;
    switch(lang.toLowerCase()) {
      case 'en': return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      case 'fr': return ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
      case 'ru': default: return ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    }
  };
  const getLocalizedMonths = () => {
    const lang = language ;
    switch(lang.toLowerCase()) {
      case 'en':
        return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      case 'fr':
        return ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
      case 'ru': ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
      default:
        return ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
    }
  };
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {

    const fetchChartData = async () => {
      setLoading(true);
      setError(null);

      
      try {
        // const response = await axios.get(
        //   `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${timeframe}`
        // );
        // const prices: [number, number][] = response.data.prices;
        const prices = FakeCoinChartData.prices;
        
        const maxLabels = 8;
        let step = Math.ceil(prices.length / maxLabels);
        const priceData = prices.map(([, price]) => price);
        let labels: string[] = [];
        
        for (let i = 0; i < prices.length; i += step) {
          const [timestamp] = prices[i];
          const date = new Date(timestamp);
          
          let label = '';
          if (timeframe === '1') {
            label = date.getHours() + ':00';
          } else if (timeframe === '7') {
            const days = getLocalizedDays();
            label = days[date.getDay()];
          } else if (timeframe === '30') {
            label = date.getDate().toString() + '/' + (date.getMonth() + 1);
          } else {
            const months = getLocalizedMonths();
            label = months[date.getMonth()];
          }
          
          labels.push(label);
        }
      
        while (labels.length < maxLabels) {
          labels.push('');
        }
        
        
        const paddedData = [...priceData];
        while (paddedData.length < labels.length * step) {
          paddedData.push(priceData[priceData.length - 1]);
        }
        
        const chartDataUpdate = {
          labels,
          datasets: [{ data: priceData }]
        };
        
        setChartData(chartDataUpdate);
      } catch (err) {
        console.error('Ошибка при загрузке данных графика:', err);
        setError('Не удалось загрузить данные для графика');
      } finally {
        setLoading(false);
      }
    };
    
    fetchChartData();
  }, [coinId, timeframe]);

  if (loading) {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFF" />
          <Text style={styles.loadingText}>{locale.common.loading}</Text>
        </View>
      );
    }
  }
  
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const chartConfig = {
    backgroundGradientFrom: 'transparent',
    backgroundGradientTo: 'transparent',
    backgroundColor: 'transparent',
    decimalPlaces: 1,
    color: () => `rgba(255, 255, 255, 1)`,
    labelColor: () => `rgba(255, 255, 255, 1)`,
    style: {
      borderRadius: 0,
    },
    propsForDots: {
      r: '0', 
      strokeWidth: '0',
    },
    propsForBackgroundLines: {
      strokeDasharray: '', 
      strokeWidth: 3,
      stroke: 'rgba(255, 255, 255, 0.1)',
    },

    fillShadowGradientFrom: 'rgba(255, 255, 255, 0.3)',
    fillShadowGradientTo: 'rgba(255, 255, 255, 0.0)',
    useShadowColorFromDataset: false,
  };



  return (
    <View style={[styles.container, chartStyle]}>
      <TouchableWithoutFeedback >
        <View>
          <LineChart
            data={chartData}
            width={chartWidth}
            height={chartHeight}
            chartConfig={chartConfig}
            bezier
            withDots={false}
            withInnerLines={false}
            withOuterLines={true}
            withVerticalLines={false}
            withHorizontalLines={true}
            withShadow={false}
            fromZero={false}
            transparent={true}
          />
          

        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: 'center',
    position: 'relative',
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
  errorContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FFF',
  },
});

export default CryptoChart;