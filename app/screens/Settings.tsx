import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  StyleSheet, 
  Animated,
  Dimensions,
  StatusBar
} from 'react-native';
import { observer } from "mobx-react-lite";
import { useNavigation } from 'expo-router';
import { useLanguage } from '../mobx/LanguageStore/LanguageStore';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface LanguageOptionProps {
  flag: string;
  language: string;
  code: string;
  isSelected: boolean;
  onPress: (code: string) => void;
}

const LanguageOption = React.memo(({ flag, language, code, isSelected, onPress }: LanguageOptionProps) => {
  const animatedValue = React.useRef(new Animated.Value(1)).current;
  
  const handlePressIn = useCallback(() => {
    Animated.timing(animatedValue, {
      toValue: 0.87,
      duration: 100,
      useNativeDriver: true
    }).start();
  }, [animatedValue]);
  
  const handlePressOut = useCallback(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true
    }).start();
  }, [animatedValue]);

  const gradientColors: [string, string] = useMemo(() => {
    return isSelected ? ['#4776E6', '#8E54E9'] : ['#2a2a2a', '#1a1a1a'];
  }, [isSelected]);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress(code)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.languageOptionContainer}
    >
      <Animated.View style={[
        styles.languageCard,
        isSelected && styles.selectedCard,
        { transform: [{ scale: animatedValue }] }
      ]}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
        <View style={styles.flagContainer}>
          <Text style={styles.flagEmoji}>{flag}</Text>
        </View>
        <Text style={[
          styles.languageText, 
          isSelected && styles.selectedText
        ]}>
          {language}
        </Text>
        {isSelected && (
          <View style={styles.checkmarkContainer}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
});

const SettingsContent = observer(() => {
  const navigation = useNavigation();
  const { setLanguage, locale, language } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const titleOpacity = React.useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(titleOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start();
    
    navigation.setOptions({
      title: locale.common?.settings || "Settings",
      headerStyle: {
        backgroundColor: '#121212',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
      headerTitleStyle: {
        fontWeight: '600',
        fontSize: 18,
        color: '#ffffff',
      },
      headerTintColor: '#ffffff',
    });
  }, [navigation, locale]);

  useEffect(() => {
    setSelectedLanguage(language);
  }, [language]);

  const handleLanguageSelect = useCallback((code: string) => {
    if (code === "en" || code === "ru" || code === "fr") {
      setSelectedLanguage(code);
      setLanguage(code);
    } else {
      console.error(`Invalid language code: ${code}`);
    }
  }, [setLanguage]);

  const languageOptions = useMemo(() => [
    { flag: "🇬🇧", language: "English", code: "en" },
    { flag: "🇷🇺", language: "Русский", code: "ru" },
    { flag: "🇫🇷", language: "Français", code: "fr" },
  ], []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      
      <Animated.Text style={[
        styles.title,
        { opacity: titleOpacity }
      ]}>
        {locale.common?.languagePreferences || "Select your language"}
      </Animated.Text>
      
      <View style={styles.languagesContainer}>
        {languageOptions.map(option => (
          <LanguageOption
            key={option.code}
            flag={option.flag}
            language={option.language}
            code={option.code}
            isSelected={selectedLanguage === option.code}
            onPress={handleLanguageSelect}
          />
        ))}
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.saveButton}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <LinearGradient
            colors={['#4776E6', '#8E54E9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.saveButtonGradient}
          >
            <Text style={styles.saveButtonText}>
              {locale.common?.save || "Save"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 30,
    marginLeft: 10,
    color: '#ffffff',
  },
  languagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  languageOptionContainer: {
    width: width / 2 - 30,
    marginBottom: 20,
  },
  languageCard: {
    borderRadius: 16,
    padding: 16,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  selectedCard: {
    elevation: 5,
    shadowOpacity: 0.2,
  },
  flagContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  flagEmoji: {
    fontSize: 24,
  },
  languageText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#aaaaaa',
  },
  selectedText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  checkmarkContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#4776E6',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  saveButton: {
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#4776E6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  saveButtonGradient: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

const Settings = observer(() => (
  <SettingsContent />
));

export default Settings;