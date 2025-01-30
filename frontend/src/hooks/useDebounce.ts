import { useEffect, useState } from "react";

/**
 * A hook that delays updating a value until a specified delay has passed.
 * Useful for reducing the frequency of expensive operations (e.g., API calls, search updates).
 *
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds (minimum 0)
 * @returns The debounced value
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebounce(searchTerm, 500);
 */
export function useDebounce<T>(value: T, delay: number): T {
  // Ensure delay is non-negative
  const safeDelay = Math.max(0, delay);
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Skip debouncing if delay is 0
    if (safeDelay === 0) {
      setDebouncedValue(value);
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, safeDelay);

    // Cleanup timeout on component unmount or when value/delay changes
    return (): void => clearTimeout(timer);
  }, [value, safeDelay]);

  return debouncedValue;
}
