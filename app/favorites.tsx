import React, { useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
} from 'react-native';
import CountryListItem from '../src/components/CountryListItem';
import CountryDetailModal from '../src/components/CountryDetailModal';
import EmptyState from '../src/components/EmptyState';
import { Country, FavoriteCountry } from '../src/types/Country';

// Mock favorites data - replace with real data later
const mockFavorites: FavoriteCountry[] = [
  {
    cca3: 'USA',
    name: { common: 'United States', official: 'United States of America' },
    capital: ['Washington, D.C.'],
    region: 'Americas',
    subregion: 'North America',
    population: 331900000,
    area: 9833517,
    flags: { png: 'https://flagcdn.com/w320/us.png', svg: 'https://flagcdn.com/us.svg' },
    languages: { eng: 'English' },
    currencies: { USD: { name: 'United States dollar', symbol: '$' } },
    timezones: ['UTC-12:00', 'UTC-11:00', 'UTC-10:00'],
    borders: ['CAN', 'MEX'],
    note: 'Amazing diverse culture and landscapes',
    dateAdded: '2024-01-15',
  },
];

export default function Favorites() {
  const [favorites, setFavorites] = useState(mockFavorites);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleCountryPress = (country: Country) => {
    setSelectedCountry(country);
    setModalVisible(true);
  };

  const handleRemoveFavorite = (countryCode: string) => {
    setFavorites((prev) => prev.filter((country) => country.cca3 !== countryCode));
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedCountry(null);
  };

  const renderFavoriteItem = ({ item }: { item: FavoriteCountry }) => (
    <CountryListItem
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
          iconName="star-outline"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.cca3}
        renderItem={renderFavoriteItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      {/* Country Detail Modal */}
      <CountryDetailModal
        country={selectedCountry}
        visible={modalVisible}
        onClose={handleModalClose}
        onFavoritePress={() => selectedCountry && handleRemoveFavorite(selectedCountry.cca3)}
        isFavorite={true}
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
