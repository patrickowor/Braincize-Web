import { features } from "@/content/home";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

export function KeyFeatures({ className }: { className?: string }) {
  return (
    <section className={cn("flex flex-col items-center gap-[1.5rem] lg:h-[45.0625rem] lg:justify-center lg:gap-[3rem] lg:p-[1.5rem]", className)}>
      <h2 className="w-[10.25rem] text-center font-poppins text-[1rem] leading-[normal] font-bold text-navy lg:w-auto lg:text-[3rem]">
        Key Features
      </h2>
      <ul className="flex w-full flex-col gap-[1rem] lg:w-[80.25rem] lg:flex-row lg:items-center lg:gap-[4.625rem]">
        {features.map((feature) => (
          <li
            key={feature.title}
            className="flex items-center gap-[0.75rem] bg-surface p-[0.5rem] drop-shadow-[0_0.25rem_0.46875rem_rgba(24,134,244,0.1)] lg:w-[23.625rem] lg:flex-col lg:gap-[1.75rem] lg:px-[1.5rem] lg:py-[3rem]"
          >
            <span className="lg:hidden">
              <Icon {...feature.icon.mobile} size={64} />
            </span>
            <span className="hidden lg:block">
              <Icon {...feature.icon.desktop} size={120} />
            </span>
            <div className="flex-1 text-ink lg:flex lg:h-[16.3125rem] lg:w-[23.625rem] lg:flex-none lg:flex-col lg:items-center lg:gap-[2.75rem] lg:text-center">
              <h3 className="font-poppins text-[1rem] leading-[normal] font-semibold lg:w-full lg:text-[2rem]">{feature.title}</h3>
              <p className="mt-[1rem] font-poppins text-[0.75rem] leading-[1.5rem] font-medium tracking-[-0.0015rem] opacity-85 lg:mt-0 lg:w-[21.875rem] lg:flex-1 lg:text-[1.5rem] lg:leading-[2.5625rem] lg:tracking-[-0.003rem]">
                {feature.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
