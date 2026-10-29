"use client";

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Typography/Heading";
import { Text } from "@/components/ui/Typography/Text";
import {
  initialStackSelection,
  stackContent,
  type StackProject,
  type StackSelection,
  type StackTech,
} from "@/content/stack";
import { cn } from "@/lib/cn";
import {
  getStackLinks,
  isLinkOn,
  isProjectOn,
  isSameSelection,
  isTechOn,
  linkPath,
} from "@/lib/stackMap";

interface StackMapProps {
  techs: readonly StackTech[];
  projects: readonly StackProject[];
}

type LinkGeometry = Record<string, string>;

function centerY(element: HTMLElement, originTop: number): number {
  const rect = element.getBoundingClientRect();
  return rect.top - originTop + rect.height / 2;
}

/**
 * Technologies ↔ projects. One DOM for every width: from `sm` up the three
 * columns sit side by side and an SVG between them draws the links, measured
 * from the buttons; below it the SVG is hidden and the columns stack, so the
 * linked items are told apart by their highlight alone. No horizontal scroll.
 */
export function StackMap({ techs, projects }: StackMapProps) {
  const [selection, setSelection] = useState<StackSelection>(initialStackSelection);
  const [geometry, setGeometry] = useState<LinkGeometry>({});
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const nodesRef = useRef(new Map<string, HTMLElement>());

  const links = useMemo(() => getStackLinks(techs), [techs]);

  const measure = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    if (rect.width === 0) {
      setGeometry({});
      return;
    }
    const next: LinkGeometry = {};
    for (const link of links) {
      const tech = nodesRef.current.get(`tech:${link.tech}`);
      const project = nodesRef.current.get(`project:${link.project}`);
      if (!tech || !project) continue;
      next[link.key] = linkPath(0, centerY(tech, rect.top), rect.width, centerY(project, rect.top));
    }
    setGeometry(next);
  }, [links]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => observer.disconnect();
  }, [measure]);

  const registerNode = (key: string) => (element: HTMLElement | null) => {
    if (element) nodesRef.current.set(key, element);
    else nodesRef.current.delete(key);
  };

  const select = (next: StackSelection) => {
    setSelection((current) => (isSameSelection(current, next) ? current : next));
  };

  const selectionHandlers = (next: StackSelection) => ({
    onClick: () => select(next),
    onFocus: () => select(next),
    onMouseEnter: () => select(next),
  });

  const summary = useMemo(() => {
    if (selection.kind === "tech") {
      const tech = techs.find((item) => item.name === selection.id);
      const names = projects
        .filter((project) => tech?.usedIn.includes(project.id))
        .map((project) => project.label);
      return stackContent.describeTech(selection.id, names);
    }
    const project = projects.find((item) => item.id === selection.id);
    const names = techs.filter((tech) => tech.usedIn.includes(selection.id)).map((tech) => tech.name);
    return stackContent.describeProject(project?.label ?? selection.id, names);
  }, [selection, techs, projects]);

  // Selected links are drawn last so they sit on top of the idle ones.
  const orderedLinks = useMemo(
    () => [...links].sort((a, b) => Number(isLinkOn(a, selection)) - Number(isLinkOn(b, selection))),
    [links, selection],
  );

  return (
    <div ref={rootRef} className="flex flex-col gap-8 sm:flex-row sm:gap-0">
      <div
        role="group"
        aria-label={stackContent.techsLabel}
        className="flex flex-wrap gap-2 sm:w-44 sm:shrink-0 sm:flex-col md:w-50"
      >
        {techs.map((tech) => {
          const isOn = isTechOn(tech, selection);
          const isSelected = selection.kind === "tech" && selection.id === tech.name;
          return (
            <Button
              key={tech.name}
              ref={registerNode(`tech:${tech.name}`)}
              variant={isOn ? "signal" : "outline"}
              aria-pressed={isSelected}
              className={cn("normal-case sm:justify-start", !isOn && "bg-surface text-muted")}
              {...selectionHandlers({ kind: "tech", id: tech.name })}
            >
              {tech.name}
            </Button>
          );
        })}
      </div>

      <svg ref={svgRef} aria-hidden="true" className="hidden min-w-16 flex-1 sm:block">
        {orderedLinks.map((link) => {
          const d = geometry[link.key];
          if (!d) return null;
          const isOn = isLinkOn(link, selection);
          return (
            <path
              key={link.key}
              d={d}
              fill="none"
              className={cn(
                "transition-[stroke,opacity] duration-300",
                isOn
                  ? "stroke-dash-flow animate-dash-flow stroke-signal stroke-2"
                  : "stroke-line-strong stroke-1 opacity-60",
              )}
            />
          );
        })}
      </svg>

      <div
        role="group"
        aria-label={stackContent.projectsLabel}
        className="flex flex-col gap-2 sm:w-56 sm:shrink-0 sm:justify-between lg:w-75"
      >
        {projects.map((project) => {
          const isOn = isProjectOn(project, selection, techs);
          const isSelected = selection.kind === "project" && selection.id === project.id;
          return (
            <Button
              key={project.id}
              ref={registerNode(`project:${project.id}`)}
              variant={isOn ? "lit" : "outline"}
              aria-pressed={isSelected}
              className={cn(
                "min-h-18 w-full flex-col items-start gap-1 rounded-item px-5 text-left normal-case whitespace-normal",
                !isOn && "bg-surface text-dim",
              )}
              {...selectionHandlers({ kind: "project", id: project.id })}
            >
              <Heading as="span" size="node" tone="inherit">
                {project.label}
              </Heading>
              <Text as="span" size="label" tone={isOn ? "inherit" : "muted"}>
                {project.sub}
              </Text>
              {project.body && (
                <Text as="span" tone={isOn ? "inherit" : "muted"} className="font-normal">
                  {project.body}
                </Text>
              )}
            </Button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        {summary}
      </p>
    </div>
  );
}
