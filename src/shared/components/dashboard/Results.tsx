import { Card } from "@/shared/components/dashboard/ui/card";
import { Badge } from "@/shared/components/dashboard/ui/badge";
import "@/shared/styles/dashboard.css";
import {  Model } from "@/shared/utils/models";

import { FileImage } from "lucide-react";

type ResultParam = {
    availableModels: Model[],
    docs: DocumentAnalysis[], 
    selectedModel: string
}



export function Result({ docs, selectedModel, availableModels } :  ResultParam){
    const completedImages = docs.filter(doc => doc.status === "complete");
    const avgAtrophyScore = completedImages.length > 0
        ? completedImages.reduce((sum, doc) => sum + (doc.metrics?.atrophyScore || 0), 0) / completedImages.length
        : 0;


    return  docs.length > 0 && (
        <section>
        <h2 className="text-xl font-semibold mb-4 text-foreground">Analysis Results</h2>
        
        {/* Overall Summary */}
        {completedImages.length > 0 && (
            <Card className="p-6 mb-4 bg-gradient-to-br from-card to-muted/20">
            <h3 className="font-semibold mb-4 text-foreground">Overall Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-card">
                <p className="text-sm text-muted-foreground mb-1">Images Analyzed</p>
                <p className="text-2xl font-bold text-primary">{completedImages.length}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-card">
                <p className="text-sm text-muted-foreground mb-1">Avg. Atrophy Score</p>
                <p className="text-2xl font-bold text-accent">{avgAtrophyScore.toFixed(1)}%</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-card">
                <p className="text-sm text-muted-foreground mb-1">Model Used</p>
                <p className="text-lg font-semibold text-foreground">
                    {availableModels.find(m => m.id === selectedModel)?.name}
                </p>
                </div>
            </div>
            </Card>
        )}

        {/* Individual Results */}
        <div className="grid grid-cols-1 gap-4">
            {docs.map((doc) => (
            <Card key={doc.id} className="p-6">
                <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-muted">
                    <FileImage className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-2">{doc.filename}</h4>
                    <div className="flex items-center gap-2">
                    {doc.status === "pending" && (
                        <Badge variant="secondary">Pending</Badge>
                    )}
                    {doc.status === "analyzing" && (
                        <Badge className="bg-accent text-accent-foreground">
                        Analyzing...
                        </Badge>
                    )}
                    {doc.status === "complete" && doc.metrics && (
                        <>
                        <Badge
                            variant={
                            doc.metrics.severity === "Normal"
                                ? "secondary"
                                : doc.metrics.severity === "Mild"
                                ? "default"
                                : "destructive"
                            }
                        >
                            {doc.metrics.severity}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                            Confidence: {(doc.confidence! * 100).toFixed(1)}%
                        </span>
                        </>
                    )}
                    </div>
                    {doc.status === "complete" && doc.metrics && (
                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                        <p className="text-sm text-muted-foreground mb-1">Atrophy Score</p>
                        <p className="text-lg font-semibold text-foreground">
                            {doc.metrics.atrophyScore.toFixed(1)}%
                        </p>
                        </div>
                        <div>
                        <p className="text-sm text-muted-foreground mb-1">Volume Loss</p>
                        <p className="text-lg font-semibold text-foreground">
                            {doc.metrics.volumeLoss.toFixed(1)}%
                        </p>
                        </div>
                    </div>
                    )}
                    {doc.status === "error" && (
                        <>
                            <Badge variant="destructive">Error</Badge>
                            <span className="text-sm text-muted-foreground">
                                {"   "}{doc.prediction}
                            </span>
                        </>
                    )}
                </div>
                </div>
            </Card>
            ))}
        </div>
        </section>
    )
}

export interface DocumentAnalysis {
  id: string;
  filename: string;
  status: "pending" | "analyzing" | "complete" | "error";
  prediction?: string;
  confidence?: number;
  metrics?: {
    atrophyScore: number;
    volumeLoss: number;
    severity: "Mild" | "Moderate" | "Severe" | "Normal";
  };
}
