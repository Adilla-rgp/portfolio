import { Container } from "@/components/ui/Container";
import { Marquee } from "@/components/ui/Marquee";
import { NavLink } from "@/components/ui/NavLink";
import { Accent } from "@/components/ui/Typography/Accent";
import { Heading } from "@/components/ui/Typography/Heading";
import { Text } from "@/components/ui/Typography/Text";
import { homeContent } from "@/content/home";

const { footer } = homeContent;

export function HomeFooter() {
  return (
    <footer id={footer.id} className="overflow-hidden border-t border-line">
      <Marquee
        speed="fast"
        aria-label={footer.cta}
        className="pt-12 pb-6"
        itemClassName="gap-16 px-0 pr-16"
      >
        <Heading as="p" size="marquee">
          {footer.cta} <Accent>{footer.ctaArrow}</Accent>
        </Heading>
      </Marquee>
      <Container className="flex flex-wrap items-center justify-between gap-6 pt-6 pb-14">
        <Text size="monoLg" tone="muted">
          {footer.place}
        </Text>
        <nav aria-label={footer.navLabel}>
          <ul className="flex flex-wrap gap-x-8">
            {footer.links.map((link) => (
              <li key={link.href}>
                <NavLink href={link.href} size="md" target="_blank" rel="noopener noreferrer">
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </footer>
  );
}
