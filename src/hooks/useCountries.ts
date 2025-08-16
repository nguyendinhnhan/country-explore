import { useCallback, useEffect, useMemo, useState } from 'react';
import { Country, Region } from '../types/Country';
import { useDebounce } from './useDebounce';
import { useFetch } from './useFetch';

const API_BASE_URL = 'https://restcountries.com/v3.1';
const API_FIELDS =
  'name,flags,region,population,capital,languages,currencies,cca3';
const ITEMS_PER_PAGE = 20;
const SEARCH_DEBOUNCE_DELAY = 300;

interface UseCountriesReturn {
  countries: Country[];
  displayedCountries: Country[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedRegion: Region;
  setSelectedRegion: (region: Region) => void;
  retry: () => void;
  loadMore: () => void;
  hasMore: boolean;
  refreshing: boolean;
  refresh: () => void;
}

// Fetch function for countries API
const fetchCountries = async (): Promise<Country[]> => {
  const response = await fetch(`${API_BASE_URL}/all?fields=${API_FIELDS}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  // Transform API data to match our Country interface
  return data
    .filter((country: any) => country && country.cca3 && country.name?.common)
    .map((country: any) => ({
      cca3: country.cca3,
      name: {
        common: country.name.common,
        official: country.name.official,
      },
      capital: country.capital || [],
      region: country.region,
      population: country.population,
      flags: {
        png: country.flags.png,
        svg: country.flags.svg,
      },
      languages: country.languages || {},
      currencies: country.currencies || {},
    }));
};

export const useCountries = (): UseCountriesReturn => {
  // State for search and filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<Region>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  // Debounced search query to avoid excessive filtering
  const debouncedSearchQuery = useDebounce(searchQuery, SEARCH_DEBOUNCE_DELAY);

  // Fetch countries data using the useFetch hook
  const {
    data: allCountries,
    loading,
    error,
    refetch,
  } = useFetch(fetchCountries);

  const filteredCountries = useMemo(() => {
    if (!allCountries) {
      return [];
    }

    let filtered = allCountries;

    // Filter by region
    if (selectedRegion !== 'All') {
      filtered = filtered.filter(
        (country) => country.region === selectedRegion
      );
    }

    // Filter by search query
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase().trim();
      filtered = filtered.filter((country) => {
        const commonName = country.name.common.toLowerCase();
        const officialName = country.name.official.toLowerCase();
        const capitals = country.capital?.map((cap) => cap.toLowerCase()) || [];

        return (
          commonName.includes(query) ||
          officialName.includes(query) ||
          capitals.some((cap) => cap.includes(query))
        );
      });
    }

    return filtered;
  }, [allCountries, debouncedSearchQuery, selectedRegion]);

  // Memoized displayed countries for pagination
  const displayedCountries = useMemo(() => {
    return filteredCountries.slice(0, currentPage * ITEMS_PER_PAGE);
  }, [filteredCountries, currentPage]);

  // Calculate if there are more items to load
  const hasMore = useMemo(() => {
    return currentPage * ITEMS_PER_PAGE < filteredCountries.length;
  }, [currentPage, filteredCountries.length]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, selectedRegion]);

  // Load more items (pagination)
  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [hasMore, loading]);

  // Retry function
  const retry = useCallback(() => {
    refetch();
  }, [refetch]);

  // Refresh function with visual feedback
  const refresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  return {
    countries: filteredCountries,
    displayedCountries,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedRegion,
    setSelectedRegion,
    retry,
    loadMore,
    hasMore,
    refreshing,
    refresh,
  };
};
