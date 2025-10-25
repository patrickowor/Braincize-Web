"use client";
import { useState } from "react";
import { toast } from "sonner";
import { availableModels } from "@/shared/utils/models";
import "@/shared/styles/dashboard.css";
import ModelSelection from "../../../shared/components/dashboard/ModelSelection";
import FileUploader from "../../../shared/components/dashboard/FileUpload";
import {Result, DocumentAnalysis } from "../../../shared/components/dashboard/Results";
import { BASE_URL } from "@/shared/utils/urls";
import constants from "@/shared/utils/constants";

const Dashboard = () => {
    const [selectedModel, setSelectedModel] = useState<string | null>(null);
    const [docs, setDoc] = useState<DocumentAnalysis[]>([]);
    const [docFile, setDocFile] = useState<Record<string, File>>({});
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleModelSelect = (modelId: string) => {
        setSelectedModel(modelId);
        toast.success(`${availableModels.find(m => m.id === modelId)?.name} selected`);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
    
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const filesMap : Record<string, any>= {};
        const newDocs: DocumentAnalysis[] = files.map((file, index) => {
            filesMap[file.name] = file;

            return {
                id: `img-${Date.now()}-${index}`,
                filename: file.name,
                status: "pending",
            }
        });
        setDoc(prev => [...prev, ...newDocs]);
        setDocFile(prev => ({...prev, ...filesMap}));
        toast.success(`${files.length} image(s) uploaded`);
      };


    const startAnalysis = async () => {
        if (!selectedModel) {
            toast.error("Please select a model first");
            return;
        }
        if (docs.length === 0) {
            toast.error("Please upload docs first");
            return;
        }

        setIsAnalyzing(true);
        setProgress(0);

        for (let i = 0; i < docs.length; i++) {
            setDoc(prev =>
                prev.map((doc, idx) =>
                idx === i ? { ...doc, status: "analyzing" } : doc
                )
            );
        }


        const filePromises = docs.map( (docData) => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = async function (){
                try {
                    const imgBlob = reader.result;
                    const  blob = await (await fetch(imgBlob as string)).blob()
                    const path = availableModels.find(m => m.id === selectedModel)?.endpoint;

                    const response = await fetch(`${BASE_URL}/${path}`,{
                        method: 'POST',
                        mode: 'cors',
                        headers: {
                            accept: 'application/json',
                            "Content-Type" : 'binary',
                            'Access-Control-Allow-Origin':'*'
                        },
                        body : blob 
                    })
                    const text = await response.text()
                    resolve(JSON.parse(text) as {message: string, value?: string});
                } catch (error) {
                    reject(error)
                }
            }
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(docFile[docData.filename]);   
        }));


        const analysis = await Promise.allSettled(filePromises) ;

        // await new Promise(resolve => setTimeout(resolve, 2000));

        const severities: Array<"Normal" | "Mild" | "Moderate" | "Severe"> = ["Normal", "Mild", "Moderate", "Severe"];

        for (let i = 0; i < analysis.length; i++) {
            setProgress(((i + 1) / docs.length) * 100);
            if (analysis[i].status == "rejected") {
                setDoc(prev =>
                    prev.map((doc, idx) =>
                    idx === i ? {
                        ...doc,
                        status: "error",
                        prediction: "Offline"
                    }
                    : doc
                ));
                continue;
            } 
            // @ts-expect-error promissedSettled type error
            const response: {message: string, value?: string | number} = analysis[i].value;
            let severity: "Normal" | "Mild" | "Moderate" | "Severe";
            let score = 0;
            const confidence = 100; // TODO adjust this number

            switch (response.message.split(" ")[0].toLowerCase()) {
                case "small":
                    severity = severities[1];
                    score = response.value as number;
                    break;
                case "medium":
                    severity = severities[2];
                    score = response.value as number;
                    break;
                case "large":
                    severity = severities[3];
                    score = response.value as number;
                    break;
                default:
                    if (response.value == null){
                        setDoc(prev =>
                            prev.map((doc, idx) =>
                            idx === i ? {
                                ...doc,
                                status: "error",
                                prediction: response.message
                            }
                            : doc
                        ));
                        continue;
                    } else {
                        severity = severities[0];
                        score = response.value as number;
                    }
                    break;
            }

            setDoc(prev =>
                prev.map((doc, idx) =>
                idx === i
                    ? {
                        ...doc,
                        status: "complete",
                        prediction: severity,
                        confidence: confidence,
                        metrics: {
                            atrophyScore: score,
                            volumeLoss: 0, // TODO: change this
                            severity: severity
                        },
                    }
                    : doc
                )
            );
            
        }

        setIsAnalyzing(false);
        toast.success("Analysis complete!");
    };

    return (
        <section className="dashboard-wrapper fnt-poppins" style={{paddingTop: constants.HeaderPadding}}>
            <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
                <main className="container mx-auto px-6 py-8 space-y-8">
                    <ModelSelection handleModelSelect={handleModelSelect} selectedModel={selectedModel as string} availableModels={availableModels}  />

                    <FileUploader isAnalyzing={isAnalyzing} docs={docs} handleFileUpload={handleFileUpload}  progress={progress} selectedModel={selectedModel as string} startAnalysis={startAnalysis} />

                    <Result docs={docs} selectedModel={selectedModel as string} availableModels={availableModels} />
                </main>
            </div>
        </section>
    )
}
export default Dashboard;

