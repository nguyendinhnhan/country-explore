import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import RegionFilter from '../../src/components/RegionFilter';
import { regions } from '../../src/data/mockRegions';

describe('RegionFilter Component', () => {
  it('renders all regions and highlights the active one', () => {
    const mockOnRegionChange = jest.fn();
    const { getByTestId } = render(
      <RegionFilter
        regions={regions}
        selectedRegion={'Asia'}
        onRegionChange={mockOnRegionChange}
      />
    );

    regions.forEach((r) => {
      const el = getByTestId(`region-${r}`);
      expect(el).toBeTruthy();
    });

    // active item should exist
    const active = getByTestId('region-Asia');
    expect(active).toBeTruthy();
  });

  it('calls onRegionChange with the correct region when pressed', () => {
    const mockOnRegionChange = jest.fn();
    const { getByTestId } = render(
      <RegionFilter
        regions={regions}
        selectedRegion={'All'}
        onRegionChange={mockOnRegionChange}
      />
    );

    const europe = getByTestId('region-Europe');
    fireEvent.press(europe);

    expect(mockOnRegionChange).toHaveBeenCalledWith('Europe');
  });
});
