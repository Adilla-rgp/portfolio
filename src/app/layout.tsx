import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { HydrationMarker } from "@/components/layout/HydrationMarker";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import "@/styles/globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: site.title,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  authors: [{ name: site.name, url: site.links.github }],
  creator: site.name,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.name,
    title: site.title,
    description: site.description,
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
};

interface RootLayoutProps {
  children: ReactNode;
}

// Runs before first paint so CSS can hold entrances back only when JS is
// available (see `fade-in` in utilities.css). Kept tiny and synchronous.
const markJsScript = "document.documentElement.setAttribute('data-js','')";

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    // suppressHydrationWarning: data-js (head script) and data-hydrated
    // (HydrationMarker) are set on <html> outside React's render.
    <html
      lang={site.locale}
      className={cn(archivo.variable, jetbrainsMono.variable)}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: markJsScript }} />
      </head>
      <body>
        <HydrationMarker />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
