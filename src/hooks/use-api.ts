"use client";

import { useState, useCallback } from 'react';
import { useLogger } from '@/contexts/logger-context';

type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

export const useApi = <T, P extends any[]>(
  apiCall: (...args: P) => Promise<T>,
  options: { endpoint: string; method?: string }
) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<any | null>(null);
  const [status, setStatus] = useState<ApiStatus>('idle');
  const { addLog, updateLog } = useLogger();
  const { endpoint, method = 'GET' } = options;

  const execute = useCallback(
    async (...args: P) => {
      setStatus('loading');
      setData(null);
      setError(null);
      
      const logId = addLog({ method, endpoint, request: args });

      try {
        const result = await apiCall(...args);
        setData(result);
        setStatus('success');
        updateLog(logId, { response: result, status: 'success' });
        return result;
      } catch (e) {
        setError(e);
        setStatus('error');
        updateLog(logId, { response: e, status: 'error' });
        throw e;
      }
    },
    [apiCall, addLog, updateLog, endpoint, method]
  );

  return { data, error, status, execute, isLoading: status === 'loading' };
};
