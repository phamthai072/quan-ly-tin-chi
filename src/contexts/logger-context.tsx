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

const initialLogs: LogEntry[] = [
    {
        id: 1,
        timestamp: new Date(Date.now() - 5000).toLocaleTimeString(),
        type: 'req',
        method: 'GET',
        endpoint: '/api/students',
        data: { page: 1, limit: 10, search: '' },
    },
    {
        id: 2,
        timestamp: new Date(Date.now() - 4500).toLocaleTimeString(),
        type: 'res',
        method: 'GET',
        endpoint: '/api/students',
        data: { message: 'Successfully retrieved 12 students.', count: 12 },
    },
    {
        id: 3,
        timestamp: new Date(Date.now() - 2000).toLocaleTimeString(),
        type: 'req',
        method: 'POST',
        endpoint: '/api/results',
        data: { studentId: 'B20DCCN001', subjectId: 'INT201', midtermScore: 8.0, finalScore: 7.5 },
    },
    {
        id: 4,
        timestamp: new Date(Date.now() - 1500).toLocaleTimeString(),
        type: 'res',
        method: 'POST',
        endpoint: '/api/results',
        data: { success: true, message: 'Result saved successfully.', resultId: 'RES007' },
    }
];


export const LoggerProvider = ({ children }: { children: ReactNode }) => {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
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
