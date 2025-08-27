import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  FavoritesProvider,
  useFavoritesContext,
} from '../../src/contexts/FavoritesContext';

// minimal mock country
const mockCountry = {
  cca3: 'TST',
  name: { common: 'Testland', official: 'Testlandia' },
  flags: { png: 'https://example.com/flag.png', svg: '' },
  region: 'TestRegion',
  population: 1,
} as any;

describe('E2E: favorite + note persistence', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <FavoritesProvider>{children}</FavoritesProvider>
  );

  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('stars a country, adds a note, reloads and still has the favorite + note', async () => {
    const { result, unmount } = renderHook(() => useFavoritesContext(), {
      wrapper,
    });

    // wait for provider to finish loading persisted state
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.addFavorite(mockCountry);
    });

    const testNote = 'Persisted note';
    await act(async () => {
      await result.current.updateNote(mockCountry.cca3, testNote);
    });

    expect(result.current.isFavorite(mockCountry)).toBe(true);
    expect(result.current.getFavoriteNote(mockCountry)).toBe(testNote);

    // simulate app restart
    unmount();

    const { result: r2 } = renderHook(() => useFavoritesContext(), { wrapper });
    await waitFor(() => expect(r2.current.loading).toBe(false));

    expect(r2.current.isFavorite(mockCountry)).toBe(true);
    expect(r2.current.getFavoriteNote(mockCountry)).toBe(testNote);
  });
});
