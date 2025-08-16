import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavoriteCountry } from '../types/Country';

class StorageService {
  private static readonly FAVORITES_KEY = 'country_favorites';

  /**
   * Load favorites from AsyncStorage
   */
  static async loadFavorites(): Promise<FavoriteCountry[]> {
    try {
      const stored = await AsyncStorage.getItem(this.FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  }

  /**
   * Save favorites to AsyncStorage
   */
  static async saveFavorites(favorites: FavoriteCountry[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
      throw new Error('Failed to save favorites');
    }
  }

  /**
   * Add a country to favorites
   */
  static async addFavorite(country: Omit<FavoriteCountry, 'dateAdded' | 'note'>): Promise<FavoriteCountry[]> {
    try {
      const currentFavorites = await this.loadFavorites();
      
      // Check if already exists
      const existingIndex = currentFavorites.findIndex(fav => fav.cca3 === country.cca3);
      if (existingIndex >= 0) {
        return currentFavorites;
      }

      const newFavorite: FavoriteCountry = {
        ...country,
        dateAdded: new Date().toISOString(),
        note: '',
      };

      const updatedFavorites = [...currentFavorites, newFavorite];
      await this.saveFavorites(updatedFavorites);
      return updatedFavorites;
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw new Error('Failed to add favorite');
    }
  }

  /**
   * Remove a country from favorites
   */
  static async removeFavorite(countryCode: string): Promise<FavoriteCountry[]> {
    try {
      const currentFavorites = await this.loadFavorites();
      const updatedFavorites = currentFavorites.filter(fav => fav.cca3 !== countryCode);
      await this.saveFavorites(updatedFavorites);
      return updatedFavorites;
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw new Error('Failed to remove favorite');
    }
  }

  /**
   * Update note for a favorite country
   */
  static async updateFavoriteNote(countryCode: string, note: string): Promise<FavoriteCountry[]> {
    try {
      const currentFavorites = await this.loadFavorites();
      const updatedFavorites = currentFavorites.map(fav =>
        fav.cca3 === countryCode ? { ...fav, note } : fav
      );
      await this.saveFavorites(updatedFavorites);
      return updatedFavorites;
    } catch (error) {
      console.error('Error updating favorite note:', error);
      throw new Error('Failed to update note');
    }
  }

  /**
   * Check if a country is favorited
   */
  static async isFavorite(countryCode: string): Promise<boolean> {
    try {
      const favorites = await this.loadFavorites();
      return favorites.some(fav => fav.cca3 === countryCode);
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  }

  /**
   * Get favorite note for a country
   */
  static async getFavoriteNote(countryCode: string): Promise<string> {
    try {
      const favorites = await this.loadFavorites();
      const favorite = favorites.find(fav => fav.cca3 === countryCode);
      return favorite?.note || '';
    } catch (error) {
      console.error('Error getting favorite note:', error);
      return '';
    }
  }

  /**
   * Clear all favorites (useful for testing or reset functionality)
   */
  static async clearFavorites(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.FAVORITES_KEY);
    } catch (error) {
      console.error('Error clearing favorites:', error);
      throw new Error('Failed to clear favorites');
    }
  }
}

export default StorageService;
