import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = { title: "Sign up" };

export default function SignupPage() {
  return (
    <AuthShell
      heading="An AI-powered Neuroimaging Tool"
      blurb="Create an account to analyse MRI scans with models built for early detection of brain atrophy."
      title="Create Account"
      switchPrompt="Already have an account?"
      switchLabel="Login"
      switchHref="/login"
    >
      <SignupForm />
    </AuthShell>
  );
}
