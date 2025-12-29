import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryClient } from "@tanstack/react-query";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";

const STALE_TIME_MS = 5 * 60 * 1000;
const CACHE_TIME_MS = 30 * 60 * 1000;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME_MS,
      cacheTime: CACHE_TIME_MS,
      gcTime: CACHE_TIME_MS,
      // Prevent automatic refetches to cut down on API calls.
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retryOnMount: false,
      retry: false,
    },
  },
});

export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

export const PERSIST_MAX_AGE_MS = CACHE_TIME_MS;
