"use client";

import { useState } from "react";
import { Segmented } from "@/components/ui/Segmented";
import { Text } from "@/components/ui/Typography/Text";
import {
  cacheContent,
  formatCount,
  formatRecovery,
  recoveryByBaseSize,
  type RecoverySeries,
} from "@/content/cache";
import { cssVars } from "@/lib/cssVars";

const { chart } = cacheContent;

/**
 * viewBox units. Drawn ~350px wide on a 390px phone (scale ~0.88), so 14-unit
 * text stays at 12px or more.
 */
const layout = {
  width: 400,
  height: 270,
  plotLeft: 52,
  plotRight: 392,
  plotTop: 30,
  plotBottom: 214,
  barWidth: 64,
  fontSize: 14,
  axisGutter: 10,
  /** Value labels sit inside the top of each bar. */
  valueInset: 22,
  xLabelY: 238,
  xTitleY: 264,
} as const;

const GRID_RATES = [0, 0.5, 1] as const;
const plotHeight = layout.plotBottom - layout.plotTop;
const slotWidth = (layout.plotRight - layout.plotLeft) / recoveryByBaseSize.length;
const y = (rate: number) => layout.plotBottom - rate * plotHeight;
const slotCenter = (index: number) => layout.plotLeft + slotWidth * (index + 0.5);

/** Bars per base size; sizes sit in equal slots, not on a linear axis. */
export function RecoveryChart() {
  const [series, setSeries] = useState<RecoverySeries>("geral");
  const seriesLabel = chart.series.find((option) => option.value === series)?.label ?? series;
  const description = chart.describe(
    seriesLabel,
    recoveryByBaseSize.map(
      (point) => `${formatCount(point.baseSize)} submissões, ${formatRecovery(point.rate[series])}`,
    ),
  );

  return (
    <figure className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Text as="span" size="label" tone="muted">
          {chart.title}
        </Text>
        <Segmented
          aria-label={chart.seriesLabel}
          options={chart.series}
          value={series}
          onValueChange={setSeries}
        />
      </div>

      <svg
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        role="img"
        aria-label={description}
        className="h-auto w-full"
      >
        <g className="fill-muted font-mono" fontSize={layout.fontSize}>
          {GRID_RATES.map((rate) => (
            <g key={rate}>
              <line
                x1={layout.plotLeft}
                x2={layout.plotRight}
                y1={y(rate)}
                y2={y(rate)}
                className="stroke-line"
              />
              <text
                x={layout.plotLeft - layout.axisGutter}
                y={y(rate)}
                textAnchor="end"
                dominantBaseline="middle"
              >
                {`${rate * 100}%`}
              </text>
            </g>
          ))}
          {recoveryByBaseSize.map((point, index) => (
            <text key={point.baseSize} x={slotCenter(index)} y={layout.xLabelY} textAnchor="middle">
              {formatCount(point.baseSize)}
            </text>
          ))}
          <text x={(layout.plotLeft + layout.plotRight) / 2} y={layout.xTitleY} textAnchor="middle">
            {chart.axisTitle}
          </text>
        </g>

        {recoveryByBaseSize.map((point, index) => {
          const rate = point.rate[series];
          return (
            <g key={point.baseSize}>
              <rect
                x={slotCenter(index) - layout.barWidth / 2}
                y={layout.plotTop}
                width={layout.barWidth}
                height={plotHeight}
                className="bar-grow-y fill-signal transition-transform duration-500 ease-out-expo"
                style={cssVars({ "--bar": rate })}
              />
              <text
                x={slotCenter(index)}
                y={y(rate) + layout.valueInset}
                textAnchor="middle"
                fontSize={layout.fontSize}
                className="fill-bg font-mono font-bold"
              >
                {formatRecovery(rate)}
              </text>
            </g>
          );
        })}
      </svg>

      <Text as="figcaption" size="codeSm" tone="muted">
        {chart.legend}
      </Text>
    </figure>
  );
}
