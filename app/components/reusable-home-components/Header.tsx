import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { memo, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LocalizationData } from '../../types/LocalizationData';

interface HeaderProps {
  marketTrend: 'up' | 'down' | 'neutral';
  locale: LocalizationData;
  router: any;
  formattedDate: string;
}

const Header = memo(({ marketTrend, locale, router, formattedDate }: HeaderProps) => {
  const navigateToSettings = useCallback(() => {
    router.navigate('/screens/Settings');
  }, [router]);

  const trendColor =
    marketTrend === 'up' ? '#4CAF50' : marketTrend === 'down' ? '#FF6B6B' : '#FFD700';
  const trendText =
    marketTrend === 'up'
      ? locale.home.marketUp
      : marketTrend === 'down'
        ? locale.home.marketDown
        : locale.home.marketStable;
  const trendIcon =
    marketTrend === 'up' ? 'trending-up' : marketTrend === 'down' ? 'trending-down' : 'remove';

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerTitle}>{locale.home.title}</Text>
        <Text style={styles.headerDate}>{formattedDate}</Text>
      </View>
      <View style={styles.marketIndicator}>
        <Text style={[styles.marketTrendText, { color: trendColor }]}>{trendText}</Text>
        <Ionicons name={trendIcon} size={18} color={trendColor} />
      </View>
      <TouchableOpacity onPress={navigateToSettings} style={styles.settingsButton}>
        <Ionicons name="cog-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerDate: {
    fontSize: 12,
    color: '#aaaaaa',
  },
  marketIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  marketTrendText: {
    fontSize: 12,
    marginRight: 5,
  },
  settingsButton: {
    padding: 10,
  },
});

export default Header;
