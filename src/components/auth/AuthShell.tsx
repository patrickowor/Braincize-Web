import Link from "next/link";
import { SiteShell } from "@/components/layout/SiteShell";

interface AuthShellProps {
  /** Heading and blurb shown on the dark panel beside the form. */
  heading: string;
  blurb: string;
  title: string;
  children: React.ReactNode;
  /** The "have an account / need an account" switch under the form. */
  switchPrompt: string;
  switchLabel: string;
  switchHref: string;
}

/** Split auth screen from the previous design: photo with an overlay panel, form card on the right. */
export function AuthShell({ heading, blurb, title, children, switchPrompt, switchLabel, switchHref }: AuthShellProps) {
  return (
    <SiteShell>
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[url('/images/home/neuroscience.png')] bg-cover bg-center bg-no-repeat lg:min-h-[52rem]">
        <div className="hidden flex-1 min-[37.5625rem]:block">
          <div className="m-[3.125rem] rounded-[0.5rem] bg-[#052142] px-[1.875rem] py-[1.25rem] text-center">
            <h2 className="mb-[0.9375rem] font-poppins text-[1.875rem] leading-[1.3] font-semibold text-white">{heading}</h2>
            <p className="font-poppins text-[1.125rem] text-white">{blurb}</p>
          </div>
        </div>

        <div className="flex w-full flex-1 items-center justify-center self-stretch bg-transparent px-[1.25rem] py-[2.5rem] min-[37.5625rem]:bg-[#f5f6fa] min-[37.5625rem]:max-lg:rounded-l-[0.625rem] lg:rounded-l-[1.875rem]">
          <div className="w-full max-w-[31.25rem] rounded-[0.5rem] bg-white px-[1.5625rem] py-[1.875rem] shadow-[0_0.25rem_0.75rem_rgba(0,0,0,0.1)]">
            <h1 className="mb-[1.25rem] font-poppins text-[1.75rem] font-semibold text-[#1a1f4b] max-[60.5rem]:text-center">{title}</h1>
            {children}

            <div className="mt-[1.25rem] mb-[0.625rem] flex items-center gap-[0.625rem] text-center font-poppins text-[#888]">
              <span className="h-px flex-1 bg-[#ddd]" />
              or
              <span className="h-px flex-1 bg-[#ddd]" />
            </div>
            <p className="mb-[0.625rem] text-center font-poppins text-[0.9375rem] text-[#555]">{switchPrompt}</p>
            <Link
              href={switchHref}
              className="flex items-center justify-center rounded-[0.25rem] border border-[#3b5998] bg-white p-[0.625rem] font-poppins text-[0.9375rem] text-[#3b5998] hover:border-2 hover:border-black"
            >
              {switchLabel}
            </Link>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
