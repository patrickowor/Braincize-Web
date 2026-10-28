import type { Metadata } from "next";
import { ProjectGrid } from "@/components/dashboard/ProjectGrid";

export const metadata: Metadata = { title: "Select a project" };

export default function DashboardPage() {
  return (
    <section>
      <h1 className="mb-6 font-poppins text-xl font-semibold text-dash-fg">Select Analysis Project</h1>
      <ProjectGrid />
    </section>
  );
}
