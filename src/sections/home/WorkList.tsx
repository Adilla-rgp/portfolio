"use client";

import { useId, useMemo, useState } from "react";
import { useLens } from "@/components/lens/LensProvider";
import { Tag } from "@/components/ui/Tag";
import { Heading } from "@/components/ui/Typography/Heading";
import { Text } from "@/components/ui/Typography/Text";
import type { Lens } from "@/content/lens";
import {
  getProjectHref,
  isExternalHref,
  listedProjects,
  projectStatusLabel,
} from "@/content/projects";
import { cn } from "@/lib/cn";

const INDEX_DIGITS = 2;

interface OpenItem {
  lens: Lens;
  index: number;
}

export function WorkList() {
  const { lens } = useLens();
  const baseId = useId();
  // Scoped to the lens it was set under, so switching lens reopens the first
  // item without an effect.
  const [openItem, setOpenItem] = useState<OpenItem>({ lens, index: 0 });
  const openIndex = openItem.lens === lens ? openItem.index : 0;

  const ordered = useMemo(
    () => [...listedProjects].sort((a, b) => a.order[lens] - b.order[lens]),
    [lens],
  );

  return (
    <ul className="border-t border-line-strong">
      {ordered.map((project, index) => {
        const isOpen = index === openIndex;
        const { description, tags } = project.copy[lens];
        const nameId = `${baseId}-${project.id}-name`;
        const descriptionId = `${baseId}-${project.id}-description`;
        const open = () => setOpenItem({ lens, index });
        const href = getProjectHref(project);
        const externalProps = isExternalHref(href)
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {};

        return (
          <li key={project.id}>
            <a
              href={href}
              {...externalProps}
              aria-labelledby={nameId}
              aria-describedby={descriptionId}
              onMouseEnter={open}
              onFocus={open}
              className={cn(
                "block border-b border-line-strong py-7 text-fg hover:text-fg",
                isOpen && "bg-linear-to-r from-signal/8 to-transparent to-60%",
              )}
            >
              <span className="flex flex-wrap items-baseline gap-x-8 gap-y-3">
                <Text
                  as="span"
                  size="monoLg"
                  tone={isOpen ? "signal" : "muted"}
                  className="min-w-10"
                >
                  {String(index + 1).padStart(INDEX_DIGITS, "0")}
                </Text>
                <Heading
                  as="span"
                  id={nameId}
                  size="project"
                  tone={isOpen ? "default" : "dim"}
                  className="transition-colors duration-300"
                >
                  {project.name}
                </Heading>
                <Text as="span" size="label" tone="muted" className="ml-auto">
                  {projectStatusLabel[project.status]}
                </Text>
              </span>

              <span className={cn("collapsible", isOpen && "collapsible-open")}>
                <span className="overflow-hidden">
                  <span className="flex flex-wrap gap-x-12 gap-y-6 pt-5 pb-1 md:pl-18">
                    <Text as="span" size="lg" id={descriptionId} className="grow-2 basis-105">
                      {description}
                    </Text>
                    <span className="flex grow basis-60 flex-wrap content-start gap-2">
                      {tags.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </span>
                  </span>
                </span>
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
