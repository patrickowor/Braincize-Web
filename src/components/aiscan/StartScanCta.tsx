"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { authLinks } from "@/config/site";
import { useAuth } from "@/providers/AuthProvider";

/**
 * Entry to the scanning tool. The tool itself lives in the dashboard (login, pick a project, pick a
 * model, upload); this panel keeps the Figma drop-zone look and routes people there.
 */
export function StartScanCta() {
  const { user, ready } = useAuth();
  const signedIn = ready && Boolean(user);

  return (
    <div className="mx-auto flex w-[17.5rem] max-w-full flex-col items-center gap-[1rem] lg:w-[53.75rem] lg:gap-[2rem]">
      <div className="flex w-full flex-col items-center rounded-[0.18912rem] border-[0.04731rem] border-dashed border-line bg-surface px-[1rem] py-[3rem] text-center shadow-[0.12612rem_0.12612rem_0.12612rem_0_rgba(24,134,244,0.15)] lg:rounded-[0.75rem] lg:border-[0.1875rem] lg:px-[3rem] lg:py-[6rem] lg:shadow-[0.5rem_0.5rem_0.5rem_0_rgba(24,134,244,0.15)]">
        <span className="lg:hidden">
          <Icon src="/icons/mobile/cloud-upload-aiscan.svg" size={30.264} boxInset="12.5% 8.33%" imgInset="-4.48% -4.03%" flip="xy" />
        </span>
        <span className="hidden lg:block">
          <Icon src="/icons/cloud-upload-aiscan.svg" size={120} boxInset="12.5% 8.33%" imgInset="-4.48% -4.03%" flip="xy" />
        </span>
        <p className="mt-[1rem] font-montserrat text-[0.875rem] leading-[normal] font-medium text-ink lg:mt-[2rem] lg:text-[1.75rem]">
          {signedIn ? "Choose a project and start a scan" : "Sign in to upload and analyze MRI scans"}
        </p>
        <p className="mt-[0.5rem] font-montserrat text-[0.5rem] leading-[normal] font-medium text-ink-faint lg:mt-[0.75rem] lg:text-[1rem]">
          Pick a model, upload many images or a video, and get results per image
        </p>
      </div>
      <Link
        href={signedIn ? "/dashboard" : authLinks.login}
        className="flex h-[2.75rem] w-full items-center justify-center rounded-[0.5rem] bg-brand p-[0.15762rem] font-poppins text-[1rem] leading-[normal] font-semibold text-white lg:h-[4rem] lg:rounded-[0.75rem] lg:text-[1.25rem]"
      >
        {signedIn ? "Go to dashboard" : "Start a scan"}
      </Link>
    </div>
  );
}
