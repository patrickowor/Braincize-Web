import type { Metadata } from "next";
import { PageBand } from "@/components/layout/PageBand";
import { SiteShell } from "@/components/layout/SiteShell";
import { Glow } from "@/components/ui/Glow";
import { termsIntro, termsSections } from "@/content/terms";

export const metadata: Metadata = { title: "Terms of Service" };

const heading =
  "font-poppins text-[1.125rem] leading-[1.75rem] font-semibold tracking-[-0.00022rem] text-ink opacity-85 lg:py-[1rem] lg:text-[2.5rem] lg:leading-[normal] lg:font-medium lg:tracking-normal lg:opacity-100";
const body =
  "mt-[0.5rem] font-poppins text-[1rem] leading-[1.75rem] font-medium tracking-[-0.0002rem] text-ink opacity-85 lg:mt-0 lg:max-w-[68.75rem] lg:text-[1.25rem] lg:leading-[1.6] lg:tracking-[-0.0025rem]";

export default function TermsPage() {
  return (
    <SiteShell newsletter>
      <div className="relative overflow-x-clip pb-[5.9375rem] lg:pb-[10rem]">
        <Glow
          src="/images/bg/ellipse-terms.svg"
          inset="-37.52% -31.95%"
          className="right-[-13.125rem] bottom-0 hidden h-[33.3125rem] w-[39.125rem] lg:block"
        />

        <PageBand title="Terms of Service" />

        <div className="relative mt-[1.5rem] flex flex-col gap-[1.5rem] px-[1rem] lg:mt-[3rem] lg:gap-[2rem] lg:px-[4.5625rem]">
          <section className="flex flex-col max-lg:order-1">
            <h2 className={heading}>{termsIntro.title}</h2>
            <p className={body}>
              {termsIntro.body[0]}
              <span aria-hidden className="hidden h-[2rem] lg:block" /> <span className="lg:block">{termsIntro.body[1]}</span>
            </p>
          </section>

          {termsSections.map((section) => (
            <section
              key={section.title}
              style={{ "--mobile-order": section.mobileOrder } as React.CSSProperties}
              className="flex flex-col max-lg:order-(--mobile-order)"
            >
              <h2 className={heading}>{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className={body}>
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
