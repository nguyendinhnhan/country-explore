import React, { useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
} from 'react-native';
import CountryCard from '../src/components/CountryCard';
import EmptyState from '../src/components/EmptyState';

// Mock favorites data - replace with real data later
const mockFavorites = [
  {
    cca3: 'USA',
    name: { common: 'United States', official: 'United States of America' },
    capital: ['Washington, D.C.'],
    region: 'Americas',
    population: 331900000,
    flags: { png: 'https://flagcdn.com/w320/us.png', svg: 'https://flagcdn.com/us.svg' },
    note: 'Amazing diverse culture and landscapes',
    dateAdded: '2024-01-15',
  },
];

export default function Favorites() {
  const [favorites, setFavorites] = useState(mockFavorites);

  const handleCountryPress = (country: typeof mockFavorites[0]) => {
    // For now, just log - we'll implement navigation later
    console.log('Navigate to country:', country.name.common);
  };

  const handleRemoveFavorite = (countryCode: string) => {
    setFavorites((prev) => prev.filter((country) => country.cca3 !== countryCode));
  };

  const renderFavoriteCard = ({ item }: { item: typeof mockFavorites[0] }) => (
    <CountryCard
      country={item}
      onPress={() => handleCountryPress(item)}
      onFavoritePress={() => handleRemoveFavorite(item.cca3)}
      isFavorite={true}
    />
  );

  if (favorites.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          title="No favorites yet"
          message="Start exploring countries and add them to your favorites!"
          iconName="heart-outline"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.cca3}
        renderItem={renderFavoriteCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
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
