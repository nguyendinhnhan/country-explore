export interface Country {
  cca3: string; // 3-letter country code
  name: {
    common: string;
    official: string;
  };
  capital?: string[];
  region: string;
  subregion?: string;
  population: number;
  flags: {
    png: string;
    svg: string;
  };
  languages?: { [key: string]: string };
  currencies?: { [key: string]: { name: string; symbol: string } };
  area?: number;
  timezones?: string[];
  borders?: string[];
}

export interface FavoriteCountry extends Country {
  note?: string;
  dateAdded: string;
}

export type Region = 'Africa' | 'Americas' | 'Asia' | 'Europe' | 'Oceania' | 'All';

export interface SearchFilters {
  region: Region;
  searchQuery: string;
}
