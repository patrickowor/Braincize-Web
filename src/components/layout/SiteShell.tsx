import { Newsletter } from "./Newsletter";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader, type HeaderVariant } from "./SiteHeader";

interface SiteShellProps {
  children: React.ReactNode;
  headerVariant?: HeaderVariant;
  /** The newsletter band sits directly above the footer on some pages. */
  newsletter?: boolean;
}

/** Header + page content + (newsletter) + footer. Every public page renders inside this. */
export function SiteShell({ children, headerVariant = "default", newsletter = false }: SiteShellProps) {
  return (
    <>
      <SiteHeader variant={headerVariant} />
      <main>{children}</main>
      {newsletter && <Newsletter />}
      <SiteFooter />
    </>
  );
}
