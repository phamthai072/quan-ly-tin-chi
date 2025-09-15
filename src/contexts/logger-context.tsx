"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type LogEntry = {
  id: number;
  timestamp: string;
  method: string;
  endpoint: string;
  request: any;
  response: any;
  status: 'pending' | 'success' | 'error';
};

type LoggerContextType = {
  logs: LogEntry[];
  isLoggerOpen: boolean;
  addLog: (log: Omit<LogEntry, 'id' | 'timestamp' | 'response' | 'status'>) => number;
  updateLog: (id: number, log: Partial<Omit<LogEntry, 'id' | 'timestamp'>>) => void;
  toggleLogger: () => void;
  clearLogs: () => void;
};

const LoggerContext = createContext<LoggerContextType | undefined>(undefined);

const initialLogs: LogEntry[] = [
    {
        id: 1,
        timestamp: new Date(Date.now() - 5000).toLocaleTimeString(),
        method: 'GET',
        endpoint: '/api/students',
        request: { page: 1, limit: 10, search: '' },
        response: { message: 'Successfully retrieved 12 students.', count: 12 },
        status: 'success',
    },
    {
        id: 2,
        timestamp: new Date(Date.now() - 2000).toLocaleTimeString(),
        method: 'POST',
        endpoint: '/api/results',
        request: { studentId: 'B20DCCN001', subjectId: 'INT201', midtermScore: 8.0, finalScore: 7.5 },
        response: { success: true, message: 'Result saved successfully.', resultId: 'RES007' },
        status: 'success',
    },
    {
        id: 3,
        timestamp: new Date(Date.now() - 1000).toLocaleTimeString(),
        method: 'POST',
        endpoint: '/api/lecturers',
        request: { name: 'New Lecturer', faculty: 'CNTT' },
        response: { error: 'Failed to create lecturer', code: 500 },
        status: 'error',
    }
];


export const LoggerProvider = ({ children }: { children: ReactNode }) => {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [isLoggerOpen, setIsLoggerOpen] = useState(false);

  const addLog = useCallback((log: Omit<LogEntry, 'id' | 'timestamp' | 'response' | 'status'>) => {
    const newId = Date.now();
    setLogs(prevLogs => [
      ...prevLogs,
      {
        ...log,
        id: newId,
        timestamp: new Date().toLocaleTimeString(),
        response: null,
        status: 'pending',
      },
    ]);
    return newId;
  }, []);

  const updateLog = useCallback((id: number, logUpdate: Partial<Omit<LogEntry, 'id' | 'timestamp'>>) => {
      setLogs(prevLogs => prevLogs.map(l => l.id === id ? {...l, ...logUpdate} : l));
  }, []);

  const toggleLogger = useCallback(() => {
    setIsLoggerOpen(prev => !prev);
  }, []);
  
  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return (
    <LoggerContext.Provider value={{ logs, isLoggerOpen, addLog, updateLog, toggleLogger, clearLogs }}>
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
