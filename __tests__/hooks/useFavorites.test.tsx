import { act, renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';
import {
  FavoritesProvider,
  useFavoritesContext,
} from '../../src/contexts/FavoritesContext';
import { mockCountriesData } from '../../src/data/mockCountries';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

const mockCountry = mockCountriesData[0];
const mockCountry2 = mockCountriesData[1];

// Wrapper component for testing
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <FavoritesProvider>{children}</FavoritesProvider>
);

describe('useFavoritesContext Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with loading state', async () => {
    const { result } = renderHook(() => useFavoritesContext(), { wrapper });

    expect(result.current.favorites).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);

    // Wait for initial loading to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('should add country to favorites', async () => {
    const { result } = renderHook(() => useFavoritesContext(), { wrapper });

    // Wait for initial loading to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.addFavorite(mockCountry);
    });

    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.favorites[0].cca3).toBe(mockCountry.cca3);
    expect(result.current.isFavorite(mockCountry)).toBe(true);
  });

  it('should remove country from favorites', async () => {
    const { result } = renderHook(() => useFavoritesContext(), { wrapper });

    // Wait for initial loading to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // First add the country
    await act(async () => {
      await result.current.addFavorite(mockCountry);
    });

    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.isFavorite(mockCountry)).toBe(true);

    // Then remove it
    await act(async () => {
      await result.current.removeFavorite(mockCountry.cca3);
    });

    expect(result.current.favorites).toHaveLength(0);
    expect(result.current.isFavorite(mockCountry)).toBe(false);
  });

  it('should toggle favorites correctly', async () => {
    const { result } = renderHook(() => useFavoritesContext(), { wrapper });

    // Wait for initial loading to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Initially not favorite
    expect(result.current.isFavorite(mockCountry)).toBe(false);

    // Toggle to add
    await act(async () => {
      await result.current.toggleFavorite(mockCountry);
    });

    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.isFavorite(mockCountry)).toBe(true);

    // Toggle to remove
    await act(async () => {
      await result.current.toggleFavorite(mockCountry);
    });

    expect(result.current.favorites).toHaveLength(0);
    expect(result.current.isFavorite(mockCountry)).toBe(false);
  });

  it('should handle multiple favorites', async () => {
    const { result } = renderHook(() => useFavoritesContext(), { wrapper });

    // Wait for initial loading to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Add first country
    await act(async () => {
      await result.current.addFavorite(mockCountry);
    });

    // Add second country
    await act(async () => {
      await result.current.addFavorite(mockCountry2);
    });

    expect(result.current.favorites).toHaveLength(2);
    expect(result.current.isFavorite(mockCountry)).toBe(true);
    expect(result.current.isFavorite(mockCountry2)).toBe(true);

    // Remove first country
    await act(async () => {
      await result.current.removeFavorite(mockCountry.cca3);
    });

    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.isFavorite(mockCountry)).toBe(false);
    expect(result.current.isFavorite(mockCountry2)).toBe(true);
    expect(result.current.favorites[0].cca3).toBe(mockCountry2.cca3);
  });

  it('should update notes for favorites', async () => {
    const { result } = renderHook(() => useFavoritesContext(), { wrapper });
    const testNote = 'This is a test note';

    // Wait for initial loading to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Add country first
    await act(async () => {
      await result.current.addFavorite(mockCountry);
    });

    expect(result.current.getFavoriteNote(mockCountry)).toBe('');

    // Update note
    await act(async () => {
      await result.current.updateNote(mockCountry.cca3, testNote);
    });

    expect(result.current.getFavoriteNote(mockCountry)).toBe(testNote);
  });

  it('should refresh favorites', async () => {
    const { result } = renderHook(() => useFavoritesContext(), { wrapper });

    // Wait for initial loading to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.refreshFavorites();
    });

    // After refresh, loading should be false
    expect(result.current.loading).toBe(false);
  });
});
