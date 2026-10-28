import type { Metadata } from "next";
import { PageBand } from "@/components/layout/PageBand";
import { SiteShell } from "@/components/layout/SiteShell";
import { ResearchList } from "@/components/research/ResearchList";
import { Glow } from "@/components/ui/Glow";

export const metadata: Metadata = { title: "Research" };

/** Re-read the article list from the backend at most this often (seconds). */
export const revalidate = 300;

export default function ResearchPage() {
  return (
    <SiteShell newsletter>
      <div className="relative overflow-x-clip pb-[6.25rem] lg:pb-[10rem]">
        <Glow
          src="/images/bg/ellipse-research.svg"
          inset="-37.52% -31.95%"
          className="bottom-0 left-[-4.8125rem] hidden h-[33.3125rem] w-[39.125rem] lg:block"
        />

        <PageBand title="Research" />

        <ResearchList className="relative mt-[2rem] px-[1rem] lg:mt-[3.5rem] lg:px-[4.5625rem]" />
      </div>
    </SiteShell>
  );
}
