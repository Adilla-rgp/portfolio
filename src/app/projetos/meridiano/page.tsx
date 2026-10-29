import type { Metadata } from "next";
import { meridianoCase } from "@/content/cases/meridiano";
import { getProject, projectMetadata } from "@/lib/projectPage";
import { CaseStudyPage } from "@/sections/project/case/CaseStudyPage";

const project = getProject("meridiano");

export const metadata: Metadata = projectMetadata(project, meridianoCase.meta);

export default function MeridianoPage() {
  return <CaseStudyPage project={project} content={meridianoCase} />;
}
