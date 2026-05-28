import { useEffect, useState } from 'react';

/**
 * Debounces a value. Use to avoid hammering the API on every keystroke.
 *   const debouncedSearch = useDebounce(search, 250);
 */
export function useDebounce<T>(value: T, delay = 250): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
