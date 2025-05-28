import React, { ComponentType, memo, useMemo, useCallback, useState, useEffect } from 'react';
import { debounce } from 'lodash';

// Performance monitoring utilities
export const performanceMonitor = {
  startTime: 0,
  
  start(label: string) {
    this.startTime = performance.now();
    console.log(`Performance: Starting ${label}`);
  },
  
  end(label: string) {
    const endTime = performance.now();
    const duration = endTime - this.startTime;
    console.log(`Performance: ${label} took ${duration.toFixed(2)}ms`);
    return duration;
  },
  
  measure<T>(label: string, fn: () => T): T {
    this.start(label);
    const result = fn();
    this.end(label);
    return result;
  }
};

// Debounced search hook
export function useDebouncedSearch(searchTerm: string, delay: number = 300) {
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, delay]);

  return debouncedTerm;
}

// Memoized component wrapper
export function withMemo<T extends ComponentType<any>>(
  Component: T,
  areEqual?: (prevProps: any, nextProps: any) => boolean
): T {
  return memo(Component, areEqual) as unknown as T;
}

// Function memoization hook
export function useComponentMemo<T>(factory: () => T, dependencies: any[]): T {
  return useMemo(factory, dependencies);
}

// Callback memoization hook
export function useComponentCallback<T extends (...args: any[]) => any>(callback: T, dependencies: any[]): T {
  return useCallback(callback, dependencies);
}

// State management with performance logging
export function usePerformanceState<T>(initialValue: T, label: string): [T, (newValue: T) => void] {
  const [state, setState] = useState<T>(initialValue);

  const setPerformanceState = useCallback((newValue: T) => {
    performanceMonitor.start(`State Update: ${label}`);
    setState(newValue);
    performanceMonitor.end(`State Update: ${label}`);
  }, [label]);

  return [state, setPerformanceState];
}

// Debounced function
export function useDebounce<T extends (...args: any[]) => any>(func: T, delay: number): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => debounce(func, delay), [func, delay]);
}
