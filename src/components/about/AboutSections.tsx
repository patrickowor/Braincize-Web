import Image from "next/image";
import Link from "next/link";
import { aboutHero, founderMessage, mission, researchFocus } from "@/content/about";
import { Glow } from "@/components/ui/Glow";
import { Icon } from "@/components/ui/Icon";
import { LinkButton } from "@/components/ui/LinkButton";
import { BulletList } from "./BulletList";

const photo = "relative shrink-0 overflow-clip bg-[#d9d9d9]";

export function AboutHero() {
  return (
    <section className="mx-auto flex w-[23rem] max-w-full flex-col gap-[1.75rem] pb-px lg:w-[80.3125rem] lg:flex-row lg:items-center lg:gap-[2.625rem] lg:pb-0">
      <div className="flex flex-col gap-[1.1875rem] lg:w-[47.25rem] lg:shrink-0 lg:gap-[2.625rem]">
        <h1 className="font-poppins text-[1.5rem] leading-[normal] font-semibold text-ink lg:text-[3rem] lg:font-bold lg:text-navy">
          {aboutHero.title}
        </h1>
        <div className={`${photo} h-[22.9375rem] w-[22.25rem] lg:hidden`}>
          <div className="absolute inset-x-0 top-[-11.82%] h-[141.79%]">
            <Image src="/images/home/founder.png" alt="Dr. Calvin H. Flowers" fill unoptimized className="object-cover" />
          </div>
        </div>
        <p className="hidden font-poppins text-[1.5rem] leading-[2.875rem] font-medium tracking-[-0.003rem] text-ink opacity-85 lg:block lg:h-[23.125rem]">
          {aboutHero.bio}
        </p>
      </div>

      <div className="lg:hidden">
        <p className="min-h-[9.375rem] font-poppins text-[1rem] leading-[1.75rem] font-medium tracking-[-0.0002rem] text-ink opacity-85">
          <br />
          {aboutHero.summary}
        </p>
        <Link href="/about" className="mt-[0.625rem] flex items-center gap-[0.625rem] font-poppins text-[0.75rem] font-medium text-brand">
          Read more
          <Icon src="/icons/mobile/double-chevron.svg" size={16} boxInset="22.92% 25%" imgInset="-8.65% -9.38%" rotate="rotate(-90deg)" />
        </Link>
      </div>

      <div className={`${photo} hidden h-[35.5rem] w-[30.4375rem] lg:block`}>
        <Image src="/images/home/founder.png" alt="Dr. Calvin H. Flowers" fill unoptimized className="object-cover" />
      </div>
    </section>
  );
}

/** Mobile: stacked title, image band, copy. Desktop: image left, copy right on a translucent band. */
export function MissionSection() {
  return (
    <section className="relative lg:flex lg:h-[55.4375rem] lg:items-center lg:justify-center lg:overflow-clip lg:bg-sky/50">
      <Glow
        src="/images/bg/ellipse-about-2.svg"
        inset="-74.91% -27.97%"
        className="top-[-8.375rem] left-[calc(50%+12.4375rem)] hidden h-[16.6875rem] w-[44.6875rem] lg:block"
      />
      <div className="relative flex flex-col gap-[1.625rem] lg:-ml-[1.125rem] lg:flex-row lg:items-end lg:gap-[4.375rem] lg:opacity-90">
        <div className="flex flex-col gap-[0.625rem] lg:contents">
          <h2 className="font-poppins text-[1.5rem] leading-[normal] font-semibold text-ink lg:hidden">{mission.title}</h2>
          <div className="relative h-[13.70106rem] w-[22.25rem] overflow-clip bg-sky/50 lg:h-[44.9375rem] lg:w-[31.9375rem] lg:shrink-0 lg:bg-[#d9d9d9]">
            <Glow
              src="/images/bg/mobile/ellipse-about.svg"
              inset="-74.91% -27.97%"
              className="top-[-2.07rem] left-[14.19562rem] h-[4.12419rem] w-[11.04425rem] lg:hidden"
            />
            <Image
              src="/images/about/mission.png"
              alt="Climbers helping each other up a mountain"
              fill
              unoptimized
              className="object-cover"
            />
          </div>
          <p className="min-h-[5.75rem] font-poppins text-[1rem] leading-[1.75rem] font-medium tracking-[-0.0002rem] text-ink opacity-65 lg:hidden">
            {mission.intro}
          </p>
        </div>

        <div className="flex flex-col gap-[1.5rem] lg:w-[45.0625rem] lg:gap-[3.375rem]">
          <div className="hidden flex-col gap-[1rem] lg:flex">
            <h2 className="font-montserrat text-[3rem] leading-[normal] font-bold text-navy">{mission.title}</h2>
            <p className="w-[44.75rem] font-poppins text-[2rem] leading-[normal] font-medium text-ink">{mission.intro}</p>
          </div>
          <BulletList
            items={mission.points}
            bullets={["b", "c", "b", "b"]}
            widths={[756, 674, 662, 756]}
            className="lg:w-[45.6875rem]"
          />
        </div>
      </div>
    </section>
  );
}

