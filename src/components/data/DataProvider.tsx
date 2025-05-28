
import React, { ReactNode, createContext, useContext, useReducer, useCallback } from 'react';
import { useLogger } from '@/hooks/useLogger';

interface DataState {
  [key: string]: {
    data: any;
    loading: boolean;
    error?: Error;
    lastFetch?: Date;
    cacheExpiry?: Date;
  };
}

type DataAction = 
  | { type: 'FETCH_START'; key: string }
  | { type: 'FETCH_SUCCESS'; key: string; data: any; cacheExpiry?: Date }
  | { type: 'FETCH_ERROR'; key: string; error: Error }
  | { type: 'INVALIDATE'; key: string }
  | { type: 'CLEAR_ALL' };

interface DataContextType {
  state: DataState;
  fetchData: (key: string, fetchFn: () => Promise<any>, options?: FetchOptions) => Promise<any>;
  invalidateData: (key: string) => void;
  clearAllData: () => void;
  isLoading: (key: string) => boolean;
  getData: (key: string) => any;
  getError: (key: string) => Error | undefined;
}

interface FetchOptions {
  force?: boolean;
  cacheDuration?: number; // in milliseconds
  retries?: number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

function dataReducer(state: DataState, action: DataAction): DataState {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        [action.key]: {
          ...state[action.key],
          loading: true,
          error: undefined
        }
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        [action.key]: {
          data: action.data,
          loading: false,
          error: undefined,
          lastFetch: new Date(),
          cacheExpiry: action.cacheExpiry
        }
      };
    case 'FETCH_ERROR':
      return {
        ...state,
        [action.key]: {
          ...state[action.key],
          loading: false,
          error: action.error
        }
      };
    case 'INVALIDATE':
      return {
        ...state,
        [action.key]: {
          ...state[action.key],
          cacheExpiry: new Date(0) // Expired immediately
        }
      };
    case 'CLEAR_ALL':
      return {};
    default:
      return state;
  }
}

interface DataProviderProps {
  children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  const [state, dispatch] = useReducer(dataReducer, {});
  const logger = useLogger('DataProvider');

  const fetchData = useCallback(async (
    key: string, 
    fetchFn: () => Promise<any>,
    options: FetchOptions = {}
  ) => {
    const { force = false, cacheDuration = 5 * 60 * 1000, retries = 3 } = options;
    const currentEntry = state[key];

    // Check if we have valid cached data
    if (!force && currentEntry?.data && currentEntry.cacheExpiry && new Date() < currentEntry.cacheExpiry) {
      logger.debug(`Using cached data for key: ${key}`);
      return currentEntry.data;
    }

    // Check if already loading
    if (currentEntry?.loading) {
      logger.debug(`Already loading data for key: ${key}`);
      return currentEntry.data;
    }

    dispatch({ type: 'FETCH_START', key });
    logger.info(`Fetching data for key: ${key}`, { force, cacheDuration });

    let lastError: Error | undefined;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const data = await fetchFn();
        const cacheExpiry = new Date(Date.now() + cacheDuration);
        
        dispatch({ 
          type: 'FETCH_SUCCESS', 
          key, 
          data, 
          cacheExpiry 
        });
        
        logger.info(`Successfully fetched data for key: ${key}`, { attempt });
        return data;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        logger.warn(`Fetch attempt ${attempt} failed for key: ${key}`, { 
          error: lastError.message,
          attempt,
          retries 
        });
        
        if (attempt < retries) {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }

    dispatch({ type: 'FETCH_ERROR', key, error: lastError! });
    logger.error(`All fetch attempts failed for key: ${key}`, { 
      error: lastError!.message,
      attempts: retries 
    });
    throw lastError;
  }, [state, logger]);

  const invalidateData = useCallback((key: string) => {
    dispatch({ type: 'INVALIDATE', key });
    logger.info(`Invalidated data for key: ${key}`);
  }, [logger]);

  const clearAllData = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' });
    logger.info('Cleared all cached data');
  }, [logger]);

  const isLoading = useCallback((key: string) => {
    return state[key]?.loading || false;
  }, [state]);

  const getData = useCallback((key: string) => {
    return state[key]?.data;
  }, [state]);

  const getError = useCallback((key: string) => {
    return state[key]?.error;
  }, [state]);

  const contextValue: DataContextType = {
    state,
    fetchData,
    invalidateData,
    clearAllData,
    isLoading,
    getData,
    getError
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
