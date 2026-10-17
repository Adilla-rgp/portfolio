import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { aboutContent } from "@/content/about";
import { pageMetadata } from "@/lib/metadata";
import { AboutHero } from "@/sections/about/AboutHero";
import { AboutNumbers } from "@/sections/about/AboutNumbers";
import { OffCodeSection } from "@/sections/about/OffCodeSection";
import { StackSection } from "@/sections/about/StackSection";
import { TimelineSection } from "@/sections/about/TimelineSection";

export const metadata: Metadata = pageMetadata(aboutContent.meta);

export default function AboutPage() {
  return (
    <>
      <SiteHeader
        homeHref={aboutContent.nav.homeHref}
        items={aboutContent.nav.items}
        className="border-b border-line"
      />
      <main>
        <AboutHero />
        <AboutNumbers />
        <StackSection />
        <TimelineSection />
        <OffCodeSection />
      </main>
      <SiteFooter />
    </>
  );
}
