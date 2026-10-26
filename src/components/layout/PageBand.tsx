import { cn } from "@/lib/cn";

interface PageBandProps {
  title: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Sky-blue title band under the header. Contact, Terms and Research each drew this at a different
 * height, offset and alignment in Figma; it is one component now, aligned to the content gutter.
 */
export function PageBand({ title, children, className }: PageBandProps) {
  return (
    <section className={cn("mt-[2.75rem] bg-sky px-[1rem] py-[1.75rem] lg:mt-[1.5625rem] lg:px-[4.5625rem] lg:py-[3.5rem]", className)}>
      <h1 className="font-montserrat text-[1.5rem] leading-[normal] font-bold text-ink lg:text-[3rem]">{title}</h1>
      {children}
    </section>
  );
}
