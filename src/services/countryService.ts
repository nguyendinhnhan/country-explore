import { Country, Region } from '@/src/types/Country';
import { logApiError } from '@/src/services/ErrorHandler';
import {
  transformRawToCountry,
  splitValidItems,
} from '@/src/utils/countryTransform';

const API_BASE_URL = 'https://restcountries.com/v3.1';
const API_FIELDS =
  'name,flags,region,population,capital,languages,currencies,cca3';

export interface PaginatedResponse {
  data: Country[];
  totalCount: number;
  hasNextPage: boolean;
}

export interface GetCountriesParams {
  page?: number;
  limit?: number;
  search?: string;
  region?: string;
}

class CountryService {
  private allCountries: Country[] = [];
  private isInitialized = false;
  private cache = new Map<string, PaginatedResponse>();

  private async initializeCountries(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/all?fields=${API_FIELDS}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Ensure we only keep items with a valid cca3 (our canonical id)
      const { validItems, skippedCca3s } = splitValidItems(data);
      if (skippedCca3s.length > 0) {
        logApiError(
          `Skipped ${skippedCca3s.length} countries from /all response because they lack cca3`,
          { skippedCount: skippedCca3s.length, skippedCca3s }
        );
      }

      // Transform API data to match our Country interface
      this.allCountries = validItems.map((country: any) =>
        transformRawToCountry(country)
      );

      this.isInitialized = true;
    } catch (error) {
      logApiError('Failed to fetch countries', error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  }

  private getCacheKey(params: GetCountriesParams): string {
    return `${params.page || 1}-${params.limit || 20}-${params.search || ''}-${params.region || 'All'}`;
  }

  async getCountries(
    params: GetCountriesParams = {}
  ): Promise<PaginatedResponse> {
    const { page = 1, limit = 20, search = '', region = 'All' } = params;

    // Check cache first
    const cacheKey = this.getCacheKey(params);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    // Simulate network delay
    await new Promise((resolve) =>
      setTimeout(resolve, 300 + Math.random() * 500)
    );

    await this.initializeCountries();

    let filteredCountries = [...this.allCountries];

    // Apply search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filteredCountries = filteredCountries.filter(
        (country) =>
          country.name.common.toLowerCase().includes(searchLower) ||
          country.cca3.toLowerCase().includes(searchLower)
      );
    }

    // Apply region filter
    if (region !== 'All' && region !== '') {
      filteredCountries = filteredCountries.filter(
        (country) => country.region === region
      );
    }

    // Sort alphabetically
    filteredCountries.sort((a, b) =>
      a.name.common.localeCompare(b.name.common)
    );

    // Calculate pagination
    const totalCount = filteredCountries.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const data = filteredCountries.slice(startIndex, endIndex);
    const hasNextPage = endIndex < totalCount;

    const result: PaginatedResponse = {
      data,
      totalCount,
      hasNextPage,
    };

    // Cache the result
    this.cache.set(cacheKey, result);

    return result;
  }

  async getCountryByCode(
    code: string,
    forceFetch = false
  ): Promise<Country | null> {
    await this.initializeCountries();

    const cached = this.allCountries.find((country) => country.cca3 === code);
    if (cached && !forceFetch) {
      return cached;
    }

    // Try fetching the single-country endpoint for fresh/more-detailed data
    try {
      const resp = await fetch(
        `${API_BASE_URL}/alpha/${code}?fields=${API_FIELDS}`
      );
      if (!resp.ok) {
        logApiError(
          `HTTP error fetching country ${code}`,
          new Error(`status ${resp.status}`)
        );
        return cached || null;
      }

      const data = await resp.json();
      const raw = Array.isArray(data) ? data[0] : data;
      if (!raw) return cached || null;

      const transformed: Country = transformRawToCountry(raw);

      // Update local list for subsequent fast lookups
      const idx = this.allCountries.findIndex(
        (c) => c.cca3 === transformed.cca3
      );
      if (idx >= 0) this.allCountries[idx] = transformed;
      else this.allCountries.push(transformed);

      return transformed;
    } catch (err) {
      logApiError(`Failed to fetch country ${code}`, err);
      return cached || null;
    }
  }

  async getRegions(): Promise<Region[]> {
    await this.initializeCountries();

    const regions = Array.from(
      new Set(this.allCountries.map((c) => c.region).filter(Boolean))
    );

    return ['All', ...regions] as unknown as Region[];
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const countryService = new CountryService();
