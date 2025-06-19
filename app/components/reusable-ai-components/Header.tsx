import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LocalizationData } from "@/app/types/LocalizationData";

type AiTab = 'chat' | 'analysis';


const Header = ({ clearChatHistory, locale, activeTab, error, }: { clearChatHistory: () => void, locale: LocalizationData, activeTab: AiTab, error: any }) => {
    return (
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{locale.ai.title}</Text>
        <View style={styles.headerActions}>
          {activeTab === 'chat' && (
                    <TouchableOpacity 
                    style={styles.headerButton}
                    onPress={clearChatHistory}
                >
                    <Ionicons name="trash-outline" size={22} color="#3498db" />
              </TouchableOpacity>
          )}
          {error && (
            <View style={styles.errorIndicator}>
              <Ionicons name="alert-circle" size={22} color="#FF5722" />
            </View>
          )}
        </View>
      </View>
    );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  errorIndicator: {
    padding: 8,
    marginLeft: 8,
  },
});