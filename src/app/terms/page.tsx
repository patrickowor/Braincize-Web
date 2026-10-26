import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { Glow } from "@/components/ui/Glow";
import { cn } from "@/lib/cn";
import { rem } from "@/lib/rem";
import { termsIntro, termsSections } from "@/content/terms";

export const metadata: Metadata = { title: "Terms of Service" };

const heading =
  "font-poppins text-[1.125rem] leading-[1.75rem] font-semibold tracking-[-0.00022rem] text-ink opacity-85 lg:w-[30.1875rem] lg:py-[1rem] lg:text-[3rem] lg:leading-[normal] lg:font-medium lg:tracking-normal lg:whitespace-nowrap lg:opacity-100";
const body =
  "mt-[0.5rem] font-poppins text-[1rem] leading-[1.75rem] font-medium tracking-[-0.0002rem] text-ink opacity-85 lg:mt-0 lg:w-[81.875rem] lg:text-[1.5rem] lg:leading-[normal] lg:tracking-[-0.003rem]";

export default function TermsPage() {
  return (
    <SiteShell newsletter>
      <div className="relative overflow-x-clip pb-[5.9375rem] lg:pb-[15.5rem]">
        <Glow
          src="/images/bg/ellipse-terms.svg"
          inset="-37.52% -31.95%"
          className="top-[131.575rem] left-[calc(50%+15.5625rem)] hidden h-[33.3125rem] w-[39.125rem] lg:block"
        />

        <section className="relative mt-[2.75rem] h-[8.375rem] bg-sky pt-[2.3125rem] pl-[0.5rem] lg:mt-[3.575rem] lg:h-[15.25rem] lg:p-0">
          <h1 className="font-montserrat text-[1.5rem] leading-[normal] font-bold text-ink lg:absolute lg:top-[4.8125rem] lg:left-[3.1875rem] lg:w-[45.1875rem] lg:text-[4rem]">
            Terms of Service
          </h1>
        </section>

        <div className="relative mx-auto mt-[1.1875rem] flex w-[23.25rem] max-w-full flex-col gap-[1.5rem] lg:mx-0 lg:mt-[4.8125rem] lg:ml-[2.5625rem] lg:w-[83.125rem] lg:gap-[2rem]">
          <section className="flex flex-col max-lg:order-1 lg:h-[20.4375rem] lg:p-[0.625rem]">
            <h2 className={heading}>{termsIntro.title}</h2>
            <p className={body}>
              {termsIntro.body[0]}
              <span aria-hidden className="hidden h-[2.25rem] lg:block" /> <span className="lg:block">{termsIntro.body[1]}</span>
            </p>
          </section>

          {termsSections.map((section) => (
            <section
              key={section.title}
              style={{ "--mobile-order": section.mobileOrder, "--min-h": rem(section.minHeight) } as React.CSSProperties}
              className="flex max-lg:order-(--mobile-order) flex-col lg:ml-[0.375rem] lg:min-h-(--min-h)"
            >
              <h2 className={heading}>{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className={cn(body, section.narrow && "lg:w-[50.0625rem]")}>
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
