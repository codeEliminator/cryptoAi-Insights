import { View, Text } from "react-native";
import { Message } from "@/app/(tabs)/ai";
import { StyleSheet } from "react-native";

const renderMessageItem = ({ item }: { item: Message }) => (
  <View style={[
    styles.messageBubble,
    item.isUser ? styles.userMessage : styles.aiMessage
  ]}>
    <Text style={styles.messageText}>{item.text}</Text>
    {item.timestamp && (
      <Text style={styles.timestampText}>
        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    )}
  </View>
);

export default renderMessageItem;
const styles = StyleSheet.create({
    messageBubble: {
    padding: 12,
    borderRadius: 18,
    marginBottom: 8,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#3498db',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  aiMessage: {
    backgroundColor: '#2a2a2a',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    color: '#ffffff',
    fontSize: 16,
  },
  timestampText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },

});