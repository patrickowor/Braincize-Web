import Image from "next/image";
import { LinkButton } from "@/components/ui/LinkButton";
import { cn } from "@/lib/cn";

/** Desktop-only: this section is not part of the mobile Home frame. */
export function Neuroscience({ className }: { className?: string }) {
  return (
    <section className={cn("mx-auto flex w-[81rem] items-end gap-[3.4375rem] p-[1.5rem]", className)}>
      <div className="relative h-[28.0625rem] w-[27.5625rem] shrink-0 overflow-clip">
        <div className="absolute top-[-0.13125rem] left-[-8.62625rem] h-[31.43894rem] w-[39.6415rem]">
          <Image
            src="/images/home/neuroscience.png"
            alt="A clinician reviewing brain MRI scans"
            fill
            unoptimized
            className=" object-cover"
          />
        </div>
      </div>

      <div className="flex w-[47rem] shrink-0 flex-col gap-[2.75rem]">
        <div className="flex flex-col gap-[1.5rem]">
          <h2 className="w-[38.75rem] py-[1rem] font-poppins text-[3rem] leading-[normal] font-medium text-ink">
            Where Neuroscience Meets Machine Learning
          </h2>
          <p className="h-[11.5rem] font-poppins text-[1.5rem] leading-[2.875rem] font-medium tracking-[-0.003rem] text-ink opacity-85">
            We’re rethinking brain health — with AI that sees what others miss. At Braincize, our smart imaging
            technology helps detect early signs of brain injury and disease in veterans, athletes, and at-risk
            individuals — long before symptoms appear.
          </p>
        </div>
        <LinkButton href="/about" className="w-[14.4375rem] p-[0.625rem] font-poppins text-[1.5rem] font-semibold">
          Read more
        </LinkButton>
      </div>
    </section>
  );
}
