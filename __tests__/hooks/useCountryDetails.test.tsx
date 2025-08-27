import { renderHook, waitFor } from '@testing-library/react-native';
import useCountryDetails from '../../src/hooks/useCountryDetails';
import { mockCountriesData } from '@/src/data/mockCountries';

jest.mock('../../src/services/countryService');

describe('useCountryDetails hook', () => {
  const initial = mockCountriesData[0];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads country details and updates state', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { countryService } = require('../../src/services/countryService');
    countryService.getCountryByCode = jest
      .fn()
      .mockResolvedValueOnce(mockCountriesData[0]);

    const { result } = renderHook(() =>
      useCountryDetails('USA', { initialData: initial, forceFetch: true })
    );

    // loading will be true briefly
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.details).toEqual(mockCountriesData[0]);
  });

  it('falls back to initial data on error', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { countryService } = require('../../src/services/countryService');
    countryService.getCountryByCode = jest
      .fn()
      .mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() =>
      useCountryDetails('USA', { initialData: initial, forceFetch: true })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // should remain initial when fetch fails
    expect(result.current.details).toEqual(initial);
  });

  it('respects forceFetch flag when calling getCountryByCode', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { countryService } = require('../../src/services/countryService');
    countryService.getCountryByCode = jest
      .fn()
      .mockResolvedValueOnce(mockCountriesData[0]);

    const { result } = renderHook(() =>
      useCountryDetails('USA', { initialData: initial, forceFetch: false })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(countryService.getCountryByCode).toHaveBeenCalledWith('USA', false);
  });
});
