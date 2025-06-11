
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Download, 
  FileText, 
  FileSpreadsheet,
  Database,
  Calendar,
  Filter
} from 'lucide-react';
import { SavedWorkflow } from '@/utils/flow/types';
import { toast } from '@/hooks/use-toast';

interface ExportOptions {
  format: 'json' | 'csv' | 'pdf' | 'xml';
  includeExecutionData: boolean;
  dateRange: 'all' | 'week' | 'month' | 'quarter' | 'year';
  workflows: string[];
}

interface WorkflowDataExporterProps {
  workflows: SavedWorkflow[];
  executionHistory?: any[];
}

export function WorkflowDataExporter({ 
  workflows, 
  executionHistory = [] 
}: WorkflowDataExporterProps) {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'json',
    includeExecutionData: false,
    dateRange: 'all',
    workflows: []
  });

  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const exportData = generateExportData();
      const blob = createExportBlob(exportData);
      downloadFile(blob, getFileName());
      
      toast({
        title: "Export Completed",
        description: `Data exported as ${exportOptions.format.toUpperCase()}`
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data",
        variant: "destructive"
      });
    }
    
    setIsExporting(false);
  };

  const generateExportData = () => {
    const selectedWorkflows = exportOptions.workflows.length > 0 
      ? workflows.filter(w => exportOptions.workflows.includes(w.metadata.name))
      : workflows;

    const baseData = {
      exportMetadata: {
        timestamp: new Date().toISOString(),
        format: exportOptions.format,
        workflowCount: selectedWorkflows.length,
        includesExecutionData: exportOptions.includeExecutionData
      },
      workflows: selectedWorkflows.map(workflow => ({
        id: workflow.id,
        metadata: workflow.metadata,
        nodeCount: workflow.nodes.length,
        edgeCount: workflow.edges.length,
        structure: exportOptions.format === 'json' ? {
          nodes: workflow.nodes,
          edges: workflow.edges
        } : {
          summary: `${workflow.nodes.length} nodes, ${workflow.edges.length} connections`
        }
      }))
    };

    if (exportOptions.includeExecutionData && executionHistory.length > 0) {
      const filteredHistory = filterExecutionHistory();
      return {
        ...baseData,
        executionHistory: filteredHistory
      };
    }

    return baseData;
  };

  const filterExecutionHistory = () => {
    if (exportOptions.dateRange === 'all') return executionHistory;
    
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (exportOptions.dateRange) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    return executionHistory.filter(entry => 
      new Date(entry.timestamp) >= cutoffDate
    );
  };

  const createExportBlob = (data: any): Blob => {
    switch (exportOptions.format) {
      case 'json':
        return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      
      case 'csv':
        const csvContent = convertToCSV(data);
        return new Blob([csvContent], { type: 'text/csv' });
      
      case 'xml':
        const xmlContent = convertToXML(data);
        return new Blob([xmlContent], { type: 'application/xml' });
      
      default:
        return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    }
  };

  const convertToCSV = (data: any): string => {
    const headers = ['Workflow Name', 'Folder', 'Node Count', 'Edge Count', 'Created', 'Updated'];
    const rows = data.workflows.map((w: any) => [
      w.metadata.name,
      w.metadata.folder,
      w.nodeCount,
      w.edgeCount,
      w.metadata.createdAt,
      w.metadata.updatedAt
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const convertToXML = (data: any): string => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<export>\n';
    
    xml += `  <metadata>\n`;
    xml += `    <timestamp>${data.exportMetadata.timestamp}</timestamp>\n`;
    xml += `    <workflowCount>${data.exportMetadata.workflowCount}</workflowCount>\n`;
    xml += `  </metadata>\n`;
    
    xml += `  <workflows>\n`;
    data.workflows.forEach((w: any) => {
      xml += `    <workflow>\n`;
      xml += `      <name>${w.metadata.name}</name>\n`;
      xml += `      <folder>${w.metadata.folder}</folder>\n`;
      xml += `      <nodeCount>${w.nodeCount}</nodeCount>\n`;
      xml += `      <edgeCount>${w.edgeCount}</edgeCount>\n`;
      xml += `    </workflow>\n`;
    });
    xml += `  </workflows>\n`;
    
    xml += '</export>';
    return xml;
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getFileName = (): string => {
    const timestamp = new Date().toISOString().split('T')[0];
    const workflowCount = exportOptions.workflows.length || workflows.length;
    return `workflow-export-${workflowCount}-workflows-${timestamp}.${exportOptions.format}`;
  };

  const formatIcons = {
    json: <Database className="w-4 h-4" />,
    csv: <FileSpreadsheet className="w-4 h-4" />,
    pdf: <FileText className="w-4 h-4" />,
    xml: <FileText className="w-4 h-4" />
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export Workflow Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Export Format */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Export Format</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {['json', 'csv', 'xml'].map((format) => (
              <Button
                key={format}
                variant={exportOptions.format === format ? "default" : "outline"}
                onClick={() => setExportOptions(prev => ({ ...prev, format: format as any }))}
                className="flex items-center gap-2"
              >
                {formatIcons[format as keyof typeof formatIcons]}
                {format.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Date Range */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Date Range
          </label>
          <Select 
            value={exportOptions.dateRange} 
            onValueChange={(value) => setExportOptions(prev => ({ 
              ...prev, 
              dateRange: value as any 
            }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Workflow Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Workflows to Export
          </label>
          <div className="max-h-32 overflow-y-auto space-y-1 border rounded p-2">
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExportOptions(prev => ({ 
                  ...prev, 
                  workflows: workflows.map(w => w.metadata.name)
                }))}
              >
                Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExportOptions(prev => ({ ...prev, workflows: [] }))}
              >
                Clear All
              </Button>
            </div>
            {workflows.map(workflow => (
              <label key={workflow.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={exportOptions.workflows.includes(workflow.metadata.name)}
                  onChange={(e) => {
                    const name = workflow.metadata.name;
                    setExportOptions(prev => ({
                      ...prev,
                      workflows: e.target.checked
                        ? [...prev.workflows, name]
                        : prev.workflows.filter(w => w !== name)
                    }));
                  }}
                />
                <span className="truncate">{workflow.metadata.name}</span>
                <Badge variant="outline" className="text-xs">
                  {workflow.metadata.folder}
                </Badge>
              </label>
            ))}
          </div>
        </div>

        {/* Export Summary */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Export Summary</h4>
          <div className="text-sm space-y-1">
            <p>Format: <Badge variant="outline">{exportOptions.format.toUpperCase()}</Badge></p>
            <p>Workflows: <Badge variant="outline">
              {exportOptions.workflows.length || workflows.length}
            </Badge></p>
            <p>Date Range: <Badge variant="outline">{exportOptions.dateRange}</Badge></p>
            {exportOptions.includeExecutionData && (
              <p>Includes execution history data</p>
            )}
          </div>
        </div>

        {/* Export Button */}
        <Button 
          onClick={handleExport}
          disabled={isExporting || workflows.length === 0}
          className="w-full flex items-center gap-2"
          size="lg"
        >
          {isExporting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Export Data
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
