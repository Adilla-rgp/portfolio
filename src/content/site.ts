export const site = {
  name: "Ádilla Gomes",
  title: "Ádilla Gomes — Back-end, IA & Dados",
  description:
    "Construo os sistemas por trás de produtos com IA: APIs, filas, bancos e agentes em produção. E levo modelos e dados do notebook para produção, sempre com uma forma de medir se funcionam.",
  locale: "pt-BR",
  timeZone: "America/Fortaleza",
  links: {
    github: "https://github.com/Adilla-rgp",
    linkedin: "https://www.linkedin.com/in/adilla-gomes",
    cal: "https://cal.com/adilla-gomes",
  },
  nav: {
    label: "Principal",
    homeHref: "#topo",
    items: [
      { label: "Sistema", href: "#trace" },
      { label: "Trabalho", href: "#trabalho" },
      // /sobre is not built yet (roadmap step 5).
      { label: "Sobre", href: "#" },
      { label: "Contato", href: "#contato" },
    ],
  },
} as const;
