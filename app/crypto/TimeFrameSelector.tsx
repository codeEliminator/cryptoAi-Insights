import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LocalizationData } from '../types/LocalizationData';

interface TimeframeSelectorProps {
  selectedTimeframe: string;
  onTimeframeChange: (timeframe: '1' | '7' | '30' | '365') => void;
  locale: LocalizationData; 
}

const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({ 
  selectedTimeframe, 
  onTimeframeChange,
  locale
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          selectedTimeframe === '1' && styles.selectedButton
        ]}
        onPress={() => onTimeframeChange('1')}
      >
        <Text style={[
          styles.buttonText,
          selectedTimeframe === '1' && styles.selectedButtonText
        ]}>
          1D
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.button,
          selectedTimeframe === '7' && styles.selectedButton
        ]}
        onPress={() => onTimeframeChange('7')}
      >
        <Text style={[
          styles.buttonText,
          selectedTimeframe === '7' && styles.selectedButtonText
        ]}>
          1W
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.button,
          selectedTimeframe === '30' && styles.selectedButton
        ]}
        onPress={() => onTimeframeChange('30')}
      >
        <Text style={[
          styles.buttonText,
          selectedTimeframe === '30' && styles.selectedButtonText
        ]}>
          1M
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.button,
          selectedTimeframe === '365' && styles.selectedButton
        ]}
        onPress={() => onTimeframeChange('365')}
      >
        <Text style={[
          styles.buttonText,
          selectedTimeframe === '365' && styles.selectedButtonText
        ]}>
          1Y
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 4,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  selectedButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  buttonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '600',
  },
  selectedButtonText: {
    color: '#FFFFFF',
  },
});

export default TimeframeSelector;