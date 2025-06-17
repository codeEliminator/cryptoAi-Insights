import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import TypingText from "./TypingText";
import { LocalizationData } from "@/app/types/LocalizationData";

interface LoginScreenProps {
  locale: LocalizationData;
  handleConnect: () => void;
}

export default function LoginScreen({ locale, handleConnect }: LoginScreenProps) {
  return (
    <View style={styles.connectWrapper}>
      <View style={styles.connectContainer}>
      <TypingText 
        textArray={locale.profile.entryTitles}
        style={styles.entryTitle}
        typingSpeed={70}
        delayBetweenTexts={500}
        delayBeforeErasing={2000}
      />
      <TouchableOpacity 
        style={styles.customConnectButton} 
        onPress={handleConnect}
      >
        <Text style={styles.buttonText}>{locale.profile.connectWallet}</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.customConnectButton2} 
        // onPress={handleConnect}
      >
        <Text style={styles.buttonText}>{locale.profile.createAWallet}</Text>
      </TouchableOpacity>
    </View>
  </View>
  );
}
const styles = StyleSheet.create({
  connectWrapper: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  customConnectButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    width: '100%',
    marginBottom: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customConnectButton2: {
    backgroundColor: 'grey',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    width: '100%',
    marginBottom: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  entryTitle: {
    color: '#ffffff',
    fontSize: 24,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

