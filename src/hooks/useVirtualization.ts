
import { useState, useEffect, useCallback, useMemo } from 'react';

interface UseVirtualizationOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  totalItems: number;
}

export function useVirtualization({
  itemHeight,
  containerHeight,
  overscan = 5,
  totalItems
}: UseVirtualizationOptions) {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleRange = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const end = Math.min(totalItems, start + visibleCount + overscan * 2);
    
    return { start, end };
  }, [scrollTop, itemHeight, containerHeight, totalItems, overscan]);

  const totalHeight = totalItems * itemHeight;
  const offsetY = visibleRange.start * itemHeight;

  const handleScroll = useCallback((scrollTop: number) => {
    setScrollTop(scrollTop);
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    const targetScrollTop = index * itemHeight;
    setScrollTop(targetScrollTop);
    return targetScrollTop;
  }, [itemHeight]);

  return {
    visibleRange,
    totalHeight,
    offsetY,
    handleScroll,
    scrollToIndex
  };
}
