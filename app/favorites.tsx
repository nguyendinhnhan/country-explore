import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, ListRenderItem, StyleSheet, View } from 'react-native';

import CountryDetailModal from '../src/components/LazyCountryDetailModal';
import CountryListItem from '../src/components/CountryListItem';
import EmptyState from '../src/components/EmptyState';
import { useFavoritesContext } from '../src/contexts/FavoritesContext';
import { Country, FavoriteCountry } from '../src/types/Country';

export default function FavoritesScreen() {
  const { favorites, toggleFavorite, updateNote, isFavorite, getFavoriteNote } =
    useFavoritesContext();

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  // Sort favorites by date added (most recent first)
  const sortedFavorites = useMemo(() => {
    return [...favorites].sort(
      (a, b) =>
        new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
    );
  }, [favorites]);

  const renderFavoriteItem: ListRenderItem<FavoriteCountry> = useCallback(
    ({ item }) => (
      <CountryListItem
        country={item}
        onPress={() => setSelectedCountry(item)}
        onFavoritePress={() => toggleFavorite(item)}
        onNoteChange={(note) => updateNote(item.cca3, note)}
        isFavorite={isFavorite(item)}
        note={getFavoriteNote(item)}
        showFavoriteButton={true}
      />
    ),
    [toggleFavorite, updateNote, isFavorite, getFavoriteNote]
  );

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
          onFavoritePress={() => toggleFavorite(selectedCountry)}
          isFavorite={isFavorite(selectedCountry)}
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
