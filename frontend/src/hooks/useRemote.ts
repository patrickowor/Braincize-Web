"use client";

import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api";

export interface Remote<T> {
  data: T | null;
  loading: boolean;
  /** Status of a failed request, 0 when it never reached the server. */
  status: number | null;
  error: string | null;
}

/** Loads data from the API when the component mounts or `key` changes. */
export function useRemote<T>(load: () => Promise<T>, key: string): Remote<T> {
  const [state, setState] = useState<Remote<T>>({ data: null, loading: true, status: null, error: null });

  useEffect(() => {
    let cancelled = false;
    setState({ data: null, loading: true, status: null, error: null });
    load().then(
      (data) => !cancelled && setState({ data, loading: false, status: null, error: null }),
      (error: unknown) => {
        if (cancelled) return;
        const known = error instanceof ApiError;
        setState({
          data: null,
          loading: false,
          status: known ? error.status : 0,
          error: known ? error.message : "The server could not be reached. Please try again.",
        });
      },
    );
    return () => {
      cancelled = true;
    };
    // `load` is a fresh closure every render; `key` says when to fetch again.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return state;
}
