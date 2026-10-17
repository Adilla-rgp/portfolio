# DESIGN.md — Portfólio Ádilla Gomes

Fonte da verdade do visual. Substitui qualquer orientação antiga de identidade roxa ou glassmorphism no AGENTS.md.
As telas de referência estão em `docs/design-reference/*.dc.html`: são protótipos HTML com toda a lógica de interação em JS puro, dentro do bloco `<script type="text/x-dc">`. Use-as como especificação de layout, copy e comportamento. Não copie o formato: reimplemente em React/Next.

## Conceito

**"Do ruído ao sistema."** Back-end + IA/dados num site só, com duas lentes (`backend` | `dados`) que reordenam e reescrevem os mesmos projetos.
O site mostra o sistema em vez de descrevê-lo: entrada com partículas que viram um sinal, trace de requisição, gráficos que se arrastam e demos que funcionam de verdade.

Regras de conteúdo:
- **Nunca inventar números.** Métrica que não existe fica como `[— ms]`, `[—%]` e similares até ter dado real.
- **Rotular o que é ilustrativo.** Curvas, modelos de brinquedo e documentos de exemplo ganham um aviso visível de que são ilustrativos.

## Tokens

Tema escuro único: remover `next-themes`. Mapear tudo no `@theme` do Tailwind v4. Nenhuma cor fixa em componente.

```css
@theme {
  /* superfícies */
  --color-bg: #0B0B0C;
  --color-sunken: #0F0F11;     /* faixas de seção alternadas */
  --color-surface: #111113;    /* cards, painéis */
  --color-surface-2: #141416;  /* itens dentro de painéis */
  --color-raised: #1F1F23;     /* hover/selecionado dentro de painéis */
  --color-line: #26262A;
  --color-line-strong: #3A3A40;
  /* texto */
  --color-fg: #F2EFE8;         /* osso */
  --color-fg-soft: #C9C5BC;    /* parágrafos */
  --color-muted: #9A968E;      /* labels mono */
  --color-dim: #6E6A63;        /* itens inativos grandes */
  --color-faint: #4A4741;      /* desativado */
  /* sinal */
  --color-signal: #FF5A1F;     /* acento único; texto sobre ele = bg */
  --color-ok: #47D17C;         /* status online / acerto */

  --font-sans: var(--font-archivo), system-ui, sans-serif;
  --font-mono: var(--font-jetbrains), ui-monospace, monospace;

  --radius-pill: 999px;
  --radius-card: 1rem;     /* 16px painéis */
  --radius-item: 0.75rem;  /* 12px itens */
  --radius-chip: 0.25rem;

  --ease-out-expo: cubic-bezier(.2, .8, .2, 1);
}
```

Acentos alternativos já testados: lima `#C6FF3D` e azul `#3D7BFF`. A troca deve ser só de `--color-signal`.

## Tipografia

Fontes via `next/font/google`:
- **Archivo** variável, com `axes: ['wdth']`, exposta como `--font-archivo`.
- **JetBrains Mono** (400/500/700), exposta como `--font-jetbrains`.

| Papel | Fonte | Tamanho | Peso / largura | Extra |
|---|---|---|---|---|
| Display (hero) | Archivo | `clamp(56px, 10.4vw, 156px)` | 850 / `font-stretch:125%` | uppercase, `line-height:.9`, `tracking:-0.035em` |
| Display XL (Cosmo, Gallifrey, 404) | Archivo | `clamp(80px, 17vw, 250px)` | 900 / 125% | `line-height:.82`, `tracking:-0.05em` |
| H2 de seção | Archivo | `clamp(40px, 5vw, 72px)` | 800 / 115% | uppercase, `line-height:.95`, `tracking:-0.03em`, termina com ponto final |
| H3 | Archivo | `clamp(32px, 3.8vw, 54px)` | 800 / 115% | |
| Nome de projeto (lista) | Archivo | `clamp(36px, 5.6vw, 84px)` | 800 / 120% | uppercase; inativo em `dim` |
| Número grande | Archivo | 64–72px | 850–900 / 125% | |
| Kicker | Mono | 13px | 400 | uppercase, `tracking:.08em`, cor `signal`, ex.: `01 — O SISTEMA` |
| Label | Mono | 11–12px | 400–700 | uppercase, `tracking:.06em`, cor `muted` |
| Corpo grande | Archivo | 19–21px | 400 | `line-height:1.5`, cor `fg-soft` |
| Corpo | Archivo | 16–17px | 400 | `line-height:1.55` |

