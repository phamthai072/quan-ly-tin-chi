"use client";

import { useLogger, LogEntry } from '@/contexts/logger-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Database, ChevronDown, ChevronUp, Trash2, X, LoaderCircle } from 'lucide-react';
import { useState } from 'react';

const LogItem = ({ log }: { log: LogEntry }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const httpMethod = log.method.toUpperCase();
  let methodBadgeColor = 'bg-gray-500';
  if (httpMethod === 'GET') methodBadgeColor = 'bg-blue-500';
  else if (httpMethod === 'POST') methodBadgeColor = 'bg-green-500';
  else if (httpMethod === 'PUT') methodBadgeColor = 'bg-yellow-500';
  else if (httpMethod === 'DELETE') methodBadgeColor = 'bg-red-500';

  let statusBadgeColor = '';
  switch(log.status) {
      case 'success':
          statusBadgeColor = 'bg-green-600';
          break;
      case 'error':
          statusBadgeColor = 'bg-red-600';
          break;
      case 'pending':
          statusBadgeColor = 'bg-yellow-500';
          break;
  }
  
  return (
    <div className="p-2 border-b border-border/50 text-xs font-mono">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <span className="font-bold w-20">{log.timestamp}</span>
        <Badge className={cn("w-12 justify-center", statusBadgeColor)}>
            {log.status === 'pending' ? <LoaderCircle className="animate-spin h-3 w-3"/> : log.status.toUpperCase()}
        </Badge>
        <Badge className={cn("w-20 justify-center", methodBadgeColor)}>{httpMethod}</Badge>
        <span className="flex-1 truncate">{log.endpoint}</span>
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </div>
      {isExpanded && (
        <div className="mt-2 grid grid-cols-2 gap-2">
            <div className="space-y-1">
                <h4 className="font-semibold">Request</h4>
                <ScrollArea className="p-2 bg-muted/50 rounded-md max-h-40">
                <pre className="whitespace-pre-wrap break-all text-xs">
                    {JSON.stringify(log.request, null, 2)}
                </pre>
                </ScrollArea>
            </div>
             <div className="space-y-1">
                <h4 className="font-semibold">Response</h4>
                <ScrollArea className="p-2 bg-muted/50 rounded-md max-h-40">
                <pre className="whitespace-pre-wrap break-all text-xs">
                    {JSON.stringify(log.response, null, 2)}
                </pre>
                </ScrollArea>
            </div>
        </div>
      )}
    </div>
  );
};

export const Logger = () => {
  const { logs, isLoggerOpen, toggleLogger, clearLogs } = useLogger();

  return (
    <>
      {!isLoggerOpen && (
        <Button
          onClick={toggleLogger}
          className="fixed bottom-4 right-4 z-50 rounded-full h-12 w-12"
          aria-label="Open Logger"
        >
          <Database className="h-6 w-6" />
        </Button>
      )}

      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-40 h-1/3 transform transition-transform duration-300 ease-in-out",
          isLoggerOpen ? 'translate-y-0' : 'translate-y-full'
        )}
      >
        <Card className="h-full flex flex-col rounded-t-lg border-t-2 border-primary shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between p-3 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="h-5 w-5" />
              Logger
            </CardTitle>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={clearLogs} aria-label="Clear Logs">
                    <Trash2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={toggleLogger} aria-label="Close Logger">
                    <X className="h-4 w-4" />
                </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <ScrollArea className="h-full">
              {logs.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No logs yet.
                </div>
              ) : (
                [...logs].reverse().map((log) => <LogItem key={log.id} log={log} />)
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
