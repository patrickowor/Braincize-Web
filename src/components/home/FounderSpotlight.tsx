import Image from "next/image";
import { Glow } from "@/components/ui/Glow";
import { LinkButton } from "@/components/ui/LinkButton";
import { cn } from "@/lib/cn";

/** Desktop-only: this section is not part of the mobile Home frame. */
export function FounderSpotlight({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <Glow
        src="/images/bg/ellipse-2.svg"
        inset="-58.82% -27.97%"
        className="top-[20.0625rem] left-[calc(50%-52.1875rem)] h-[21.25rem] w-[44.6875rem]"
      />
      <section className="relative mx-auto flex w-[81.375rem] translate-x-[-0.1875rem] items-start gap-[5.6875rem] bg-page p-[1.5rem]">
        <div className="flex w-[47rem] shrink-0 flex-col gap-[2.75rem]">
          <div className="flex flex-col">
            <h2 className="w-[30.1875rem] py-[1rem] font-poppins text-[3rem] leading-[normal] font-medium whitespace-nowrap text-ink">
              Founder Spotlight
            </h2>
            <div className="h-[18rem] font-poppins text-[1.5rem] leading-[normal] font-medium tracking-[-0.003rem] text-ink opacity-85">
              <p className="mt-[2.25rem]">Meet Dr. Calvin H. Flowers</p>
              <p>
                Pioneer in MRI and AI-driven brain diagnostics, Dr. Flowers has shaped global neuroimaging standards.
                His mission? To detect brain trauma earlier — from war zones to playing fields — and turn insight into
                action.
              </p>
              <p>“When we understand brain damage earlier, we can act earlier. That changes everything.”</p>
            </div>
          </div>
          <LinkButton href="/about" className="w-[15rem] p-[0.625rem] font-poppins text-[1.5rem] font-semibold">
            Read more
          </LinkButton>
        </div>

        <div className="relative h-[35.5rem] w-[25.6875rem] shrink-0 overflow-clip bg-[#d9d9d9]">
          <Image src="/images/home/founder.png" alt="Dr. Calvin H. Flowers" fill unoptimized className="object-cover" />
        </div>
      </section>
    </div>
  );
}
