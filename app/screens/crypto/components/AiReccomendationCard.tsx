import React, { useState } from "react";
import { 
  StyleSheet, 
  View, 
  Text, 
  ActivityIndicator, 
  Dimensions,
  Modal,
  TouchableOpacity,
  ScrollView,
  Pressable
} from "react-native";
import { LocalizationData } from "@/app/types/LocalizationData";

interface AiRecommendationCardProps {
  loadingAiInfo: boolean;
  recommendation: string | null;
  locale: LocalizationData;
}

const AiRecommendationCard = ({ loadingAiInfo, recommendation, locale }: AiRecommendationCardProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  
  const truncatedText = recommendation && recommendation.length > 120 
    ? `${recommendation.substring(0, 120)}...` 
    : recommendation;

  return (
    <>
      <Pressable
        onLongPress={() => recommendation && setModalVisible(true)}
        delayLongPress={500}
        style={{width: '100%'}}
      >
        <View style={styles.container}>
          <View style={styles.card}>

            {loadingAiInfo ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFF" />
                <Text style={styles.loadingText}>{locale.common.loading}</Text>
              </View>
            ) : (
              <View style={styles.contentContainer}>
                {recommendation && (
                  <Text style={styles.recommendationText}>{truncatedText}</Text>
                )}
                {recommendation && recommendation.length > 120 && (
                  <Text style={styles.hintText}>{locale.crypto.longPressForFullText || "Long press for full text"}</Text>
                )}
              </View>
            )}
          </View>
        </View>
      </Pressable>

      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderText}>{locale.crypto.aiRecommendation}</Text>
                <TouchableOpacity 
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalScrollView}>
                <Text style={styles.modalText}>{recommendation}</Text>
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    width: '100%',
    overflow: 'hidden',
    marginVertical: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    height: 200,
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
  },
  card: {
    padding: 16,
    width: '100%',
    height: '100%',
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 10,
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
  },
  recommendationText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
  },
  hintText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.9,
    maxHeight: height * 0.7,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  modalContent: {
    backgroundColor: 'rgba(30, 30, 30, 0.95)',
    width: '100%',
    height: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  modalHeaderText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalScrollView: {
    padding: 20,
  },
  modalText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
  },
});

export default AiRecommendationCard;