O ponto final do título é na cor `signal`, como em `Do ruído / ao sistema.` e `Cosmo.`.

## Layout

- **Container:** `max-width:1360px`, `padding-inline:40px` (no celular, 20px).
- **Ritmo das seções:** `padding-block:120px`. Seções alternam `bg` / `sunken`, separadas por `border-top: 1px line`.
- **Grids:** flex com `flex-wrap` e `flex-basis` (ex.: `flex: 1 1 380px`), para tudo empilhar sozinho no celular.

## Primitivas (`src/components/ui`)

Todas com `forwardRef`, repasse de `...props` nativas, `className` via `cn()` e variantes com CVA.

- **Button:** pill, fonte mono uppercase 700, `tracking:.04em`.
  - Variantes `signal` (fundo signal, texto bg), `outline` (borda `line-strong`) e `ghost`.
  - Tamanhos `md` (44px) e `lg` (52px). Opção `asChild` ou `as="a"`.
- **Segmented:** grupo de pills dentro de uma borda pill, `role="group"` e `aria-pressed`. Usado na lente, em cache frio/quente, aluno/sistema e bidirecional.
- **Heading:** prop `as` com `h2` como padrão, e prop `size` (`display | displayXl | h2 | h3`).
- **Text:** prop `as` com `p` como padrão, e prop `tone` (`soft | muted`).
- **Kicker:** mono, signal, uppercase.
- **Section:** recebe `id` e `tone` (`bg | sunken`); a borda de cima é opcional.
- **Container**
- **Card:** variantes `surface` (borda `line`, fundo `surface`), `sunken` e `lit` (fundo `fg`, texto `bg`, para o item "atual").
- **Tag:** pill mono 12px com borda `line-strong`. Substitui o `Label` e o `Badge` atuais.
- **StatusDot:** bolinha de 8px em `ok` ou `muted`, com um piscar opcional.
- **Marquee:** faixa infinita com conteúdo duplicado (a cópia leva `aria-hidden`) e `@keyframes marquee` de 0 a -50%.
- **RevealText:** cada linha num wrapper com `overflow:hidden`; o texto sobe de `translateY(105%)` em 1,1s com `ease-out-expo` e atraso escalonado de 0,15s.

## Movimento (`src/lib/motion.ts`)

- **Easing padrão:** `ease-out-expo`.
- **Entradas:** `fade` (opacidade + 12px, 0,9s) e `rise` (o RevealText).
- **Loops (`useRafTicker`):** usar um hook com `requestAnimationFrame` limitado a cerca de 30fps, que expõe `t` em segundos e para quando o componente sai da tela (IntersectionObserver).
- **`prefers-reduced-motion`:** sem partículas animadas (mostrar a onda já formada), sem marquee, sem typewriter, e transições de no máximo 150ms.
- **Partículas:** desenhar em `<canvas>` 2D, não em SVG nem Three.js. São cerca de 150 pontos.

## Telas e rotas

