"use client";

import { CheckCircle2 } from "lucide-react";
import { Badge, Card } from "@/components/ui/dashboard";
import type { ScanModel } from "@/content/scanModels";
import type { ScanModelId } from "@/lib/api/types";
import { cn } from "@/lib/cn";

interface ModelPickerProps {
  models: ScanModel[];
  selected: ScanModelId | null;
  onSelect: (id: ScanModelId) => void;
}

/** Choose exactly one analysis model. */
export function ModelPicker({ models, selected, onSelect }: ModelPickerProps) {
  return (
    <section aria-labelledby="model-heading">
      <h2 id="model-heading" className="mb-4 font-poppins text-xl font-semibold text-dash-fg">
        Select Analysis Model
      </h2>
      <div role="radiogroup" aria-labelledby="model-heading" className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {models.map((model) => {
          const active = selected === model.id;
          return (
            <button
              key={model.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onSelect(model.id)}
              className="cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dash-primary"
            >
              <Card
                className={cn(
                  "h-full p-6 transition-all hover:shadow-dash-elevated",
                  active ? "bg-dash-accent/10 ring-2 ring-dash-primary" : "hover:border-dash-primary/50",
                )}
              >
                <div className="mb-3 flex items-start justify-between">
                  <h3 className="font-poppins text-lg font-semibold text-dash-fg">{model.name}</h3>
                  {active && <CheckCircle2 className="h-5 w-5 shrink-0 text-dash-primary" aria-hidden />}
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Badge variant="secondary">{model.type}</Badge>
                    <Badge variant="outline" className="border-dash-primary/20 bg-dash-primary/10 text-dash-primary">
                      {model.version}
                    </Badge>
                  </div>
                  <p className="font-poppins text-sm text-dash-muted-fg">{model.description}</p>
                </div>
              </Card>
            </button>
          );
        })}
      </div>
    </section>
  );
}
