import { cn } from "@/lib/cn";

/** Card, badge and progress bar in the previous dashboard's visual language. */
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-lg border border-dash-border bg-white text-dash-fg shadow-sm", className)} {...props} />;
}

const badgeVariants = {
  default: "border-transparent bg-dash-primary text-white",
  secondary: "border-transparent bg-dash-secondary text-white",
  outline: "text-dash-fg",
  destructive: "border-transparent bg-dash-destructive text-white",
  success: "border-transparent bg-emerald-600 text-white",
} as const;

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { variant?: keyof typeof badgeVariants }) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 font-poppins text-xs font-semibold",
        badgeVariants[variant],
        className,
      )}
      {...props}
    />
  );
}

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-dash-muted", className)}
    >
      <div className="h-full bg-dash-primary transition-all" style={{ width: `${clamped}%` }} />
    </div>
  );
}

export function DashButton({
  className,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline" }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 font-poppins text-sm font-medium whitespace-nowrap transition-opacity disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" && "bg-gradient-to-r from-dash-primary to-dash-accent text-white hover:opacity-90",
        variant === "outline" && "border border-dash-border bg-white text-dash-fg hover:bg-dash-muted",
        className,
      )}
      {...props}
    />
  );
}
