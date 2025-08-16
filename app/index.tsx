import React, { useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
} from 'react-native';
import CountryCard from '../src/components/CountryCard';
import EmptyState from '../src/components/EmptyState';
import ErrorState from '../src/components/ErrorState';
import LoadingState from '../src/components/LoadingState';
import SearchBar from '../src/components/SearchBar';
import { Region } from '../src/types/Country';

// Mock data for UI testing - replace with real API later
const mockCountries = [
  {
    cca3: 'USA',
    name: { common: 'United States', official: 'United States of America' },
    capital: ['Washington, D.C.'],
    region: 'Americas',
    population: 331900000,
    flags: { png: 'https://flagcdn.com/w320/us.png', svg: 'https://flagcdn.com/us.svg' },
  },
  {
    cca3: 'FRA',
    name: { common: 'France', official: 'French Republic' },
    capital: ['Paris'],
    region: 'Europe',
    population: 67390000,
    flags: { png: 'https://flagcdn.com/w320/fr.png', svg: 'https://flagcdn.com/fr.svg' },
  },
  {
    cca3: 'JPN',
    name: { common: 'Japan', official: 'Japan' },
    capital: ['Tokyo'],
    region: 'Asia',
    population: 125800000,
    flags: { png: 'https://flagcdn.com/w320/jp.png', svg: 'https://flagcdn.com/jp.svg' },
  },
  {
    cca3: 'BRA',
    name: { common: 'Brazil', official: 'Federative Republic of Brazil' },
    capital: ['Brasília'],
    region: 'Americas',
    population: 215300000,
    flags: { png: 'https://flagcdn.com/w320/br.png', svg: 'https://flagcdn.com/br.svg' },
  },
  {
    cca3: 'AUS',
    name: { common: 'Australia', official: 'Commonwealth of Australia' },
    capital: ['Canberra'],
    region: 'Oceania',
    population: 25690000,
    flags: { png: 'https://flagcdn.com/w320/au.png', svg: 'https://flagcdn.com/au.svg' },
  },
];

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<Region>('All');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter countries based on search and region
  const filteredCountries = mockCountries.filter((country) => {
    const matchesSearch = country.name.common
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'All' || country.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const handleCountryPress = (country: typeof mockCountries[0]) => {
    // For now, just log - we'll implement navigation later
    console.log('Navigate to country:', country.name.common);
  };

  const handleFavoritePress = (countryCode: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(countryCode)) {
        newFavorites.delete(countryCode);
      } else {
        newFavorites.add(countryCode);
      }
      return newFavorites;
    });
  };

  const renderCountryCard = ({ item }: { item: typeof mockCountries[0] }) => (
    <CountryCard
      country={item}
      onPress={() => handleCountryPress(item)}
      onFavoritePress={() => handleFavoritePress(item.cca3)}
      isFavorite={favorites.has(item.cca3)}
    />
  );

  if (loading) {
    return <LoadingState message="Loading countries..." />;
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={() => {
          setError(null);
          // Add retry logic here
        }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedRegion={selectedRegion}
        onRegionChange={setSelectedRegion}
      />
      
      {filteredCountries.length === 0 ? (
        <EmptyState
          title="No countries found"
          message={
            searchQuery
              ? `No countries match "${searchQuery}"`
              : `No countries found in ${selectedRegion}`
          }
          iconName="search-outline"
        />
      ) : (
        <FlatList
          data={filteredCountries}
          keyExtractor={(item) => item.cca3}
          renderItem={renderCountryCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 20,
  },
});
