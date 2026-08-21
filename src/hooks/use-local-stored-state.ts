import { useCallback, useSyncExternalStore } from "react";

const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export default function useLocalStoredState<T>(
  key: string
): [T | null, (value: T) => void] {
  const json = useSyncExternalStore(
    subscribe,
    () => localStorage.getItem(key),
    () => null
  );

  const state = json ? (JSON.parse(json) as T) : null;

  const setStateCallback = useCallback(
    (value: T) => {
      localStorage.setItem(key, JSON.stringify(value));
      emitChange();
    },
    [key]
  );

  return [state, setStateCallback];
}
