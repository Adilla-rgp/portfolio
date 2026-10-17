"use client";

import { Button } from "@/components/ui/Button";
import { homeContent } from "@/content/home";
import { useParticlesControl } from "./ParticlesControl";

/** Restarts the noise → signal convergence. Hidden under reduced motion. */
export function ReplayButton() {
  const { replay } = useParticlesControl();

  return (
    <Button variant="outline" onClick={replay} className="motion-reduce:hidden">
      {homeContent.hero.replay}
    </Button>
  );
}