| Rota | Referência | Peças interativas |
|---|---|---|
| `/` | `Home.dc.html` | Ver detalhes abaixo. |
| `/projetos/documento-sinal` | `Signal.dc.html` | Linha de leitura que percorre o documento; JSON digitado campo a campo; nota contra o gabarito subindo; clique no campo acende o trecho de origem; pacote atravessando as 4 etapas. |
| `/projetos/cosmo` | `Case.dc.html` | 5 decisões com tour automático (6s cada) e barra de progresso; diagrama da arquitetura que acende os nós de cada decisão, com as conexões tracejadas em movimento; botão para alternar entre "escolhi" e "não escolhi". |
| `/projetos/gallifrey` | `Gallifrey.dc.html` | Missão de 3 questões sobre listas com feedback; alternância entre visão do aluno e do sistema, que mostra o nível de Bloom e o registro do back-end; linha animada do protótipo à produção. |
| `/projetos/recomendacao` | `Rec.dc.html` | O visitante monta uma sequência de tópicos e vê barras de atenção, a posição [MASK] pulsando e os 3 tópicos mais prováveis (modelo de brinquedo); animação de mascaramento com alternância bidirecional/só da esquerda. |
| `/sobre` | `About.dc.html` | Números que sobem contando; grafo da stack (tecnologia ↔ projeto, com links animados); linha do tempo de 2020 a 2028 que roda sozinha e pode ser arrastada. |
| `not-found.tsx` | `NotFound.dc.html` | Partículas soltas que se juntam em volta do mouse; "404" com efeito de falha. |

Detalhes da Home:
1. **Abertura** com 860px de altura:
   - Partículas que vão do ruído à onda e se afastam do mouse num raio de 160px.
   - Título com RevealText e seletor de lente no topo.
   - CTA "VER O TRABALHO ↓" e botão "↺ VOLTAR AO RUÍDO".
   - Faixa (marquee) de status ao vivo com a hora real de São Luís (`America/Fortaleza`).
2. **"Esta página, por dentro.":** trace de 5 etapas animado, disparado por botão, com alternância de cache frio/quente (no quente, a etapa de banco aparece como PULADO).
3. **"Arraste o limiar.":** gráfico em SVG com o limiar de Jaccard (0,50 a 0,95). Mostra a curva de acertos de cache (com área) e a de reuso errado (tracejada), com alça arrastável, um `input range` para acessibilidade, uma frase que muda conforme a zona e o aviso de que as curvas são ilustrativas.
4. **"Trabalho":** lista com nomes gigantes. O item com hover ou foco se expande com descrição e tags, e a ordem e o texto dependem da lente.
5. **Rodapé:** marquee gigante "VAMOS CONVERSAR →" e links para Cal.com, GitHub e LinkedIn.

Persistir a lente na URL (`?lente=dados`), para que cada candidatura possa ter o link certo.

## Conteúdo

Centralizar em `src/content/` (tipado, `as const`):
- `site.ts`: links (github.com/Adilla-rgp, linkedin.com/in/adilla-gomes, cal.com/adilla-gomes).
- `projects.ts`: texto por lente, tags por lente, ordem por lente, status e rota.
- `decisions.ts`: as decisões do Cosmo.
- `timeline.ts`: os marcos da página Sobre.

Os textos entre colchetes nas referências são placeholders a preencher.

## Acessibilidade

- **Controles reais:** `<button>`, `<a>` e `<input>`; nada de `onClick` em div.
- **SVG:** os decorativos levam `aria-hidden`; os gráficos levam `role="img"` com `aria-label`.
- **Toque:** alvos de pelo menos 44px.
- **Contraste:** os pares de cores dos tokens já passam em AA. Não usar `dim` nem `faint` para texto pequeno importante.
- **Página:** `lang="pt-BR"`.

## Roteiro de implementação

1. **Base:** commit do estado atual; renomear `master` para `main`; corrigir o import do CSS; limpar o `globals.css`; tokens no `@theme`; fontes; `lang`; metadata; remover `three`, `@react-three/*`, `next-themes` e `zod`; script `type-check`; atualizar o AGENTS.md para apontar para este arquivo.
2. **Primitivas** + `lib/motion.ts` + `useRafTicker`.
3. **Home estática:** layout, copy e lentes, sem as peças animadas.
4. **Peças de assinatura da Home**, nesta ordem: RevealText e marquee, trace, gráfico do limiar, partículas.
5. `/sobre` e `not-found`.
6. **Páginas de projeto**, cada uma só quando o projeto real existir. A primeira é `/projetos/documento-sinal`.
