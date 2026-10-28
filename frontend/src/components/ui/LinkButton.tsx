import Link from "next/link";
import { cn } from "@/lib/cn";

type Props = Omit<React.ComponentProps<typeof Link>, "className"> & { className?: string };

/** Solid brand button used for every call-to-action in the design. Size/typography come via className. */
export function LinkButton({ className, ...props }: Props) {
  return (
    <Link
      {...props}
      className={cn(
        "flex items-center justify-center bg-brand text-white transition-colors hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        className,
      )}
    />
  );
}
