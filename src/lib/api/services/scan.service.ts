import { http } from "../http";
import { endpoints } from "../endpoints";
import type { ScanRequest, ScanResult } from "../types";

export const scanService = {
  predict: ({ model, files }: ScanRequest) => {
    const form = new FormData();
    files.forEach((file) => form.append("files", file));
    return http.post<ScanResult>(endpoints.scan[model], form);
  },
};
