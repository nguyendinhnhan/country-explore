import { useCallback, useEffect, useRef, useState } from 'react';
import { Country } from '../types/Country';
import { countryService } from '../services/CountryService';
import { logApiError } from '../services/ErrorHandler';

type Options = {
  forceFetch?: boolean;
  initialData: Country;
};

export default function useCountryDetails(
  code: string | undefined,
  options: Options
) {
  const { forceFetch = false, initialData } = options;

  const [details, setDetails] = useState<Country>(initialData);
  const [loading, setLoading] = useState(false);

  const isMountedRef = useRef(false);

  const fetchCountry = useCallback(async () => {
    if (!code || !isMountedRef.current) return;

    setLoading(true);
    try {
      const res = await countryService.getCountryByCode(code, forceFetch);
      if (res && isMountedRef.current) setDetails(res);
    } catch (err) {
      logApiError(`Failed to fetch country ${code}`, err);
      if (isMountedRef.current) {
        setDetails(initialData);
      }
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, [code, initialData, forceFetch]);

  useEffect(() => {
    if (!code) return;
    isMountedRef.current = true;
    fetchCountry();

    return () => {
      isMountedRef.current = false;
    };
  }, [code, forceFetch, initialData, fetchCountry]);

  return { details, loading, fetchCountry };
}
