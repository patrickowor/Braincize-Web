"use client";

import Image from "next/image";
import { useState } from "react";
import { Icon, type IconSpec } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type Size = "lg" | "sm" | "mobile";
type Control = "home" | "play" | "forward" | "backward" | "subtitle" | "more";

/** Icon exports per control and size. Insets are the ones Figma reports for each export. */
const controls: Record<Size, Record<Control, Omit<IconSpec, "size">>> = {
  lg: {
    home: { src: "/icons/player/home.svg", boxInset: "8.33%", imgInset: "-3.33%" },
    play: { src: "/icons/player/play.svg", boxInset: "15.62% 17.71%" },
    forward: { src: "/icons/player/forward-5.svg", boxInset: "8.33%", imgInset: "-3.33%" },
    backward: { src: "/icons/player/backward-5.svg", boxInset: "8.33%", imgInset: "-3.33%" },
    subtitle: { src: "/icons/player/subtitle.svg", boxInset: "10.42%", imgInset: "-3.51%" },
    more: { src: "/icons/player/more-vertical.svg", boxInset: "25% 49.96% 20.83% 49.93%", imgInset: "-5.12% -2709.07% 0 -2709.46%" },
  },
  sm: {
    home: { src: "/icons/player/home.svg", boxInset: "8.33%", imgInset: "-3.33%" },
    play: { src: "/icons/player/sm-play.svg", boxInset: "15.62% 17.71%" },
    forward: { src: "/icons/player/sm-forward-5.svg", boxInset: "8.33%", imgInset: "-3.75%" },
    backward: { src: "/icons/player/sm-backward-5.svg", boxInset: "8.33%", imgInset: "-3.75%" },
    subtitle: { src: "/icons/player/sm-subtitle.svg", boxInset: "10.42%", imgInset: "-3.95%" },
    more: { src: "/icons/player/sm-more-vertical.svg", boxInset: "25% 49.96% 20.83% 49.93%", imgInset: "-9.62% -5042.23% -1.93% -5044.49%" },
  },
  mobile: {
    home: { src: "/icons/player/mobile/home.svg", boxInset: "8.33%", imgInset: "-3.75%" },
    play: { src: "/icons/player/mobile/play.svg", boxInset: "15.62% 17.71%" },
    forward: { src: "/icons/player/mobile/forward-5.svg", boxInset: "8.33%", imgInset: "-5%" },
    backward: { src: "/icons/player/mobile/backward-5.svg", boxInset: "8.33%", imgInset: "-5%" },
    subtitle: { src: "/icons/player/mobile/subtitle.svg", boxInset: "10.42%", imgInset: "-5.26% -5.27% -5.27% -5.26%" },
    more: { src: "/icons/player/mobile/more-vertical.svg", boxInset: "25% 49.96% 20.83% 49.93%", imgInset: "-7.69% -4064.29% 0 -4063.5%" },
  },
};

const px = { lg: 36, sm: 23.732, mobile: 18 } as const;

function Control({ size, name }: { size: Size; name: Control }) {
  return <Icon {...controls[size][name]} size={px[size]} />;
}

/** The brain frame with its progress track, shared by the big slide player and the small preview. */
function PlayerFrame({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("relative overflow-clip border-solid border-[rgba(204,204,204,0.2)] bg-white", className)}>
      <div className="absolute -top-[var(--b)] -left-[var(--b)] h-[calc(100%+2*var(--b))] w-[calc(100%+2*var(--b))] overflow-hidden">
        <Image src="/images/aiscan/player-brain.png" alt="Brain MRI slice" fill unoptimized className="object-cover object-left" />
      </div>
      {children}
    </div>
  );
}

function Progress({ className, fill }: { className: string; fill: number }) {
  return (
    <div className={cn("absolute overflow-clip rounded-full bg-[rgba(24,134,244,0.1)]", className)}>
      <div className="h-full bg-brand" style={{ width: `${fill}%` }} />
    </div>
  );
}

const badge =
  "absolute flex items-center justify-center bg-[rgba(24,134,244,0.45)] font-poppins leading-[normal] font-semibold whitespace-pre text-white";

