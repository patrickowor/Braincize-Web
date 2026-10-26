"use client";

import { useState } from "react";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { api, type ScanResult } from "@/lib/api";
import { ResultViewer } from "./ResultViewer";
import { UploadPanel } from "./UploadPanel";

/**
 * Upload → scan → result. The Figma file shows these as three frames (upload, slide player, mp4 panel);
 * they are modelled here as two phases, with the result view toggling between slide and mp4.
 *
 * `afterResult` is server-rendered content (FAQ, contact form) that the result frames show below the viewer.
 */
export function AiScanExperience({ afterResult }: { afterResult: React.ReactNode }) {
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [missingFile, setMissingFile] = useState(false);
  const { run, pending, error } = useAsyncAction(api.scan.predict);

  async function scan() {
    if (!files.length) {
      setMissingFile(true);
      return;
    }
    setMissingFile(false);
    const next = await run({ model: "predictMid", files });
    if (next) setResult(next);
  }

  function restart() {
    setResult(null);
    setFiles([]);
    setMissingFile(false);
  }

  if (result) {
    return (
      <>
        <div className="mt-[4.75rem] lg:mt-[13.1875rem]">
          <ResultViewer onRestart={restart} />
        </div>
        {afterResult}
      </>
    );
  }

  return (
    <div className="mt-[4.75rem] lg:mt-[14.4375rem]">
      <UploadPanel files={files} onFiles={setFiles} onScan={scan} scanning={pending} error={missingFile ? "Select an MRI file to scan." : error} />
    </div>
  );
}
