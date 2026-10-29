import { caseStudyContent, type Architecture } from "@/content/caseStudy";
import { cn } from "@/lib/cn";

interface ArchitectureDiagramProps<NodeId extends string> {
  architecture: Architecture<NodeId>;
  lit: readonly NodeId[];
}

const { node, stroke } = caseStudyContent.diagram;

function nodeIds<NodeId extends string>(architecture: Architecture<NodeId>): NodeId[] {
  return Object.keys(architecture.nodes) as NodeId[];
}

/**
 * Static SVG; only classes change between decisions, so the lit nodes fade
 * through CSS transitions and the lit links reuse the stack map's dash flow.
 * Decorative: the parent carries the description, and nodes with a page are
 * also offered as real links outside the SVG, so their anchors here stay out
 * of the tab order.
 */
export function ArchitectureDiagram<NodeId extends string>({
  architecture,
  lit,
}: ArchitectureDiagramProps<NodeId>) {
  const { width, height, nodes, edges } = architecture;
  const isLit = (id: NodeId) => lit.includes(id);
  const center = (id: NodeId) => ({
    x: nodes[id].x + node.width / 2,
    y: nodes[id].y + node.height / 2,
  });

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
      {nodeIds(architecture).map((id) => {
        const { x, y, label, sub, href } = nodes[id];
        const on = isLit(id);
        const box = (
          <g className="group">
            <rect
              x={x}
              y={y}
              width={node.width}
              height={node.height}
              rx={node.radius}
              className={cn(
                "transition-colors duration-300",
                on ? "fill-signal stroke-signal" : "fill-surface-2 stroke-line",
                href && !on && "group-hover:stroke-signal",
              )}
            />
            <text
              x={x + node.paddingX}
              y={y + node.labelBaseline}
              fontSize={node.labelSize}
              className={cn(
                "font-sans font-bold transition-colors duration-300",
                on ? "fill-bg" : "fill-dim",
                href && !on && "group-hover:fill-fg",
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
        return href ? (
          <a key={id} href={href} tabIndex={-1} className="cursor-pointer">
            {box}
          </a>
        ) : (
          <g key={id}>{box}</g>
        );
      })}
    </svg>
  );
}

export function describeLitParts<NodeId extends string>(
  architecture: Architecture<NodeId>,
  lit: readonly NodeId[],
): string[] {
  return lit.map((id) => architecture.nodes[id].label);
}

/** Nodes that open another page, offered as real links next to the diagram. */
export function linkedNodes<NodeId extends string>(
  architecture: Architecture<NodeId>,
): { id: NodeId; label: string; href: string }[] {
  return nodeIds(architecture).flatMap((id) => {
    const { label, href } = architecture.nodes[id];
    return href ? [{ id, label, href }] : [];
  });
}
