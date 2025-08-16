import React, { useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
} from 'react-native';
import CountryListItem from '../src/components/CountryListItem';
import CountryDetailModal from '../src/components/CountryDetailModal';
import EmptyState from '../src/components/EmptyState';
import ErrorState from '../src/components/ErrorState';
import LoadingState from '../src/components/LoadingState';
import SearchBar from '../src/components/SearchBar';
import { Region, Country } from '../src/types/Country';

// Mock data for UI testing - replace with real API later
const mockCountries: Country[] = [
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
    timezones: ['UTC-12:00', 'UTC-11:00', 'UTC-10:00', 'UTC-09:00', 'UTC-08:00', 'UTC-07:00'],
    borders: ['CAN', 'MEX'],
  },
  {
    cca3: 'FRA',
    name: { common: 'France', official: 'French Republic' },
    capital: ['Paris'],
    region: 'Europe',
    subregion: 'Western Europe',
    population: 67390000,
    area: 551695,
    flags: { png: 'https://flagcdn.com/w320/fr.png', svg: 'https://flagcdn.com/fr.svg' },
    languages: { fra: 'French' },
    currencies: { EUR: { name: 'Euro', symbol: '€' } },
    timezones: ['UTC+01:00'],
    borders: ['AND', 'BEL', 'DEU', 'ITA', 'LUX', 'MCO', 'ESP', 'CHE'],
  },
  {
    cca3: 'JPN',
    name: { common: 'Japan', official: 'Japan' },
    capital: ['Tokyo'],
    region: 'Asia',
    subregion: 'Eastern Asia',
    population: 125800000,
    area: 377930,
    flags: { png: 'https://flagcdn.com/w320/jp.png', svg: 'https://flagcdn.com/jp.svg' },
    languages: { jpn: 'Japanese' },
    currencies: { JPY: { name: 'Japanese yen', symbol: '¥' } },
    timezones: ['UTC+09:00'],
  },
  {
    cca3: 'BRA',
    name: { common: 'Brazil', official: 'Federative Republic of Brazil' },
    capital: ['Brasília'],
    region: 'Americas',
    subregion: 'South America',
    population: 215300000,
    area: 8515767,
    flags: { png: 'https://flagcdn.com/w320/br.png', svg: 'https://flagcdn.com/br.svg' },
    languages: { por: 'Portuguese' },
    currencies: { BRL: { name: 'Brazilian real', symbol: 'R$' } },
    timezones: ['UTC-05:00', 'UTC-04:00', 'UTC-03:00', 'UTC-02:00'],
    borders: ['ARG', 'BOL', 'COL', 'FRG', 'GUY', 'PRY', 'PER', 'SUR', 'URY', 'VEN'],
  },
  {
    cca3: 'AUS',
    name: { common: 'Australia', official: 'Commonwealth of Australia' },
    capital: ['Canberra'],
    region: 'Oceania',
    subregion: 'Australia and New Zealand',
    population: 25690000,
    area: 7692024,
    flags: { png: 'https://flagcdn.com/w320/au.png', svg: 'https://flagcdn.com/au.svg' },
    languages: { eng: 'English' },
    currencies: { AUD: { name: 'Australian dollar', symbol: '$' } },
    timezones: ['UTC+05:00', 'UTC+06:30', 'UTC+07:00', 'UTC+08:00', 'UTC+09:30', 'UTC+10:00'],
  },
];

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<Region>('All');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Filter countries based on search and region
  const filteredCountries = mockCountries.filter((country) => {
    const matchesSearch = country.name.common
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'All' || country.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const handleCountryPress = (country: Country) => {
    setSelectedCountry(country);
    setModalVisible(true);
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

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedCountry(null);
  };

  const renderCountryItem = ({ item }: { item: Country }) => (
    <CountryListItem
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
          renderItem={renderCountryItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Country Detail Modal */}
      <CountryDetailModal
        country={selectedCountry}
        visible={modalVisible}
        onClose={handleModalClose}
        onFavoritePress={() => selectedCountry && handleFavoritePress(selectedCountry.cca3)}
        isFavorite={selectedCountry ? favorites.has(selectedCountry.cca3) : false}
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
