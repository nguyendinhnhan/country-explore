import { useCallback, useEffect, useState } from 'react';
import { countryService } from '../services/countryService';
import { Country, Region } from '../types/Country';
import { useDebounce } from './useDebounce';

const ITEMS_PER_PAGE = 20;
const SEARCH_DEBOUNCE_DELAY = 300;

interface UseCountriesReturn {
  countries: Country[];
  isLoading: boolean;
  isLoadingMore: boolean;
  isRefreshing: boolean;
  hasMore: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedRegion: Region;
  setSelectedRegion: (region: Region) => void;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
}

export const useCountries = (): UseCountriesReturn => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // State for search and filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<Region>('All');

  // Debounced search query to avoid excessive filtering
  const debouncedSearchQuery = useDebounce(searchQuery, SEARCH_DEBOUNCE_DELAY);

  const loadCountries = useCallback(
    async (page: number, append: boolean = false) => {
      try {
        setError(null);

        if (page === 1 && !append) {
          setIsLoading(true);
        } else {
          setIsLoadingMore(true);
        }

        const response = await countryService.fetchCountries({
          page,
          limit: ITEMS_PER_PAGE,
          search: debouncedSearchQuery,
          region: selectedRegion === 'All' ? '' : selectedRegion,
        });

        if (response && response.data) {
          setCountries((prevCountries) =>
            append ? [...prevCountries, ...response.data] : response.data
          );
          setHasMore(response.hasNextPage || false);
          setCurrentPage(page);
        } else {
          setError('Failed to load countries');
        }
      } catch (err) {
        console.error('Error loading countries:', err);
        setError('Network error occurred');
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [debouncedSearchQuery, selectedRegion]
  );

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    setCurrentPage(1);
    setHasMore(true);
    await loadCountries(1, false);
    setIsRefreshing(false);
  }, [loadCountries]);

  const loadMore = useCallback(async () => {
    if (!isLoadingMore && hasMore) {
      const nextPage = currentPage + 1;
      await loadCountries(nextPage, true);
    }
  }, [isLoadingMore, hasMore, currentPage, loadCountries]);

  // Initial load and reload when filters change
  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
    loadCountries(1, false);
  }, [loadCountries]);

  return {
    countries,
    isLoading,
    isLoadingMore,
    isRefreshing,
    hasMore,
    error,
    searchQuery,
    setSearchQuery,
    selectedRegion,
    setSelectedRegion,
    refresh,
    loadMore,
  };
};
