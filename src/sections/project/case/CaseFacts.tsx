import type { ReactNode } from "react";
import { Text } from "@/components/ui/Typography/Text";
import type { CaseFact } from "@/content/caseStudy";
import { projectPageContent } from "@/content/projectPage";
import type { Project } from "@/content/projects";
import { ProjectStatus } from "@/sections/project/ProjectStatus";

interface FactProps {
  label: string;
  children: ReactNode;
}

function Fact({ label, children }: FactProps) {
  return (
    <div className="flex flex-col gap-1">
      <Text as="dt" size="label" tone="muted">
        {label}
      </Text>
      <Text as="dd" size="code" tone="fg">
        {children}
      </Text>
    </div>
  );
}

interface CaseFactsProps {
  project: Project;
  facts: readonly CaseFact[];
}

export function CaseFacts({ project, facts }: CaseFactsProps) {
  return (
    <dl aria-label={projectPageContent.factsLabel} className="grid grid-cols-2 gap-x-10 gap-y-4">
      {facts.map((fact) => (
        <Fact key={fact.label} label={fact.label}>
          {"isStatus" in fact ? (
            <ProjectStatus status={project.status} note={project.statusNote} />
          ) : (
            fact.value
          )}
        </Fact>
      ))}
    </dl>
  );
}
