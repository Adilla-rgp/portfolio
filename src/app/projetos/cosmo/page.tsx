import type { Metadata } from "next";
import { cosmoCase } from "@/content/cases/cosmo";
import { getProject, projectMetadata } from "@/lib/projectPage";
import { CaseStudyPage } from "@/sections/project/case/CaseStudyPage";

const project = getProject("cosmo");

export const metadata: Metadata = projectMetadata(project, cosmoCase.meta);

export default function CosmoPage() {
  return <CaseStudyPage project={project} content={cosmoCase} />;
}
