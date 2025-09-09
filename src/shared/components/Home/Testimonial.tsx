"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {  Quote } from "lucide-react";


const TESTIMONIALS = [
  {
    name: "Adaeze U.",
    role: "Product Manager, Lagos",
    quote:
      "This transformed our onboarding—customers actually read the reviews and convert.",
  },
  {
    name: "Michael A.",
    role: "Founder, Abuja",
    quote:
      "Simple to drop in, gorgeous out of the box. Ten minutes and done!",
  },
];


// --- UI PRIMITIVES ---

export function Card({ children, className = "",  }: { children: React.ReactNode; className?: string, role?: string }) {
  return <div className={`rounded-xl border bg-white shadow-sm ${className}`}>{children}</div>;
}

export function CardHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-4 flex items-center gap-2 ${className}`}>{children}</div>;
}

export function CardContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-4 pt-0 ${className}`}>{children}</div>;
}

export function Button({
  children,
  onClick,
  size = "md",
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: "sm" | "md" | "icon";
  variant?: "primary" | "secondary";
}) {
  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    icon: "p-2",
  };

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
  };

  return (
    <button
      onClick={onClick}
      className={`rounded-lg font-medium transition-colors ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// --- PAGE COMPONENTS ---

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  // deterministic color from name
  const hue = useMemo(
    () => (Array.from(name).reduce((a, c) => a + c.charCodeAt(0), 0) % 360),
    [name]
  );
  return (
    <div
      className="flex h-10 w-10 items-center justify-center rounded-full font-semibold text-white"
      style={{ backgroundColor: `hsl(${hue} 70% 45%)` }}
      aria-hidden
    >
      {initials}
    </div>
  );
}



function SnapCarousel({ items }: { items: typeof TESTIMONIALS }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);

  // Auto-advance every 6s (pause on hover/focus)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let hover = false;
    const onEnter = () => (hover = true);
    const onLeave = () => (hover = false);

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);

    const id = setInterval(() => {
      if (hover) return;
      snapTo((index + 1) % items.length);
    }, 6000);

    return () => {
      clearInterval(id);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
    
  }, [index, items.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") snapTo(Math.min(index + 1, items.length - 1));
      if (e.key === "ArrowLeft") snapTo(Math.max(index - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, items.length]);

  const snapTo = (i: number) => {
    const el = containerRef.current;
    if (!el) return;
    const card = el.querySelectorAll<HTMLElement>("[data-card]")[i];
    if (!card) return;
    setIndex(i);
    card.scrollIntoView({ inline: "center", behavior: "smooth", block: "nearest" });
  };

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="no-scrollbar scroll-smooth snap-x snap-mandatory overflow-x-auto py-6 testimonial-tab"
        aria-roledescription="carousel"
        aria-label="Testimonials"

        style={{paddingTop: '30px'}}
      >
        <div className="mx-auto flex w-max gap-6 px-6">
          {items.map((t, i) => (
            <Card
              key={i}
              data-card
              role="group"
              aria-roledescription={`slide ${i + 1} of ${items.length}`}
              className="snap-center w-[320px] sm:w-[380px] md:w-[520px] shrink-0 rounded-2xl border border-gray-200 bg-white/70 shadow-sm backdrop-blur transition-shadow hover:shadow-md"
            >
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar name={t.name} />
                <div>
                  <div className="text-base font-semibold text-gray-900">{t.name}</div>
                  <div className="text-sm text-gray-600">{t.role}</div>
                </div>
                <Quote className="ml-auto size-5 opacity-60" aria-hidden />
              </CardHeader>
              <CardContent>
                <p className="text-gray-800 text-lg leading-relaxed">
                  “{t.quote}”
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TestimonialPage() {
  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900">

      <section className="mx-auto max-w-4xl px-6 py-10 sm:py-14" style={{paddingBottom: '10px'}}>
        <div className="mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Testimonials
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Our greatest measure of success comes from the words of those who believe in what we do.
          </p>
        </div>
      </section>

      <style>{`
        .testimonial-tab::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Carousel */}
      <section className="mx-auto max-w-6xl px-2 sm:px-6 pb-16 ">
        <SnapCarousel items={TESTIMONIALS} />
      </section>
    </div>
  );
}
