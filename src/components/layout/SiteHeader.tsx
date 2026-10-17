import type { ReactNode } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { navLinkVariants } from "@/components/ui/NavLink";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

export interface SiteNavItem {
  label: string;
  href: string;
}

interface SiteHeaderProps {
  /** Center slot, e.g. the lens switch on the Home. */
  actions?: ReactNode;
  /** Target of the name link; an in-page anchor on the Home, `/` elsewhere. */
  homeHref?: string;
  items?: readonly SiteNavItem[];
  className?: string;
}

interface HeaderLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
}

/** Routes go through next/link (prefetch, client navigation); anchors stay plain. */
function HeaderLink({ href, className, children }: HeaderLinkProps) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

export function SiteHeader({
  actions,
  homeHref = site.nav.homeHref,
  items = site.nav.items,
  className,
}: SiteHeaderProps) {
  return (
    <header className={cn("w-full", className)}>
      <Container className="flex flex-wrap items-center justify-between gap-4 py-5.5">
        <HeaderLink
          href={homeHref}
          className={cn(navLinkVariants({ size: "md", weight: "bold" }), "tracking-label")}
        >
          {site.name}
        </HeaderLink>
        {actions}
        <nav aria-label={site.nav.label}>
          <ul className="flex flex-wrap gap-x-7">
            {items.map((item) => (
              <li key={item.label}>
                <HeaderLink href={item.href} className={navLinkVariants()}>
                  {item.label}
                </HeaderLink>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
