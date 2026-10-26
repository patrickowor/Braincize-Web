import { Glow } from "@/components/ui/Glow";

export function WhatIs() {
  return (
    <section className="relative h-[12.25rem] overflow-clip bg-white max-lg:mt-[1.42837rem] lg:h-[32rem]">
      <Glow
        src="/images/bg/mobile/ellipse-3.svg"
        inset="-76.05% -31.6%"
        className="top-[8.25rem] left-[-2.125rem] h-[4.32787rem] w-[10.4165rem] lg:hidden"
      />
      <Glow
        src="/images/bg/mobile/ellipse-4.svg"
        inset="-50.63% -27.97%"
        className="top-[9.8125rem] left-[17.1875rem] h-[6.5rem] w-[11.76587rem] lg:hidden"
      />
      <Glow
        src="/images/bg/mobile/ellipse-5.svg"
        inset="-163.93% -21.93%"
        className="top-0 left-[3.32375rem] h-[2.00762rem] w-[15.00769rem] lg:hidden"
      />
      <Glow
        src="/images/bg/ellipse-3.svg"
        inset="-50.63% -27.97%"
        className="top-[14.9375rem] left-[calc(50%+21.375rem)] hidden h-[24.6875rem] w-[44.6875rem] lg:block"
      />
      <Glow
        src="/images/bg/ellipse-4.svg"
        inset="-76.05% -31.6%"
        className="top-[17.125rem] left-[calc(50%-55.625rem)] hidden h-[16.4375rem] w-[39.5625rem] lg:block"
      />
      <Glow
        src="/images/bg/ellipse-5.svg"
        inset="-163.93% -21.93%"
        className="top-0 left-[calc(50%-32.375rem)] hidden h-[7.625rem] w-[57rem] lg:block"
      />

      <div className="relative mx-auto flex w-[24.375rem] max-w-full flex-col items-center gap-[0.39494rem] p-[0.26331rem] pt-[2.00769rem] text-center lg:w-[87.9375rem] lg:gap-[1.5rem] lg:p-[1rem] lg:pt-[6.625rem]">
        <h2 className="font-poppins text-[1rem] leading-[normal] font-bold text-navy lg:text-[3rem]">What is Braincize ?</h2>
        <p className="w-[22.62669rem] max-w-full font-poppins text-[0.875rem] leading-[1.5rem] font-medium tracking-[-0.00175rem] text-ink opacity-85 lg:w-[85.9375rem] lg:text-[2rem] lg:leading-[2.875rem] lg:tracking-[-0.004rem]">
          Braincize is an AI-powered neuroimaging tool that analyzes MRI scans to detect early signs of brain volume loss
          from injuries or neurodegenerative diseases, helping improve diagnosis and treatment planning.
        </p>
      </div>
    </section>
  );
}
