
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText, Save } from 'lucide-react';
import { useWorkflowTemplates, WorkflowTemplate } from '@/hooks/useWorkflowTemplates';
import { Node, Edge } from '@xyflow/react';
import { toast } from '@/hooks/use-toast';

interface SaveTemplateDialogProps {
  nodes: Node[];
  edges: Edge[];
  nodeCounter: number;
  trigger?: React.ReactNode;
}

export function SaveTemplateDialog({ 
  nodes, 
  edges, 
  nodeCounter, 
  trigger 
}: SaveTemplateDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const { saveTemplate } = useWorkflowTemplates();

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = () => {
    if (!name.trim() || !description.trim() || !category.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (nodes.length === 0) {
      toast({
        title: "No Content",
        description: "Cannot save a template with no workflow steps",
        variant: "destructive"
      });
      return;
    }

    try {
      const template = saveTemplate({
        name: name.trim(),
        description: description.trim(),
        category: category.trim(),
        tags,
        nodes,
        edges,
        nodeCounter,
        difficulty,
        estimatedTime: estimatedTime.trim() || '15-30 minutes',
        isPublic: false, // User templates are private by default
        author: 'User'
      });

      toast({
        title: "Template Saved",
        description: `"${name}" has been saved as a template`
      });

      // Reset form
      setName('');
      setDescription('');
      setCategory('');
      setDifficulty('beginner');
      setEstimatedTime('');
      setTags([]);
      setTagInput('');
      setOpen(false);
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save template. Please try again.",
        variant: "destructive"
      });
    }
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <Save className="w-4 h-4 mr-2" />
      Save as Template
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Save as Template
          </DialogTitle>
          <DialogDescription>
            Save this workflow as a reusable template for future projects
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="template-name">Template Name *</Label>
            <Input
              id="template-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Basic Electrical Diagnosis"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="template-description">Description *</Label>
            <Textarea
              id="template-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this template is for and when to use it"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="template-category">Category *</Label>
              <Input
                id="template-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Electrical, Mechanical"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="template-difficulty">Difficulty</Label>
              <Select value={difficulty} onValueChange={(value: any) => setDifficulty(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="template-time">Estimated Time</Label>
            <Input
              id="template-time"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(e.target.value)}
              placeholder="e.g., 15-30 minutes"
            />
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button type="button" onClick={handleAddTag} size="sm">
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map(tag => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="cursor-pointer"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="text-sm text-muted-foreground">
            Template will include {nodes.length} steps and {edges.length} connections
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Template
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
