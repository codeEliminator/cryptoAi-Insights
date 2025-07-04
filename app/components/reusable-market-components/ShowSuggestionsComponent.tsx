import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { CryptoCurrency } from '../../types/types';
import SuggestionItem from './SuggestionItem';
import { router } from 'expo-router';

const ShowSuggestionsComponent = React.memo(
  ({ suggestions }: { suggestions: CryptoCurrency[] }) => {
    const selectSuggestion = useCallback(
      (coinId: string) => {
        router.push(`/screens/crypto/${coinId}`);
      },
      [router]
    );
    const renderSuggestion = useCallback(
      ({ item }: { item: CryptoCurrency }) => (
        <SuggestionItem item={item} onSelect={selectSuggestion} />
      ),
      [selectSuggestion]
    );
    return (
      <View style={styles.suggestionsContainer}>
        <FlatList
          data={suggestions}
          renderItem={renderSuggestion}
          keyExtractor={item => item.uuid}
          keyboardShouldPersistTaps="handled"
          removeClippedSubviews={true}
          maxToRenderPerBatch={5}
        />
      </View>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.suggestions.length === nextProps.suggestions.length &&
      prevProps.suggestions.every((coin, index) => coin.uuid === nextProps.suggestions[index].uuid)
    );
  }
);
ShowSuggestionsComponent.displayName = 'ShowSuggestionsComponent';
export default ShowSuggestionsComponent;
const styles = StyleSheet.create({
  suggestionsContainer: {
    backgroundColor: '#1f1f1f',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    maxHeight: 200,
  },
});
