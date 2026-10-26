import { FaqSection } from "@/components/faq/FaqSection";
import { FounderSpotlight } from "@/components/home/FounderSpotlight";
import { Hero } from "@/components/home/Hero";
import { KeyFeatures } from "@/components/home/KeyFeatures";
import { Neuroscience } from "@/components/home/Neuroscience";
import { Testimonials } from "@/components/home/Testimonials";
import { WhatIs } from "@/components/home/WhatIs";
import { SiteShell } from "@/components/layout/SiteShell";
import { Glow } from "@/components/ui/Glow";

export default function HomePage() {
  return (
    <SiteShell headerVariant="home">
      <Hero />
      <WhatIs />
      <div className="relative z-10 flex flex-col overflow-x-clip px-[1rem] max-lg:mt-[5.5rem] max-lg:gap-[3.375rem] max-lg:pb-[5.625rem] lg:px-0 lg:pb-[9.1875rem]">
        <KeyFeatures className="lg:mt-[3.625rem]" />
        <Neuroscience className="max-lg:hidden lg:mt-[2.6875rem]" />
        <FounderSpotlight className="max-lg:hidden lg:mt-[9.625rem]" />
        <Testimonials className="max-lg:order-last lg:mt-[6rem]" />
        <FaqSection className="lg:mt-[9.8125rem]" />
        <Glow
          src="/images/bg/ellipse-7.svg"
          inset="-124.22% -37.45%"
          className="bottom-[-5.3125rem] left-[calc(50%+30.6875rem)] hidden h-[10.0625rem] w-[33.375rem] lg:block"
        />
      </div>
    </SiteShell>
  );
}
