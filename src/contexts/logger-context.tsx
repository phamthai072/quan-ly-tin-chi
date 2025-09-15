"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type LogEntry = {
  id: number;
  timestamp: string;
  type: 'req' | 'res';
  method: string;
  endpoint: string;
  data: any;
};

type LoggerContextType = {
  logs: LogEntry[];
  isLoggerOpen: boolean;
  addLog: (log: Omit<LogEntry, 'id' | 'timestamp'>) => void;
  toggleLogger: () => void;
  clearLogs: () => void;
};

const LoggerContext = createContext<LoggerContextType | undefined>(undefined);

export const LoggerProvider = ({ children }: { children: ReactNode }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoggerOpen, setIsLoggerOpen] = useState(false);

  const addLog = useCallback((log: Omit<LogEntry, 'id' | 'timestamp'>) => {
    setLogs(prevLogs => [
      ...prevLogs,
      {
        ...log,
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  }, []);

  const toggleLogger = useCallback(() => {
    setIsLoggerOpen(prev => !prev);
  }, []);
  
  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return (
    <LoggerContext.Provider value={{ logs, isLoggerOpen, addLog, toggleLogger, clearLogs }}>
      {children}
    </LoggerContext.Provider>
  );
};

export const useLogger = () => {
  const context = useContext(LoggerContext);
  if (context === undefined) {
    throw new Error('useLogger must be used within a LoggerProvider');
  }
  return context;
};
