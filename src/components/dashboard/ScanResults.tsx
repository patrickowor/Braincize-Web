"use client";

import { FileImage } from "lucide-react";
import Image from "next/image";
import { Badge, Card } from "@/components/ui/dashboard";
import type { ScanModel } from "@/content/scanModels";
import type { ScanItem } from "./types";

const severityBadge = (severity: string) => (severity === "Normal" ? "secondary" : severity === "Mild" ? "default" : "destructive");

export function ScanResults({ items, model }: { items: ScanItem[]; model: ScanModel | undefined }) {
  if (!items.length) return null;

  const done = items.filter((item) => item.status === "complete" && item.outcome);
  const average = done.length ? done.reduce((sum, item) => sum + (item.outcome?.atrophyScore ?? 0), 0) / done.length : 0;

  return (
    <section aria-labelledby="results-heading">
      <h2 id="results-heading" className="mb-4 font-poppins text-xl font-semibold text-dash-fg">
        Analysis Results
      </h2>

      {done.length > 0 && (
        <Card className="mb-4 bg-gradient-to-br from-white to-dash-muted/20 p-6">
          <h3 className="mb-4 font-poppins font-semibold text-dash-fg">Overall Summary</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Stat label="Images Analyzed" value={String(done.length)} tone="primary" />
            <Stat label="Avg. Atrophy Score" value={`${average.toFixed(1)}%`} tone="accent" />
            <Stat label="Model Used" value={model ? `${model.name} · ${model.version}` : "—"} small />
          </div>
        </Card>
      )}

      <ul className="grid grid-cols-1 gap-4">
        {items.map((item) => (
          <li key={item.id}>
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden bg-dash-muted">
                  {item.previewUrl ? (
                    <Image src={item.previewUrl} alt="" fill unoptimized className="object-cover" />
                  ) : (
                    <FileImage className="h-6 w-6 text-dash-muted-fg" aria-hidden />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="mb-2 truncate font-poppins font-medium text-dash-fg">{item.file.name}</h4>
                  <div className="flex flex-wrap items-center gap-2">
                    {item.status === "pending" && <Badge variant="secondary">Pending</Badge>}
                    {item.status === "analyzing" && <Badge className="border-transparent bg-dash-accent text-dash-fg">Analyzing...</Badge>}
                    {item.status === "complete" && item.outcome && (
                      <>
                        <Badge variant={severityBadge(item.outcome.severity)}>{item.outcome.severity}</Badge>
                        <span className="font-poppins text-sm text-dash-muted-fg">{item.outcome.message}</span>
                      </>
                    )}
                    {item.status === "error" && (
                      <>
                        <Badge variant="destructive">Error</Badge>
                        <span className="font-poppins text-sm text-dash-muted-fg">{item.error}</span>
                      </>
                    )}
                  </div>
                  {item.status === "complete" && item.outcome && (
                    <div className="mt-4">
                      <p className="mb-1 font-poppins text-sm text-dash-muted-fg">Atrophy Score</p>
                      <p className="font-poppins text-lg font-semibold text-dash-fg">{item.outcome.atrophyScore.toFixed(1)}%</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Stat({ label, value, tone, small }: { label: string; value: string; tone?: "primary" | "accent"; small?: boolean }) {
  return (
    <div className=" bg-surface p-4 text-center">
      <p className="mb-1 font-poppins text-sm text-dash-muted-fg">{label}</p>
      <p
        className={`font-poppins font-bold ${small ? "text-lg font-semibold text-dash-fg" : "text-2xl"} ${
          tone === "primary" ? "text-dash-primary" : tone === "accent" ? "text-dash-accent" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}
