"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { defaultLens, lensParam, type Lens } from "@/content/lens";

interface LensContextValue {
  lens: Lens;
  setLens: (lens: Lens) => void;
}

const LensContext = createContext<LensContextValue | null>(null);

interface LensProviderProps {
  /** Parsed on the server from `?lente=`, so the first paint already matches the URL. */
  initialLens: Lens;
  children: ReactNode;
}

export function LensProvider({ initialLens, children }: LensProviderProps) {
  const [lens, setLensState] = useState(initialLens);

  // history.replaceState keeps Next's router in sync without a server round
  // trip, so switching lens is instant and does not add history entries.
  const setLens = useCallback((next: Lens) => {
    setLensState(next);

    const url = new URL(window.location.href);
    if (next === defaultLens) {
      url.searchParams.delete(lensParam);
    } else {
      url.searchParams.set(lensParam, next);
    }
    window.history.replaceState(window.history.state, "", url);
  }, []);

  const value = useMemo(() => ({ lens, setLens }), [lens, setLens]);

  return <LensContext.Provider value={value}>{children}</LensContext.Provider>;
}

export function useLens(): LensContextValue {
  const context = useContext(LensContext);
  if (!context) {
    throw new Error("useLens must be used inside <LensProvider>.");
  }
  return context;
}
