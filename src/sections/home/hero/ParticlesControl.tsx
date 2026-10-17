"use client";

import { createContext, useContext, useMemo, useRef, type ReactNode } from "react";

interface ParticlesControlValue {
  /** The canvas registers how to restart its convergence. */
  registerReplay: (replay: (() => void) | null) => void;
  replay: () => void;
}

const ParticlesControlContext = createContext<ParticlesControlValue | null>(null);

interface ParticlesControlProps {
  children: ReactNode;
}

/**
 * Connects the replay button to the particle canvas without lifting any
 * per-frame state: the canvas hands over a callback, the button calls it.
 */
export function ParticlesControl({ children }: ParticlesControlProps) {
  const replayRef = useRef<(() => void) | null>(null);

  const value = useMemo<ParticlesControlValue>(
    () => ({
      registerReplay: (replay) => {
        replayRef.current = replay;
      },
      replay: () => replayRef.current?.(),
    }),
    [],
  );

  return (
    <ParticlesControlContext.Provider value={value}>{children}</ParticlesControlContext.Provider>
  );
}

export function useParticlesControl(): ParticlesControlValue {
  const context = useContext(ParticlesControlContext);
  if (!context) {
    throw new Error("useParticlesControl must be used inside <ParticlesControl>.");
  }
  return context;
}
