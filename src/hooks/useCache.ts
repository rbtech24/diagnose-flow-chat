
import { useState, useEffect, useCallback } from 'react';
import { queryCache } from '@/services/cacheService';

export function useCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: {
    ttl?: number;
    enabled?: boolean;
    refetchOnMount?: boolean;
  }
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const enabled = options?.enabled !== false;
  const refetchOnMount = options?.refetchOnMount !== false;

  const fetchData = useCallback(async (skipCache = false) => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      let result: T;

      if (skipCache) {
        result = await fetcher();
        queryCache.set(key, result, options?.ttl);
      } else {
        result = await queryCache.getOrSet(key, fetcher, options?.ttl);
      }

      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [key, fetcher, enabled, options?.ttl]);

  const invalidate = useCallback(() => {
    queryCache.delete(key);
    setData(null);
  }, [key]);

  const refetch = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  const mutate = useCallback((newData: T) => {
    setData(newData);
    queryCache.set(key, newData, options?.ttl);
  }, [key, options?.ttl]);

  useEffect(() => {
    if (enabled && refetchOnMount) {
      // Check cache first
      const cached = queryCache.get<T>(key);
      if (cached) {
        setData(cached);
      } else {
        fetchData();
      }
    }
  }, [key, enabled, refetchOnMount, fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch,
    invalidate,
    mutate
  };
}
