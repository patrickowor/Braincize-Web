import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { PageBand } from "@/components/layout/PageBand";
import { SiteShell } from "@/components/layout/SiteShell";
import { contactLinks } from "@/content/contact";

export const metadata: Metadata = { title: "Contact us" };

export default function ContactPage() {
  return (
    <SiteShell newsletter>
      <PageBand title="Contact us">
        <p className="mt-[1rem] font-poppins text-[0.875rem] leading-[normal] font-medium text-ink opacity-85 lg:mt-[0.75rem] lg:text-[1.25rem] lg:leading-[1.875rem] lg:opacity-100">
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
      </PageBand>

      <ContactForm className="mt-[3rem] max-w-full px-[1rem] pb-[6rem] lg:mt-[4.5rem] lg:w-[58.1875rem] lg:px-[4.5625rem] lg:pb-[10rem]" />
    </SiteShell>
  );
}
