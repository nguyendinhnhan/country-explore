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

  /**
   * Test 1: Should render country information correctly
   */
  it('should render country information correctly', () => {
    const { getByText } = render(
      <CountryListItem
        country={mockCountry}
        isFavorite={false}
        onPress={mockOnPress}
        onFavoritePress={mockOnFavoritePress}
      />
    );

    expect(getByText('United States')).toBeTruthy();
    expect(getByText('Americas')).toBeTruthy();
    expect(getByText('Washington, D.C.')).toBeTruthy();
    expect(getByText('331,900,000')).toBeTruthy();
  });

  /**
   * Test 2: Should call onPress when item is pressed
   */
  it('should call onPress when item is pressed', () => {
    const { getByTestId } = render(
      <CountryListItem
        country={mockCountry}
        isFavorite={false}
        onPress={mockOnPress}
        onFavoritePress={mockOnFavoritePress}
      />
    );

    const countryItem = getByTestId('country-item');
    fireEvent.press(countryItem);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  /**
   * Test 3: Should call onFavoritePress when favorite button is pressed
   */
  it('should call onFavoritePress when favorite button is pressed', () => {
    const { getByTestId } = render(
      <CountryListItem
        country={mockCountry}
        isFavorite={false}
        onPress={mockOnPress}
        onFavoritePress={mockOnFavoritePress}
      />
    );

    const favoriteButton = getByTestId('favorite-button');
    fireEvent.press(favoriteButton);

    expect(mockOnFavoritePress).toHaveBeenCalledTimes(1);
  });

  /**
   * Test 4: Should display correct favorite icon when not favorite
   */
  it('should display correct favorite icon when not favorite', () => {
    const { getByTestId } = render(
      <CountryListItem
        country={mockCountry}
        isFavorite={false}
        onPress={mockOnPress}
        onFavoritePress={mockOnFavoritePress}
      />
    );

    const favoriteIcon = getByTestId('favorite-icon');
    expect(favoriteIcon).toBeTruthy();
  });

  /**
   * Test 5: Should display correct favorite icon when is favorite
   */
  it('should display correct favorite icon when is favorite', () => {
    const { getByTestId } = render(
      <CountryListItem
        country={mockCountry}
        isFavorite={true}
        onPress={mockOnPress}
        onFavoritePress={mockOnFavoritePress}
      />
    );

    const favoriteIcon = getByTestId('favorite-icon');
    expect(favoriteIcon).toBeTruthy();
  });

  /**
   * Test 6: Should handle country with multiple capitals
   */
  it('should handle country with multiple capitals', () => {
    const countryWithMultipleCapitals: Country = {
      ...mockCountry,
      capital: ['Pretoria', 'Cape Town', 'Bloemfontein'],
      name: { common: 'South Africa', official: 'Republic of South Africa' },
    };

    const { getByText } = render(
      <CountryListItem
        country={countryWithMultipleCapitals}
        isFavorite={false}
        onPress={mockOnPress}
        onFavoritePress={mockOnFavoritePress}
      />
    );

    expect(getByText('Pretoria, Cape Town, Bloemfontein')).toBeTruthy();
  });

  /**
   * Test 7: Should handle country with no capital
   */
  it('should handle country with no capital', () => {
    const countryWithNoCapital: Country = {
      ...mockCountry,
      capital: undefined,
      name: { common: 'Test Country', official: 'Test Country Official' },
    };

    const { getByText } = render(
      <CountryListItem
        country={countryWithNoCapital}
        isFavorite={false}
        onPress={mockOnPress}
        onFavoritePress={mockOnFavoritePress}
      />
    );

    expect(getByText('N/A')).toBeTruthy();
  });

  /**
   * Test 8: Should format population numbers correctly
   */
  it('should format population numbers correctly', () => {
    const testCases = [
      { population: 1000, expected: '1,000' },
      { population: 1000000, expected: '1,000,000' },
      { population: 331900000, expected: '331,900,000' },
    ];

    testCases.forEach(({ population, expected }) => {
      const testCountry: Country = {
        ...mockCountry,
        population,
        name: { common: `Test Country ${population}`, official: 'Test' },
      };

      const { getByText } = render(
        <CountryListItem
          country={testCountry}
          isFavorite={false}
          onPress={mockOnPress}
          onFavoritePress={mockOnFavoritePress}
        />
      );

      expect(getByText(expected)).toBeTruthy();
    });
  });

  /**
   * Test 9: Should not show favorite button when showFavoriteButton is false
   */
  it('should not show favorite button when showFavoriteButton is false', () => {
    const { queryByTestId } = render(
      <CountryListItem
        country={mockCountry}
        isFavorite={false}
        onPress={mockOnPress}
        onFavoritePress={mockOnFavoritePress}
        showFavoriteButton={false}
      />
    );

    expect(queryByTestId('favorite-button')).toBeNull();
  });

  /**
   * Test 10: Should handle note functionality
   */
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

    // Initially, the note should be displayed as text
    expect(getByText(testNote)).toBeTruthy();

    // Click on the note to enter edit mode
    const noteDisplay = getByText(testNote);
    fireEvent.press(noteDisplay);

    // Now the TextInput should be available
    const noteInput = getByDisplayValue(testNote);
    fireEvent.changeText(noteInput, 'Updated note');

    expect(mockOnNoteChange).toHaveBeenCalledWith('Updated note');
  });
});
