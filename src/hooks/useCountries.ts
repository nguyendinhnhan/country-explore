import { useCallback, useEffect, useState } from 'react';
import { countryService } from '@/src/services/CountryService';
import { Country } from '@/src/types/Country';
import { logApiError } from '@/src/services/ErrorHandler';

const ITEMS_PER_PAGE = 20;
interface UseCountriesOptions {
  region?: string;
  query?: string;
}
interface UseCountriesReturn {
  countries: Country[];
  isLoading: boolean;
  isLoadingMore: boolean;
  isRefreshing: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
}

export const useCountries = (
  options: UseCountriesOptions = {}
): UseCountriesReturn => {
  const { query, region } = options;
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

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
          search: query,
          region: region === 'All' ? '' : region,
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
        logApiError('Error loading countries', err);
        setError('Network error occurred');
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [query, region]
  );

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    setCurrentPage(1);
    setHasMore(true);
    await loadCountries(1, false);
    setIsRefreshing(false);
  }, [loadCountries]);

  const loadMore = useCallback(async () => {
    if (!isLoadingMore && hasMore && countries.length > 0) {
      const nextPage = currentPage + 1;
      await loadCountries(nextPage, true);
    }
  }, [isLoadingMore, hasMore, currentPage, loadCountries, countries.length]);

  useEffect(() => {
    setCountries([]);
    loadCountries(1, false);
  }, [loadCountries]);

  return {
    countries,
    isLoading,
    isLoadingMore,
    isRefreshing,
    error,
    refresh,
    loadMore,
  };
};
