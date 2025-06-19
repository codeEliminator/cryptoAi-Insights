import { View, Text, TouchableOpacity } from "react-native";
import { LocalizationData } from "@/app/types/LocalizationData";
import { Ionicons } from "@expo/vector-icons";
import { AiTab } from "@/app/(tabs)/ai";
import { StyleSheet } from "react-native";

interface TabContainerProps {
  locale: LocalizationData;
  activeTab: AiTab;
  setActiveTab: (tab: AiTab) => void;
}

const TabContainer = ({ locale, activeTab, setActiveTab }: TabContainerProps) => {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === AiTab.CHAT && styles.activeTab]}
        onPress={() => setActiveTab(AiTab.CHAT)}
      >
        <Ionicons 
          name="chatbubble-ellipses-outline" 
          size={20} 
          color={activeTab === AiTab.CHAT ? '#3498db' : '#aaaaaa'} 
        />
        <Text style={[
          styles.tabText,
          activeTab === AiTab.CHAT && styles.activeTabText
        ]}>
          {locale.ai.chat}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tab, activeTab === AiTab.ANALYSIS && styles.activeTab]}
        onPress={() => setActiveTab(AiTab.ANALYSIS)}
      >
        <Ionicons 
          name="analytics-outline" 
          size={20} 
          color={activeTab === AiTab.ANALYSIS ? '#3498db' : '#aaaaaa'} 
        />
        <Text style={[
          styles.tabText,
          activeTab === AiTab.ANALYSIS && styles.activeTabText
        ]}>
          {locale.ai.analysis}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default TabContainer;

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#1a1a1a',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3498db',
  },
  tabText: {
    color: '#aaaaaa',
    marginLeft: 8,
  },
  activeTabText: {
    color: '#3498db',
    fontWeight: 'bold',
  },
})
