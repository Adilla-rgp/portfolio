"use client";

import { useState } from "react";
import { Segmented } from "@/components/ui/Segmented";
import { Text } from "@/components/ui/Typography/Text";

const seriesOptions = [
  { value: "geral", label: "Geral" },
  { value: "sintaxe", label: "Sintaxe" },
  { value: "logica", label: "Lógica" },
] as const;

const cacheOptions = [
  { value: "frio", label: "Cache frio" },
  { value: "quente", label: "Cache quente" },
] as const;

type Series = (typeof seriesOptions)[number]["value"];
type Cache = (typeof cacheOptions)[number]["value"];

export function SegmentedDemo() {
  const [series, setSeries] = useState<Series>("geral");
  const [cache, setCache] = useState<Cache>("frio");

  return (
    <div className="flex flex-wrap items-center gap-6">
      <Segmented
        aria-label="Tipo de erro"
        options={seriesOptions}
        value={series}
        onValueChange={setSeries}
      />
      <Segmented
        aria-label="Estado do cache"
        options={cacheOptions}
        value={cache}
        onValueChange={setCache}
      />
      <Text as="span" tone="muted" className="font-mono text-mono-sm">
        série={series} · cache={cache}
      </Text>
    </div>
  );
}
