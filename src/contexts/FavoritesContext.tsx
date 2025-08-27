import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { Alert } from 'react-native';
import StorageService from '../services/storageService';
import { Country, FavoriteCountry } from '../types/Country';

// Types
interface FavoritesState {
  favorites: FavoriteCountry[];
  loading: boolean;
  error: string | null;
}

type FavoritesAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_FAVORITES'; payload: FavoriteCountry[] }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_FAVORITE'; payload: FavoriteCountry }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'UPDATE_NOTE'; payload: { countryCode: string; note: string } };

interface FavoritesContextType extends FavoritesState {
  addFavorite: (country: Country) => Promise<void>;
  removeFavorite: (countryCode: string) => Promise<void>;
  toggleFavorite: (country: Country) => Promise<void>;
  updateNote: (countryCode: string, note: string) => Promise<void>;
  isFavorite: (country: Country) => boolean;
  getFavoriteNote: (country: Country) => string;
  refreshFavorites: () => Promise<void>;
}

// Initial state
const initialState: FavoritesState = {
  favorites: [],
  loading: true,
  error: null,
};

// Reducer
function favoritesReducer(
  state: FavoritesState,
  action: FavoritesAction
): FavoritesState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_FAVORITES':
      return {
        ...state,
        favorites: action.payload,
        loading: false,
        error: null,
      };

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };

    case 'ADD_FAVORITE':
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
        error: null,
      };

    case 'REMOVE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.filter((f) => f.cca3 !== action.payload),
        error: null,
      };

    case 'UPDATE_NOTE':
      return {
        ...state,
        favorites: state.favorites.map((f) =>
          f.cca3 === action.payload.countryCode
            ? { ...f, note: action.payload.note }
            : f
        ),
        error: null,
      };

    default:
      return state;
  }
}

// Context
const FavoritesContext = createContext<FavoritesContextType | null>(null);

// Provider
interface FavoritesProviderProps {
  children: ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [state, dispatch] = useReducer(favoritesReducer, initialState);

  const favoritesSet = useMemo(
    () => new Set(state.favorites.map((f) => f.cca3)),
    [state.favorites]
  );

  // Load favorites from storage
  const loadFavorites = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const favorites = await StorageService.loadFavorites();
      dispatch({ type: 'SET_FAVORITES', payload: favorites });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to load favorites';
      dispatch({ type: 'SET_ERROR', payload: message });
      console.error('Error loading favorites:', error);
    }
  }, []);

  // Load favorites on mount
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // Add favorite
  const addFavorite = useCallback(async (country: Country) => {
    try {
      const updatedFavorites = await StorageService.addFavorite(country);
      const newFavorite = updatedFavorites.find((f) => f.cca3 === country.cca3);
      if (newFavorite) {
        dispatch({ type: 'ADD_FAVORITE', payload: newFavorite });
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to add favorite';
      dispatch({ type: 'SET_ERROR', payload: message });
      Alert.alert('Error', message);
    }
  }, []);

  // Remove favorite
  const removeFavorite = useCallback(async (countryCode: string) => {
    try {
      await StorageService.removeFavorite(countryCode);
      dispatch({ type: 'REMOVE_FAVORITE', payload: countryCode });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to remove favorite';
      dispatch({ type: 'SET_ERROR', payload: message });
      Alert.alert('Error', message);
    }
  }, []);

  // Toggle favorite
  const toggleFavorite = useCallback(
    async (country: Country) => {
      const isCurrentlyFavorite = favoritesSet.has(country.cca3);

      if (isCurrentlyFavorite) {
        await removeFavorite(country.cca3);
      } else {
        await addFavorite(country);
      }
    },
    [favoritesSet, addFavorite, removeFavorite]
  );

  // Update note
  const updateNote = useCallback(async (countryCode: string, note: string) => {
    try {
      await StorageService.updateFavoriteNote(countryCode, note);
      dispatch({ type: 'UPDATE_NOTE', payload: { countryCode, note } });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to update note';
      dispatch({ type: 'SET_ERROR', payload: message });
      Alert.alert('Error', message);
    }
  }, []);

  // Check if country is favorite
  const isFavorite = useCallback(
    (country: Country) => !!country?.cca3 && favoritesSet.has(country.cca3),
    [favoritesSet]
  );

  // Get favorite note
  const getFavoriteNote = useCallback(
    (country: Country) => {
      if (!country?.cca3) return '';
      const favorite = state.favorites.find((f) => f.cca3 === country.cca3);
      return favorite?.note || '';
    },
    [state.favorites]
  );

  // Refresh favorites
  const refreshFavorites = useCallback(async () => {
    await loadFavorites();
  }, [loadFavorites]);

  const contextValue: FavoritesContextType = {
    ...state,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    updateNote,
    isFavorite,
    getFavoriteNote,
    refreshFavorites,
  };

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
}

// Hook to use favorites context
export function useFavoritesContext(): FavoritesContextType {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error(
      'useFavoritesContext must be used within a FavoritesProvider'
    );
  }
  return context;
}
