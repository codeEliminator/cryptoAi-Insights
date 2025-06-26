import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { CryptoCurrency } from '../../types/types';
import SuggestionItem from './SuggestionItem';
import { router } from 'expo-router';

export default function ShowSuggestionsComponent({
  suggestions,
}: {
  suggestions: CryptoCurrency[];
}) {
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
}

const styles = StyleSheet.create({
  suggestionsContainer: {
    backgroundColor: '#1f1f1f',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    maxHeight: 200,
  },
});
