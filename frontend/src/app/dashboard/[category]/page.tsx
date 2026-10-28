import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ScanProject } from "@/components/dashboard/ScanProject";

export const metadata: Metadata = { title: "Analysis" };

/** Any category the backend lists (`/dashboard/brainscan`, `/dashboard/lungscan`, ...). */
export default async function ScanProjectPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;

  return (
    <>
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-2 font-poppins text-sm text-dash-muted-fg hover:text-dash-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        All projects
      </Link>
      <ScanProject categoryId={category} />
    </>
  );
}
