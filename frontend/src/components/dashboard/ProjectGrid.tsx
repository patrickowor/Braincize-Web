"use client";

import { Card } from "@/components/ui/dashboard";
import { useRemote } from "@/hooks/useRemote";
import { api } from "@/lib/api";
import { ProjectCard } from "./ProjectCard";

/** The dashboard picker: one card per category the backend lists. */
export function ProjectGrid() {
  const { data: categories, loading, error } = useRemote(() => api.catalog.categories(), "categories");

  if (loading) {
    return (
      <p role="status" className="font-poppins text-sm text-dash-muted-fg">
        Loading projects...
      </p>
    );
  }
  if (error || !categories) {
    return (
      <Card className="max-w-4xl p-6">
        <p role="alert" className="font-poppins text-sm text-dash-muted-fg">
          {error ?? "Projects could not be loaded."}
        </p>
      </Card>
    );
  }
  if (!categories.length) {
    return <p className="font-poppins text-sm text-dash-muted-fg">No projects have been set up yet.</p>;
  }

  return (
    <div className="grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
      {categories.map((category) => (
        <ProjectCard key={category.id} category={category} />
      ))}
    </div>
  );
}
