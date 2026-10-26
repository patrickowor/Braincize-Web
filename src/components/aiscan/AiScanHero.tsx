import { LinkButton } from "@/components/ui/LinkButton";

/** "Try Braincize" intro band shared by every AI Scan state. */
export function AiScanHero() {
  return (
    <section className="flex h-[11.8125rem] flex-col items-center gap-[0.75rem] bg-sky pt-[2.1875rem] lg:h-[25.375rem] lg:gap-[1.5rem] lg:px-[11.1875rem] lg:py-[1.5rem]">
      <div className="flex w-full flex-col items-center gap-[0.5rem] text-center text-ink lg:w-[67.625rem] lg:gap-[0.375rem]">
        <h1 className="h-[1.75rem] w-full font-montserrat text-[1.5rem] leading-[normal] font-bold lg:h-[6.1875rem] lg:text-[4rem]">
          Try Braincize
        </h1>
        <p className="w-[20.375rem] max-w-full font-poppins text-[0.875rem] leading-[normal] font-medium lg:w-full lg:text-[2.75rem]">
          Unlock your brain story with AI<br className="lg:hidden" /> application<br className="hidden lg:block" /> of MRI study.
        </p>
      </div>
      <LinkButton
        href="/about"
        className="h-[2.75rem] w-[13.75rem] rounded-[0.5rem] p-[0.625rem] font-montserrat text-[0.875rem] font-semibold lg:h-[4.3125rem] lg:w-[28rem] lg:rounded-[0.75rem] lg:font-poppins lg:text-[1.5rem]"
      >
        Learn More
      </LinkButton>
    </section>
  );
}
