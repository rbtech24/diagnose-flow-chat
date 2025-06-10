
import { useState } from 'react';
import { ValidationSummary, ValidationResult } from '@/types/validation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  ChevronDown, 
  ChevronRight,
  X
} from 'lucide-react';

interface ValidationPanelProps {
  validationSummary: ValidationSummary | null;
  isValidating: boolean;
  onClose: () => void;
  onNodeFocus?: (nodeId: string) => void;
  onValidate: () => void;
}

export function ValidationPanel({
  validationSummary,
  isValidating,
  onClose,
  onNodeFocus,
  onValidate
}: ValidationPanelProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['errors']));

  const getSeverityIcon = (severity: 'error' | 'warning' | 'info') => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const getSeverityColor = (severity: 'error' | 'warning' | 'info') => {
    switch (severity) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'secondary';
      case 'info':
        return 'outline';
    }
  };

  const groupResultsByCategory = (results: ValidationResult[]) => {
    const groups: Record<string, ValidationResult[]> = {};
    results.forEach(result => {
      const rule = result.ruleId;
      const category = rule.includes('structure') ? 'structure' :
                     rule.includes('content') ? 'content' :
                     rule.includes('logic') ? 'logic' :
                     rule.includes('accessibility') ? 'accessibility' : 'other';
      
      if (!groups[category]) groups[category] = [];
      groups[category].push(result);
    });
    return groups;
  };

  const filterResults = (results: ValidationResult[]) => {
    if (activeTab === 'all') return results;
    return results.filter(result => result.severity === activeTab);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  if (!validationSummary && !isValidating) {
    return (
      <Card className="w-80">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Workflow Validation</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground mb-4">
              Validate your workflow to catch potential issues
            </p>
            <Button onClick={onValidate} size="sm">
              Run Validation
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-80">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Workflow Validation</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onValidate} disabled={isValidating}>
              {isValidating ? 'Validating...' : 'Refresh'}
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isValidating ? (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Validating workflow...</p>
          </div>
        ) : validationSummary ? (
          <div className="space-y-4">
            {/* Summary */}
            <div className="flex items-center gap-2">
              {validationSummary.isValid ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              )}
              <span className="text-sm font-medium">
                {validationSummary.isValid ? 'Valid Workflow' : `${validationSummary.totalIssues} Issues Found`}
              </span>
            </div>

            {/* Counts */}
            <div className="flex gap-2">
              <Badge variant={getSeverityColor('error')} className="text-xs">
                {validationSummary.errors} Errors
              </Badge>
              <Badge variant={getSeverityColor('warning')} className="text-xs">
                {validationSummary.warnings} Warnings
              </Badge>
              <Badge variant={getSeverityColor('info')} className="text-xs">
                {validationSummary.infos} Info
              </Badge>
            </div>

            {/* Filter Tabs */}
            {validationSummary.totalIssues > 0 && (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                  <TabsTrigger value="error" className="text-xs">Errors</TabsTrigger>
                  <TabsTrigger value="warning" className="text-xs">Warnings</TabsTrigger>
                  <TabsTrigger value="info" className="text-xs">Info</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab}>
                  <ScrollArea className="h-96">
                    <div className="space-y-2">
                      {Object.entries(groupResultsByCategory(filterResults(validationSummary.results))).map(([category, results]) => (
                        <Collapsible
                          key={category}
                          open={expandedCategories.has(category)}
                          onOpenChange={() => toggleCategory(category)}
                        >
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" className="w-full justify-between p-2 h-auto">
                              <span className="text-xs font-medium capitalize">{category} ({results.length})</span>
                              {expandedCategories.has(category) ? (
                                <ChevronDown className="w-3 h-3" />
                              ) : (
                                <ChevronRight className="w-3 h-3" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="space-y-1 ml-2">
                              {results.map((result, index) => (
                                <div
                                  key={index}
                                  className={`p-2 rounded border text-xs cursor-pointer hover:bg-muted/50 ${
                                    result.nodeId ? 'cursor-pointer' : ''
                                  }`}
                                  onClick={() => result.nodeId && onNodeFocus?.(result.nodeId)}
                                >
                                  <div className="flex items-start gap-2">
                                    {getSeverityIcon(result.severity)}
                                    <div className="flex-1">
                                      <p className="font-medium">{result.message}</p>
                                      {result.suggestion && (
                                        <p className="text-muted-foreground mt-1">{result.suggestion}</p>
                                      )}
                                      {result.nodeId && (
                                        <p className="text-muted-foreground mt-1">Node: {result.nodeId}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
