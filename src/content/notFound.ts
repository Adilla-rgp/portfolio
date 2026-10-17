export const notFoundContent = {
  meta: {
    title: "Sinal perdido",
    description: "Esta rota não existe.",
  },
  ariaLabel: "Página não encontrada",
  kicker: "Erro 404 · GET",
  /** Shown until the client knows the real path. */
  pathFallback: "/[rota]",
  code: { before: "4", accent: "0", after: "4" },
  title: "Sinal perdido",
  body: "Esta rota só tem ruído. Passe o mouse e tente juntar alguma coisa, ou volte para onde o sinal é forte.",
  actions: [
    { label: "← Voltar para a Home", href: "/", variant: "signal" },
    { label: "Quem sou eu", href: "/sobre", variant: "outline" },
  ],
} as const;
