"use client";

import { useEffect } from "react";

/**
 * Marks <html data-hydrated> once React has hydrated. CSS uses it to switch off
 * the FadeIn safety net (see `fade-in` in utilities.css).
 */
export function HydrationMarker() {
  useEffect(() => {
    document.documentElement.setAttribute("data-hydrated", "");
  }, []);

  return null;
}
