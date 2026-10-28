import { cosmoArchitecture, type CosmoNodeId } from "@/content/cases/cosmo";
import { cn } from "@/lib/cn";

interface ArchitectureDiagramProps {
  lit: readonly CosmoNodeId[];
}

const { width, height, node, nodes, edges, stroke } = cosmoArchitecture;

function center(id: CosmoNodeId) {
  return { x: nodes[id].x + node.width / 2, y: nodes[id].y + node.height / 2 };
}

/**
 * Static SVG; only classes change between decisions, so the lit nodes fade
 * through CSS transitions and the lit links reuse the stack map's dash flow.
 * Decorative: the parent carries the description.
 */
export function ArchitectureDiagram({ lit }: ArchitectureDiagramProps) {
  const isLit = (id: CosmoNodeId) => lit.includes(id);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      className="block w-full min-w-diagram"
    >
      {edges.map(([from, to]) => {
        const a = center(from);
        const b = center(to);
        const on = isLit(from) && isLit(to);
        return (
          <line
            key={`${from}-${to}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            strokeWidth={on ? stroke.lit : stroke.idle}
            className={cn(
              "transition-colors duration-300",
              on ? "stroke-dash-flow animate-dash-flow stroke-signal" : "stroke-line",
            )}
          />
        );
      })}
      {(Object.keys(nodes) as CosmoNodeId[]).map((id) => {
        const { x, y, label, sub } = nodes[id];
        const on = isLit(id);
        return (
          <g key={id}>
            <rect
              x={x}
              y={y}
              width={node.width}
              height={node.height}
              rx={node.radius}
              className={cn(
                "transition-colors duration-300",
                on ? "fill-signal stroke-signal" : "fill-surface-2 stroke-line",
              )}
            />
            <text
              x={x + node.paddingX}
              y={y + node.labelBaseline}
              fontSize={node.labelSize}
              className={cn(
                "font-sans font-bold transition-colors duration-300",
                on ? "fill-bg" : "fill-dim",
              )}
            >
              {label}
            </text>
            <text
              x={x + node.paddingX}
              y={y + node.subBaseline}
              fontSize={node.subSize}
              className={cn("font-mono transition-colors duration-300", on ? "fill-bg" : "fill-dim")}
            >
              {sub}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function describeLitParts(lit: readonly CosmoNodeId[]): string[] {
  return lit.map((id) => nodes[id].label);
}
