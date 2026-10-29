# Portfólio — Ádilla Gomes

**[byadilla.vercel.app](https://byadilla.vercel.app)**

Portfólio de engenharia de software com foco em back-end, IA e dados. A ideia central é **mostrar o sistema em vez de descrevê-lo**: as peças da página são interativas e, sempre que possível, funcionam com dados reais.

---

## Destaques

- **Trace de uma requisição real.** O botão dispara `GET /api/home` e mostra as etapas medidas no seu navegador: DNS, conexão, espera e download (Resource Timing), as etapas internas do servidor (`Server-Timing`) e se a resposta veio do cache da CDN (`x-vercel-cache`). Dá para comparar cache frio e quente.
- **Calculadora do cache dos agentes tutores.** Compara duas mensagens de erro com similaridade de Jaccard, permite arrastar o limiar e mostra o caso em que o Jaccard falha (tokens iguais em ordem invertida) e a triagem que barra o falso positivo. O gráfico ao lado usa dados reais de 16.850 submissões.
- **Estudos de caso por decisões.** Cada projeto é contado pelas decisões de engenharia: contexto, escolha, alternativa, trade-off e resultado, com o diagrama da arquitetura acendendo as partes envolvidas.
- **Abertura em canvas 2D.** Partículas que saem do ruído e formam um sinal, reagindo ao ponteiro.

Nenhum número é inventado: dado que não existe não aparece, e um teste falha se algum placeholder chegar a uma página.

## Qualidade

- PageSpeed Insights: 100 em Performance, Acessibilidade, Boas práticas e SEO, no desktop e no celular.
- Testes de unidade e de conteúdo com Vitest, incluindo uma verificação que renderiza todas as páginas e procura campos vazios ou links quebrados.
- CI com GitHub Actions a cada push e pull request: type-check, lint, testes e build.
- Acessibilidade: controles nativos, navegação por teclado, `aria-live` nas peças interativas, contraste AA e `prefers-reduced-motion` respeitado em todas as animações.
- Conteúdo visível sem JavaScript: títulos e entradas de seção são CSS renderizado no servidor, com rede de segurança caso a hidratação falhe.

## Stack

Next.js (App Router) · React · TypeScript · Tailwind CSS v4 · class-variance-authority · Framer Motion · Vitest · GitHub Actions · Vercel

## Decisões de arquitetura

- **Tokens como única fonte de estilo.** Cores, tipografia e espaçamentos ficam no `@theme` do Tailwind; a paleta padrão é desligada para impedir cores fora do sistema.
- **Conteúdo separado do código.** Todo o texto do site vive em `src/content/`, tipado; os componentes só renderizam.
- **Animação sem re-render.** Loops por frame desenham direto no canvas ou atualizam variáveis CSS via refs, com o loop pausado fora da tela.
- **Template de estudo de caso.** As páginas de projeto compartilham um único componente alimentado por conteúdo; campos vazios somem em vez de virar placeholder.

## Estrutura

```
src/
  app/          rotas e API (/api/home)
  components/   primitivas de interface, layout e partículas
  sections/     seções e o template de estudo de caso
  content/      textos e dados do site
  lib/          lógica pura (trace, cache, linha do tempo), com testes
  hooks/        useRafTicker e afins
  styles/       tokens, base e animações
  types/        tipos compartilhados
  assets/       fontes
docs/
  DESIGN.md           especificação visual
  design-reference/   protótipos das telas
```

## Rodando localmente

```bash
npm install
npm run dev          # http://localhost:3000
npm run type-check
npm run lint
npm test
npm run build
```

---

[Portfólio](https://byadilla.vercel.app) · [LinkedIn](https://linkedin.com/in/adilla-gomes) · [GitHub](https://github.com/Adilla-rgp)
