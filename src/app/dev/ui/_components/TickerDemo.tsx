"use client";

import { useRafTicker } from "@/hooks/useRafTicker";
import { StatusDot } from "@/components/ui/StatusDot";
import { Text } from "@/components/ui/Typography/Text";

export function TickerDemo() {
  const { ref, t, isRunning, reducedMotion } = useRafTicker<HTMLDivElement>();

  return (
    <div ref={ref} className="flex flex-wrap items-center gap-4 font-mono text-mono">
      <StatusDot tone={isRunning ? "ok" : "muted"} />
      <Text as="span" tone="soft" className="font-mono text-mono tabular-nums">
        t = {t.toFixed(2)}s
      </Text>
      <Text as="span" tone="muted" className="font-mono text-mono-sm uppercase tracking-label">
        {reducedMotion ? "reduced motion: parado" : isRunning ? "rodando ~30fps" : "pausado (fora da tela)"}
      </Text>
    </div>
  );
}
