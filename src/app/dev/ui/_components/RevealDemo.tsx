"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { RevealText } from "@/components/ui/RevealText";
import { Heading } from "@/components/ui/Typography/Heading";

export function RevealDemo() {
  const [runId, setRunId] = useState(0);

  return (
    <div className="flex flex-col items-start gap-6">
      <Heading as="p" size="display">
        <RevealText
          key={runId}
          lines={[
            "Do ruído",
            <>
              ao sistema<span className="text-signal">.</span>
            </>,
          ]}
        />
      </Heading>
      <Button variant="outline" onClick={() => setRunId((id) => id + 1)}>
        ↺ Repetir
      </Button>
    </div>
  );
}
