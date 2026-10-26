import { SiteShell } from "@/components/layout/SiteShell";

/** App area: signed-in only (enforced in middleware). Same chrome as the site, dashboard palette inside. */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteShell>
      <div className="min-h-[calc(100vh-10rem)] bg-gradient-to-br from-white via-dash-muted/20 to-white">
        <div className="mx-auto w-full max-w-[87.5rem] px-6 py-8 lg:px-8">{children}</div>
      </div>
    </SiteShell>
  );
}
