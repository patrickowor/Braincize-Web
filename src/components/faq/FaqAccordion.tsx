"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import type { FaqItem } from "@/lib/api/types";

export function FaqAccordion({ items, className }: { items: FaqItem[]; className?: string }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const baseId = useId();

  return (
    <ul className={cn("flex flex-col", className)}>
      {items.map((item, index) => {
        const open = openId === item.id;
        const panelId = `${baseId}-${item.id}`;
        return (
          <li key={item.id}>
            <button
              type="button"
              aria-expanded={open}
              aria-controls={item.answer ? panelId : undefined}
              onClick={() => setOpenId(open ? null : item.id)}
              className="flex w-full cursor-pointer items-center justify-between gap-[0.5rem] text-left lg:justify-start lg:gap-[9.375rem]"
            >
              <span className="font-poppins text-[0.8125rem] leading-[normal] font-medium tracking-[-0.00162rem] text-navy lg:w-[68.58463rem] lg:text-[1.5rem] lg:leading-[4.03437rem] lg:tracking-[-0.003rem]">
                {index + 1}. {item.question}
              </span>
              <span className={cn("block shrink-0 transition-transform", open && "rotate-180")}>
                <span className="lg:hidden">
                  <Icon
                    src="/icons/mobile/chevron-faq.svg"
                    size={15.705}
                    boxInset="25% 37.5%"
                    imgInset="-5.35% -10.7% -5.36% -10.73%"
                    rotate="rotate(-90deg) scaleY(-1)"
                  />
                </span>
                <span className="hidden lg:block">
                  <Icon
                    src="/icons/chevron-faq.svg"
                    size={39.291}
                    boxInset="25% 37.5%"
                    imgInset="-5.36% -10.72% -5.36% -10.71%"
                    rotate="rotate(-90deg) scaleY(-1)"
                  />
                </span>
              </span>
            </button>
            {item.answer && open && (
              <p id={panelId} className="pb-[1rem] font-poppins text-[0.8125rem] text-ink lg:text-[1.25rem]">
                {item.answer}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
