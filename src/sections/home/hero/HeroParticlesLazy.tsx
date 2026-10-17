"use client";

import dynamic from "next/dynamic";

// Client-only and split out of the main bundle: the canvas is decorative and
// must not weigh on the first paint of the hero.
export const HeroParticlesLazy = dynamic(
  () => import("./HeroParticles").then((module) => module.HeroParticles),
  { ssr: false },
);
