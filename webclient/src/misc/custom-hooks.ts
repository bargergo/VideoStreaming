import { useEffect, useState } from "react";

export function useSessionStorage(key: string): [string | null, React.Dispatch<React.SetStateAction<string>>] {

  const value = sessionStorage.getItem(key);
  const [state, setState] = useState<string | null>(value);

  useEffect(() => {
    if (state == null) {
      sessionStorage.removeItem(key);
    } else {
      sessionStorage.setItem(key, state);
    }
  }, [state, key]);
  return [state, setState];
};

export function useLocalStorage(key: string): [string | null, React.Dispatch<React.SetStateAction<string>>] {

  const value = localStorage.getItem(key);
  const [state, setState] = useState<string | null>(value);

  useEffect(() => {
    if (state == null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, state);
    }
  }, [state, key]);
  return [state, setState];
};

export function useLocalStorageForNumber(key: string): [number | null, React.Dispatch<React.SetStateAction<number>>] {

  const value = localStorage.getItem(key);
  const [state, setState] = useState<number | null>(+value);

  useEffect(() => {
    if (state == null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, '' + state);
    }
  }, [state, key]);
  return [state, setState];
};