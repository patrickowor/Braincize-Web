import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";

export async function ResearchList({ className }: { className?: string }) {
  const articles = await api.research.list();

  return (
    <ul className={cn("flex flex-col gap-[1.75rem] lg:gap-[3rem]", className)}>
      {articles.map((article) => (
        <li key={article.id} className="flex flex-col">
          <div className="flex items-start gap-[0.5rem] lg:items-center lg:gap-[1.125rem]">
            <span className="relative mt-[0.1875rem] block size-[0.875rem] shrink-0 lg:mt-0 lg:size-[2rem]">
              <Image src="/icons/mobile/bullet-research.svg" alt="" fill unoptimized className="lg:hidden dark:brightness-0 dark:invert" />
              <Image src="/icons/bullet-b.svg" alt="" fill unoptimized className="hidden lg:block" />
            </span>
            <h2 className="font-poppins text-[1rem] leading-[1.25rem] font-medium tracking-[-0.0002rem] text-ink uppercase opacity-85 lg:max-w-[72.75rem] lg:text-[1.375rem] lg:leading-[1.5] lg:tracking-[-0.00275rem] lg:normal-case">
              {article.title}
            </h2>
          </div>

          <Link
            href={article.href ?? "#"}
            className="mt-[0.75rem] flex items-center gap-[0.625rem] self-start pl-[1.375rem] font-poppins text-[0.75rem] leading-[normal] font-medium text-brand lg:mt-[0.75rem] lg:pl-[3.125rem]"
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
