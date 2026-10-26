import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api";
import { cn } from "@/lib/cn";
import { rem } from "@/lib/rem";
import { Icon } from "@/components/ui/Icon";

/** Heights of the mobile list rows in the Figma frame; they carry blank lines from the design file. */
const MOBILE_ROW_HEIGHTS = [95, 73, 72, 72, 64];

export async function ResearchList({ className }: { className?: string }) {
  const articles = await api.research.list();

  return (
    <ul className={cn("flex flex-col gap-[2.75rem] lg:gap-[5.25rem]", className)}>
      {articles.map((article, index) => (
        <li
          key={article.id}
          style={{ "--row-h": rem(MOBILE_ROW_HEIGHTS[index] ?? 0) } as React.CSSProperties}
          className="relative flex flex-col max-lg:min-h-(--row-h) max-lg:pb-[0.375rem]"
        >
          <div className="relative flex items-start gap-[0.5rem] lg:items-center lg:gap-[1.125rem]">
            <span className="relative mt-[0.5625rem] block size-[0.875rem] shrink-0 lg:mt-0 lg:size-[2rem]">
              <Image src="/icons/mobile/bullet-research.svg" alt="" fill unoptimized className="lg:hidden" />
              <Image src="/icons/bullet-b.svg" alt="" fill unoptimized className="hidden lg:block" />
            </span>
            <h2 className="w-[20.9375rem] max-w-full font-poppins text-[1rem] leading-[1.25rem] font-medium tracking-[-0.0002rem] text-ink uppercase opacity-85 lg:min-h-[3.75rem] lg:w-[72.75rem] lg:text-[1.5rem] lg:leading-[2.875rem] lg:tracking-[-0.003rem] lg:normal-case">
              {article.title}
            </h2>
          </div>

          <Link
            href={article.href ?? "#"}
            className="mt-[1rem] flex items-center gap-[0.625rem] self-start pl-[1.4375rem] font-poppins text-[0.75rem] leading-[normal] font-medium text-brand max-lg:mt-auto lg:pl-0"
          >
            Read more
            <span className="lg:hidden">
              <Icon src="/icons/mobile/double-chevron.svg" size={16} boxInset="22.92% 25%" imgInset="-8.65% -9.38%" rotate="rotate(-90deg)" />
            </span>
            <span className="hidden lg:block">
              <Icon src="/icons/double-chevron.svg" size={16} boxInset="22.92% 25%" imgInset="-8.65% -9.38%" rotate="rotate(-90deg)" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
