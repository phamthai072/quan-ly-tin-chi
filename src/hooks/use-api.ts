"use client";

import { useState, useCallback } from "react";
import { useLogger } from "@/contexts/logger-context";

type ApiStatus = "idle" | "loading" | "success" | "error";

interface ApiCallParams {
  endpoint: string;
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  query?: Record<string, string | number>;
}

export const useApi = () => {
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<any | null>(null);
  const [status, setStatus] = useState<ApiStatus>("idle");
  const { addLog, updateLog } = useLogger();

  const apiCall = useCallback(
    async ({ endpoint, method = "GET", body, headers, query }: ApiCallParams) => {
      setStatus("loading");
      setData(null);
      setError(null);

      let url = endpoint;
      if (query) {
        const qs = new URLSearchParams(query as any).toString();
        url += `?${qs}`;
      }

      const logId = addLog({ method, endpoint: url, request: body });

      try {
        const res = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          body: body ? JSON.stringify(body) : undefined,
        });

        if (!res.ok) throw new Error(`HTTP error ${res.status}`);

        const result = await res.json();
        setData(result);
        setStatus("success");
        updateLog(logId, { response: result, status: "success" });
        return result;
      } catch (e) {
        setError(e);
        setStatus("error");
        updateLog(logId, { response: e, status: "error" });
        throw e;
      }
    },
    [addLog, updateLog]
  );

  return { apiCall, data, error, status, isLoading: status === "loading" };
};
