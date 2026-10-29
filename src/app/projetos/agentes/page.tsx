import type { Metadata } from "next";
import { agentsCase } from "@/content/cases/agentes";
import { getProject, projectMetadata } from "@/lib/projectPage";
import { CaseStudyPage } from "@/sections/project/case/CaseStudyPage";

const project = getProject("agentes");

export const metadata: Metadata = projectMetadata(project, agentsCase.meta);

export default function AgentsPage() {
  return <CaseStudyPage project={project} content={agentsCase} />;
}
