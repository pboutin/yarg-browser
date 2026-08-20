import { useCallback, useEffect, useState } from "react";

export default function useLocalStoredState<T>(
  key: string
): [T | null, (value: T) => void] {
  const [state, setState] = useState<T | null>(null);

  useEffect(() => {
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
      setState(JSON.parse(storedValue));
    }
  }, [key]);

  const setStateCallback = useCallback(
    (value: T) => {
      localStorage.setItem(key, JSON.stringify(value));
      setState(value);
    },
    [key, setState]
  );

  return [state, setStateCallback];
}
