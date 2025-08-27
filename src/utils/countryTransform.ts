import { Country } from '@/src/types/Country';

// Transform raw API object to our Country shape with safe defaults
export function transformRawToCountry(raw: any): Country {
  return {
    cca3: raw?.cca3 ?? '',
    name: {
      common: raw?.name?.common ?? '',
      official: raw?.name?.official ?? '',
    },
    capital: raw?.capital ?? [],
    region: raw?.region ?? '',
    population: typeof raw?.population === 'number' ? raw.population : 0,
    flags: {
      png: raw?.flags?.png ?? '',
      svg: raw?.flags?.svg ?? '',
    },
    languages: raw?.languages ?? {},
    currencies: raw?.currencies ?? {},
  };
}

// Split API payload into valid items (have cca3) and skipped items (missing/invalid cca3)
export function splitValidItems(data: any) {
  const items = Array.isArray(data) ? data : [data];
  const validItems = items.filter(
    (r: any) => typeof r?.cca3 === 'string' && r.cca3.trim() !== ''
  );

  if (validItems.length === items.length) {
    return { validItems, skippedCca3s: [] } as const;
  }

  const skippedItems = items.filter(
    (r: any) => !(typeof r?.cca3 === 'string' && r.cca3.trim() !== '')
  );
  const skippedCca3s = skippedItems.map((r: any) => r?.cca3 ?? null);
  return { validItems, skippedCca3s } as const;
}

export default transformRawToCountry;
