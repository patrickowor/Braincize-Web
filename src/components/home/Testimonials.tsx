"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { testimonials } from "@/content/home";
import { cn } from "@/lib/cn";

const AUTO_ADVANCE_MS = 6000;

function Stars() {
  return (
    <div className="flex items-center gap-[0.15656rem] lg:gap-[0.35081rem]" aria-label="5 out of 5 stars" role="img">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className="relative block h-[0.93944rem] w-[0.97862rem] overflow-clip lg:h-[2.10475rem] lg:w-[2.19256rem]">
          <span className="absolute top-[calc(50%-0.005rem)] left-[calc(50%-0.005rem)] size-[0.84162rem] -translate-x-1/2 -translate-y-1/2 lg:top-[calc(50%-0.01125rem)] lg:left-[calc(50%-0.01125rem)] lg:size-[1.8855rem]">
            <Image src="/icons/mobile/star.svg" alt="" fill unoptimized className="max-w-none lg:hidden" />
            <Image src="/icons/star.svg" alt="" fill unoptimized className="hidden max-w-none lg:block" />
          </span>
        </span>
      ))}
    </div>
  );
}

/**
 * One card visible at a time. Native scroll-snap gives swipe on touch; it also advances on a timer
 * (paused while hovered/focused or when the user prefers reduced motion).
 */
export function Testimonials({ className }: { className?: string }) {
  const track = useRef<HTMLUListElement>(null);
  const paused = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      const el = track.current;
      if (!el || paused.current) return;
      const slide = el.firstElementChild as HTMLElement | null;
      if (!slide) return;
      const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
      const step = slide.offsetWidth + gap;
      const next = (Math.round(el.scrollLeft / step) + 1) % testimonials.length;
      el.scrollTo({ left: next * step, behavior: "smooth" });
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section aria-label="Testimonials" className={cn("mx-auto w-[17rem] max-w-full lg:w-[40.25rem]", className)}>
      <ul
        ref={track}
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
        onFocus={() => (paused.current = true)}
        onBlur={() => (paused.current = false)}
        className="flex snap-x snap-mandatory gap-[2.73387rem] overflow-x-auto [scrollbar-width:none] lg:gap-[6.125rem] [&::-webkit-scrollbar]:hidden"
      >
        {testimonials.map((item) => (
          <li
            key={item.author}
            className="flex h-[15.85437rem] w-full shrink-0 snap-center flex-col items-center justify-center gap-[2.15306rem] bg-white/[0.01] p-[0.6695rem] shadow-[0_0.39144rem_0.58719rem_0_rgba(24,134,244,0.1)] backdrop-blur-[1.17437rem] lg:h-[35.52019rem] lg:gap-[4.82375rem] lg:p-[1.5rem] lg:shadow-[0_0.87706rem_1.31556rem_0_rgba(24,134,244,0.1)] lg:backdrop-blur-[2.63112rem]"
          >
            <blockquote className="w-full font-poppins text-[0.70437rem] leading-[normal] font-medium tracking-[-0.00141rem] text-ink lg:w-[37.27425rem] lg:text-[1.57869rem] lg:tracking-[-0.00316rem]">
              {item.quote}
            </blockquote>
            <p className="w-full text-center font-poppins text-[0.93937rem] leading-[normal] font-bold tracking-[-0.00188rem] text-ink lg:text-[2.10487rem] lg:tracking-[-0.00421rem]">
              {item.author}
            </p>
            <Stars />
          </li>
        ))}
      </ul>
    </section>
  );
}
