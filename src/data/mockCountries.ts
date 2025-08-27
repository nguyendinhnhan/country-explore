import type { Country } from '../types/Country';

export const mockCountriesData: Country[] = [
  {
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
  },
  {
    cca3: 'GBR',
    name: {
      common: 'United Kingdom',
      official: 'United Kingdom of Great Britain and Northern Ireland',
    },
    capital: ['London'],
    region: 'Europe',
    population: 67800000,
    flags: {
      png: 'https://example.com/gbr.png',
      svg: 'https://example.com/gbr.svg',
    },
    languages: { eng: 'English' },
    currencies: { GBP: { name: 'British pound', symbol: '£' } },
  },
  {
    cca3: 'JPN',
    name: { common: 'Japan', official: 'Japan' },
    capital: ['Tokyo'],
    region: 'Asia',
    population: 125800000,
    flags: {
      png: 'https://example.com/jpn.png',
      svg: 'https://example.com/jpn.svg',
    },
    languages: { jpn: 'Japanese' },
    currencies: { JPY: { name: 'Japanese yen', symbol: '¥' } },
  },
];

export default mockCountriesData;
