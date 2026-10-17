"use client";

import { ParticleFieldLazy } from "@/components/particles/ParticleFieldLazy";
import { useParticlesControl } from "./ParticlesControl";

/** The hero's wave field, wired to the replay button. */
export function HeroParticles() {
  const { registerReplay } = useParticlesControl();
  return <ParticleFieldLazy mode="wave" registerReplay={registerReplay} />;
}
