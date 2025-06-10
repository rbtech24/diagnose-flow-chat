
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, Clock, MessageSquare } from 'lucide-react';

interface ExecutionHistoryEntry {
  nodeId: string;
  answer: any;
  timestamp: Date;
  nodeLabel: string;
}

interface ExecutionHistoryProps {
  history: ExecutionHistoryEntry[];
  answers: Record<string, any>;
}

export function ExecutionHistory({ history, answers }: ExecutionHistoryProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatAnswer = (answer: any) => {
    if (typeof answer === 'object' && answer !== null) {
      return answer.answer || JSON.stringify(answer);
    }
    return String(answer);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Execution History
          <Badge variant="outline">{history.length} steps</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          <div className="space-y-3">
            {history.map((entry, index) => (
              <div 
                key={`${entry.nodeId}-${index}`}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm truncate">
                      {entry.nodeLabel}
                    </h4>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {formatTime(entry.timestamp)}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {formatAnswer(entry.answer)}
                    </Badge>
                    {typeof entry.answer === 'object' && entry.answer?.notes && (
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <MessageSquare className="w-3 h-3" />
                        <span className="truncate">{entry.answer.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {history.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No execution history yet</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
