import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LocalizationData } from '@/app/types/LocalizationData';
export default function SearchComponent({
  locale,
  inputValue,
  handleSearchChange,
  clearSearch,
}: {
  locale: LocalizationData;
  inputValue: string;
  handleSearchChange: (text: string) => void;
  clearSearch: () => void;
}) {
  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchInputContainer}>
        <Ionicons name="search" size={20} color="#aaaaaa" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={locale.market.searchPlaceholder}
          placeholderTextColor="#777777"
          value={inputValue}
          onChangeText={handleSearchChange}
        />
        {inputValue.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#aaaaaa" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    padding: 10,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
    padding: 0,
    height: 40,
  },
  clearButton: {
    padding: 5,
  },
});
