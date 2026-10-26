import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { BrainScan } from "@/components/dashboard/BrainScan";

export const metadata: Metadata = { title: "Brain Scan" };

export default function BrainScanPage() {
  return (
    <>
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-2 font-poppins text-sm text-dash-muted-fg hover:text-dash-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        All projects
      </Link>
      <BrainScan />
    </>
  );
}
