import type { IconFlip } from "@/components/ui/Icon";

interface FeatureIcon {
  src: string;
  boxInset: string;
  imgInset: string;
  flip: IconFlip;
}

export interface Feature {
  title: string;
  description: string;
  /** Desktop (120px) and mobile (64px) icon exports differ in stroke weight, so each has its own asset. */
  icon: { desktop: FeatureIcon; mobile: FeatureIcon };
}

export const features: Feature[] = [
  {
    title: "Upload Scan",
    description: "Upload your MRI scan securely. Our platform uses encrypted, HIPAA-compliant methods.",
    icon: {
      desktop: { src: "/icons/cloud-upload.svg", boxInset: "12.5% 8.33%", imgInset: "-4.48% -4.03%", flip: "xy" },
      mobile: { src: "/icons/mobile/cloud-upload.svg", boxInset: "12.5% 8.33%", imgInset: "-3.12% -2.81%", flip: "xy" },
    },
  },
  {
    title: "AI Analysis",
    description: "Our AI analyzes the scan for signs of brain volume loss and neurodegeneration.",
    icon: {
      desktop: { src: "/icons/brain-02.svg", boxInset: "8.33%", imgInset: "-4.03%", flip: "xy" },
      mobile: { src: "/icons/mobile/brain-02.svg", boxInset: "8.33%", imgInset: "-2.81%", flip: "xy" },
    },
  },
  {
    title: "Report & Insights",
    description: "You receive a detailed report with easy-to-understand insights and next steps",
    icon: {
      desktop: { src: "/icons/file-01.svg", boxInset: "8.33% 14.58%", imgInset: "-4.03% -4.74%", flip: "y" },
      mobile: { src: "/icons/mobile/file-01.svg", boxInset: "8.33% 14.58%", imgInset: "-2.81% -3.31%", flip: "y" },
    },
  },
];

export interface Testimonial {
  quote: string;
  author: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "“After years of taking hits on the field, I finally found answers. Braincize gave me the clarity I didn’t know I needed. The AI analysis made my MRI results feel personal, not clinical.”",
    author: "— Sarah M. – Retired Athlete",
  },
  {
    quote:
      "“I’ve been struggling with memory lapses and headaches since returning home. Braincize helped identify patterns that traditional scans missed. It’s life-changing to feel seen and supported!”",
    author: "— Marcus J. (Veteran, U.S. Army)",
  },
  {
    quote:
      "“We caught the early signs of my mother’s brain volume loss through Braincize. Their early insights gave us time to prepare and act — and that made all the difference.”",
    author: "— Olivia R. – Daughter of Alzheimer’s Patient",
  },
];
