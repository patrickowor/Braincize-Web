import { Newsletter } from "./Newsletter";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader, type HeaderOffset, type HeaderVariant } from "./SiteHeader";

interface SiteShellProps {
  children: React.ReactNode;
  headerVariant?: HeaderVariant;
  headerOffset?: HeaderOffset;
  /** The newsletter band sits directly above the footer on some pages. */
  newsletter?: boolean;
}

/** Header + page content + (newsletter) + footer. Every public page renders inside this. */
export function SiteShell({ children, headerVariant = "default", headerOffset, newsletter = false }: SiteShellProps) {
  return (
    <>
      <SiteHeader variant={headerVariant} offset={headerOffset} />
      <main>{children}</main>
      {newsletter && <Newsletter />}
      <SiteFooter />
    </>
  );
}
