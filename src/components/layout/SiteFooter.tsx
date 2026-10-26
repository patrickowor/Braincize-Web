import Image from "next/image";
import Link from "next/link";
import { footerColumns, site } from "@/config/site";
import { Glow } from "@/components/ui/Glow";


/** Footer composition is fixed in the design, so the columns are placed on the frame. */
export function SiteFooter() {
  return (
    <footer className="relative h-[6.4375rem] w-full overflow-clip bg-navy lg:h-[19.625rem]">
      <div className="relative mx-auto h-full w-[24.5625rem] max-w-full lg:w-[90rem]">
        <Glow
          src="/images/bg/mobile/ellipse-1.svg"
          inset="-84.75% -31.6%"
          className="top-[4.51438rem] left-[-0.88562rem] h-[4.02044rem] w-[10.78369rem] lg:hidden"
        />
        <Glow
          src="/images/bg/ellipse-6.svg"
          inset="-84.75% -31.6%"
          className="hidden top-[16.5625rem] left-[-3.25rem] h-[14.75rem] w-[39.5625rem] lg:block"
        />

        <Link
          href="/"
          aria-label="Braincize home"
          className="absolute top-[0.5625rem] left-[0.5rem] block h-[2.9375rem] w-[3.67163rem] lg:top-[-1px] lg:left-[1.8125rem] lg:h-[14.72525rem] lg:w-[18.40544rem]"
        >
          <Image src="/images/shared/logo.png" alt="Braincize" fill unoptimized className="object-cover" />
        </Link>

        <div className="absolute top-[3.9375rem] left-[1.125rem] flex w-[6.625rem] flex-col gap-[0.5rem] text-[0.5rem] text-white lg:top-[3.75rem] lg:left-[26.9375rem] lg:w-[14.0625rem] lg:gap-[0.8125rem] lg:text-[0.84375rem] lg:leading-[1.875rem]">
          <p className="w-[12rem] font-poppins leading-[0.5rem] font-semibold [text-shadow:0_0.25rem_0.25rem_rgba(0,0,0,0.25)] lg:w-[15.125rem] lg:leading-[1.875rem] lg:font-bold lg:text-[1rem] lg:[text-shadow:none]">
            Support and help team
          </p>
          <a href={`mailto:${site.contact.supportEmail}`} className="font-poppins leading-[0.51106rem] lg:leading-[1.875rem]">
            {site.contact.supportEmail}
          </a>
        </div>

        <FooterList
          title="Quick Links"
          items={footerColumns.quickLinks}
          className="top-[1.125rem] left-[8.25rem] w-[3rem] lg:top-[3.375rem] lg:left-[45.8125rem] lg:w-[5.875rem]"
        />
        <FooterList
          title="Legal"
          items={footerColumns.legal}
          className="top-[1.125rem] left-[13.1875rem] w-[4.25rem] lg:top-[3.125rem] lg:left-[57.4375rem] lg:w-[7.3125rem]"
        />

        <div className="absolute top-[1.125rem] left-[19.0625rem] flex w-[4.375rem] flex-col gap-[0.5625rem] text-white lg:top-[2.5rem] lg:left-[70.5rem] lg:w-auto lg:gap-0">
          <p className="font-poppins text-[0.5rem] leading-[0.51106rem] font-semibold tracking-[-0.0001rem] lg:text-[1rem] lg:leading-[1.875rem] lg:font-bold lg:tracking-normal">
            Contact Us
          </p>
          <div className="flex flex-col gap-[0.375rem] text-[0.5rem] leading-[0.51106rem] tracking-[-0.0001rem] lg:mt-[0.9375rem] lg:gap-0 lg:text-[0.875rem] lg:leading-[1.875rem] lg:tracking-normal">
            <p className="font-poppins font-semibold">Phone</p>
            <p className="font-poppins lg:-mt-[0.23438rem]">{site.contact.phone}</p>
          </div>
          <div className="hidden text-[0.875rem] leading-[1.875rem] lg:mt-[0.01563rem] lg:block">
            <p className="font-poppins font-semibold">Email</p>
            <p className="font-poppins -mt-[0.23438rem]">{site.contact.email}</p>
          </div>
          <p className="hidden font-poppins text-[1rem] leading-[1.875rem] font-bold lg:mt-[0.46875rem] lg:block">Follow us on:</p>
          <div className="flex items-center gap-[0.375rem] lg:mt-[0.93125rem] lg:gap-[1.40625rem]">
            <SocialIcon label="Twitter" href={site.social.twitter} mask="twitter-mask" />
            <SocialIcon label="Facebook" href={site.social.facebook} mask="facebook-mask" />
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterList({
  title,
  items,
  className,
}: {
  title: string;
  items: readonly { label: string; href: string }[];
  className: string;
}) {
  return (
    <div
      className={`absolute flex flex-col gap-[0.375rem] text-[0.5rem] leading-[0.75rem] tracking-[-0.0001rem] text-white lg:gap-[0.8125rem] lg:text-[0.84375rem] lg:leading-[1.875rem] lg:tracking-normal ${className}`}
    >
      <p className="font-poppins font-semibold lg:text-[1rem] lg:font-bold">{title}</p>
      {items.map((item) => (
        <Link key={`${item.label}-${item.href}`} href={item.href} className="font-poppins">
          {item.label}
        </Link>
      ))}
    </div>
  );
}

function SocialIcon({ label, href, mask }: { label: string; href: string; mask: "twitter-mask" | "facebook-mask" }) {
  return (
    <a href={href} aria-label={label} className="block size-[0.75rem] lg:size-[1.875rem]">
      <span
        aria-hidden
        className="block size-full bg-white lg:hidden"
        style={{ maskImage: `url(/icons/mobile/${mask}.png)`, maskSize: "100% 100%" }}
      />
      <span
        aria-hidden
        className="hidden size-full bg-white lg:block"
        style={{ maskImage: `url(/icons/${mask}.png)`, maskSize: "100% 100%" }}
      />
    </a>
  );
}
