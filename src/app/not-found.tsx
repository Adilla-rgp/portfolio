import type { Metadata } from "next";
import Link from "next/link";
import { CurrentPath } from "@/components/layout/CurrentPath";
import { ParticleFieldLazy } from "@/components/particles/ParticleFieldLazy";
import { buttonVariants } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { navLinkVariants } from "@/components/ui/NavLink";
import { Accent } from "@/components/ui/Typography/Accent";
import { Heading } from "@/components/ui/Typography/Heading";
import { Kicker } from "@/components/ui/Typography/Kicker";
import { Text } from "@/components/ui/Typography/Text";
import { notFoundContent as content } from "@/content/notFound";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: content.meta.title,
  description: content.meta.description,
};

export default function NotFound() {
  return (
    <section
      aria-label={content.ariaLabel}
      className="relative flex min-h-svh touch-pan-y flex-col overflow-hidden"
    >
      <ParticleFieldLazy mode="attract" />
      <Container className="relative flex flex-1 flex-col pt-8 pb-14">
        <Link
          href="/"
          className={cn(navLinkVariants({ size: "md", weight: "bold" }), "self-start tracking-label")}
        >
          {site.name}
        </Link>
        <main className="my-auto flex flex-col gap-6 py-12">
          <Kicker>
            {content.kicker}{" "}
            <span className="normal-case">
              <CurrentPath fallback={content.pathFallback} />
            </span>
          </Kicker>
          <Heading as="h1" size="displayCode">
            <span className="inline-block animate-glitch motion-reduce:animate-none">
              {content.code.before}
              <Accent>{content.code.accent}</Accent>
              {content.code.after}
            </span>
          </Heading>
          <Heading as="p" size="h3" className="uppercase">
            {content.title}
            <Accent>.</Accent>
          </Heading>
          <Text size="lg" className="max-w-115 text-halo">
            {content.body}
          </Text>
          <div className="flex flex-wrap gap-3">
            {content.actions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={buttonVariants({ variant: action.variant, size: "lg" })}
              >
                {action.label}
              </Link>
            ))}
          </div>
        </main>
      </Container>
    </section>
  );
}