/** Big slide player ("View in slide"). */
function SlidePlayer({ onSwap, onRestart }: { onSwap: () => void; onRestart: () => void }) {
  return (
    <div className="relative">
      <PlayerFrame
        className="[--b:0.207rem] mx-auto h-[16.56063rem] w-[25.625rem] max-w-none rounded-[0.66244rem] border-[0.207rem] shadow-[0_0.16562rem_0.621rem_0_rgba(24,134,244,0.1)] lg:[--b:0.57913rem] lg:mx-0 lg:h-[46.32937rem] lg:w-[71.6875rem] lg:rounded-[1.85319rem] lg:border-[0.57913rem] lg:shadow-[0_0.46331rem_1.73737rem_0_rgba(24,134,244,0.1)]"
      >
        <Progress className="top-[13.41563rem] left-[1.04313rem] h-[0.13425rem] w-[23.5625rem] lg:top-[36.73313rem] lg:left-[3.10812rem] lg:h-[0.38212rem] lg:w-[67.05988rem]" fill={32.5} />

        <button
          type="button"
          onClick={onSwap}
          className={cn(
            badge,
            "top-[0.46313rem] left-[calc(50%+10.91375rem)] h-[0.72013rem] w-[2.14475rem] -translate-x-1/2 cursor-pointer rounded-[0.18787rem] text-[0.5rem]",
            "lg:top-[1.29563rem] lg:left-[calc(50%+30.53125rem)] lg:h-[2.01463rem] lg:w-[6rem] lg:rounded-[0.52556rem] lg:text-[0.70075rem]",
          )}
        >
          <span className="lg:hidden">Slide</span>
          <span className="hidden lg:inline">View in slide </span>
        </button>

        {/* mobile controls */}
        <div className="absolute top-[14.29312rem] left-[1.10563rem] flex w-[23.875rem] items-center gap-[0.9375rem] lg:hidden">
          <div className="flex items-center gap-[1rem]">
            <Control size="mobile" name="home" />
            <Control size="mobile" name="play" />
            <div className="flex items-center gap-[1rem]">
              <Control size="mobile" name="forward" />
              <Control size="mobile" name="backward" />
            </div>
          </div>
          <div className="flex flex-1 items-start justify-between">
            <button type="button" onClick={onRestart} className="flex h-[1.5rem] cursor-pointer items-center justify-center rounded-[0.5rem] bg-[rgba(24,134,244,0.45)] px-[0.3125rem] font-poppins text-[0.625rem] leading-[normal] text-white opacity-30">
              Restart Scan{" "}
            </button>
            <div className="flex w-[3.25rem] items-center justify-between">
              <Control size="mobile" name="subtitle" />
              <Control size="mobile" name="more" />
            </div>
          </div>
        </div>

        {/* desktop controls */}
        <div className="absolute top-[40.79563rem] left-[3.10812rem] hidden items-center gap-[1.9375rem] lg:flex">
          <Control size="lg" name="home" />
          <Control size="lg" name="play" />
          <div className="flex items-center gap-[1rem]">
            <Control size="lg" name="forward" />
            <Control size="lg" name="backward" />
          </div>
        </div>
        <span className="absolute top-[40.42063rem] left-[64.17063rem] hidden lg:block">
          <Control size="lg" name="subtitle" />
        </span>
        <span className="absolute top-[40.42063rem] left-[67.92063rem] hidden lg:block">
          <Control size="lg" name="more" />
        </span>
      </PlayerFrame>

      <button
        type="button"
        onClick={onRestart}
        className="absolute top-[40.8125rem] left-[19.6875rem] hidden h-[2.875rem] w-[8.5625rem] cursor-pointer items-center justify-center rounded-[0.75rem] bg-[rgba(24,134,244,0.45)] px-[0.625rem] py-[0.3125rem] font-poppins text-[1rem] leading-[normal] font-semibold text-white lg:flex"
      >
        Restart Scan{" "}
      </button>
    </div>
  );
}

