const links = {
  github: "https://github.com/Adilla-rgp",
  linkedin: "https://www.linkedin.com/in/adilla-gomes",
  cal: "https://cal.com/adilla-gomes",
} as const;

export const site = {
  name: "Ádilla Gomes",
  title: "Ádilla Gomes — Back-end, IA & Dados",
  description:
    "Construo os sistemas por trás de produtos com IA: APIs, filas, bancos e agentes em produção. E levo modelos e dados do notebook para produção, sempre com uma forma de medir se funcionam.",
  locale: "pt-BR",
  ogLocale: "pt_BR",
  ogImageAlt: "Do ruído ao sistema. — Ádilla Gomes",
  timeZone: "America/Fortaleza",
  links,
  nav: {
    label: "Principal",
    homeHref: "#topo",
    items: [
      { label: "Sistema", href: "#trace" },
      { label: "Trabalho", href: "#trabalho" },
      { label: "Sobre", href: "/sobre" },
      { label: "Contato", href: "#contato" },
    ],
  },
  footer: {
    id: "contato",
    cta: "Vamos conversar",
    ctaArrow: "→",
    place: "São Luís, BR · UFMA · Laboratório Telemídia",
    navLabel: "Contato",
    links: [
      { label: "Cal.com ↗", href: links.cal },
      { label: "GitHub ↗", href: links.github },
      { label: "LinkedIn ↗", href: links.linkedin },
    ],
  },
} as const;
