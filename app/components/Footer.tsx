import { View, Text, StyleSheet } from 'react-native';
import { LocalizationData } from '../types/LocalizationData';

const Footer = ({ locale, language }: { locale: LocalizationData; language: string }) => {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>
        Powered by Crypto Insights • {locale.common.refreshed}{' '}
        {new Date().toLocaleTimeString(language + '-' + language.toUpperCase(), {
          hour12: false,
        })}
      </Text>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  footer: {
    padding: 16,
    alignItems: 'center',
    marginBottom: 26,
  },
  footerText: {
    fontSize: 12,
    color: '#666666',
  },
});
