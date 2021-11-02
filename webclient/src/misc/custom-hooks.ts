import { useEffect, useState } from "react";

export default function useSessionStorage(key: string): [string | null, React.Dispatch<React.SetStateAction<string>>] {

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