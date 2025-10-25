/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card } from "@/shared/components/dashboard/ui/card";
import { Button } from "@/shared/components/dashboard/ui/button";
import { Progress } from "@/shared/components/dashboard/ui/progress";
import {  Upload } from "lucide-react";
import "@/shared/styles/dashboard.css";

type FileUploaderParam = {
    docs : any,
    isAnalyzing: boolean,
    progress: number,
    selectedModel: string,
    startAnalysis: (...args: any) => void,
    handleFileUpload: (...args: any) => void
}

export default function FileUploader ({ docs,isAnalyzing, progress, selectedModel, startAnalysis ,handleFileUpload}: FileUploaderParam) {
    return         <section>
          <h2 className="text-xl font-semibold mb-4 text-foreground">Upload Brain MRI Images</h2>
          <Card className="p-8">
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-12 cursor-pointer hover:border-primary transition-colors bg-muted/20">
              <Upload className="h-12 w-12 text-muted-foreground mb-4" />
              <span className="text-lg font-medium text-foreground mb-2">
                Drop files here or click to browse
              </span>
              <span className="text-sm text-muted-foreground">
                Supports JPEG, PNG, DICOM formats
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {docs.length > 0 && (
              <div className="mt-6 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-foreground">Uploaded Images ({docs.length})</h3>
                  <Button
                    onClick={startAnalysis}
                    disabled={isAnalyzing || !selectedModel}
                    className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                  >
                    {isAnalyzing ? "Analyzing..." : "Start Analysis"}
                  </Button>
                </div>
                {isAnalyzing && (
                  <div className="space-y-2">
                    <Progress value={progress} className="h-2" />
                    <p className="text-sm text-muted-foreground text-center">
                      Analyzing: {Math.round(progress)}% complete
                    </p>
                  </div>
                )}
              </div>
            )}
          </Card>
        </section>
}

