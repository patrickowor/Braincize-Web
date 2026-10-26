import type { Metadata } from "next";
import { AiScanHero } from "@/components/aiscan/AiScanHero";
import { StartScanCta } from "@/components/aiscan/StartScanCta";
import { SiteShell } from "@/components/layout/SiteShell";

export const metadata: Metadata = { title: "AI Scan" };

export default function AiScanPage() {
  return (
    <SiteShell>
      <AiScanHero />
      <div className="mt-[4.75rem] pb-[6.25rem] lg:mt-[6rem] lg:pb-[10rem]">
        <StartScanCta />
      </div>
    </SiteShell>
  );
}
