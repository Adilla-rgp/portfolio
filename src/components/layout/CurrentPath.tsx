"use client";

import { usePathname } from "next/navigation";

interface CurrentPathProps {
  fallback: string;
}

/** The requested path, read on the client (not-found pages get no params). */
export function CurrentPath({ fallback }: CurrentPathProps) {
  const pathname = usePathname();
  return <>{pathname ?? fallback}</>;
}
