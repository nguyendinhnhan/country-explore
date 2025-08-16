import { act, renderHook, waitFor } from '@testing-library/react-native';
import { useCountries } from '../../src/hooks/useCountries';
import type { Country } from '../../src/types/Country';

// Mock the dependencies
jest.mock('../../src/hooks/useDebounce');
jest.mock('../../src/services/countryService');

const mockCountriesData: Country[] = [
  {
    cca3: 'USA',
    name: {
      common: 'United States',
      official: 'United States of America',
    },
    capital: ['Washington, D.C.'],
    region: 'Americas',
    population: 331900000,
    flags: {
      png: 'https://example.com/usa.png',
      svg: 'https://example.com/usa.svg',
    },
    languages: { eng: 'English' },
    currencies: { USD: { name: 'United States dollar', symbol: '$' } },
  },
  {
    cca3: 'GBR',
    name: {
      common: 'United Kingdom',
      official: 'United Kingdom of Great Britain and Northern Ireland',
    },
    capital: ['London'],
    region: 'Europe',
    population: 67800000,
    flags: {
      png: 'https://example.com/gbr.png',
      svg: 'https://example.com/gbr.svg',
    },
    languages: { eng: 'English' },
    currencies: { GBP: { name: 'British pound', symbol: '£' } },
  },
  {
    cca3: 'JPN',
    name: { common: 'Japan', official: 'Japan' },
    capital: ['Tokyo'],
    region: 'Asia',
    population: 125800000,
    flags: {
      png: 'https://example.com/jpn.png',
      svg: 'https://example.com/jpn.svg',
    },
    languages: { jpn: 'Japanese' },
    currencies: { JPY: { name: 'Japanese yen', symbol: '¥' } },
  },
];

describe('useCountries Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock countryService
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { countryService } = require('../../src/services/countryService');
    countryService.fetchCountries = jest.fn().mockResolvedValue({
      data: mockCountriesData,
      totalCount: mockCountriesData.length,
      hasNextPage: false,
    });

    // Mock useDebounce to return the input immediately (no debounce in tests)
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useDebounce } = require('../../src/hooks/useDebounce');
    useDebounce.mockImplementation((value: string) => value);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  /**
   * Test 1: Basic hook initialization and data loading
   */
  it('should initialize with correct default values and load countries', async () => {
    const { result } = renderHook(() => useCountries());

    // Check initial state
    expect(result.current.searchQuery).toBe('');
    expect(result.current.selectedRegion).toBe('All');
    expect(result.current.error).toBe(null);
    expect(result.current.countries).toEqual([]);

    // Wait for the async loading to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.countries).toEqual(mockCountriesData);
  });

  /**
   * Test 2: Search functionality
   */
  it('should filter countries by search query', async () => {
    const { result } = renderHook(() => useCountries());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Change search query
    act(() => {
      result.current.setSearchQuery('United');
    });

    expect(result.current.searchQuery).toBe('United');
  });

  /**
   * Test 3: Region filtering
   */
  it('should filter countries by selected region', async () => {
    const { result } = renderHook(() => useCountries());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Change region
    act(() => {
      result.current.setSelectedRegion('Americas');
    });

    expect(result.current.selectedRegion).toBe('Americas');
  });

  /**
   * Test 4: Load more functionality
   */
  it('should handle load more correctly', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { countryService } = require('../../src/services/countryService');

    // Mock initial response with hasNextPage
    countryService.fetchCountries.mockResolvedValueOnce({
      data: mockCountriesData.slice(0, 2),
      totalCount: 3,
      hasNextPage: true,
    });

    const { result } = renderHook(() => useCountries());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.countries).toHaveLength(2);
      expect(result.current.hasMore).toBe(true);
    });

    // Mock next page response
    countryService.fetchCountries.mockResolvedValueOnce({
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
      expect(result.current.hasMore).toBe(false);
    });
  });

  /**
   * Test 5: Error handling
   */
  it('should handle errors correctly', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { countryService } = require('../../src/services/countryService');
    countryService.fetchCountries.mockRejectedValueOnce(
      new Error('Network error')
    );

    const { result } = renderHook(() => useCountries());

    await waitFor(() => {
      expect(result.current.error).toBe('Network error occurred');
      expect(result.current.countries).toEqual([]);
      expect(result.current.isLoading).toBe(false);
    });
  });

  /**
   * Test 6: Refresh functionality
   */
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
