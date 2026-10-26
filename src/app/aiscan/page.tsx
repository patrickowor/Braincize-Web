import type { Metadata } from "next";
import { AiScanExperience } from "@/components/aiscan/AiScanExperience";
import { AiScanHero } from "@/components/aiscan/AiScanHero";
import { ContactForm } from "@/components/contact/ContactForm";
import { FaqSection } from "@/components/faq/FaqSection";
import { SiteShell } from "@/components/layout/SiteShell";

export const metadata: Metadata = { title: "AI Scan" };

export default function AiScanPage() {
  return (
    <SiteShell headerOffset={{ left: 64, top: 31 }}>
      {/* Desktop frames keep the footer at y=3233, so the page is at least that tall. */}
      <div className="flow-root pb-[6.25rem] lg:min-h-[192.5625rem] lg:pb-0">
        <div className="mt-[2.8125rem] lg:mt-[4.1875rem]">
          <AiScanHero />
        </div>

        <AiScanExperience
          afterResult={
            <>
              <FaqSection
                className="mt-[7.5625rem] px-[1rem] lg:mt-[19.625rem] lg:px-0"
                titleClassName="lg:w-[52.6875rem] lg:text-[2.25rem]"
                listClassName="lg:w-[70.8125rem] lg:-translate-x-[1.96875rem]"
              />
              <ContactForm className="mx-auto mt-[1.75rem] w-[22.375rem] max-w-full lg:mt-[12.5rem] lg:ml-[7.625rem] lg:w-[48rem]" />
            </>
          }
        />
      </div>
    </SiteShell>
  );
}
