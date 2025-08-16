import { useCallback, useEffect, useState } from 'react';

interface UseFetchOptions {
  autoFetch?: boolean;
}

interface UseFetchReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearError: () => void;
}

/**
 * Custom hook for data fetching with loading and error states
 * @param fetchFn - Function that returns a Promise with the data
 * @param options - Configuration options
 * @returns Object with data, loading, error states and refetch function
 */
export const useFetch = <T>(
  fetchFn: () => Promise<T>,
  options: UseFetchOptions = {}
): UseFetchReturn<T> => {
  const { autoFetch = true } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fetchFn();
      setData(result);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('useFetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    if (autoFetch) {
      refetch();
    }
  }, [autoFetch, refetch]);

  return {
    data,
    loading,
    error,
    refetch,
    clearError,
  };
};
