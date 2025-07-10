import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, ActivityIndicator, StyleSheet } from 'react-native';
// import { LineChart } from "react-native-gifted-charts";
import { LineChart } from "react-native-chart-kit";
import { LocalizationData } from '../../types/LocalizationData';
import { fetchChartData } from '@/app/utils/api/fetchChartData';
import ChartData from '@/app/types/ChartTypes';

const fakeData = [{"date": "03 07 2025", "label": "Чт", "value": 109389.26849358118}, {"date": "04 07 2025", "label": "Пт", "value": 108991.71506309851}, {"date": "05 07 2025", "label": "Сб", "value": 108080.69280477084}, {"date": "05 07 2025", "label": "Сб", "value": 108146.47997496236}, {"date": "06 07 2025", "label": "Вс", "value": 108226.77823782979}, {"date": "07 07 2025", "label": "Пн", "value": 109060.68873662295}, {"date": "08 07 2025", "label": "Вт", "value": 108032.89177796259}, {"date": "08 07 2025", "label": "Вт", "value": 108269.04717656305}, {"date": "09 07 2025", "label": "Ср", "value": 108699.69913613351}, {"date": "10 07 2025", "label": "Чт", "value": 111287.54047974612}]

interface CryptoChartProps {
  coinId: string;
  timeframe?: '1' | '7' | '30' | '365'; 
  chartStyle?: any;
  chartHeight?: number;
  chartWidth?: number;
  locale: LocalizationData;
  language: 'en' | 'fr' | 'ru';
}

const screenWidth = Dimensions.get('window').width;

const defaultProps = {
  timeframe: '7',
  chartStyle: {},
  chartHeight: 250,
  chartWidth: screenWidth - 50,

}

const CryptoChart: React.FC<CryptoChartProps> = (props) => {
  const { coinId, timeframe, chartStyle, chartHeight, chartWidth, locale, language } = { ...defaultProps, ...props };
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchChartData(coinId, timeframe, language);
        if (response instanceof Error) {
          setError(response.message);
        } else {
          setChartData(response);
          console.log('Chart data fetched:', response);
        } 
        setChartData(fakeData as ChartData[]);
      } catch (error) {
        setError('Error fetching chart data');
      }  finally {
          setLoading(false);
        }
    }
    fetchData();
  }, [coinId, timeframe, language]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFF" />
        <Text style={styles.loadingText}>{locale.common.loading}</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }




  return (
    <View style={[styles.container, chartStyle]}>
      <View >
        <LineChart
        
         data = {{
           labels: chartData.map(item => item.label),
           datasets: [
             {
               data: chartData.map(item => item.value)
             }
           ]
         }}
          width={chartWidth}
          height={chartHeight}
          withDots={false}
          withInnerLines={false}
          withOuterLines={false}
          withHorizontalLines={false}
          yLabelsOffset={0}
          chartConfig={{
            verticalLabelRotation: 10,
            backgroundColor: '#000',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgb(255, 255, 255)`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
              paddingRight: 20,
            },
            fillShadowGradient: 'green',
            fillShadowGradientOpacity: 0.5,
            
            
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
        </View>
        <View>
          <Text style={styles.disclaimerText}>{locale.crypto.pricingDisclaimer}</Text>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  disclaimerText: {
    color: '#dbdbdb',
    fontSize: 12,
  }
});

export default CryptoChart;