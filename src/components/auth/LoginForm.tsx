"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { useAuth } from "@/providers/AuthProvider";
import { Lock, User } from "lucide-react";
import { Field, FormError, SubmitButton } from "./Field";

/** Only same-site paths are honoured, so `?next=` can't send people elsewhere. */
const safeNext = (next: string | null) => (next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard");

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { run, pending, error } = useAsyncAction(login);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const user = await run({ username, password });
    if (user) router.push(safeNext(params.get("next")));
  }

  return (
    <form onSubmit={onSubmit}>
      <Field label="Username" icon={User} placeholder="Enter your username" name="username" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <Field
        label="Password"
        icon={Lock}
        placeholder="Enter your password"
        name="password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <FormError>{error}</FormError>}
      <SubmitButton pending={pending}>{pending ? "Logging in…" : "Login"}</SubmitButton>
    </form>
  );
}
