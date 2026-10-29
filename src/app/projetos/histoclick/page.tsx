import type { Metadata } from "next";
import { histoclickCase } from "@/content/cases/histoclick";
import { getProject, projectMetadata } from "@/lib/projectPage";
import { CaseStudyPage } from "@/sections/project/case/CaseStudyPage";

const project = getProject("histoclick");

export const metadata: Metadata = projectMetadata(project, histoclickCase.meta);

export default function HistoclickPage() {
  return <CaseStudyPage project={project} content={histoclickCase} />;
}
