"use client";

import { useCallback, useState } from "react";
import { ApiError } from "@/lib/api";

export type ActionStatus = "idle" | "pending" | "success" | "error";

/** Wraps an API call and exposes its status, so forms never track loading/error state by hand. */
export function useAsyncAction<Args extends unknown[], Result>(action: (...args: Args) => Promise<Result>) {
  const [status, setStatus] = useState<ActionStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async (...args: Args) => {
      setStatus("pending");
      setError(null);
      try {
        const result = await action(...args);
        setStatus("success");
        return result;
      } catch (e) {
        setError(e instanceof ApiError ? e.message : "Something went wrong. Please try again.");
        setStatus("error");
        return undefined;
      }
    },
    [action],
  );

  return { status, error, run, pending: status === "pending" };
}
