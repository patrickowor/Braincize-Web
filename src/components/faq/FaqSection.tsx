import { api } from "@/lib/api";
import { cn } from "@/lib/cn";
import { FaqAccordion } from "./FaqAccordion";

/** Title + accordion. Items come from the API layer so the source can change without touching this file. */
export async function FaqSection({ className }: { className?: string }) {
  const items = await api.faq.list();

  return (
    <section className={cn("flex flex-col items-center", className)}>
      <h2 className="text-center font-poppins text-[1rem] leading-[normal] font-bold text-navy lg:w-[62.3125rem] lg:text-[3rem] lg:text-ink">
        <span className="lg:hidden">Frequently asked questions (FAQ)</span>
        <span className="hidden lg:inline">Frequently Asked Question (FAQ)</span>
      </h2>
      <FaqAccordion
        items={items}
        className="mt-[1.875rem] w-full gap-[0.625rem] lg:mt-[2.75rem] lg:w-[83.8125rem] lg:-translate-x-[0.28125rem] lg:gap-[2.25rem]"
      />
    </section>
  );
}
