"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { authLinks, mainNav } from "@/config/site";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";

export type HeaderVariant = "home" | "default";

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

const chevron = {
  src: "/icons/chevron-nav.svg",
  size: 24,
  boxInset: "25% 37.5%",
  imgInset: "-6.25% -12.5%",
  rotate: "rotate(-90deg) scaleY(-1)",
};

/**
 * Two header treatments exist in the design:
 *  - "home": Poppins, overlays the hero, has a Log in button (Desktop-1)
 *  - "default": Montserrat, sits above the page content (every other frame)
 */
export function SiteHeader({ variant = "default" }: { variant?: HeaderVariant }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const home = variant === "home";

  const font = home ? "font-poppins" : "font-montserrat font-semibold";

  return (
    <header className={cn("relative z-20", home && "lg:absolute lg:inset-x-0 lg:top-0")}>
      {/* Desktop */}
      <div
        className={cn(
          "mx-auto hidden w-[90rem] items-center gap-[16.375rem] lg:flex",
          home ? "pt-[0.875rem]" : "pt-[1.9375rem] pl-[4.5625rem]",
        )}
      >
        <Link href="/" className="relative block h-[7.55044rem] w-[9.4375rem] shrink-0" aria-label="Braincize home">
          <Image src="/images/shared/logo.png" alt="Braincize" fill unoptimized className="object-cover" priority />
        </Link>

        <div className="flex items-center gap-[2.75rem]">
          <nav aria-label="Main" className="flex w-[41.5rem] items-center justify-center gap-[2.25rem] rounded-[1.5rem] px-[1rem]">
            {mainNav.map((item, i) => {
              const active = isActive(pathname, item.href);
              const isResearch = item.label === "Research";
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center justify-center text-[1.5rem] whitespace-nowrap text-ink",
                    i < 2 ? "p-[0.625rem]" : "p-[1rem]",
                    i === 0 ? "rounded-[1rem]" : "rounded-[0.75rem]",
                    font,
                    home ? (active ? "font-semibold" : "font-medium opacity-50") : !active && "opacity-50",
                  )}
                >
                  {isResearch ? (
                    <span className="flex items-center gap-[0.25rem]">
                      {item.label}
                      <Icon {...chevron} />
                    </span>
                  ) : (
                    item.label
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-[1.75rem]">
            {home && (
              <Link
                href={authLinks.login}
                className="flex h-[3.625rem] w-[6.5625rem] items-center justify-center rounded-[0.75rem] border border-ink p-[0.625rem] text-[1.5rem] font-medium text-ink"
              >
                Log in
              </Link>
            )}
            <Link
              href={authLinks.signup}
              className={cn(
                "flex h-[3.625rem] w-[9.9375rem] items-center justify-center rounded-[0.75rem] bg-brand p-[0.625rem] text-[1.5rem] text-white",
                home ? "font-poppins font-medium" : "font-montserrat font-semibold",
              )}
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden">
        <div className="relative left-[0.5rem] mx-auto flex w-[22.875rem] max-w-full items-center justify-between pt-[0.875rem]">
          <Link href="/" className="relative block h-[4.07481rem] w-[5.09319rem]" aria-label="Braincize home">
            <Image src="/images/shared/logo.png" alt="Braincize" fill unoptimized className="object-cover" priority />
          </Link>
          <Link
            href={authLinks.signup}
            className="flex items-center justify-center rounded-[0.5rem] bg-brand p-[0.625rem] font-poppins text-[0.875rem] font-semibold text-white"
          >
            Sign up
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
          className="mt-[3.375rem] ml-[1.8125rem] block size-[2.25rem] cursor-pointer"
        >
          <Icon src="/icons/mobile/menu.svg" size={36} boxInset="16.67% 12.5%" />
        </button>

        {open && (
          <nav id="mobile-menu" aria-label="Main" className="mx-[1rem] mt-[0.5rem] flex flex-col rounded-[0.5rem] bg-white p-[0.5rem] shadow-[0_0.25rem_0.46875rem_0_rgba(24,134,244,0.1)]">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
                className={cn(
                  "p-[0.5rem] font-poppins text-[1rem] font-medium text-ink",
                  !isActive(pathname, item.href) && "opacity-50",
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link href={authLinks.login} onClick={() => setOpen(false)} className="p-[0.5rem] font-poppins text-[1rem] font-medium text-ink opacity-50">
              Log in
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
