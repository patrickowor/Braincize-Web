"use client";

import { Activity, Brain, Wind } from "lucide-react";
import Link from "next/link";
import { Badge, Card } from "@/components/ui/dashboard";
import type { ModelCategory } from "@/lib/api/types";
import { cn } from "@/lib/cn";

/** Icon names the backend can set on a category. Anything else gets the generic one. */
const icons: Record<string, typeof Brain> = { brain: Brain, lungs: Wind };

/** One selectable project on the dashboard. A category with no models yet is listed but inert. */
export function ProjectCard({ category }: { category: ModelCategory }) {
  const Icon = (category.icon && icons[category.icon]) || Activity;
  const available = category.modelCount > 0;

  const body = (
    <Card
      className={cn(
        "flex h-full flex-col items-center space-y-4 p-8 text-center transition-all",
        available ? "cursor-pointer hover:scale-105 hover:border-dash-primary/50 hover:shadow-dash-elevated" : "opacity-70",
      )}
    >
      <div className=" bg-gradient-to-br from-dash-primary to-dash-accent p-4">
        <Icon className="h-12 w-12 text-white" aria-hidden />
      </div>
      <div>
        <h3 className="mb-2 font-poppins text-xl font-semibold text-dash-fg">{category.name}</h3>
        <p className="mb-3 font-poppins text-sm text-dash-muted-fg">{category.description}</p>
        <Badge className="border-transparent bg-dash-accent/20 text-dash-primary">
          {available ? (category.inputLabel ?? "Analysis") : "Coming soon"}
        </Badge>
      </div>
    </Card>
  );

  return available ? (
    <Link
      href={`/dashboard/${encodeURIComponent(category.id)}`}
      className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dash-primary"
    >
      {body}
    </Link>
  ) : (
    <div aria-disabled>{body}</div>
  );
}
