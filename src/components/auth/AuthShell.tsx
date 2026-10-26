import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SiteShell } from "@/components/layout/SiteShell";

interface AuthShellProps {
  /** Heading and blurb shown on the brand panel beside the form. */
  heading: string;
  blurb: string;
  title: string;
  children: React.ReactNode;
  /** The "have an account / need an account" switch under the form. */
  switchPrompt: string;
  switchLabel: string;
  switchHref: string;
}

const perks = ["Choose from multiple AI analysis models", "Upload MRI images or a scan video", "Get a severity result for every image"];

/**
 * Split auth screen: brand panel on the left (desktop only), form on the right.
 * Uses the site's tokens, so it follows the light/dark theme with the rest of the pages.
 */
export function AuthShell({ heading, blurb, title, children, switchPrompt, switchLabel, switchHref }: AuthShellProps) {
  return (
    <SiteShell>
      <section className="relative overflow-clip px-[1rem] py-[1.5rem] lg:px-[4.5625rem] lg:py-[2.5rem]">
        <div aria-hidden className="pointer-events-none absolute -top-[10rem] -left-[10rem] size-[32rem] rounded-full bg-brand/20 blur-[7rem]" />
        <div aria-hidden className="pointer-events-none absolute -right-[10rem] -bottom-[12rem] size-[32rem] rounded-full bg-sky/70 blur-[7rem]" />

        <div className="relative mx-auto grid w-full max-w-[70rem] overflow-hidden rounded-[1.5rem] bg-surface shadow-[0_0.5rem_2rem_0_rgba(24,134,244,0.18)] lg:grid-cols-2">
          <aside className="relative hidden flex-col justify-center overflow-hidden bg-gradient-to-br from-brand to-[#040a40] p-[3rem] text-white lg:flex">
            <Image src="/images/home/neuroscience.png" alt="" fill unoptimized className="object-cover opacity-20 mix-blend-luminosity" />
            <div className="relative">
              <p className="font-montserrat text-[0.875rem] font-semibold tracking-[0.2em] uppercase opacity-80">Braincize</p>
              <h2 className="mt-[1rem] font-montserrat text-[2.25rem] leading-[1.2] font-bold">{heading}</h2>
              <p className="mt-[1rem] font-poppins text-[1.0625rem] leading-[1.6] opacity-90">{blurb}</p>
              <ul className="mt-[2rem] flex flex-col gap-[0.875rem]">
                {perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-[0.75rem] font-poppins text-[0.9375rem]">
                    <CheckCircle2 className="size-[1.25rem] shrink-0" aria-hidden />
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="flex flex-col justify-center px-[1.5rem] py-[2rem] lg:px-[3.5rem] lg:py-[3rem]">
            <h1 className="font-montserrat text-[1.75rem] leading-[1.2] font-bold text-navy">{title}</h1>
            <p className="mt-[0.5rem] mb-[1.5rem] font-poppins text-[0.9375rem] text-ink opacity-70 lg:hidden">{blurb}</p>
            <div className="mb-[1.5rem] hidden lg:block" />
            {children}
            <p className="mt-[1.5rem] text-center font-poppins text-[0.9375rem] text-ink">
              {switchPrompt}{" "}
              <Link href={switchHref} className="font-semibold text-brand hover:underline">
                {switchLabel}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
