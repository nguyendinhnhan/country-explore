import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import SearchBar from '../../src/components/SearchBar';

describe('SearchBar Component', () => {
  const mockOnSearchChange = jest.fn();
  const mockOnRegionChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test 1: Should render correctly with default props
   */
  it('should render correctly with default props', () => {
    const { getByPlaceholderText, getByText } = render(
      <SearchBar
        searchQuery=""
        selectedRegion="All"
        onSearchChange={mockOnSearchChange}
        onRegionChange={mockOnRegionChange}
      />
    );

    expect(getByPlaceholderText('Search countries...')).toBeTruthy();
    expect(getByText('All')).toBeTruthy();
  });

  /**
   * Test 2: Should call onSearchChange when text input changes
   */
  it('should call onSearchChange when text input changes', () => {
    const { getByPlaceholderText } = render(
      <SearchBar
        searchQuery=""
        selectedRegion="All"
        onSearchChange={mockOnSearchChange}
        onRegionChange={mockOnRegionChange}
      />
    );

    const searchInput = getByPlaceholderText('Search countries...');
    fireEvent.changeText(searchInput, 'United States');

    expect(mockOnSearchChange).toHaveBeenCalledWith('United States');
    expect(mockOnSearchChange).toHaveBeenCalledTimes(1);
  });

  /**
   * Test 3: Should call onRegionChange when region picker changes
   */
  it('should call onRegionChange when region picker changes', () => {
    const { getByText } = render(
      <SearchBar
        searchQuery=""
        selectedRegion="All"
        onSearchChange={mockOnSearchChange}
        onRegionChange={mockOnRegionChange}
      />
    );

    const europeButton = getByText('Europe');
    fireEvent.press(europeButton);

    expect(mockOnRegionChange).toHaveBeenCalledWith('Europe');
    expect(mockOnRegionChange).toHaveBeenCalledTimes(1);
  });

  /**
   * Test 4: Should display current search query
   */
  it('should display current search query', () => {
    const searchQuery = 'Test Query';
    const { getByDisplayValue } = render(
      <SearchBar
        searchQuery={searchQuery}
        selectedRegion="All"
        onSearchChange={mockOnSearchChange}
        onRegionChange={mockOnRegionChange}
      />
    );

    expect(getByDisplayValue(searchQuery)).toBeTruthy();
  });

  /**
   * Test 5: Should display current selected region
   */
  it('should display current selected region', () => {
    const selectedRegion = 'Europe';
    const { getByText } = render(
      <SearchBar
        searchQuery=""
        selectedRegion={selectedRegion}
        onSearchChange={mockOnSearchChange}
        onRegionChange={mockOnRegionChange}
      />
    );

    expect(getByText(selectedRegion)).toBeTruthy();
  });

  /**
   * Test 6: Should have all region options available
   */
  it('should have all region options available', () => {
    const { getByText } = render(
      <SearchBar
        searchQuery=""
        selectedRegion="All"
        onSearchChange={mockOnSearchChange}
        onRegionChange={mockOnRegionChange}
      />
    );

    // Test that all regions are present
    const regions = ['All', 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

    regions.forEach((region) => {
      expect(getByText(region)).toBeTruthy();
    });
  });

  /**
   * Test 7: Should handle empty and whitespace search queries
   */
  it('should handle empty and whitespace search queries', () => {
    const { getByPlaceholderText } = render(
      <SearchBar
        searchQuery=""
        selectedRegion="All"
        onSearchChange={mockOnSearchChange}
        onRegionChange={mockOnRegionChange}
      />
    );

    const searchInput = getByPlaceholderText('Search countries...');

    // Test empty string
    fireEvent.changeText(searchInput, '');
    expect(mockOnSearchChange).toHaveBeenCalledWith('');

    // Test whitespace
    fireEvent.changeText(searchInput, '   ');
    expect(mockOnSearchChange).toHaveBeenCalledWith('   ');

    expect(mockOnSearchChange).toHaveBeenCalledTimes(2);
  });
});
