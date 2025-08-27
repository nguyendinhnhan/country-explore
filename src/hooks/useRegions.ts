import { useEffect, useState } from 'react';
import { countryService } from '@/src/services/CountryService';
import { Region } from '@/src/types/Country';
import { ErrorContext, logCriticalError } from '../services/ErrorHandler';

interface UseRegionsResult {
  regions: Region[];
  loading: boolean;
}

export function useRegions(initial: Region[] = ['All']): UseRegionsResult {
  const [regions, setRegions] = useState<Region[]>(initial);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRegions();
  }, []);

  const loadRegions = async () => {
    setLoading(true);
    try {
      const rs = await countryService.getRegions();
      setRegions(rs);
    } catch (error) {
      logCriticalError('Failed to load categories:', error, ErrorContext.API);
    } finally {
      setLoading(false);
    }
  };

  return { regions, loading };
}

export default useRegions;
