export const aboutContent = {
  meta: {
    path: "/sobre",
    title: "Sobre",
    description:
      "Estudante de Ciência da Computação na UFMA e desenvolvedora no Laboratório TeleMídia. Stack, trajetória e liderança fora do código.",
  },
  nav: {
    homeHref: "/",
    items: [
      { label: "← Home", href: "/" },
      { label: "Stack", href: "#stack" },
      { label: "Trajetória", href: "#trajetoria" },
      { label: "Contato", href: "#contato" },
    ],
  },
  hero: {
    ariaLabel: "Apresentação",
    kicker: "Sobre — São Luís, Maranhão",
    titleLines: ["Quem está", "por trás"],
    intro:
      "Estudante de Ciência da Computação na UFMA e desenvolvedora no Laboratório TeleMídia, onde ajudei a construir o Cosmo, uma plataforma de questões de programação, e hoje desenvolvo agentes tutores com IA para ele. Faço pesquisa aplicada em IA na iniciação científica e gosto de sistemas que dá para medir.",
    photo: {
      /** Shown once the file exists in public/; until then, no photo at all. */
      src: "/images/adilla-gomes.jpg",
      alt: "Ádilla Gomes",
    },
    cv: {
      ariaLabel: "Currículo",
      soonHint: "em breve",
      downloadMark: "↓",
      files: [
        { label: "CV · PT-BR", href: "/cv/adilla-gomes-cv-pt-br.pdf", lang: "pt-BR" },
        { label: "CV · EN", href: "/cv/adilla-gomes-cv-en.pdf", lang: "en" },
      ],
    },
  },
  numbers: {
    ariaLabel: "Números",
    items: [
      { id: "anos", value: 3, suffix: "+", label: "Anos desenvolvendo" },
      { id: "producao", value: 2, label: "Projetos em produção" },
      { id: "iniciacoes", value: 2, label: "Iniciações científicas" },
      { id: "formatura", text: "2027", label: "Formatura prevista" },
    ],
  },
  stack: {
    id: "stack",
    kicker: "01 — Stack",
    title: "Sem barra de %",
    body: "Toque numa tecnologia para ver onde ela trabalhou de verdade. Ou toque num projeto para ver do que ele é feito.",
  },
  timeline: {
    id: "trajetoria",
    kicker: "02 — Trajetória",
    title: "Arraste o tempo",
  },
  offCode: {
    ariaLabel: "Fora do código",
    kicker: "03 — Fora do código",
    title: "Liderança",
    items: [
      {
        name: "Dacomp",
        body: "Diretora de Educação do diretório acadêmico, criando minicursos de programação para alunos de Ciência da Computação.",
      },
      {
        name: "Monitoria",
        body: "Monitora de Algoritmos I na UFMA, a mesma disciplina que hoje o Cosmo atende.",
      },
    ],
  },
} as const;

export type AboutNumber = (typeof aboutContent.numbers.items)[number];
