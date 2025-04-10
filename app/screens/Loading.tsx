import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { LocalizationData } from '../types/LocalizationData';

export default function Loading({locale}: {locale: LocalizationData}){
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#3498db" />
      <Text style={styles.loadingText}>{locale.common.loading}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 10,
  },
})