import { Ionicons } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Region } from '../types/Country';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedRegion: Region;
  onRegionChange: (region: Region) => void;
}

const regions: Region[] = [
  'All',
  'Africa',
  'Americas',
  'Asia',
  'Europe',
  'Oceania',
];

export default function SearchBar({
  searchQuery,
  onSearchChange,
  selectedRegion,
  onRegionChange,
}: SearchBarProps) {
  const handleRegionPress = useCallback(
    (region: Region) => {
      onRegionChange(region);
    },
    [onRegionChange]
  );
  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#8E8E93"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search countries..."
          placeholderTextColor="#8E8E93"
          value={searchQuery}
          onChangeText={onSearchChange}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Region Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.regionContainer}
        contentContainerStyle={styles.regionContent}
      >
        {regions.map((region) => (
          <TouchableOpacity
            key={region}
            style={[
              styles.regionButton,
              selectedRegion === region && styles.regionButtonActive,
            ]}
            onPress={() => handleRegionPress(region)}
          >
            <Text
              style={[
                styles.regionText,
                selectedRegion === region && styles.regionTextActive,
              ]}
            >
              {region}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
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
    color: '#000',
  },
  regionContainer: {
    marginHorizontal: -16,
  },
  regionContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  regionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    marginRight: 8,
  },
  regionButtonActive: {
    backgroundColor: '#007AFF',
  },
  regionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3C3C43',
  },
  regionTextActive: {
    color: '#FFFFFF',
  },
});
