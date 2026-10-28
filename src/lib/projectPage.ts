import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects, type Project } from "@/content/projects";
import { pageMetadata } from "@/lib/metadata";

export type ProjectId = (typeof projects)[number]["id"];

export function getProject(id: ProjectId): Project {
  const project = projects.find((candidate) => candidate.id === id);
  if (!project) throw new Error(`Unknown project: ${id}`);
  return project;
}

/**
 * Unpublished case pages open in development only, so they can be reviewed
 * before `isPublished` flips; in production they are a 404.
 */
export function ensureProjectPage(project: Project): void {
  if (!project.isPublished && process.env.NODE_ENV === "production") notFound();
}

interface ProjectMetadataOptions {
  title: string;
  description: string;
}

export function projectMetadata(
  project: Project,
  { title, description }: ProjectMetadataOptions,
): Metadata {
  return {
    ...pageMetadata({ path: project.route, title, description }),
    ...(!project.isPublished && { robots: { index: false, follow: false } }),
  };
}
