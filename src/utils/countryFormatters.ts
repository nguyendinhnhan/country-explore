import { Country } from '../types/Country';

export const formatPopulation = (population: number): string => {
  if (population >= 1000000) {
    return `${(population / 1000000).toFixed(1)} million`;
  } else if (population >= 1000) {
    return `${(population / 1000).toFixed(0)} thousand`;
  }
  return population.toLocaleString();
};

export const getCapital = (country: Country): string => {
  if (!country.capital || country.capital.length === 0) {
    return 'N/A';
  }
  return country.capital.join(', ');
};

export const getLanguages = (country: Country): string => {
  if (!country.languages) {
    return 'N/A';
  }
  return Object.values(country.languages).join(', ');
};

export const getCurrencies = (country: Country): string => {
  if (!country.currencies) {
    return 'N/A';
  }
  return Object.values(country.currencies)
    .map((currency) => `${currency.name} (${currency.symbol})`)
    .join(', ');
};
