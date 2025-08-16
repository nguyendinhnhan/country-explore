import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  ListRenderItem,
  StyleSheet,
  View,
} from 'react-native';

import CountryDetailModal from '../src/components/CountryDetailModal';
import CountryListItem from '../src/components/CountryListItem';
import EmptyState from '../src/components/EmptyState';
import { Country, FavoriteCountry } from '../src/types/Country';

const FAVORITES_KEY = 'country_favorites';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<FavoriteCountry[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const loadFavorites = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }, []);

  const saveFavorites = useCallback(async (newFavorites: FavoriteCountry[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Error saving favorites:', error);
      Alert.alert('Error', 'Failed to save favorites');
    }
  }, []);

  const removeFavorite = useCallback((country: Country) => {
    const newFavorites = favorites.filter(fav => fav.cca3 !== country.cca3);
    saveFavorites(newFavorites);
  }, [favorites, saveFavorites]);


  const updateFavoriteNote = useCallback((countryCode: string, note: string) => {
    const newFavorites = favorites.map(fav =>
      fav.cca3 === countryCode ? { ...fav, note } : fav
    );
    saveFavorites(newFavorites);
  }, [favorites, saveFavorites]);

  const getFavoriteNote = useCallback((country: Country) => {
    const favorite = favorites.find(fav => fav.cca3 === country.cca3);
    return favorite?.note || '';
  }, [favorites]);

  // Load favorites when screen focuses
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

  // Sort favorites by date added (most recent first)
  const sortedFavorites = useMemo(() => {
    return [...favorites].sort((a, b) => 
      new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
    );
  }, [favorites]);

  const renderFavoriteItem: ListRenderItem<FavoriteCountry> = useCallback(({ item }) => (
    <CountryListItem
      country={item}
      onPress={() => setSelectedCountry(item)}
      onFavoritePress={() => removeFavorite(item)}
      onNoteChange={(note) => updateFavoriteNote(item.cca3, note)}
      isFavorite={true}
      note={getFavoriteNote(item)}
      showFavoriteButton={true}
    />
  ), [removeFavorite, updateFavoriteNote, getFavoriteNote]);

  // Show empty state when no favorites
  if (favorites.length === 0) {
    return (
      <EmptyState
        title="No Favorites"
        message="You haven't added any countries to your favorites yet. Tap the star icon on any country to add it here!"
        iconName="star-outline"
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedFavorites}
        renderItem={renderFavoriteItem}
        keyExtractor={(item) => item.cca3}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {selectedCountry && (
        <CountryDetailModal
          country={selectedCountry}
          visible={true}
          onClose={() => setSelectedCountry(null)}
          onFavoritePress={() => removeFavorite(selectedCountry)}
          isFavorite={true}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
});
