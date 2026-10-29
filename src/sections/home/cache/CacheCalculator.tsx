"use client";

import { useId, useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Segmented, type SegmentedOption } from "@/components/ui/Segmented";
import { TextArea } from "@/components/ui/TextArea";
import { Heading } from "@/components/ui/Typography/Heading";
import { Text } from "@/components/ui/Typography/Text";
import {
  cacheContent,
  cachePresets,
  cacheSetup,
  formatSimilarity,
  type CachePresetId,
  type CacheVerdict,
} from "@/content/cache";
import { matchCache, uniqueTokens } from "@/lib/cacheMatch";
import { ThresholdSlider } from "./ThresholdSlider";
import { TokenChips } from "./TokenChips";

/** "custom" once the visitor edits a message: no preset stays pressed. */
type PresetChoice = CachePresetId | "custom";
type TriageChoice = (typeof cacheContent.triage.options)[number]["value"];

const presetOptions: readonly SegmentedOption<PresetChoice>[] = cachePresets.map(
  ({ id, label }) => ({ value: id, label }),
);

const [initialPreset] = cachePresets;

const verdictCard = {
  exact: "ok",
  similar: "ok",
  rejected: "signal",
  miss: "outline",
} as const satisfies Record<CacheVerdict, string>;

export function CacheCalculator() {
  const [preset, setPreset] = useState<PresetChoice>(initialPreset.id);
  const [incoming, setIncoming] = useState<string>(initialPreset.incoming);
  const [cached, setCached] = useState<string>(initialPreset.cached);
  const [threshold, setThreshold] = useState<number>(cacheSetup.threshold);
  const [triage, setTriage] = useState<TriageChoice>("on");
  const incomingId = useId();
  const cachedId = useId();

  const match = matchCache({ incoming, cached, threshold, triage: triage === "on" });
  const tokens = useMemo(
    () => ({ incoming: uniqueTokens(incoming), cached: uniqueTokens(cached) }),
    [incoming, cached],
  );
  const shared = useMemo(() => {
    const cachedSet = new Set(tokens.cached);
    return new Set(tokens.incoming.filter((token) => cachedSet.has(token)));
  }, [tokens]);

  const choosePreset = (id: PresetChoice) => {
    const chosen = cachePresets.find((item) => item.id === id);
    if (!chosen) return;
    setPreset(chosen.id);
    setIncoming(chosen.incoming);
    setCached(chosen.cached);
  };

  const current = cachePresets.find((item) => item.id === preset);
  const note = current && "note" in current ? current.note : null;
  const verdict = cacheContent.verdicts[match.verdict];
  const similarity = formatSimilarity(match.similarity);
  const thresholdLabel = formatSimilarity(threshold);

  const fields = [
    { id: incomingId, label: cacheContent.fields.incoming, value: incoming, set: setIncoming, tokens: tokens.incoming },
    { id: cachedId, label: cacheContent.fields.cached, value: cached, set: setCached, tokens: tokens.cached },
  ];

  return (
    <Card className="@container flex flex-col gap-7">
      <Segmented
        aria-label={cacheContent.presetsLabel}
        options={presetOptions}
        value={preset}
        onValueChange={choosePreset}
        className="flex-wrap self-start"
      />

      <div className="grid gap-6 @xl:grid-cols-2">
        {fields.map((field) => (
          <div key={field.id} className="flex min-w-0 flex-col gap-3">
            <Text as="span" size="label" tone="muted">
              <label htmlFor={field.id}>{field.label}</label>
            </Text>
            <TextArea
              id={field.id}
              font="mono"
              rows={3}
              spellCheck={false}
              value={field.value}
              onChange={(event) => {
                field.set(event.currentTarget.value);
                setPreset("custom");
              }}
            />
            <TokenChips tokens={field.tokens} shared={shared} label={field.label} />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-col gap-1.5">
          <Text as="span" size="label" tone="muted">
            {cacheContent.similarityLabel}
          </Text>
          <Heading as="p" size="number" tone={match.similarity >= threshold ? "signal" : "default"}>
            {similarity}
          </Heading>
          <Text as="span" size="codeSm" tone="muted">
            {cacheContent.describeOverlap(match.shared, match.union)}
          </Text>
        </div>
        <div className="flex flex-col gap-2">
          <Text as="span" size="label" tone="muted" aria-hidden="true">
            {cacheContent.triage.label}
          </Text>
          <Segmented
            aria-label={cacheContent.triage.label}
            options={cacheContent.triage.options}
            value={triage}
            onValueChange={setTriage}
          />
        </div>
      </div>

      <ThresholdSlider
        threshold={threshold}
        similarity={match.similarity}
        onThresholdChange={setThreshold}
      />

      <div aria-live="polite" aria-atomic="true">
        <Card
          variant={verdictCard[match.verdict]}
          radius="item"
          padding="sm"
          className="flex flex-col gap-1.5"
        >
          <Text as="span" size="monoLg" tone="inherit" className="font-bold">
            {verdict.title}
          </Text>
          <Text tone="inherit">{verdict.body(similarity, thresholdLabel)}</Text>
        </Card>
      </div>

      {note && <Text size="codeSm">{note}</Text>}
    </Card>
  );
}
