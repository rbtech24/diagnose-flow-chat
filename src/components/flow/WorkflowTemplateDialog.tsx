
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  File, 
  Search, 
  Clock, 
  Star, 
  User, 
  CheckCircle,
  Zap,
  Settings,
  Wrench
} from 'lucide-react';
import { WorkflowTemplate, useWorkflowTemplates } from '@/hooks/useWorkflowTemplates';
import { cn } from '@/lib/utils';

interface WorkflowTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (template: WorkflowTemplate) => void;
}

export function WorkflowTemplateDialog({
  open,
  onOpenChange,
  onSelectTemplate
}: WorkflowTemplateDialogProps) {
  const {
    templates,
    categories,
    selectedCategory,
    searchTerm,
    setSelectedCategory,
    setSearchTerm
  } = useWorkflowTemplates();

  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null);

  const handleSelectTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
      onOpenChange(false);
      setSelectedTemplate(null);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'electrical':
        return <Zap className="w-4 h-4" />;
      case 'mechanical':
        return <Settings className="w-4 h-4" />;
      case 'general':
        return <Wrench className="w-4 h-4" />;
      default:
        return <File className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <File className="w-5 h-5" />
            Choose Workflow Template
          </DialogTitle>
          <DialogDescription>
            Start with a pre-built template to speed up your workflow creation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(category)}
                      {category}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex gap-4 h-96">
            {/* Template List */}
            <div className="flex-1">
              <ScrollArea className="h-full">
                <div className="space-y-3 pr-4">
                  {templates.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <File className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No templates found</p>
                      <p className="text-sm">Try adjusting your search or category filter</p>
                    </div>
                  ) : (
                    templates.map(template => (
                      <Card
                        key={template.id}
                        className={cn(
                          'cursor-pointer transition-all hover:shadow-md',
                          selectedTemplate?.id === template.id && 'ring-2 ring-primary'
                        )}
                        onClick={() => setSelectedTemplate(template)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(template.category)}
                              <CardTitle className="text-sm">{template.name}</CardTitle>
                              {template.isPublic && (
                                <Badge variant="secondary" className="text-xs">
                                  Public
                                </Badge>
                              )}
                            </div>
                            <Badge 
                              className={cn('text-xs', getDifficultyColor(template.difficulty))}
                            >
                              {template.difficulty}
                            </Badge>
                          </div>
                          <CardDescription className="text-xs">
                            {template.description}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="pt-0">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {template.estimatedTime}
                              </span>
                              <span>{template.nodes.length} steps</span>
                            </div>
                            
                            {template.author && (
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {template.author}
                              </div>
                            )}
                          </div>
                          
                          {template.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {template.tags.slice(0, 3).map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                                  {tag}
                                </Badge>
                              ))}
                              {template.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs px-1 py-0">
                                  +{template.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Template Preview */}
            <div className="w-80 border-l pl-4">
              {selectedTemplate ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium flex items-center gap-2">
                      {getCategoryIcon(selectedTemplate.category)}
                      {selectedTemplate.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedTemplate.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-medium">Category:</span>
                        <p>{selectedTemplate.category}</p>
                      </div>
                      <div>
                        <span className="font-medium">Difficulty:</span>
                        <Badge 
                          className={cn('mt-1', getDifficultyColor(selectedTemplate.difficulty))}
                        >
                          {selectedTemplate.difficulty}
                        </Badge>
                      </div>
                      <div>
                        <span className="font-medium">Time:</span>
                        <p>{selectedTemplate.estimatedTime}</p>
                      </div>
                      <div>
                        <span className="font-medium">Steps:</span>
                        <p>{selectedTemplate.nodes.length} steps</p>
                      </div>
                    </div>

                    {selectedTemplate.tags.length > 0 && (
                      <div>
                        <span className="font-medium text-sm">Tags:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedTemplate.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <Button 
                    onClick={handleSelectTemplate}
                    className="w-full"
                    size="sm"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Use This Template
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <File className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a template</p>
                  <p className="text-sm">Choose a template to see details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
