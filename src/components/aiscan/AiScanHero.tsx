import { LinkButton } from "@/components/ui/LinkButton";

/** "Try Braincize" intro band. */
export function AiScanHero() {
  return (
    <section className="mt-[2.75rem] flex h-[11.8125rem] flex-col items-center gap-[0.75rem] bg-sky pt-[2.1875rem] lg:mt-[1.5625rem] lg:h-auto lg:gap-[1.75rem] lg:px-[4.5625rem] lg:py-[3.5rem]">
      <div className="flex w-full flex-col items-center gap-[0.5rem] text-center text-ink lg:gap-[0.75rem]">
        <h1 className="h-[1.75rem] w-full font-montserrat text-[1.5rem] leading-[normal] font-bold lg:h-auto lg:text-[3rem]">Try Braincize</h1>
        <p className="w-[20.375rem] max-w-full font-poppins text-[0.875rem] leading-[normal] font-medium lg:w-full lg:max-w-[56.25rem] lg:text-[1.75rem] lg:leading-[1.4]">
          Unlock your brain story with AI application of MRI study.
        </p>
      </div>
      <LinkButton
        href="/about"
        className="h-[2.75rem] w-[13.75rem] p-[0.625rem] font-montserrat text-[0.875rem] font-semibold lg:h-[3.5rem] lg:w-[20rem] lg:font-poppins lg:text-[1.25rem]"
      >
        Learn More
      </LinkButton>
    </section>
  );
}
