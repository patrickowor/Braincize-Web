"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

const ACCEPT = ".jpg,.jpeg,.png,.dcm,image/jpeg,image/png,application/dicom";

interface UploadPanelProps {
  files: File[];
  onFiles: (files: File[]) => void;
  onScan: () => void;
  scanning: boolean;
  error?: string | null;
}

/** Dashed drop zone plus the AI Scan button. File handling only; the scan itself is the parent's job. */
export function UploadPanel({ files, onFiles, onScan, scanning, error }: UploadPanelProps) {
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const pick = (list: FileList | null) => {
    if (list?.length) onFiles(Array.from(list));
  };

  return (
    <div className="mx-auto flex w-[17.5rem] max-w-full flex-col items-center gap-[1rem] lg:w-[71.125rem] lg:gap-[5.125rem]">
      <button
        type="button"
        onClick={() => input.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          pick(e.dataTransfer.files);
        }}
        className={cn(
          "relative block h-[16.55044rem] w-full cursor-pointer overflow-clip rounded-[0.18912rem] border-[0.04731rem] border-dashed border-[rgba(4,10,64,0.5)] bg-white shadow-[0.12612rem_0.12612rem_0.12612rem_0_rgba(24,134,244,0.15)]",
          "lg:h-[65.625rem] lg:rounded-[0.75rem] lg:border-[0.1875rem] lg:shadow-[0.5rem_0.5rem_0.5rem_0_rgba(24,134,244,0.15)]",
          dragging && "border-brand",
        )}
      >
        <span className="absolute top-[calc(50%-0.14188rem)] left-[calc(50%-0.00813rem)] block -translate-x-1/2 -translate-y-1/2 lg:top-[calc(50%-10.4375rem)] lg:left-1/2">
          <span className="lg:hidden">
            <Icon src="/icons/mobile/cloud-upload-aiscan.svg" size={30.264} boxInset="12.5% 8.33%" imgInset="-4.48% -4.03%" flip="xy" />
          </span>
          <span className="hidden lg:block">
            <Icon src="/icons/cloud-upload-aiscan.svg" size={120} boxInset="12.5% 8.33%" imgInset="-4.48% -4.03%" flip="xy" />
          </span>
        </span>
        <span className="absolute top-[calc(50%+1.1525rem)] left-1/2 w-[14.625rem] -translate-x-1/2 text-center font-montserrat text-[0.875rem] leading-[normal] font-medium text-ink lg:top-[calc(50%-5.1875rem)] lg:w-[55.375rem] lg:text-[2rem]">
          Click to upload or Drag and drop
        </span>
        <span className="absolute top-[calc(50%+3.0275rem)] left-[calc(50%-0.0175rem)] w-[13.96537rem] -translate-x-1/2 text-center font-montserrat text-[0.5rem] leading-[normal] font-medium text-[rgba(4,10,64,0.4)] lg:top-[calc(50%-1rem)] lg:left-1/2 lg:w-[55.375rem] lg:text-[1rem]">
          {files.length ? `${files.length} file${files.length > 1 ? "s" : ""} selected` : "JPG,JPEG,PNG or DICOM files supported"}
        </span>
      </button>
      <input
        ref={input}
        type="file"
        accept={ACCEPT}
        multiple
        hidden
        onChange={(e) => pick(e.target.files)}
        aria-label="Upload MRI scan files"
      />

      <button
        type="button"
        onClick={onScan}
        disabled={scanning}
        className="flex h-[2.75rem] w-full cursor-pointer items-center justify-center rounded-[0.5rem] bg-brand p-[0.15762rem] font-poppins text-[1rem] leading-[normal] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 lg:h-[5.1875rem] lg:rounded-[0.75rem] lg:p-[0.625rem] lg:text-[1.5rem]"
      >
        AI Scan
      </button>
      {error && (
        <p role="alert" className="font-poppins text-[0.875rem] text-ink">
          {error}
        </p>
      )}
    </div>
  );
}
