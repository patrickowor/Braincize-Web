import Image from "next/image";
import { cn } from "@/lib/cn";
import { rem } from "@/lib/rem";

export type BulletKind = "a" | "b" | "c";

interface BulletListProps {
  items: string[];
  /** Which exported bullet each row uses on desktop (the three exports differ slightly). */
  bullets: BulletKind[];
  /** Text column width per row on desktop, in design px (the frame sets these per row). */
  widths: number[];
  className?: string;
}

/** Bulleted list used by Mission and Research Focus. Desktop and mobile have different bullet artwork. */
export function BulletList({ items, bullets, widths, className }: BulletListProps) {
  return (
    <ul className={cn("flex flex-col gap-[1.5rem]", className)}>
      {items.map((item, i) => (
        <li key={item} className="flex items-start gap-[0.5rem] lg:items-center lg:gap-[1.125rem]">
          <span className="relative mt-[0.5625rem] block size-[0.875rem] shrink-0 lg:hidden">
            <Image src="/icons/mobile/bullet-outer.svg" alt="" fill unoptimized />
            <span className="absolute top-[0.21875rem] left-[0.21875rem] block size-[0.4375rem]">
              <Image src="/icons/mobile/bullet-inner.svg" alt="" fill unoptimized />
            </span>
          </span>
          <span className="relative hidden size-[2rem] shrink-0 lg:block">
            <Image src={`/icons/bullet-${bullets[i] ?? "b"}.svg`} alt="" fill unoptimized />
          </span>
          <p
            style={{ "--w": rem(widths[i] ?? 756) } as React.CSSProperties}
            className="font-poppins text-[1rem] leading-[1.25rem] font-medium tracking-[-0.0002rem] text-ink opacity-85 max-lg:min-h-[2.375rem] lg:w-(--w) lg:shrink-0 lg:text-[1.5rem] lg:leading-[2.875rem] lg:tracking-[-0.003rem]"
          >
            {item}
          </p>
        </li>
      ))}
    </ul>
  );
}