export function ResearchFocusSection() {
  return (
    <section className="flex flex-col gap-[1rem] lg:flex-row lg:items-end lg:justify-center lg:gap-[4.0625rem]">
      <div className="flex flex-col gap-[1rem] lg:h-[37.375rem] lg:gap-[4.25rem]">
        <div className="flex flex-col gap-[1rem] lg:w-[45.0625rem] lg:gap-[2.625rem]">
          <h2 className="font-poppins text-[1.5rem] leading-[2.25rem] font-semibold text-ink lg:font-montserrat lg:text-[3rem] lg:leading-[normal] lg:font-bold lg:text-navy">
            <span className="lg:hidden">{researchFocus.mobileTitle}</span>
            <span className="hidden lg:inline">{researchFocus.title}</span>
          </h2>
          <div className="relative h-[13.70106rem] w-[22.25rem] overflow-clip bg-sky/50 lg:hidden">
            <Glow
              src="/images/bg/mobile/ellipse-about.svg"
              inset="-74.91% -27.97%"
              className="top-[-2.07rem] left-[14.19562rem] h-[4.12419rem] w-[11.04425rem]"
            />
            <Image src="/images/about/research-focus.jpg" alt="Researchers working in a lab" fill unoptimized className="object-cover" />
          </div>
          <p className="min-h-[4rem] font-poppins text-[1rem] leading-[1.75rem] font-medium tracking-[-0.0002rem] text-ink opacity-65 lg:w-[44.75rem] lg:text-[2rem] lg:leading-[normal] lg:tracking-normal lg:opacity-100">
            {researchFocus.intro}
          </p>
        </div>
        <BulletList
          items={researchFocus.points}
          bullets={["a", "b", "b", "b"]}
          widths={[756, 756, 756, 756]}
          className="lg:w-[45.6875rem]"
        />
      </div>
      <div className="relative hidden h-[37.5rem] w-[31.9375rem] shrink-0 overflow-clip bg-[#d9d9d9] lg:block">
        <Image src="/images/about/research-focus.jpg" alt="Researchers working in a lab" fill unoptimized className="object-cover" />
      </div>
    </section>
  );
}

/** Desktop-only: not part of the mobile About frame. */
export function MessageSection() {
  return (
    <section className="mx-auto hidden w-[56.25rem] flex-col items-center px-[1rem] py-[0.5rem] lg:flex">
      <h2 className="w-full text-center font-poppins text-[3rem] leading-[normal] font-medium tracking-[-0.018rem] text-ink">
        {founderMessage.title}
      </h2>
      <p className="mt-[2.4375rem] w-full text-center font-poppins text-[1.5rem] leading-[normal] font-medium tracking-[-0.003rem] text-ink opacity-85">
        {founderMessage.body}
      </p>
      <LinkButton href="/contact" className="mt-[3.3125rem] w-[14.4375rem] p-[0.625rem] font-poppins text-[1.5rem] font-semibold">
        Contact us
      </LinkButton>
    </section>
  );
}
