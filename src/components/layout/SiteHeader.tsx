"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { authLinks, mainNav } from "@/config/site";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import { useAuth } from "@/providers/AuthProvider";

export type HeaderVariant = "home" | "default";

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

const chevron = {
  src: "/icons/chevron-nav.svg",
  size: 20,
  boxInset: "25% 37.5%",
  imgInset: "-6.25% -12.5%",
  rotate: "rotate(-90deg) scaleY(-1)",
};

const button = "flex h-[3rem] items-center justify-center rounded-[0.75rem] px-[1.5rem] text-[1.125rem] whitespace-nowrap";

/**
 * Site header. The Figma frames disagreed on position and type per page, so there is one layout now:
 * logo at the content gutter, nav and auth actions on the right.
 *  - "home" overlays the hero and uses Poppins (Desktop-1)
 *  - "default" sits above the page and uses Montserrat (every other frame)
 */
export function SiteHeader({ variant = "default" }: { variant?: HeaderVariant }) {
  const pathname = usePathname();
  const { user, ready, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const home = variant === "home";
  const signedIn = ready && Boolean(user);

  const font = home ? "font-poppins" : "font-montserrat font-semibold";

  return (
    <header className={cn("relative z-20", home && "lg:absolute lg:inset-x-0 lg:top-0")}>
      {/* Desktop */}
      <div className="mx-auto hidden w-[90rem] items-center justify-between px-[4.5625rem] py-[0.5rem] lg:flex">
        <Link href="/" className="relative block h-[5.5rem] w-[6.875rem] shrink-0" aria-label="Braincize home">
          <Image src="/images/shared/logo.png" alt="Braincize" fill unoptimized className="object-cover" priority />
        </Link>

        <div className="flex items-center gap-[2.5rem]">
          <nav aria-label="Main" className="flex items-center gap-[1.75rem]">
            {mainNav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center justify-center rounded-[0.75rem] p-[0.75rem] text-[1.25rem] whitespace-nowrap text-ink",
                    font,
                    home ? (active ? "font-semibold" : "font-medium opacity-50") : !active && "opacity-50",
                  )}
                >
                  {item.label === "Research" ? (
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

          <div className="flex items-center gap-[1.25rem]">
            {signedIn ? (
              <>
                <button
                  type="button"
                  onClick={logout}
                  className={cn(button, "cursor-pointer border border-ink text-ink", home ? "font-poppins font-medium" : "font-montserrat font-semibold")}
                >
                  Log out
                </button>
                <Link href="/dashboard" className={cn(button, "bg-brand text-white", home ? "font-poppins font-medium" : "font-montserrat font-semibold")}>
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                {home && (
                  <Link href={authLinks.login} className={cn(button, "border border-ink font-poppins font-medium text-ink")}>
                    Log in
                  </Link>
                )}
                <Link href={authLinks.signup} className={cn(button, "bg-brand text-white", home ? "font-poppins font-medium" : "font-montserrat font-semibold")}>
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden">
        <div className="mx-auto flex w-[22.875rem] max-w-full items-center justify-between pt-[0.5rem]">
          <Link href="/" className="relative block h-[3.55019rem] w-[4.4375rem]" aria-label="Braincize home">
            <Image src="/images/shared/logo.png" alt="Braincize" fill unoptimized className="object-cover" priority />
          </Link>
          <Link
            href={signedIn ? "/dashboard" : authLinks.signup}
            className="flex items-center justify-center rounded-[0.5rem] bg-brand p-[0.625rem] font-poppins text-[0.875rem] font-semibold text-white"
          >
            {signedIn ? "Dashboard" : "Sign up"}
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
          className="mt-[0.75rem] ml-[0.6875rem] block size-[1.5rem] cursor-pointer"
        >
          <Icon src="/icons/mobile/menu.svg" size={24} boxInset="16.67% 12.5%" />
        </button>

        {open && (
          <nav
            id="mobile-menu"
            aria-label="Main"
            className="mx-[1rem] mt-[0.5rem] flex flex-col rounded-[0.5rem] bg-white p-[0.5rem] shadow-[0_0.25rem_0.46875rem_0_rgba(24,134,244,0.1)]"
          >
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
                className={cn("p-[0.5rem] font-poppins text-[1rem] font-medium text-ink", !isActive(pathname, item.href) && "opacity-50")}
              >
                {item.label}
              </Link>
            ))}
            {signedIn ? (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  void logout();
                }}
                className="cursor-pointer p-[0.5rem] text-left font-poppins text-[1rem] font-medium text-ink opacity-50"
              >
                Log out
              </button>
            ) : (
              <Link href={authLinks.login} onClick={() => setOpen(false)} className="p-[0.5rem] font-poppins text-[1rem] font-medium text-ink opacity-50">
                Log in
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
