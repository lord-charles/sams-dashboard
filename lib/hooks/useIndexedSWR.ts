import useSWR, { SWRConfiguration, SWRResponse, Key } from 'swr';
import { getCache, setCache } from '../indexdb';
import axios from 'axios';

interface FetcherOptions {
  method?: 'GET' | 'POST';
  body?: any;
}

type ExtendedSWRConfig = Omit<SWRConfiguration, 'fetcher'> & {
  retryCount?: number;
};

const fetcher = async (key: Key, options: FetcherOptions = {}): Promise<any> => {
  if (!key) {
    throw new Error('Key is required for fetching data');
  }

  const url = key.toString();
  
  try {
    // Try to get from cache first
    const cachedData = await getCache(url);
    if (cachedData) {
      return cachedData;
    }

    // If not in cache or expired, fetch from network
    const response = options.method === 'POST'
      ? await axios.post(url, options.body)
      : await axios.get(url);

    const data = response.data;

    // Save to cache
    await setCache(url, data);

    return data;
  } catch (error) {
    // If offline, try to get from cache regardless of expiry
    if (!navigator.onLine) {
      const cachedData = await getCache(url);
      if (cachedData) {
        return cachedData;
      }
    }
    throw error;
  }
};

export function useIndexedSWR<T = any>(
  key: string | null,
  options: FetcherOptions = {},
  config: ExtendedSWRConfig = {}
): SWRResponse<T, Error> {
  return useSWR<T>(
    key as Key,
    (k) => fetcher(k, options),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 300000, // 5 minutes
      shouldRetryOnError: true,
      ...config,
    }
  );
}
