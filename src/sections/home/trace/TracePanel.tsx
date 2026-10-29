"use client";

import { forwardRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Typography/Text";
import {
  describeTraceResult,
  formatDuration,
  httpReasonPhrases,
  traceContent,
} from "@/content/trace";
import { cn } from "@/lib/cn";
import { cssVars } from "@/lib/cssVars";
import type { TraceSummary, WaterfallRow } from "@/lib/trace";

interface TracePanelProps {
  /** Request line shown in the header, e.g. `GET /api/home?nocache=…`. */
  request: string;
  rows: readonly WaterfallRow[];
  /** null while the request is in flight. */
  summary: TraceSummary | null;
  /** The figures come from a recorded run, not from this visit. */
  isRecorded: boolean;
  note: string;
  /** Changing it remounts the rows, which restarts the CSS playback. */
  runKey: string;
  /** Holds playback at the first frame until the panel has been seen. */
  isPaused: boolean;
}

const stackedCell = "col-start-1 row-start-1";

export const TracePanel = forwardRef<HTMLDivElement, TracePanelProps>(
  function TracePanel({ request, rows, summary, isRecorded, note, runKey, isPaused }, ref) {
    const reducedMotion = useReducedMotion();
    // The run whose status animation has ended. Under reduced motion there is
    // no animation, so the result is final as soon as playback is unpaused.
    const [finishedRunKey, setFinishedRunKey] = useState<string | null>(null);
    const isFinished = !isPaused && (reducedMotion || finishedRunKey === runKey);
    const end = summary?.end ?? 1;
    const statusText =
      summary?.statusCode !== undefined
        ? `${summary.statusCode} ${httpReasonPhrases[summary.statusCode] ?? ""}`.trim()
        : "";

    return (
      <Card
        ref={ref}
        role="group"
        aria-label={traceContent.panelLabel}
        className="flex min-h-trace-panel flex-col gap-1.5 p-5 md:p-7"
      >
        <div
          key={`status-${runKey}`}
          className={cn(
            "mb-2.5 flex justify-between gap-3 border-b border-line pb-3.5",
            isPaused && "trace-paused",
          )}
        >
          <Text as="span" size="codeSm" tone="muted">
            {request}
          </Text>
          <Text as="span" size="label" tone="signal" className="grid text-right">
            <span
              aria-hidden="true"
              className={cn(stackedCell, "trace-until")}
              style={cssVars({ "--at": end })}
            >
              {traceContent.running}
            </span>
            <span
              className={cn(stackedCell, "trace-after")}
              style={cssVars({ "--at": end })}
              onAnimationEnd={() => setFinishedRunKey(runKey)}
            >
              {statusText}
            </span>
          </Text>
        </div>

        <ol key={`rows-${runKey}`} className={cn("flex flex-col gap-1.5", isPaused && "trace-paused")}>
          {rows.map((row) => (
            <TraceRow key={row.name} row={row} />
          ))}
        </ol>

        <dl className="mt-3.5 grid grid-cols-3 gap-4 border-t border-line pt-4.5">
          <SummaryItem label={traceContent.summary.total}>
            {summary ? formatDuration(summary.totalMs) : traceContent.noValue}
          </SummaryItem>
          <SummaryItem label={traceContent.summary.server}>
            {summary?.serverMs != null ? formatDuration(summary.serverMs) : traceContent.noValue}
          </SummaryItem>
          <SummaryItem label={traceContent.summary.cache} isAccent>
            {summary?.cache ?? traceContent.noValue}
          </SummaryItem>
        </dl>

        {/* Announces only the final result. The keyed span is a new node per
            run, so repeating an identical result is announced again. */}
        <p aria-live="polite" className="sr-only">
          {isFinished && summary && (
            <span key={runKey}>{describeTraceResult({ ...summary, isRecorded })}</span>
          )}
        </p>

        <Text size="codeSm" tone="muted" className="mt-3">
          {note}
        </Text>
      </Card>
    );
  },
);

interface TraceRowProps {
  row: WaterfallRow;
}

function TraceRow({ row }: TraceRowProps) {
  const tag = getRowTag(row);

  return (
    <li className="grid min-h-12 grid-cols-trace items-center gap-4">
      <span className="flex min-w-0 flex-col gap-0.5">
        <Text as="span" size="code" tone="fg" className="truncate font-medium">
          {row.name}
        </Text>
        <Text as="span" size="codeXs" tone="muted">
          {row.service}
        </Text>
      </span>
      <span aria-hidden="true" className="relative block h-3.5 rounded-chip bg-raised">
        {!row.skipped && (
          <span
            className={cn("trace-bar rounded-chip", row.kind === "server" ? "bg-signal" : "bg-fg/85")}
            style={cssVars({ "--bar-start": row.start, "--bar-width": row.width })}
          />
        )}
      </span>
      <Text
        as="span"
        size="label"
        tone={tag.tone}
        className="trace-after text-right"
        style={cssVars({ "--at": row.end })}
      >
        {tag.label}
      </Text>
    </li>
  );
}

interface RowTag {
  label: string;
  tone: "muted" | "signal" | "fg";
}

function getRowTag(row: WaterfallRow): RowTag {
  if (row.skipped) return { label: row.skippedLabel, tone: "muted" };
  return { label: formatDuration(row.durationMs), tone: row.kind === "server" ? "signal" : "fg" };
}

interface SummaryItemProps {
  label: string;
  isAccent?: boolean;
  children: ReactNode;
}

function SummaryItem({ label, isAccent = false, children }: SummaryItemProps) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <Text as="dt" size="label" tone="muted">
        {label}
      </Text>
      <Text
        as="dd"
        size="monoValue"
        tone={isAccent ? "signal" : "fg"}
        // Three columns leave ~90px each on a 360px phone; a smaller size keeps
        // values like "1.234 ms" on one line.
        className={cn("whitespace-nowrap max-md:text-body-lg", isAccent && "uppercase")}
      >
        {children}
      </Text>
    </div>
  );
}
