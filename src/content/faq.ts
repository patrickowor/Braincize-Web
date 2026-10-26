import type { FaqItem } from "@/lib/api/types";

/** Answers are not in the Figma file yet; add `answer` here (or from the API) to enable expanding. */
export const faqItems: FaqItem[] = [
  { id: "different-from-mri", question: "How is Braincize different from a regular MRI ?" },
  { id: "who-should-use", question: "Who should consider using Braincize ?" },
  { id: "safe-for-everyone", question: "Is Braincize safe for everyone to use?" },
  { id: "time-to-results", question: "How long does it take to see results with Braincize ?" },
];
