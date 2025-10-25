"use client";
import { Card } from "@/shared/components/dashboard/ui/card";
import { Brain, Video } from "lucide-react";
import { useRouter } from "next/navigation";
import "@/shared/styles/dashboard.css";
import constants from "@/shared/utils/constants";

interface Project {
  id: string;
  name: string;
  description: string;
  icon: typeof Brain;
  route: string;
  inputType: string;
}

const projects: Project[] = [
    {
        id: "brain-scan",
        name: "Brain Scan",
        description:
        "Analyze brain MRI images for atrophy detection and severity assessment",
        icon: Brain,
        route: "/dashboard/brainscan",
        inputType: "Image Analysis",
    },
    {
      id: "lung-detection",
      name: "Lung Detection",
      description:
        "Upload video for comprehensive lung analysis and disease detection",
      icon: Video,
      route: "/dashboard/lungscan",
      inputType: "Video Analysis",
    },
];

const Dashboard = () => {
  const router = useRouter();

  return (
    <div className="dashboard-wrapper">
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">

        <main className="container mx-auto px-6 py-8" style={{paddingTop: constants.HeaderPadding}}>
          <section>
            <h2 className="text-xl font-semibold mb-6 text-foreground">
              Select Analysis Project
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              {projects.map((project) => {
                const IconComponent = project.icon;
                return (
                  <Card
                    key={project.id}
                    className="p-8 cursor-pointer transition-all hover:shadow-elevated hover:border-primary/50 hover:scale-105"
                    onClick={() => router.push(project.route)}
                  >
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-primary to-accent">
                        <IconComponent className="h-12 w-12 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-xl text-foreground mb-2">
                          {project.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {project.description}
                        </p>
                        <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">
                          {project.inputType}
                        </span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
