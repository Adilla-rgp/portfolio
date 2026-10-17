import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { LensProvider } from "@/components/lens/LensProvider";
import { lensParam } from "@/content/lens";
import { site } from "@/content/site";
import { parseLens } from "@/lib/lens";
import { pageMetadata } from "@/lib/metadata";
import { HomeHero } from "@/sections/home/HomeHero";
import { ThresholdSection } from "@/sections/home/ThresholdSection";
import { TraceSection } from "@/sections/home/TraceSection";
import { WorkSection } from "@/sections/home/WorkSection";

// The lens query only reorders the same content, so every variant points here.
export const metadata: Metadata = pageMetadata({ path: "/", description: site.description });

interface HomeProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Home({ searchParams }: HomeProps) {
  const initialLens = parseLens((await searchParams)[lensParam]);

  return (
    <LensProvider initialLens={initialLens}>
      <main>
        <HomeHero />
        <TraceSection />
        <ThresholdSection />
        <WorkSection />
      </main>
      <SiteFooter />
    </LensProvider>
  );
}
