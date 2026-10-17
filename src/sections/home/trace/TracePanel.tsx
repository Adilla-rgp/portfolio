"use client";

import { forwardRef, type ReactNode } from "react";
import { useLens } from "@/components/lens/LensProvider";
import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Typography/Text";
import { httpReasonPhrases, traceContent } from "@/content/trace";
import { cn } from "@/lib/cn";
import { cssVars } from "@/lib/cssVars";
import type { TraceSummary, WaterfallRow } from "@/lib/trace";

interface TracePanelProps {
  rows: readonly WaterfallRow[];
  summary: TraceSummary;
  /** Changing it remounts the rows, which restarts the CSS playback. */
  runKey: string;
  /** Holds playback at the first frame until the panel has been seen. */
  isPaused: boolean;
}

const stackedCell = "col-start-1 row-start-1";

export const TracePanel = forwardRef<HTMLDivElement, TracePanelProps>(
  function TracePanel({ rows, summary, runKey, isPaused }, ref) {
    const { lens } = useLens();
    const statusText =
      summary.statusCode !== undefined
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
            {traceContent.requestPrefix}
            {lens}
          </Text>
          <Text as="span" size="label" tone="signal" className="grid text-right">
            <span
              aria-hidden="true"
              className={cn(stackedCell, "trace-until")}
              style={cssVars({ "--at": summary.end })}
            >
              {traceContent.running}
            </span>
            <span className={cn(stackedCell, "trace-after")} style={cssVars({ "--at": summary.end })}>
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
            {traceContent.summary.totalValue}
          </SummaryItem>
          <SummaryItem label={traceContent.summary.dbQueries}>{summary.dbQueries}</SummaryItem>
          <SummaryItem label={traceContent.summary.cache} isAccent>
            {summary.cacheHit ? traceContent.cacheHit : traceContent.cacheMiss}
          </SummaryItem>
        </dl>

        <Text size="codeSm" tone="muted" className="mt-3">
          {traceContent.simulationNote}
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
            className={cn("trace-bar rounded-chip", row.kind === "other" ? "bg-fg/85" : "bg-signal")}
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
  if (row.skipped) return { label: traceContent.skipped, tone: "muted" };
  if (row.kind === "cache") {
    return row.cacheHit
      ? { label: traceContent.cacheHit, tone: "signal" }
      : { label: traceContent.cacheMiss, tone: "fg" };
  }
  return { label: traceContent.durationPlaceholder, tone: "muted" };
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
        className={cn(isAccent && "uppercase")}
      >
        {children}
      </Text>
    </div>
  );
}
