import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import StorageService from '../services/storageService';
import { Country, FavoriteCountry } from '../types/Country';

interface UseFavoritesReturn {
  favorites: FavoriteCountry[];
  loading: boolean;
  addFavorite: (country: Country) => Promise<void>;
  removeFavorite: (countryCode: string) => Promise<void>;
  toggleFavorite: (country: Country) => Promise<void>;
  updateNote: (countryCode: string, note: string) => Promise<void>;
  isFavorite: (country: Country) => boolean;
  getFavoriteNote: (country: Country) => string;
  refreshFavorites: () => Promise<void>;
}

export function useFavorites(): UseFavoritesReturn {
  const [favorites, setFavorites] = useState<FavoriteCountry[]>([]);
  const [loading, setLoading] = useState(true);

  // Load favorites from storage
  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const storedFavorites = await StorageService.loadFavorites();
      setFavorites(storedFavorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
      Alert.alert('Error', 'Failed to load favorites');
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a country to favorites
  const addFavorite = useCallback(async (country: Country) => {
    try {
      const updatedFavorites = await StorageService.addFavorite(country);
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error('Error adding favorite:', error);
      Alert.alert('Error', 'Failed to add to favorites');
    }
  }, []);

  // Remove a country from favorites
  const removeFavorite = useCallback(async (countryCode: string) => {
    try {
      const updatedFavorites = await StorageService.removeFavorite(countryCode);
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error('Error removing favorite:', error);
      Alert.alert('Error', 'Failed to remove from favorites');
    }
  }, []);

  // Toggle favorite status
  const toggleFavorite = useCallback(async (country: Country) => {
    const isCurrentlyFavorite = favorites.some(fav => fav.cca3 === country.cca3);
    
    if (isCurrentlyFavorite) {
      await removeFavorite(country.cca3);
    } else {
      await addFavorite(country);
    }
  }, [favorites, addFavorite, removeFavorite]);

  // Update note for a favorite
  const updateNote = useCallback(async (countryCode: string, note: string) => {
    try {
      const updatedFavorites = await StorageService.updateFavoriteNote(countryCode, note);
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error('Error updating note:', error);
      Alert.alert('Error', 'Failed to update note');
    }
  }, []);

  // Check if a country is favorited
  const isFavorite = useCallback((country: Country) => {
    return favorites.some(fav => fav.cca3 === country.cca3);
  }, [favorites]);

  // Get favorite note
  const getFavoriteNote = useCallback((country: Country) => {
    const favorite = favorites.find(fav => fav.cca3 === country.cca3);
    return favorite?.note || '';
  }, [favorites]);

  // Refresh favorites (useful for focus events)
  const refreshFavorites = useCallback(async () => {
    await loadFavorites();
  }, [loadFavorites]);

  // Load favorites on mount
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    updateNote,
    isFavorite,
    getFavoriteNote,
    refreshFavorites,
  };
}
