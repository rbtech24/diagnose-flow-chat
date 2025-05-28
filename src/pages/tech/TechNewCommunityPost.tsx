
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useStandardErrorHandler } from '@/utils/standardErrorHandler';
import { formValidation, validateInput } from '@/utils/validation';
import { createCommunityPost } from '@/api/communityApi';

export default function TechNewCommunityPost() {
  const navigate = useNavigate();
  const { handleAsync, handleValidationError } = useStandardErrorHandler();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'question' as 'question' | 'discussion' | 'announcement',
    tags: [] as string[]
  });
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const validation = validateInput(formValidation.communityPost, formData);
    if (!validation.isValid) {
      handleValidationError(validation.error, { showToast: false });
      setErrors({ general: validation.error || 'Please check your input' });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim()) && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    const result = await handleAsync(async () => {
      const postId = await createCommunityPost(formData);
      navigate(`/tech/community/${postId}`);
    }, {
      context: 'createCommunityPost',
      fallbackMessage: 'Failed to create post. Please try again.'
    });

    if (!result.success) {
      setErrors({ general: result.error || 'Failed to create post' });
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => navigate('/tech/community')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Community
        </Button>
        <h1 className="text-3xl font-bold">Create New Post</h1>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Share with the Community</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 text-sm">{errors.general}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="What's your question or topic?"
                maxLength={200}
                required
              />
              <p className="text-sm text-gray-500">{formData.title.length}/200 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Post Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: 'question' | 'discussion' | 'announcement') => 
                  setFormData(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="question">Question</SelectItem>
                  <SelectItem value="discussion">Discussion</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Provide details about your question or topic..."
                rows={8}
                maxLength={10000}
                required
              />
              <p className="text-sm text-gray-500">{formData.content.length}/10,000 characters</p>
            </div>

            <div className="space-y-2">
              <Label>Tags (Optional)</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  maxLength={20}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <Button type="button" onClick={handleAddTag} variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              <p className="text-sm text-gray-500">Maximum 5 tags, up to 20 characters each</p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/tech/community')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Post'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
