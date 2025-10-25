import { Card } from "@/shared/components/dashboard/ui/card";
import { Badge } from "@/shared/components/dashboard/ui/badge";
import {   CheckCircle2 } from "lucide-react";
import "@/shared/styles/dashboard.css";
import { Model } from "@/shared/utils/models";

type ModelSelectionParam = {
    availableModels: Model[],
    selectedModel: string, 
    handleModelSelect : (val: string) => void
}

export default function ModelSelection ({availableModels,  selectedModel, handleModelSelect}: ModelSelectionParam){
    return (        <section>
          <h2 className="text-xl font-semibold mb-4 text-foreground">Select Analysis Model</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {availableModels.map((model) => (
              <Card
                key={model.id}
                className={`p-6 cursor-pointer transition-all hover:shadow-elevated ${
                  selectedModel === model.id
                    ? "ring-2 ring-primary bg-accent/10"
                    : "hover:border-primary/50"
                }`}
                onClick={() => handleModelSelect(model.id)}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg text-foreground">{model.name}</h3>
                  {selectedModel === model.id && (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Badge variant="secondary">{model.type}</Badge>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {model.version}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{model.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>)
}