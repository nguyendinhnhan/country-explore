import { Country } from '../types/Country';

const API_BASE_URL = 'https://restcountries.com/v3.1';
const API_FIELDS =
  'name,flags,region,population,capital,languages,currencies,cca3';

export interface PaginatedResponse {
  data: Country[];
  totalCount: number;
  hasNextPage: boolean;
}

export interface FetchCountriesParams {
  page?: number;
  limit?: number;
  search?: string;
  region?: string;
}

class CountryService {
  private allCountries: Country[] = [];
  private isInitialized = false;
  private cache = new Map<string, PaginatedResponse>();

  // Initialize countries from API once
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

      // Transform API data to match our Country interface
      this.allCountries = data.map((country: any) => ({
        cca3: country.cca3,
        name: {
          common: country.name.common,
          official: country.name.official,
        },
        capital: country.capital || [],
        region: country.region,
        population: country.population,
        flags: {
          png: country.flags.png,
          svg: country.flags.svg,
        },
        languages: country.languages || {},
        currencies: country.currencies || {},
      }));

      this.isInitialized = true;
    } catch (error) {
      throw new Error(`Failed to fetch countries: ${error}`);
    }
  }

  // Generate cache key for request
  private getCacheKey(params: FetchCountriesParams): string {
    return `${params.page || 1}-${params.limit || 20}-${params.search || ''}-${params.region || 'All'}`;
  }

  // Simulate paginated API with caching
  async fetchCountries(
    params: FetchCountriesParams = {}
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

  // Get single country by code
  async getCountryByCode(code: string): Promise<Country | null> {
    await this.initializeCountries();
    return this.allCountries.find((country) => country.cca3 === code) || null;
  }

  // Clear cache when needed
  clearCache(): void {
    this.cache.clear();
  }
}

export const countryService = new CountryService();
