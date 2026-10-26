import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <AuthShell
      heading="Welcome Back!"
      blurb="Sign in to pick up where you left off: your projects, models and scan results are waiting."
      title="Login"
      switchPrompt="Don't have an account?"
      switchLabel="Signup"
      switchHref="/signup"
    >
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
