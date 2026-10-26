export type ProjectIcon = "brain" | "lungs";

export interface Project {
  id: string;
  name: string;
  description: string;
  icon: ProjectIcon;
  route: string;
  /** Short label under the description. */
  inputType: string;
  /** False until the project's models and page exist; it is listed but not clickable. */
  available: boolean;
}

/** Add a project here and it appears on the dashboard picker. */
export const projects: Project[] = [
  {
    id: "brain-scan",
    name: "Brain Scan",
    description: "Analyze brain MRI images or video for atrophy detection and severity assessment",
    icon: "brain",
    route: "/dashboard/brainscan",
    inputType: "Image & Video Analysis",
    available: true,
  },
  {
    id: "lung-scan",
    name: "Lung Scan",
    description: "Upload scans for comprehensive lung analysis and disease detection",
    icon: "lungs",
    route: "/dashboard/lungscan",
    inputType: "Video Analysis",
    available: false,
  },
];
