import { useEffect, useState } from "react";

/**
 * Returns a debounced value that will change debounceDelay ms after value changes
 * @param value
 * @param debounceDelay
 */
export const useDebouncedValue = <T>(value: T, debounceDelay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), debounceDelay);
    return () => clearTimeout(timer);
  }, [value, debounceDelay, setDebouncedValue]);

  return debouncedValue;
};
