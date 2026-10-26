import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { ResearchList } from "@/components/research/ResearchList";
import { Glow } from "@/components/ui/Glow";

export const metadata: Metadata = { title: "Research" };

export default function ResearchPage() {
  return (
    <SiteShell newsletter>
      {/* Desktop frame keeps the newsletter band at y=2440, so the page is at least that tall. */}
      <div className="relative flow-root overflow-x-clip pb-[6.25rem] lg:min-h-[144.95rem] lg:pb-0">
        <Glow
          src="/images/bg/ellipse-research.svg"
          inset="-37.52% -31.95%"
          className="top-[133.3875rem] left-[-4.8125rem] hidden h-[33.3125rem] w-[39.125rem] lg:block"
        />

        <section className="relative mt-[1rem] h-[8.25rem] bg-sky pt-[2.3125rem] pl-[0.625rem] lg:mt-[3.575rem] lg:h-[15.25rem] lg:p-0">
          <h1 className="font-montserrat text-[1.5rem] leading-[normal] font-bold text-ink lg:absolute lg:top-[3.375rem] lg:left-[2.5625rem] lg:text-[4rem]">
            Research
          </h1>
        </section>

        <ResearchList className="mx-auto mt-[0.9375rem] w-[22.5625rem] max-w-full lg:mx-0 lg:mt-[4.4375rem] lg:ml-[2.5625rem] lg:w-[76.25rem]" />
      </div>
    </SiteShell>
  );
}
