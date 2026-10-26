"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { useAuth } from "@/providers/AuthProvider";
import { Field, SubmitButton } from "./Field";

export function SignupForm() {
  const router = useRouter();
  const { signup } = useAuth();
  const [values, setValues] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const { run, pending, error } = useAsyncAction(signup);

  const bind = (key: keyof typeof values) => ({
    name: key,
    value: values[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValues((current) => ({ ...current, [key]: e.target.value })),
  });

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const user = await run(values);
    if (user) router.push("/dashboard");
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex gap-[0.9375rem] max-[37.5rem]:flex-col max-[37.5rem]:gap-0">
        <Field label="First Name" autoComplete="given-name" {...bind("firstName")} />
        <Field label="Last Name" autoComplete="family-name" {...bind("lastName")} />
      </div>
      <Field label="Email Address" type="email" autoComplete="email" {...bind("email")} />
      <Field label="Password" type="password" autoComplete="new-password" minLength={8} {...bind("password")} />
      {error && (
        <p role="alert" className="font-poppins text-[0.875rem] text-[#c0392b]">
          {error}
        </p>
      )}
      <SubmitButton pending={pending}>{pending ? "Creating account…" : "Create Account"}</SubmitButton>
    </form>
  );
}
