"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { useAuth } from "@/providers/AuthProvider";
import { Lock, Mail, User } from "lucide-react";
import { Field, FormError, SubmitButton } from "./Field";

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
        <Field label="First Name" icon={User} placeholder="First name" autoComplete="given-name" {...bind("firstName")} />
        <Field label="Last Name" icon={User} placeholder="Last name" autoComplete="family-name" {...bind("lastName")} />
      </div>
      <Field label="Email Address" icon={Mail} placeholder="you@example.com" type="email" autoComplete="email" {...bind("email")} />
      <Field label="Password" icon={Lock} placeholder="At least 8 characters" type="password" autoComplete="new-password" minLength={8} {...bind("password")} />
      {error && <FormError>{error}</FormError>}
      <SubmitButton pending={pending}>{pending ? "Creating account…" : "Create Account"}</SubmitButton>
    </form>
  );
}
