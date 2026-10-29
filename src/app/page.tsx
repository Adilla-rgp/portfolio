import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { HomeHero } from "@/sections/home/HomeHero";
import { ThresholdSection } from "@/sections/home/ThresholdSection";
import { TraceSection } from "@/sections/home/TraceSection";
import { WorkSection } from "@/sections/home/WorkSection";

export const metadata: Metadata = pageMetadata({ path: "/", description: site.description });

export default function Home() {
  return (
    <>
      <main>
        <HomeHero />
        <TraceSection />
        <ThresholdSection />
        <WorkSection />
      </main>
      <SiteFooter />
    </>
  );
}
