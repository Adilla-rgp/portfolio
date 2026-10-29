"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useInView } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import { Segmented } from "@/components/ui/Segmented";
import {
  formatRecordedAt,
  traceContent,
  traceStages,
  type TraceMode,
} from "@/content/trace";
import { recordedTraces } from "@/content/traceRecording";
import {
  loadLastRun,
  measureHomeRequest,
  saveLastRun,
  type RecordedTrace,
} from "@/lib/measureHomeRequest";
import { buildWaterfall, getSharedScale, summarizeTrace } from "@/lib/trace";
import type { Trace } from "@/types/trace";
import { TracePanel } from "./TracePanel";

/** The first run starts once most of the panel is on screen. */
const PANEL_IN_VIEW = { once: true, amount: 0.5 } as const;

const EMPTY_TRACE: Trace = { traceId: "", name: traceContent.rootName, spans: [] };

interface Run {
  id: number;
  result: RecordedTrace;
  /** The live request failed and this is the last recorded run. */
  isRecorded: boolean;
}

interface TraceDemoProps {
  /** Static copy for the left column (kicker, title, body), rendered on the server. */
  intro: ReactNode;
}

/**
 * Fires a real request at /api/home from this browser and plays it back as a
 * waterfall. Only the latest request may update the panel; a failed one shows
 * the last recorded run instead, labeled as such.
 */
export function TraceDemo({ intro }: TraceDemoProps) {
  const [mode, setMode] = useState<TraceMode>("frio");
  const [requestedId, setRequestedId] = useState(0);
  const [run, setRun] = useState<Run | null>(null);
  // Latest trace per mode, so both share one axis and the warm request reads
  // as a fraction of the cold one.
  const [latestByMode, setLatestByMode] = useState<Partial<Record<TraceMode, Trace>>>({});
  const latestRequestRef = useRef(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const hasBeenSeen = useInView(panelRef, PANEL_IN_VIEW);

  const fire = useCallback(
    async (nextMode: TraceMode) => {
      const id = latestRequestRef.current + 1;
      latestRequestRef.current = id;
      setRequestedId(id);

      let result: RecordedTrace;
      let isRecorded = false;
      try {
        result = await measureHomeRequest(nextMode);
        saveLastRun(nextMode, result);
      } catch {
        result = loadLastRun(nextMode) ?? recordedTraces[nextMode];
        isRecorded = true;
      }

      if (latestRequestRef.current !== id) return;
      setRun({ id, result, isRecorded });
      setLatestByMode((current) => ({ ...current, [nextMode]: result.trace }));
    },
    [],
  );

  useEffect(() => {
    if (hasBeenSeen && latestRequestRef.current === 0) void fire("frio");
  }, [hasBeenSeen, fire]);

  const current = run !== null && run.id === requestedId ? run : null;

  const { rows, summary } = useMemo(() => {
    const scale = getSharedScale(Object.values(latestByMode));
    const trace = current?.result.trace ?? EMPTY_TRACE;
    return {
      rows: buildWaterfall(trace, traceStages, scale),
      summary: current ? summarizeTrace(trace, scale) : null,
    };
  }, [current, latestByMode]);

  const changeMode = (next: TraceMode) => {
    setMode(next);
    void fire(next);
  };

  let note: string = traceContent.measuringNote;
  if (current?.isRecorded) note = traceContent.recordedNote(formatRecordedAt(current.result.recordedAt));
  else if (current) note = traceContent.liveNote;

  const request = `${traceContent.request}${mode === "frio" ? traceContent.coldSuffix : ""}`;

  return (
    <>
      <FadeIn className="flex min-w-0 grow-5 basis-95 flex-col gap-6">
        {intro}
        <div className="flex flex-wrap items-center gap-3">
          <Button size="lg" onClick={() => void fire(mode)}>
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
          request={request}
          rows={rows}
          summary={summary}
          isRecorded={current?.isRecorded ?? false}
          note={note}
          runKey={`${requestedId}-${current ? "done" : "pending"}`}
          isPaused={!current}
        />
      </FadeIn>
    </>
  );
}
