import { useEffect, useState } from "react";

const DEFAULT_DELAY = 100;

export default function useDebouncedValue<T>(
  value: T,
  delay: number = DEFAULT_DELAY
): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [value, delay]);

  return debouncedValue;
}
