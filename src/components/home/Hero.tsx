import Image from "next/image";
import { Glow } from "@/components/ui/Glow";
import { LinkButton } from "@/components/ui/LinkButton";

/**
 * Desktop: sky-blue 1440×883 frame, text and imagery placed on it.
 * Mobile: white headline box, sky-blue image band, button below.
 */
export function Hero() {
  return (
    <section className="relative overflow-clip max-lg:pt-[0.6875rem] lg:h-[55.1875rem] lg:bg-sky">
      <div className="mx-auto flex flex-col items-center gap-[1rem] lg:relative lg:block lg:h-full lg:w-[90rem]">
        <div className="flex w-full flex-col items-end gap-[1.25rem] lg:contents">
          <div className="flex w-[23.375rem] max-w-full flex-col items-center gap-[0.5rem] bg-white lg:absolute lg:z-10 lg:top-[13.5rem] lg:left-[4.5625rem] lg:w-[42rem] lg:items-start lg:gap-[1rem] lg:bg-transparent">
            <h1 className="w-[22.375rem] max-w-full font-montserrat text-[1.875rem] leading-[2.25rem] font-bold tracking-[0.0375rem] text-navy [text-shadow:0_0.25rem_0.25rem_rgba(0,0,0,0.25)] lg:w-auto lg:text-[4.5rem] lg:whitespace-nowrap lg:leading-[5.5rem] lg:tracking-[0.18rem] lg:[text-shadow:none]">
              AI-Powered Brain
              <br />
              Atrophy
              <br />
              Detection
            </h1>
            <p className="w-[21.75rem] max-w-full font-poppins text-[0.9375rem] leading-[1.25rem] font-medium tracking-[-0.0002rem] text-ink lg:w-auto lg:text-[1.75rem] lg:leading-[2.375rem] lg:tracking-normal">
              Achieve over 90% accuracy in detecting brain volume loss with our advanced AI solutions.
            </p>
          </div>

          <div className="relative h-[14.94662rem] w-full overflow-clip bg-sky lg:contents">
            <Glow
              src="/images/bg/mobile/ellipse-2.svg"
              inset="-33.73% -31.6%"
              className="top-[5.28125rem] left-[7.98937rem] h-[10.03775rem] w-[10.71481rem] lg:hidden"
            />
            <Glow
              src="/images/bg/ellipse-1.svg"
              inset="-33.73% -31.6%"
              className="hidden top-[19.5rem] left-[29.5rem] h-[37.0625rem] w-[39.5625rem] lg:block"
            />

            <div className="absolute top-[1.1875rem] left-1/2 h-[11.69631rem] w-[22.66656rem] -translate-x-1/2 overflow-clip lg:top-[13.625rem] lg:left-[37.1875rem] lg:h-[38.625rem] lg:w-[74.85244rem] lg:translate-x-0">
              <div className="absolute top-[1.21rem] left-[0.25rem] h-[11.29881rem] w-[10.45925rem] lg:top-[1.3125rem] lg:left-0 lg:h-[37.3125rem] lg:w-[34.53994rem]">
                <Image src="/images/home/hero-brain-wave.png" alt="" fill unoptimized priority className="object-cover" />
              </div>
              <div className="absolute top-[0.8125rem] left-[12.4575rem] h-[11.29881rem] w-[10.45925rem] -scale-y-100 rotate-180 lg:top-0 lg:left-[40.3125rem] lg:h-[37.3125rem] lg:w-[34.53994rem]">
                <Image src="/images/home/hero-brain-wave.png" alt="" fill unoptimized priority className="object-cover" />
              </div>
              <div className="absolute top-[1.875rem] left-[5.5rem] h-[8.5625rem] w-[10.125rem] lg:top-[3.5rem] lg:left-[17.3125rem] lg:h-[28.75rem] lg:w-[33.9375rem]">
                <Image
                  src="/images/home/hero-brain.png"
                  alt="Illustration of a brain with neural activity"
                  fill
                  unoptimized
                  priority
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <LinkButton
          href="/aiscan"
          className="h-[3.375rem] w-[13.75rem] rounded-[0.5rem] p-[0.625rem] font-montserrat text-[0.875rem] font-semibold lg:absolute lg:z-10 lg:top-[39rem] lg:left-[4.5625rem] lg:h-[4rem] lg:w-[18.75rem] lg:rounded-[0.75rem] lg:font-poppins lg:text-[1.25rem]"
        >
          <span className="lg:hidden">Explore Our Technology</span>
          <span className="hidden lg:inline">Explore our technology</span>
        </LinkButton>
      </div>
    </section>
  );
}
