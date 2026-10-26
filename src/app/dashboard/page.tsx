import type { Metadata } from "next";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { projects } from "@/content/projects";

export const metadata: Metadata = { title: "Select a project" };

export default function DashboardPage() {
  return (
    <section>
      <h1 className="mb-6 font-poppins text-xl font-semibold text-dash-fg">Select Analysis Project</h1>
      <div className="grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
