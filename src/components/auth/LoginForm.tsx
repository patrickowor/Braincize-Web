"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { useAuth } from "@/providers/AuthProvider";
import { Field, SubmitButton } from "./Field";

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
      <Field label="Username" name="username" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && (
        <p role="alert" className="font-poppins text-[0.875rem] text-[#c0392b]">
          {error}
        </p>
      )}
      <SubmitButton pending={pending}>{pending ? "Logging in…" : "Login"}</SubmitButton>
    </form>
  );
}
