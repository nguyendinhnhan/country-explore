import React, { useCallback, useState } from 'react';
import {
  FlatList,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';

import CountryDetailModal from '../src/components/CountryDetailModal';
import CountryListItem from '../src/components/CountryListItem';
import EmptyState from '../src/components/EmptyState';
import ErrorState from '../src/components/ErrorState';
import LoadingState from '../src/components/LoadingState';
import SearchBar from '../src/components/SearchBar';
import { useFavoritesContext } from '../src/contexts/FavoritesContext';
import { useCountries } from '../src/hooks/useCountries';
import { Country } from '../src/types/Country';

export default function CountriesScreen() {
  const {
    countries,
    isLoading,
    isLoadingMore,
    error,
    searchQuery,
    setSearchQuery,
    selectedRegion,
    setSelectedRegion,
    hasMore,
    loadMore,
    isRefreshing,
    refresh,
  } = useCountries();

  const {
    toggleFavorite,
    updateNote: updateFavoriteNote,
    isFavorite,
    getFavoriteNote,
  } = useFavoritesContext();

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const keyExtractor = useCallback((item: Country) => item.cca3, []);

  const renderCountryItem: ListRenderItem<Country> = useCallback(
    ({ item }) => (
      <CountryListItem
        country={item}
        onPress={() => setSelectedCountry(item)}
        onFavoritePress={() => toggleFavorite(item)}
        onNoteChange={(note) => updateFavoriteNote(item.cca3, note)}
        isFavorite={isFavorite(item)}
        note={getFavoriteNote(item)}
        showFavoriteButton={true}
      />
    ),
    [toggleFavorite, updateFavoriteNote, isFavorite, getFavoriteNote]
  );

  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoadingMore) {
      loadMore();
    }
  }, [hasMore, isLoadingMore, loadMore]);

  const renderFooter = () => {
    if (isLoadingMore && countries.length > 0) {
      return <LoadingState message="Loading more countries..." />;
    }

    return null;
  };

  const renderEmpty = () => {
    // Show loading state for initial load
    if (isLoading) {
      return <LoadingState message="Loading countries..." />;
    }

    // Show error state
    if (error) {
      return <ErrorState message={error} onRetry={refresh} />;
    }

    // Show empty state when no results
    const emptyMessage =
      searchQuery || selectedRegion !== 'All'
        ? 'No countries found matching your search criteria'
        : 'No countries available';

    return (
      <EmptyState
        title="No Countries"
        message={emptyMessage}
        iconName="globe-outline"
      />
    );
  };

  return (
    <View style={styles.container}>
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedRegion={selectedRegion}
        onRegionChange={setSelectedRegion}
      />

      <FlatList
        data={countries.filter(Boolean)}
        renderItem={renderCountryItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={
          countries.length === 0 ? styles.emptyContainer : styles.listContainer
        }
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            tintColor="#007AFF"
          />
        }
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
    paddingTop: 8,
  },
  emptyContainer: {
    flex: 1,
    padding: 16,
    marginBottom: 32,
  },
});
