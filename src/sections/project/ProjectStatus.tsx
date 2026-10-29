import { StatusDot } from "@/components/ui/StatusDot";
import { Text } from "@/components/ui/Typography/Text";
import { projectStatusText, type ProjectStatus as Status } from "@/content/projects";
import { cn } from "@/lib/cn";

interface ProjectStatusProps {
  status: Status;
  note?: string;
  className?: string;
}

/** Green only for what is live; every other status stays neutral. */
export function ProjectStatus({ status, note, className }: ProjectStatusProps) {
  const isLive = status === "producao";
  return (
    <Text
      as="span"
      size="code"
      tone={isLive ? "ok" : "muted"}
      className={cn("inline-flex items-center gap-2", className)}
    >
      <StatusDot tone={isLive ? "ok" : "muted"} />
      {projectStatusText({ status, statusNote: note })}
    </Text>
  );
}
