"use client";

import { Eye, EyeOff, Loader2, type LucideIcon } from "lucide-react";
import { useId, useState } from "react";
import { cn } from "@/lib/cn";

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & { label: string; icon?: LucideIcon };

/** Labelled text input in the auth form style. Password fields get a show/hide toggle. */
export function Field({ label, icon: Icon, className, type, ...props }: FieldProps) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";

  return (
    <div className={cn("mb-[1rem] flex flex-1 flex-col", className)}>
      <label htmlFor={id} className="mb-[0.375rem] font-poppins text-[0.875rem] font-medium text-ink">
        {label}
      </label>
      <div className="relative">
        {Icon && <Icon className="pointer-events-none absolute top-1/2 left-[0.875rem] size-[1.125rem] -translate-y-1/2 text-ink opacity-50" aria-hidden />}
        <input
          id={id}
          required
          {...props}
          type={isPassword && visible ? "text" : type}
          className={cn(
            "h-[3rem] w-full rounded-[0.75rem] border border-edge bg-page px-[0.875rem] font-poppins text-[0.9375rem] text-ink transition-shadow outline-none placeholder:text-placeholder focus:border-brand focus:ring-4 focus:ring-brand/20",
            Icon && "pl-[2.75rem]",
            isPassword && "pr-[2.75rem]",
          )}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            className="absolute top-1/2 right-[0.5rem] flex size-[2rem] -translate-y-1/2 cursor-pointer items-center justify-center rounded-[0.5rem] text-ink opacity-60 hover:opacity-100"
          >
            {visible ? <EyeOff className="size-[1.125rem]" aria-hidden /> : <Eye className="size-[1.125rem]" aria-hidden />}
          </button>
        )}
      </div>
    </div>
  );
}

export function FormError({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="mb-[1rem] rounded-[0.5rem] bg-red-500/10 px-[0.875rem] py-[0.625rem] font-poppins text-[0.875rem] text-red-600 dark:text-red-400">
      {children}
    </p>
  );
}

export function SubmitButton({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex h-[3rem] w-full cursor-pointer items-center justify-center gap-[0.5rem] rounded-[0.75rem] bg-brand font-poppins text-[1rem] font-semibold text-white transition-colors hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending && <Loader2 className="size-[1.125rem] animate-spin" aria-hidden />}
      {children}
    </button>
  );
}
