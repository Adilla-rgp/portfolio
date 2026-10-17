import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { NavLink } from "@/components/ui/NavLink";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

interface SiteHeaderProps {
  /** Center slot, e.g. the lens switch on the Home. */
  actions?: ReactNode;
  className?: string;
}

export function SiteHeader({ actions, className }: SiteHeaderProps) {
  return (
    <header className={cn("w-full", className)}>
      <Container className="flex flex-wrap items-center justify-between gap-4 py-5.5">
        <NavLink href={site.nav.homeHref} size="md" weight="bold" className="tracking-label">
          {site.name}
        </NavLink>
        {actions}
        <nav aria-label={site.nav.label}>
          <ul className="flex flex-wrap gap-x-7">
            {site.nav.items.map((item) => (
              <li key={item.label}>
                <NavLink href={item.href}>{item.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
