# Ádilla Gomes — portfólio

Portfólio de Ádilla Gomes, desenvolvedora back-end com foco em IA e dados. O site junta as duas frentes num só
lugar: sistemas em produção (APIs, filas, bancos, agentes) e modelos levados do notebook para produção, sempre
com uma forma de medir se funcionam.

O conceito visual é **do ruído ao sistema**: partículas soltas que se organizam numa onda, peças interativas que
mostram o sistema por dentro e números que só aparecem quando existem de verdade. Métrica sem dado real fica
como `[— ms]` até ser medida.

## Stack

- [Next.js 16](https://nextjs.org) (App Router) e React 19
- TypeScript
- Tailwind CSS v4, com os tokens em `@theme`
- class-variance-authority para as variantes dos componentes
- Framer Motion para transições de interação
- Lucide para ícones
- Vitest para os testes

## Como rodar

Requer Node.js 20.9 ou mais recente.

```bash
npm install
npm run dev        # http://localhost:3000
```

| Comando              | O que faz                          |
| -------------------- | ---------------------------------- |
| `npm run dev`        | servidor de desenvolvimento        |
| `npm run build`      | build de produção                  |
| `npm start`          | serve o build de produção          |
| `npm run lint`       | ESLint                             |
| `npm run type-check` | checagem de tipos (`tsc --noEmit`) |
| `npm test`           | testes (Vitest)                    |

O CI (`.github/workflows/ci.yml`) roda type-check, lint, testes e build em cada pull request.

Variável de ambiente opcional: `NEXT_PUBLIC_SITE_URL`, a origem usada nos links canônicos, no Open Graph e no
sitemap. Na Vercel, o domínio de produção é detectado sozinho até ela ser definida.

## Estrutura

```
docs/
  DESIGN.md              fonte da verdade visual: conceito, tokens, tipografia, movimento, rotas
  design-reference/      protótipos HTML de cada tela (especificação, não código)
src/
  app/                   rotas; componentes exclusivos de uma rota ficam em `_components/`
  components/
    ui/                  primitivas (Button, Card, Heading, Text, Segmented, RevealText…)
    layout/              cabeçalho, rodapé e peças globais
  content/               todo o texto do site, tipado (`as const`)
  sections/              seções de cada página
  hooks/                 useRafTicker e outros
  lib/                   lógica pura (trace, linha do tempo, gráfico, partículas) e utilitários
  styles/                tokens.css, animations.css, utilities.css, globals.css
```

Todo o texto vive em `src/content/`, nunca escrito direto nos componentes. Isso deixa o caminho aberto para
internacionalização e para um CMS sem mexer na interface.

## Decisões de arquitetura

**Entradas em CSS, não em JavaScript.** Os títulos (`RevealText`) e as entradas das seções (`FadeIn`) são
animações CSS. O título é renderizado no servidor e anima sem esperar a hidratação. O conteúdo só fica escondido
quando um script mínimo no `<head>` confirma que há JavaScript, e uma rede de segurança revela tudo se a página
nunca hidratar. Framer Motion fica para transições de interação.

**Partículas em `<canvas>` 2D.** A abertura desenha cerca de 150 pontos em canvas, sem Three.js e sem SVG. O
desenho é imperativo: nada re-renderiza o React a cada quadro.

**Um relógio para tudo que anima por quadro.** `useRafTicker` limita o `requestAnimationFrame` a cerca de 30fps
e pausa quando o elemento sai da tela ou a aba fica oculta. Valores que mudam a cada quadro (progresso, posição
de alça, altura de barra) chegam ao CSS por variáveis (`--progress`, `--handle-x`) escritas por ref, sem estado
do React.

**Tokens como única fonte de estilo.** Cores, escala tipográfica, espaçamentos e raios estão em
`src/styles/tokens.css`, espelhando o `DESIGN.md`. A paleta padrão do Tailwind é desligada, então um componente
só alcança as cores do sistema. Tamanhos de texto saem de `<Heading>`, `<Text>` e `<Kicker>`, nunca de
utilitários soltos.

**Primitivas reutilizáveis.** Cada primitiva em `components/ui/` usa `forwardRef`, repassa as props nativas,
aceita `className` (mesclado com `cn()`) e declara variantes com CVA.

**Conteúdo honesto por construção.** Projetos têm `isPublished` e `isListed`: páginas não publicadas ficam fora
do sitemap e da lista, com `noindex`, e só abrem em desenvolvimento. Campos sem informação real são `null`, e a
interface esconde o bloco correspondente em vez de mostrar um texto provisório.

## Acessibilidade

- Controles reais (`<button>`, `<a>`, `<input>`), navegação por teclado e alvos de toque de pelo menos 44px.
- Gráficos e diagramas com `role="img"` e `aria-label` que descreve o estado atual. Gráficos arrastáveis têm um
  `<input type="range">` equivalente.
- Resultados de interações anunciados por regiões `aria-live`.
- Hierarquia de títulos correta e `lang="pt-BR"`.
- Contraste AA em todos os pares de cor dos tokens.
- `prefers-reduced-motion`: sem partículas animadas, marquee ou loops, e transições de no máximo 150ms. As peças
  mostram o estado final.

## Performance

- Peças pesadas (as partículas) carregam com `dynamic()`, depois do conteúdo principal.
- Animações por quadro não re-renderizam árvores do React e pausam fora da tela.
- O cabeçalho não pré-carrega as outras rotas ao aparecer na tela; o pré-carregamento acontece no hover.
- Fontes com `next/font` (Archivo e JetBrains Mono), sem requisições externas em tempo de execução.
- Imagens Open Graph geradas no build.
