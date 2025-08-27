import { act, renderHook, waitFor } from '@testing-library/react-native';
import { useCountries } from '../../src/hooks/useCountries';
import { mockCountriesData } from '../../src/data/mockCountries';

// Mock the dependencies
jest.mock('../../src/services/countryService');

describe('useCountries Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock countryService
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { countryService } = require('../../src/services/countryService');
    countryService.getCountries = jest.fn().mockResolvedValue({
      data: mockCountriesData,
      totalCount: mockCountriesData.length,
      hasNextPage: false,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should initialize with correct default values and load countries', async () => {
    const { result } = renderHook(() => useCountries());

    // Check initial state
    expect(result.current.error).toBe(null);
    expect(result.current.countries).toEqual([]);

    // Wait for the async loading to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.countries).toEqual(mockCountriesData);
  });

  it('should handle load more correctly', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { countryService } = require('../../src/services/countryService');

    // Mock initial response with hasNextPage
    countryService.getCountries.mockResolvedValueOnce({
      data: mockCountriesData.slice(0, 2),
      totalCount: 3,
      hasNextPage: true,
    });

    const { result } = renderHook(() => useCountries());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.countries).toHaveLength(2);
    });

    // Mock next page response
    countryService.getCountries.mockResolvedValueOnce({
      data: [mockCountriesData[2]],
      totalCount: 3,
      hasNextPage: false,
    });

    // Load more
    await act(async () => {
      await result.current.loadMore();
    });

    await waitFor(() => {
      expect(result.current.isLoadingMore).toBe(false);
      expect(result.current.countries).toHaveLength(3); // 2 + 1
    });
  });

  it('should handle errors correctly', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { countryService } = require('../../src/services/countryService');
    countryService.getCountries.mockRejectedValueOnce(
      new Error('Network error')
    );

    const { result } = renderHook(() => useCountries());

    await waitFor(() => {
      expect(result.current.error).toBe('Network error occurred');
      expect(result.current.countries).toEqual([]);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should handle refresh correctly', async () => {
    const { result } = renderHook(() => useCountries());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isRefreshing).toBe(false);

    // Start refresh
    await act(async () => {
      await result.current.refresh();
    });

    expect(result.current.isRefreshing).toBe(false);
  });
});
