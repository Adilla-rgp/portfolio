import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import { projectPageContent } from "@/content/projectPage";
import { cn } from "@/lib/cn";

export function BackHomeLink({ className }: { className?: string }) {
  return (
    <Link
      href={projectPageContent.homeHref}
      className={cn(buttonVariants({ variant: "outline", size: "lg" }), "self-start", className)}
    >
      {projectPageContent.backHome}
    </Link>
  );
}
