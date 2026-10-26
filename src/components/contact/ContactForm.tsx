"use client";

import { useState } from "react";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { api, type ContactMessage } from "@/lib/api";
import { cn } from "@/lib/cn";

const empty: ContactMessage = { name: "", email: "", address: "", phone: "", message: "" };

const field =
  "w-full rounded-[0.625rem] bg-white font-poppins font-medium capitalize outline-none placeholder:opacity-50 shadow-[0_0.25rem_1.5625rem_0.3125rem_rgba(4,10,64,0.1)] " +
  "text-[0.75rem] tracking-[-0.00015rem] placeholder:text-[rgba(4,10,64,0.36)] placeholder:opacity-70 " +
  "lg:text-[1rem] lg:tracking-normal lg:shadow-[0_0.25rem_0.875rem_0_rgba(0,0,0,0.25)] lg:placeholder:text-[#5d666f] lg:placeholder:opacity-50";

/** Contact form used on the Contact page and below the FAQ on the AI Scan page. */
export function ContactForm({ className }: { className?: string }) {
  const [values, setValues] = useState<ContactMessage>(empty);
  const { run, status, error, pending } = useAsyncAction(api.contact.send);

  const bind = (key: keyof ContactMessage) => ({
    name: key,
    value: values[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((current) => ({ ...current, [key]: e.target.value })),
  });

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result = await run(values);
    if (result) setValues(empty);
  }

  return (
    <form onSubmit={onSubmit} className={cn("flex flex-col", className)}>
      <div className="flex flex-wrap content-center items-center gap-x-[2.125rem] gap-y-[1.875rem] px-[0.34375rem]">
        <input {...bind("name")} required placeholder="your name" aria-label="Your name" className={cn(field, "h-[2.75rem] w-[16.25rem] px-[0.75rem] lg:h-[4.9375rem] lg:w-[22.375rem] lg:px-[1.5rem]")} />
        <input {...bind("email")} required type="email" placeholder="your email" aria-label="Your email" className={cn(field, "h-[2.75rem] w-[16.25rem] px-[0.75rem] lg:h-[4.9375rem] lg:w-[22.375rem] lg:px-[1.5rem]")} />
        <input {...bind("address")} placeholder="your address" aria-label="Your address" className={cn(field, "h-[2.75rem] w-[16.25rem] px-[0.75rem] lg:h-[4.9375rem] lg:w-[22.375rem] lg:px-[1.5rem]")} />
        <input {...bind("phone")} type="tel" placeholder="your number" aria-label="Your number" className={cn(field, "h-[2.75rem] w-[16.25rem] px-[0.75rem] lg:h-[4.9375rem] lg:w-[22.375rem] lg:px-[1.5rem]")} />
        <textarea
          {...bind("message")}
          required
          rows={1}
          placeholder="Write Something"
          aria-label="Your message"
          className={cn(field, "h-[2.75rem] w-[21.875rem] max-w-full resize-none px-[0.75rem] py-[0.75rem] lg:h-[4.9375rem] lg:w-[46.875rem] lg:px-[1.5rem] lg:py-[1.625rem]")}
        />
      </div>

      <div className="mt-[2rem] lg:mt-[3rem]">
        <button
          type="submit"
          disabled={pending}
          className="flex w-[9.3125rem] cursor-pointer items-center justify-center rounded-[0.5rem] bg-brand p-[0.625rem] font-poppins text-[1rem] leading-[normal] font-semibold text-white disabled:opacity-60 lg:w-auto lg:rounded-[0.75rem] lg:px-[2.8125rem] lg:py-[0.9375rem] lg:text-[1.5rem]"
        >
          <span className="lg:hidden">Contact us</span>
          <span className="hidden lg:inline">Contact Us</span>
        </button>
        <p role="status" className="mt-[0.75rem] font-poppins text-[0.875rem] text-ink">
          {status === "success" && "Thanks, we'll be in touch."}
          {status === "error" && error}
        </p>
      </div>
    </form>
  );
}