/** Blue "View in mp4" panel with the infarction progression stills. */
function Mp4Panel({ onSwap }: { onSwap: () => void }) {
  const stills = ["scan-a", "scan-b", "scan-c", "scan-a"];
  return (
    <div className="relative mx-auto h-[14.17713rem] w-[30.375rem] max-w-none shrink-0 overflow-clip rounded-[0.76981rem] bg-brand lg:mx-0 lg:h-[33.625rem] lg:w-[72.04269rem] lg:rounded-[1.82581rem]">
      <div className="absolute top-[calc(50%-0.085rem)] left-[calc(50%-0.14188rem)] flex w-[22.5635rem] -translate-x-1/2 -translate-y-1/2 items-center gap-[1.61994rem] overflow-clip mix-blend-plus-lighter lg:w-[27.9955rem] lg:gap-[2.00994rem]">
        {stills.map((name, i) => (
          <div key={`${name}-${i}`} className="relative h-[14.81094rem] w-[22.5635rem] shrink-0 lg:h-[18.3765rem] lg:w-[27.9955rem]">
            <Image src={`/images/aiscan/${name}.png`} alt="Natural progression of infarction" fill unoptimized className="rounded-[0.649rem] object-cover" />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onSwap}
        className={cn(
          badge,
          "top-[0.44812rem] left-[calc(50%+13.56188rem)] h-[0.84937rem] w-[2.52975rem] -translate-x-1/2 cursor-pointer rounded-[0.22156rem] text-[0.29544rem]",
          "lg:top-[1.0625rem] lg:left-[calc(50%+32.16625rem)] lg:h-[2.01463rem] lg:w-[6rem] lg:rounded-[0.52556rem] lg:text-[0.70075rem]",
        )}
      >
        View in  mp4{" "}
      </button>
    </div>
  );
}

/** Desktop peek card on the right edge: the other view, one click away. */
function Peek({ view, onSwap }: { view: "slide" | "mp4"; onSwap: () => void }) {
  if (view === "slide") {
    return (
      <button type="button" onClick={onSwap} aria-label="Show slide view" className="relative hidden h-[14.98669rem] w-[23.18962rem] shrink-0 cursor-pointer overflow-clip rounded-[0.59944rem] border-[0.18731rem] border-solid border-[rgba(204,204,204,0.2)] bg-white shadow-[0_0.14988rem_0.562rem_0_rgba(24,134,244,0.1)] lg:block">
        <div className="absolute -top-[0.1875rem] -left-[0.175rem] h-[15rem] w-[23.24381rem] overflow-hidden">
          <Image src="/images/aiscan/player-brain.png" alt="" fill unoptimized className="object-cover object-left" />
        </div>
        <Progress className="top-[11.37rem] left-[0.67812rem] h-[0.12362rem] w-[21.69262rem]" fill={32.5} />
        <span className="absolute top-[12.42062rem] left-[0.3075rem]"><Control size="sm" name="play" /></span>
        <span className="absolute top-[12.42062rem] left-[2.84125rem] flex items-center gap-[1.05062rem]">
          <Control size="sm" name="forward" />
          <Control size="sm" name="backward" />
        </span>
        <span className="absolute top-[12.42062rem] left-[19.21875rem]"><Control size="sm" name="subtitle" /></span>
        <span className="absolute top-[12.42062rem] left-[20.8875rem]"><Control size="sm" name="more" /></span>
      </button>
    );
  }
  return (
    <button type="button" onClick={onSwap} aria-label="Show mp4 view" className="relative hidden h-[15rem] w-[22.5rem] shrink-0 cursor-pointer rounded-[1.5rem] bg-black lg:block">
      <span className="absolute top-[7.625rem] left-[7.8125rem] flex w-[12.1875rem] items-center gap-[0.875rem] overflow-clip mix-blend-plus-lighter">
        {["scan-a", "scan-b", "scan-c", "scan-a"].map((name, i) => (
          <span key={`${name}-${i}`} className="relative block h-[8rem] w-[12.1875rem] shrink-0">
            <Image src={`/images/aiscan/${name}.png`} alt="" fill unoptimized className="rounded-[0.649rem] object-cover" />
          </span>
        ))}
      </span>
    </button>
  );
}

/** Result of a scan, shown as either the slide player or the mp4 panel. */
export function ResultViewer({ onRestart, initialView = "slide" }: { onRestart: () => void; initialView?: "slide" | "mp4" }) {
  const [view, setView] = useState<"slide" | "mp4">(initialView);
  const swap = () => setView((v) => (v === "slide" ? "mp4" : "slide"));

  return (
    <div className="overflow-x-clip lg:min-h-[46.329rem]">
      <div className={cn("flex justify-center lg:ml-[8.125rem] lg:justify-start lg:gap-[3.1875rem]", view === "mp4" && "lg:pt-[5rem]")}>
        {view === "slide" ? <SlidePlayer onSwap={swap} onRestart={onRestart} /> : <Mp4Panel onSwap={swap} />}
        <Peek view={view === "slide" ? "mp4" : "slide"} onSwap={swap} />
      </div>
    </div>
  );
}
