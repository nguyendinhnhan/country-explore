import React, { useCallback, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  ListRenderItem,
  Platform,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';

import CountryDetailModal from '../../src/components/CountryDetailModal';
import CountryListItem from '../../src/components/CountryListItem';
import EmptyState from '../../src/components/EmptyState';
import ErrorState from '../../src/components/ErrorState';
import LoadingState from '../../src/components/LoadingState';
import SearchBar from '../../src/components/SearchBar';
import { useFavoritesContext } from '../../src/contexts/FavoritesContext';
import { useCountries } from '../../src/hooks/useCountries';
import { Country, Region } from '../../src/types/Country';
import { useThemeColor } from '@/src/hooks';
import { ThemedView } from '@/src/components/ThemedView';
import { Colors } from '@/src/constants/Colors';
import RegionFilter from '@/src/components/RegionFilter';
import { useRegions } from '@/src/hooks/useRegions';

export default function CountriesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<Region>('All');

  const tintColor = useThemeColor({}, 'tint');

  const { regions } = useRegions();

  const {
    countries,
    isLoading,
    isLoadingMore,
    error,
    loadMore,
    isRefreshing,
    refresh,
  } = useCountries({ region: selectedRegion, query: searchQuery });

  const { toggleFavorite, updateNote, isFavorite, getFavoriteNote } =
    useFavoritesContext();

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const renderCountryItem: ListRenderItem<Country> = useCallback(
    ({ item }) => (
      <CountryListItem
        country={item}
        onPress={setSelectedCountry}
        onFavoritePress={toggleFavorite}
        onNoteChange={updateNote}
        isFavorite={isFavorite(item)}
        note={getFavoriteNote(item)}
      />
    ),
    [toggleFavorite, updateNote, isFavorite, getFavoriteNote]
  );

  const renderFooter = () => {
    if (isLoadingMore && countries.length > 0) {
      return <LoadingState size="small" message="Loading more..." />;
    }

    return null;
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      {isLoading && <LoadingState />}
      {error && <ErrorState message={error} onRetry={refresh} />}
      {!isLoading && !error && (
        <EmptyState
          iconName="globe-outline"
          title="No Results Found"
          message={
            searchQuery
              ? `We couldn't find any countries matching "${searchQuery}".\nTry searching for something else!`
              : 'No countries available'
          }
        />
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 0}
    >
      <ThemedView style={styles.header}>
        <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        <RegionFilter
          regions={regions}
          selectedRegion={selectedRegion}
          onRegionChange={setSelectedRegion}
        />
      </ThemedView>

      <FlatList
        data={countries.filter(Boolean)}
        renderItem={renderCountryItem}
        keyExtractor={(item: Country) => item.cca3}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            tintColor={tintColor}
          />
        }
      />

      {selectedCountry && (
        <CountryDetailModal
          country={selectedCountry}
          onClose={() => setSelectedCountry(null)}
          onFavoritePress={() => toggleFavorite(selectedCountry)}
          isFavorite={isFavorite(selectedCountry)}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
    shadowColor: Colors.border,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 52,
  },
  emptyContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 120,
    paddingBottom: 16,
  },
});
