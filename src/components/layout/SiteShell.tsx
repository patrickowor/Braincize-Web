import { SiteFooter } from "./SiteFooter";
import { SiteHeader, type HeaderVariant } from "./SiteHeader";

interface SiteShellProps {
  children: React.ReactNode;
  headerVariant?: HeaderVariant;
}

/** Header + page content + footer. Every public page renders inside this. */
export function SiteShell({ children, headerVariant = "default" }: SiteShellProps) {
  return (
    <>
      <SiteHeader variant={headerVariant} />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
