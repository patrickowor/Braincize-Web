"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & { label: string };

/** Labelled text input in the auth form style. */
export function Field({ label, className, ...props }: FieldProps) {
  const id = useId();
  return (
    <div className={cn("mb-[0.9375rem] flex flex-1 flex-col", className)}>
      <label htmlFor={id} className="mb-[0.375rem] font-poppins text-[0.875rem] text-[#333]">
        {label}
      </label>
      <input
        id={id}
        required
        {...props}
        className="rounded-[0.25rem] border border-[#ccc] px-[0.75rem] py-[0.625rem] font-poppins text-[0.9375rem] text-black outline-none focus:border-[#1a1f4b]"
      />
    </div>
  );
}

export function SubmitButton({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-[0.625rem] w-full cursor-pointer rounded-[0.25rem] border-2 border-transparent bg-[#1a1f4b] p-[0.75rem] font-poppins text-[1rem] text-white hover:border-black disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  );
}
