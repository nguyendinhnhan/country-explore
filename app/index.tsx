import React, { useCallback, useMemo, useState } from 'react';
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
    displayedCountries,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedRegion,
    setSelectedRegion,
    hasMore,
    loadMore,
    retry,
    refreshing,
    refresh,
  } = useCountries();

  const {
    toggleFavorite,
    updateNote: updateFavoriteNote,
    isFavorite,
    getFavoriteNote,
  } = useFavoritesContext();

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  // Render country item
  const renderCountryItem: ListRenderItem<Country> = useCallback(({ item }) => (
    <CountryListItem
      country={item}
      onPress={() => setSelectedCountry(item)}
      onFavoritePress={() => toggleFavorite(item)}
      onNoteChange={(note) => updateFavoriteNote(item.cca3, note)}
      isFavorite={isFavorite(item)}
      note={getFavoriteNote(item)}
      showFavoriteButton={true}
    />
  ), [toggleFavorite, updateFavoriteNote, isFavorite, getFavoriteNote]);

  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading) {
      loadMore();
    }
  }, [hasMore, loading, loadMore]);

  // Memoized render footer
  const renderFooter = useMemo(() => {
    if (!loading || displayedCountries.length === 0) return null;
    return <LoadingState message="Loading more countries..." />;
  }, [loading, displayedCountries.length]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    refresh();
  }, [refresh]);

  // Show loading state for initial load
  if (loading && displayedCountries.length === 0) {
    return <LoadingState message="Loading countries..." />;
  }

  // Show error state
  if (error && displayedCountries.length === 0) {
    return (
      <ErrorState
        message={error}
        onRetry={retry}
      />
    );
  }

  // Show empty state when no results
  if (!loading && displayedCountries.length === 0) {
    const emptyMessage = searchQuery || selectedRegion !== 'All'
      ? 'No countries found matching your search criteria'
      : 'No countries available';
    
    return (
      <EmptyState 
        title="No Countries"
        message={emptyMessage}
        iconName="globe-outline"
      />
    );
  }

  return (
    <View style={styles.container}>
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedRegion={selectedRegion}
        onRegionChange={setSelectedRegion}
      />
      
      <FlatList
        data={displayedCountries}
        renderItem={renderCountryItem}
        keyExtractor={(item) => item.cca3}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#007AFF"
          />
        }
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        getItemLayout={(data, index) => ({
          length: 120, // Approximate item height
          offset: 120 * index,
          index,
        })}
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
});
