import { act, renderHook, waitFor } from '@testing-library/react-native';
import { useCountries } from '../../src/hooks/useCountries';
import type { Country } from '../../src/types/Country';

// Mock the dependencies
jest.mock('../../src/hooks/useFetch');
jest.mock('../../src/hooks/useDebounce');

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

    // Mock useFetch to return our test data
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useFetch } = require('../../src/hooks/useFetch');
    useFetch.mockReturnValue({
      data: mockCountriesData,
      loading: false,
      error: null,
      refetch: jest.fn(),
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
  it('should initialize with correct default values and load countries', () => {
    const { result } = renderHook(() => useCountries());

    expect(result.current.searchQuery).toBe('');
    expect(result.current.selectedRegion).toBe('All');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.countries).toEqual(mockCountriesData);
    expect(result.current.displayedCountries).toHaveLength(3);
  });

  /**
   * Test 2: Search functionality filters countries correctly
   */
  it('should filter countries by search query', async () => {
    const { result } = renderHook(() => useCountries());

    // Test search by country name
    act(() => {
      result.current.setSearchQuery('United');
    });

    await waitFor(() => {
      expect(result.current.searchQuery).toBe('United');
      expect(result.current.countries).toHaveLength(2); // USA and UK contain "United"
      expect(result.current.countries[0].name.common).toBe('United States');
      expect(result.current.countries[1].name.common).toBe('United Kingdom');
    });

    // Test search by capital
    act(() => {
      result.current.setSearchQuery('Tokyo');
    });

    await waitFor(() => {
      expect(result.current.countries).toHaveLength(1);
      expect(result.current.countries[0].name.common).toBe('Japan');
    });

    // Test case insensitive search
    act(() => {
      result.current.setSearchQuery('japan');
    });

    await waitFor(() => {
      expect(result.current.countries).toHaveLength(1);
      expect(result.current.countries[0].name.common).toBe('Japan');
    });
  });

  /**
   * Test 3: Region filtering works correctly
   */
  it('should filter countries by selected region', async () => {
    const { result } = renderHook(() => useCountries());

    // Test filtering by Americas
    act(() => {
      result.current.setSelectedRegion('Americas');
    });

    await waitFor(() => {
      expect(result.current.selectedRegion).toBe('Americas');
      expect(result.current.countries).toHaveLength(1);
      expect(result.current.countries[0].name.common).toBe('United States');
    });

    // Test filtering by Europe
    act(() => {
      result.current.setSelectedRegion('Europe');
    });

    await waitFor(() => {
      expect(result.current.countries).toHaveLength(1);
      expect(result.current.countries[0].name.common).toBe('United Kingdom');
    });

    // Test reset to All
    act(() => {
      result.current.setSelectedRegion('All');
    });

    await waitFor(() => {
      expect(result.current.countries).toHaveLength(3);
    });
  });

  /**
   * Test 4: Combined search and region filtering
   */
  it('should handle combined search and region filtering', async () => {
    const { result } = renderHook(() => useCountries());

    // Set region to Europe
    act(() => {
      result.current.setSelectedRegion('Europe');
    });

    // Then search for "United" - should only find UK
    act(() => {
      result.current.setSearchQuery('United');
    });

    await waitFor(() => {
      expect(result.current.countries).toHaveLength(1);
      expect(result.current.countries[0].name.common).toBe('United Kingdom');
    });

    // Search for something not in Europe
    act(() => {
      result.current.setSearchQuery('Japan');
    });

    await waitFor(() => {
      expect(result.current.countries).toHaveLength(0);
    });
  });

  /**
   * Test 5: Pagination functionality
   */
  it('should handle pagination correctly', async () => {
    // Mock more data to test pagination
    const largeDataSet = Array.from({ length: 50 }, (_, i) => ({
      ...mockCountriesData[0],
      cca3: `T${i.toString().padStart(2, '0')}`,
      name: { common: `Test Country ${i}`, official: `Test Country ${i}` },
    }));

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useFetch } = require('../../src/hooks/useFetch');
    useFetch.mockReturnValue({
      data: largeDataSet,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useCountries());

    await waitFor(() => {
      // Should initially display first 20 items
      expect(result.current.displayedCountries).toHaveLength(20);
      expect(result.current.hasMore).toBe(true);
    });

    // Load more
    await act(() => {
      result.current.loadMore();
    });

    await waitFor(() => {
      // Should now display 40 items
      expect(result.current.displayedCountries).toHaveLength(40);
      expect(result.current.hasMore).toBe(true);
    });

    // Load more again
    await act(() => {
      result.current.loadMore();
    });

    await waitFor(() => {
      // Should now display all 50 items
      expect(result.current.displayedCountries).toHaveLength(50);
      expect(result.current.hasMore).toBe(false);
    });
  });

  /**
   * Test 6: Error handling
   */
  it('should handle errors correctly', () => {
    const mockError = 'Failed to fetch countries';

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useFetch } = require('../../src/hooks/useFetch');
    useFetch.mockReturnValue({
      data: null,
      loading: false,
      error: mockError,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() => useCountries());

    expect(result.current.error).toBe(mockError);
    expect(result.current.countries).toEqual([]);
    expect(result.current.displayedCountries).toEqual([]);
  });

  /**
   * Test 7: Refresh functionality
   */
  it('should handle refresh correctly', async () => {
    const mockRefetch = jest.fn().mockResolvedValue(undefined);

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useFetch } = require('../../src/hooks/useFetch');
    useFetch.mockReturnValue({
      data: mockCountriesData,
      loading: false,
      error: null,
      refetch: mockRefetch,
    });

    const { result } = renderHook(() => useCountries());

    expect(result.current.refreshing).toBe(false);

    // Start refresh
    await act(async () => {
      await result.current.refresh();
    });

    await waitFor(() => {
      expect(result.current.refreshing).toBe(false);
      expect(mockRefetch).toHaveBeenCalledTimes(1);
    });
  });
});
