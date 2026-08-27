import {
  useCallback,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

function getInitialValue<T>(key: string, initialValue?: T | (() => T)): T {
  try {
    const item = localStorage.getItem(key);
    if (item !== null) {
      return JSON.parse(item);
    }
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
  }

  return typeof initialValue === "function"
    ? (initialValue as () => T)()
    : (initialValue as T);
}

export default function useLocalStorageState<T>(
  key: string,
  initialValue: T | (() => T),
): [T, Dispatch<SetStateAction<T>>];
export default function useLocalStorageState<T = undefined>(
  key: string,
  initialValue?: T | (() => T),
): [T | undefined, Dispatch<SetStateAction<T | undefined>>];
export default function useLocalStorageState<T>(
  key: string,
  initialValue?: T | (() => T),
): [T, Dispatch<SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() =>
    getInitialValue(key, initialValue),
  );

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.storageArea === localStorage && event.key === key) {
        try {
          if (event.newValue !== null) {
            setStoredValue(JSON.parse(event.newValue));
          } else {
            const fallback =
              typeof initialValue === "function"
                ? (initialValue as () => T)()
                : (initialValue as T);
            setStoredValue(fallback);
          }
        } catch (error) {
          console.error(`Error syncing localStorage key "${key}":`, error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [key, initialValue]);

  const setValue: Dispatch<SetStateAction<T>> = useCallback(
    (value) => {
      setStoredValue((prevState) => {
        const nextValue =
          typeof value === "function"
            ? (value as (prevState: T) => T)(prevState)
            : value;

        try {
          localStorage.setItem(key, JSON.stringify(nextValue));
        } catch (error) {
          console.error(`Error setting localStorage key "${key}":`, error);
        }

        return nextValue;
      });
    },
    [key],
  );

  return [storedValue, setValue];
}
