import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Platform, StyleSheet, TextInput, View } from 'react-native';
import { useDebounce, useThemeColor } from '../hooks';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  debounceMs?: number;
}

export default function SearchBar({
  searchQuery,
  onSearchChange,
  debounceMs = 500,
}: SearchBarProps) {
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');

  const [localQuery, setLocalQuery] = useState('');
  const debouncedQuery = useDebounce(localQuery, debounceMs);

  const handleClearQuery = () => {
    setLocalQuery('');
    onSearchChange('');
  };

  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (trimmed !== searchQuery) {
      onSearchChange(trimmed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  return (
    <View style={styles.searchContainer}>
      <Ionicons
        name="search"
        size={20}
        color={iconColor}
        style={styles.searchIcon}
      />
      <TextInput
        style={[styles.searchInput, { color: textColor }]}
        placeholder="Search countries..."
        placeholderTextColor={iconColor}
        value={localQuery}
        onChangeText={setLocalQuery}
        clearButtonMode="while-editing"
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
      />
      {Platform.OS === 'android' && searchQuery.length > 0 && (
        <Ionicons
          name="close-circle"
          size={20}
          color={textColor}
          style={styles.clearIcon}
          onPress={handleClearQuery}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
  },
  clearIcon: {
    marginLeft: 8,
    opacity: 0.6,
  },
});
