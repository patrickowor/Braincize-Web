"use client";

import { useState } from "react";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { api, type ContactMessage } from "@/lib/api";
import { cn } from "@/lib/cn";

const empty: ContactMessage = { name: "", email: "", address: "", phone: "", message: "" };

const field =
  "w-full border border-edge bg-page px-[0.875rem] font-poppins text-[0.9375rem] text-ink outline-none transition-shadow placeholder:text-placeholder focus:border-brand focus:ring-4 focus:ring-brand/20";

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
    <form
      onSubmit={onSubmit}
      className={cn("border border-edge bg-surface p-[1.25rem] shadow-[0_0.5rem_2rem_0_rgba(24,134,244,0.12)] lg:p-[2.5rem]", className)}
    >
      <h2 className="font-montserrat text-[1.25rem] font-bold text-navy lg:text-[1.75rem]">Send us a message</h2>
      <p className="mt-[0.375rem] mb-[1.5rem] font-poppins text-[0.875rem] text-ink opacity-70 lg:text-[1rem]">
        Tell us a little about yourself and we&apos;ll get back to you.
      </p>

      <div className="grid gap-[1rem] lg:grid-cols-2 lg:gap-[1.25rem]">
        <input {...bind("name")} required placeholder="Your name" aria-label="Your name" className={cn(field, "h-[3rem]")} />
        <input {...bind("email")} required type="email" placeholder="Your email" aria-label="Your email" className={cn(field, "h-[3rem]")} />
        <input {...bind("address")} placeholder="Your address" aria-label="Your address" className={cn(field, "h-[3rem]")} />
        <input {...bind("phone")} type="tel" placeholder="Your number" aria-label="Your number" className={cn(field, "h-[3rem]")} />
        <textarea
          {...bind("message")}
          required
          rows={5}
          placeholder="Write something"
          aria-label="Your message"
          className={cn(field, "resize-none py-[0.75rem] lg:col-span-2")}
        />
      </div>

      <div className="mt-[1.5rem] flex flex-col gap-[0.75rem] lg:flex-row lg:items-center lg:gap-[1.25rem]">
        <button
          type="submit"
          disabled={pending}
          className="flex h-[3rem] w-full cursor-pointer items-center justify-center bg-brand px-[2rem] font-poppins text-[1rem] font-semibold text-white transition-colors hover:brightness-95 disabled:opacity-60 lg:w-auto"
        >
          Contact us
        </button>
        <p role="status" className="font-poppins text-[0.875rem] text-ink">
          {status === "success" && "Thanks, we'll be in touch."}
          {status === "error" && error}
        </p>
      </div>
    </form>
  );
}
