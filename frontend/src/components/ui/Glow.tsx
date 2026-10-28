import Image from "next/image";
import { cn } from "@/lib/cn";

interface GlowProps {
  src: string;
  /** CSS inset of the blurred artwork relative to its frame, as exported from Figma. */
  inset: string;
  /** Position and size of the frame. */
  className?: string;
}

/** Decorative blurred ellipse from the Figma frames. */
export function Glow({ src, inset, className }: GlowProps) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute dark:opacity-25", className)}>
      <div className="absolute" style={{ inset }}>
        <Image src={src} alt="" fill unoptimized className="max-w-none" />
      </div>
    </div>
  );
}
