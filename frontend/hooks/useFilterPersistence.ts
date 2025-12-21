import { useEffect, useCallback, useRef } from 'react';
import { PropertyListParams } from '@/lib/store/api/propertyApi';

const STORAGE_KEY = 'atlas-property-filters';

/**
 * Hook to persist property filters to localStorage
 * Debounces updates to avoid excessive writes
 */
export function useFilterPersistence(
  filters: PropertyListParams,
  setFilters: (filters: PropertyListParams) => void
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoadRef = useRef(true);

  // Load filters from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as PropertyListParams;
        // Only restore non-pagination filters (page should reset)
        const { page, page_size, ...restoredFilters } = parsed;
        setFilters(restoredFilters);
      }
    } catch (error) {
      console.warn('Failed to load filters from localStorage:', error);
    }
    isInitialLoadRef.current = false;
  }, [setFilters]);

  // Save filters to localStorage (debounced)
  useEffect(() => {
    // Don't save on initial load
    if (isInitialLoadRef.current) {
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout to debounce saves
    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
      } catch (error) {
        console.warn('Failed to save filters to localStorage:', error);
      }
    }, 500); // 500ms debounce

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [filters]);

  // Clear filters from localStorage
  const clearFilters = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear filters from localStorage:', error);
    }
  }, []);

  return { clearFilters };
}

