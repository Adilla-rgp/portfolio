"use client";

import { useState } from "react";
import { Segmented } from "@/components/ui/Segmented";
import { Text } from "@/components/ui/Typography/Text";

const lensOptions = [
  { value: "backend", label: "Back-end" },
  { value: "dados", label: "IA & Dados" },
] as const;

const cacheOptions = [
  { value: "frio", label: "Cache frio" },
  { value: "quente", label: "Cache quente" },
] as const;

type Lens = (typeof lensOptions)[number]["value"];
type Cache = (typeof cacheOptions)[number]["value"];

export function SegmentedDemo() {
  const [lens, setLens] = useState<Lens>("backend");
  const [cache, setCache] = useState<Cache>("frio");

  return (
    <div className="flex flex-wrap items-center gap-6">
      <Segmented
        aria-label="Lente do portfólio"
        options={lensOptions}
        value={lens}
        onValueChange={setLens}
      />
      <Segmented
        aria-label="Estado do cache"
        options={cacheOptions}
        value={cache}
        onValueChange={setCache}
      />
      <Text as="span" tone="muted" className="font-mono text-mono-sm">
        lente={lens} · cache={cache}
      </Text>
    </div>
  );
}
