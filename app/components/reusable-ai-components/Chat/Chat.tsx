import {
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Message } from '@/app/(tabs)/ai';
import { LocalizationData } from '@/app/types/LocalizationData';
import { AiService } from '@/app/utils/ai/aiService';
import { Ionicons } from '@expo/vector-icons';
import renderMessageItem from '../helpers/renderMessageItem';

interface ChatProps {
  messages: Message[];
  inputText: string;
  setInputText: (text: string) => void;
  locale: LocalizationData;
  setError: (error: string) => void;
  setLoading: (loading: boolean) => void;
  setMessages: (messages: Message[]) => void;
  language: string;
  loading: boolean;
  flatListRef: React.RefObject<FlatList>;
}

const Chat = ({
  messages,
  inputText,
  setInputText,
  locale,
  setError,
  setLoading,
  setMessages,
  language,
  loading,
  flatListRef,
}: ChatProps) => {
  return (
    <KeyboardAvoidingView
      style={styles.chatContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={-20}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item, index) => `message-${index}`}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder={locale.ai.askAboutCrypto}
          placeholderTextColor="#666"
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!inputText.trim() || loading) && styles.disabledButton]}
          onPress={() =>
            AiService.sendMessage({
              inputText,
              setError,
              setLoading,
              setMessages,
              language,
              loading,
              setInputText,
              messages,
              locale,
            })
          }
          disabled={!inputText.trim() || loading}
        >
          {loading ? (
            <Ionicons name="ellipsis-horizontal" size={18} color="#fff" />
          ) : (
            <Ionicons name="send" size={18} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Chat;

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    backgroundColor: '#121212',
    marginBottom: 30,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#1a1a1a',
    marginBottom: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#ffffff',
    maxHeight: 100,
  },
  sendButton: {
    width: 35,
    height: 35,
    borderRadius: 17,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#1f5a8a',
  },
});
