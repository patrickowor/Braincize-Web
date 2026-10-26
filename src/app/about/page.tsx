import type { Metadata } from "next";
import { AboutHero, MessageSection, MissionSection, ResearchFocusSection } from "@/components/about/AboutSections";
import { SiteShell } from "@/components/layout/SiteShell";
import { Glow } from "@/components/ui/Glow";

export const metadata: Metadata = { title: "About us" };

export default function AboutPage() {
  return (
    <SiteShell headerOffset={{ left: 73, top: 31 }}>
      <div className="relative overflow-x-clip pb-[6.25rem] lg:pb-[3.875rem]">
        <Glow
          src="/images/bg/ellipse-about-1.svg"
          inset="-37.52% -31.95%"
          className="top-[160.25rem] left-[calc(50%-63.9375rem)] hidden h-[33.3125rem] w-[39.125rem] lg:block"
        />

        <div className="mt-[1.25rem] lg:mt-[4.625rem]">
          <AboutHero />
        </div>

        <div className="mt-[2.75rem] flex flex-col gap-[1.625rem] max-lg:px-[1.0625rem] lg:mt-[12.75rem] lg:gap-0">
          <MissionSection />
        </div>

        <div className="mt-[2.75rem] max-lg:px-[1.0625rem] lg:mt-[9.4375rem]">
          <ResearchFocusSection />
        </div>

        <div className="lg:mt-[11.9375rem]">
          <MessageSection />
        </div>
      </div>
    </SiteShell>
  );
}
