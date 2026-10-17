"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import { useInView } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import { Segmented } from "@/components/ui/Segmented";
import {
  simulatedTraces,
  traceContent,
  traceStages,
  type TraceMode,
} from "@/content/trace";
import { buildWaterfall, getSharedScale, summarizeTrace } from "@/lib/trace";
import { TracePanel } from "./TracePanel";

// Both modes share one axis so the warm request reads as a fraction of the cold one.
const SHARED_SCALE = getSharedScale(Object.values(simulatedTraces));

/** Playback starts once most of the panel is on screen. */
const PANEL_IN_VIEW = { once: true, amount: 0.5 } as const;

interface TraceDemoProps {
  /** Static copy for the left column (kicker, title, body), rendered on the server. */
  intro: ReactNode;
}

export function TraceDemo({ intro }: TraceDemoProps) {
  const [mode, setMode] = useState<TraceMode>("frio");
  const [runId, setRunId] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const hasBeenSeen = useInView(panelRef, PANEL_IN_VIEW);

  const { rows, summary } = useMemo(() => {
    const trace = simulatedTraces[mode];
    return {
      rows: buildWaterfall(trace, traceStages, SHARED_SCALE),
      summary: summarizeTrace(trace, SHARED_SCALE),
    };
  }, [mode]);

  const replay = () => setRunId((id) => id + 1);
  const changeMode = (next: TraceMode) => {
    setMode(next);
    replay();
  };

  return (
    <>
      <FadeIn className="flex min-w-0 grow-5 basis-95 flex-col gap-6">
        {intro}
        <div className="flex flex-wrap items-center gap-3">
          <Button size="lg" onClick={replay}>
            {traceContent.fire.label}{" "}
            <span className="normal-case">{traceContent.fire.request}</span>
          </Button>
          <Segmented
            aria-label={traceContent.modeLabel}
            options={traceContent.modes}
            value={mode}
            onValueChange={changeMode}
          />
        </div>
      </FadeIn>
      <FadeIn delay="sibling" className="min-w-0 grow-7 basis-140">
        <TracePanel
          ref={panelRef}
          rows={rows}
          summary={summary}
          runKey={`${mode}-${runId}`}
          isPaused={!hasBeenSeen}
        />
      </FadeIn>
    </>
  );
}
