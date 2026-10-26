import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { SiteShell } from "@/components/layout/SiteShell";
import { contactLinks } from "@/content/contact";

export const metadata: Metadata = { title: "Contact us" };

export default function ContactPage() {
  return (
    <SiteShell newsletter>
      {/* Desktop frame keeps the newsletter band at y=1550, so the page is at least that tall. */}
      <div className="lg:flow-root lg:min-h-[89.325rem]">
        <section className="relative mt-[2.75rem] h-[8.625rem] bg-sky px-[0.875rem] pt-[1.9375rem] lg:mt-[3.5125rem] lg:h-[14.625rem] lg:p-0">
          <h1 className="font-montserrat text-[1.5rem] leading-[normal] font-bold text-ink lg:absolute lg:top-[1.375rem] lg:left-[-1.1875rem] lg:h-[6.1875rem] lg:w-[26.9375rem] lg:text-center lg:text-[4rem]">
            Contact us
          </h1>
          <p className="mt-[1rem] font-poppins text-[0.875rem] leading-[normal] font-medium text-ink opacity-85 lg:absolute lg:top-[7rem] lg:left-[1.875rem] lg:mt-0 lg:text-[1.5rem] lg:leading-[1.875rem] lg:whitespace-nowrap lg:opacity-100">
            Social links and articles
            <br />
            <a href={contactLinks.twitter.href} target="_blank" rel="noreferrer" className="lg:underline">
              {contactLinks.twitter.label}
            </a>{" "}
            <a href={contactLinks.researchGate.href} target="_blank" rel="noreferrer" className="lg:underline">
              | {contactLinks.researchGate.label} |
            </a>{" "}
            {contactLinks.legal}
          </p>
        </section>

        <ContactForm className="mt-[3.4375rem] ml-[1.1875rem] w-[22.6875rem] max-w-full pb-[6rem] lg:mt-[9.25rem] lg:ml-[4.125rem] lg:w-[48rem] lg:pb-0" />
      </div>
    </SiteShell>
  );
}
