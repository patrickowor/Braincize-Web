"use client";

import { Brain, Wind } from "lucide-react";
import Link from "next/link";
import { Badge, Card } from "@/components/ui/dashboard";
import type { Project, ProjectIcon } from "@/content/projects";
import { cn } from "@/lib/cn";

const icons: Record<ProjectIcon, typeof Brain> = { brain: Brain, lungs: Wind };

/** One selectable project on the dashboard. Unavailable projects are listed but inert. */
export function ProjectCard({ project }: { project: Project }) {
  const Icon = icons[project.icon];

  const body = (
    <Card
      className={cn(
        "flex h-full flex-col items-center space-y-4 p-8 text-center transition-all",
        project.available
          ? "cursor-pointer hover:scale-105 hover:border-dash-primary/50 hover:shadow-dash-elevated"
          : "opacity-70",
      )}
    >
      <div className="rounded-xl bg-gradient-to-br from-dash-primary to-dash-accent p-4">
        <Icon className="h-12 w-12 text-white" aria-hidden />
      </div>
      <div>
        <h3 className="mb-2 font-poppins text-xl font-semibold text-dash-fg">{project.name}</h3>
        <p className="mb-3 font-poppins text-sm text-dash-muted-fg">{project.description}</p>
        <Badge className="border-transparent bg-dash-accent/20 text-dash-primary">
          {project.available ? project.inputType : "Coming soon"}
        </Badge>
      </div>
    </Card>
  );

  return project.available ? (
    <Link href={project.route} className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dash-primary">
      {body}
    </Link>
  ) : (
    <div aria-disabled>{body}</div>
  );
}
