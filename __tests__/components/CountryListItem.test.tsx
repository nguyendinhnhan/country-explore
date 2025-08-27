import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import CountryListItem from '../../src/components/CountryListItem';
import type { Country } from '../../src/types/Country';

const mockCountry: Country = {
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
};

describe('CountryListItem Component', () => {
  const mockOnPress = jest.fn();
  const mockOnFavoritePress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render country information correctly', () => {
    const { getByText } = render(
      <CountryListItem
        country={mockCountry}
        isFavorite={false}
        onPress={mockOnPress}
        onFavoritePress={mockOnFavoritePress}
        note=""
        onNoteChange={jest.fn()}
      />
    );

    expect(getByText('United States')).toBeTruthy();
    expect(getByText('Americas')).toBeTruthy();
  });

  it('should call onPress when item is pressed', () => {
    const { getByTestId } = render(
      <CountryListItem
        country={mockCountry}
        isFavorite={false}
        onPress={mockOnPress}
        onFavoritePress={mockOnFavoritePress}
        note=""
        onNoteChange={jest.fn()}
      />
    );

    const countryItem = getByTestId('country-item');
    fireEvent.press(countryItem);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('should call onFavoritePress when favorite button is pressed', () => {
    const { getByTestId } = render(
      <CountryListItem
        country={mockCountry}
        isFavorite={false}
        onPress={mockOnPress}
        onFavoritePress={mockOnFavoritePress}
        note=""
        onNoteChange={jest.fn()}
      />
    );

    const favoriteButton = getByTestId('favorite-button');
    fireEvent.press(favoriteButton);

    expect(mockOnFavoritePress).toHaveBeenCalledTimes(1);
  });

  it('should handle note functionality', () => {
    const mockOnNoteChange = jest.fn();
    const testNote = 'Test note';

    const { getByText, getByDisplayValue } = render(
      <CountryListItem
        country={mockCountry}
        isFavorite={true}
        onPress={mockOnPress}
        onFavoritePress={mockOnFavoritePress}
        note={testNote}
        onNoteChange={mockOnNoteChange}
      />
    );

    expect(getByText(testNote)).toBeTruthy();

    // Click on the note to enter edit mode
    const noteDisplay = getByText(testNote);
    fireEvent.press(noteDisplay);

    // Now the TextInput should be available
    const noteInput = getByDisplayValue(testNote);
    fireEvent.changeText(noteInput, 'Updated note');

    expect(mockOnNoteChange).not.toHaveBeenCalled();

    // Simulate finishing editing (blur or submit)
    fireEvent(noteInput, 'blur');

    expect(mockOnNoteChange).toHaveBeenCalledWith(
      mockCountry.cca3,
      'Updated note'
    );
  });
});
