import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, ActivityIndicator, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import useLocalizedDays from '../helpers/getLocalizedDays';
import useLocalizedMonths from '../helpers/getLocalizedMonths';
import { LocalizationData } from '../types/LocalizationData';
import { FakeCoinChartData } from '../helpers/fakeCoinChartData';
import useChartData from '../hooks/useChartData';

interface ChartData {
  labels: string[];
  datasets: { data: number[] }[];
}
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
  chartWidth: screenWidth - 40,

}

const CryptoChart: React.FC<CryptoChartProps> = (props) => {
  const { coinId, timeframe, chartStyle, chartHeight, chartWidth, locale, language } = { ...defaultProps, ...props };
  const [chartData, setChartData] = useState<ChartData>({ labels: [], datasets: [{ data: [0] }]});

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { fetchChartData } = useChartData({ setLoading, setError, setChartData, coinId, timeframe, FakeCoinChartData});

  useEffect(() => {    
    fetchChartData();
  }, [fetchChartData]);

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
        <View>
          <Text style={styles.disclaimerText}>{locale.crypto.pricingDisclaimer}</Text>
        </View>
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
  disclaimerText: {
    color: '#dbdbdb',
    fontSize: 12,
  }
});

export default CryptoChart;