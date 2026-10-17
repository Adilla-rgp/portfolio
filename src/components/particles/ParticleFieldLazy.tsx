"use client";

import dynamic from "next/dynamic";

// Client-only and split out of the main bundle: the canvas is decorative and
// must not weigh on the first paint of the block behind it.
export const ParticleFieldLazy = dynamic(
  () => import("./ParticleField").then((module) => module.ParticleField),
  { ssr: false },
);
