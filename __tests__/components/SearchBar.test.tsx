import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import SearchBar from '../../src/components/SearchBar';

// Mock useDebounce so the component calls onSearchChange synchronously in tests
jest.mock('../../src/hooks/useDebounce', () => ({
  useDebounce: (value: any) => value,
}));

describe('SearchBar Component', () => {
  const mockOnSearchChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly with default props', () => {
    const { getByPlaceholderText } = render(
      <SearchBar searchQuery="" onSearchChange={mockOnSearchChange} />
    );

    expect(getByPlaceholderText('Search countries...')).toBeTruthy();
  });

  it('should call onSearchChange when text input changes', () => {
    const { getByPlaceholderText } = render(
      <SearchBar searchQuery="" onSearchChange={mockOnSearchChange} />
    );

    const searchInput = getByPlaceholderText('Search countries...');
    fireEvent.changeText(searchInput, 'United States');

    expect(mockOnSearchChange).toHaveBeenCalledWith('United States');
    expect(mockOnSearchChange).toHaveBeenCalledTimes(1);
  });

  it('should display current search query', () => {
    const searchQuery = 'Test Query';
    const { getByPlaceholderText, getByDisplayValue } = render(
      <SearchBar searchQuery="" onSearchChange={mockOnSearchChange} />
    );

    const searchInput = getByPlaceholderText('Search countries...');
    fireEvent.changeText(searchInput, searchQuery);

    expect(getByDisplayValue(searchQuery)).toBeTruthy();
  });

  it('should handle empty and whitespace search queries', () => {
    const { getByPlaceholderText } = render(
      <SearchBar searchQuery="" onSearchChange={mockOnSearchChange} />
    );

    const searchInput = getByPlaceholderText('Search countries...');

    // Test empty string -> no call because prop searchQuery is already ''
    fireEvent.changeText(searchInput, '');
    expect(mockOnSearchChange).not.toHaveBeenCalled();

    // Test whitespace -> trimmed to empty, so no call
    fireEvent.changeText(searchInput, '   ');
    expect(mockOnSearchChange).not.toHaveBeenCalled();

    fireEvent.changeText(searchInput, '   u ');
    expect(mockOnSearchChange).toHaveBeenCalledWith('u');
    expect(mockOnSearchChange).toHaveBeenCalledTimes(1);
  });
});
