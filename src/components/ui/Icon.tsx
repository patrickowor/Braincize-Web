import Image from "next/image";
import { cn } from "@/lib/cn";
import { rem } from "@/lib/rem";

export type IconFlip = "none" | "y" | "xy";

const flipClass: Record<IconFlip, string> = {
  none: "",
  y: "-scale-y-100",
  xy: "-scale-y-100 rotate-180",
};

export interface IconSpec {
  src: string;
  /** Frame size in design px. */
  size: number;
  /** Inset of the artwork box inside the frame (Figma "elements" layer). */
  boxInset: string;
  /** Extra inset the exported SVG needs for its stroke. */
  imgInset?: string;
  flip?: IconFlip;
  rotate?: string;
}

/**
 * Reproduces a Figma icon component 1:1: fixed frame → inset "elements" layer → exported SVG.
 * The exported SVGs keep Figma's flipped coordinates, so the same flip is applied here.
 */
export function Icon({ src, size, boxInset, imgInset, flip = "none", rotate, className }: IconSpec & { className?: string }) {
  return (
    <span className={cn("block shrink-0", flipClass[flip], className)} style={rotate ? { transform: rotate } : undefined}>
      <span className="relative block overflow-clip" style={{ width: rem(size), height: rem(size) }}>
        <span className="absolute" style={{ inset: boxInset }}>
          <span className="absolute" style={{ inset: imgInset ?? 0 }}>
            <Image src={src} alt="" fill unoptimized className="block max-w-none" />
          </span>
        </span>
      </span>
    </span>
  );
}
