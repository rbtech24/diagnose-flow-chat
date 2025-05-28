
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { useStandardErrorHandler } from '@/utils/standardErrorHandler';
import { formValidation, validateInput } from '@/utils/validation';

export default function TechNewFeatureRequest() {
  const navigate = useNavigate();
  const { handleAsync, handleValidationError } = useStandardErrorHandler();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    category: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    'User Interface',
    'Mobile App',
    'Reporting',
    'Integration',
    'Performance',
    'Security',
    'Workflow',
    'Other'
  ];

  const validateForm = () => {
    const validation = validateInput(formValidation.featureRequest, formData);
    if (!validation.isValid) {
      handleValidationError(validation.error, { showToast: false });
      setErrors({ general: validation.error || 'Please check your input' });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    const result = await handleAsync(async () => {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/tech/feature-requests');
    }, {
      context: 'createFeatureRequest',
      fallbackMessage: 'Failed to create feature request. Please try again.'
    });

    if (!result.success) {
      setErrors({ general: result.error || 'Failed to create feature request' });
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => navigate('/tech/feature-requests')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Feature Requests
        </Button>
        <h1 className="text-3xl font-bold">New Feature Request</h1>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Request a New Feature</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 text-sm">{errors.general}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Feature Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Brief description of the feature"
                maxLength={200}
                required
              />
              <p className="text-sm text-gray-500">{formData.title.length}/200 characters</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority *</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: 'low' | 'medium' | 'high') => 
                    setFormData(prev => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the feature in detail. Include the problem it solves, how it would work, and any specific requirements."
                rows={8}
                maxLength={10000}
                required
              />
              <p className="text-sm text-gray-500">{formData.description.length}/10,000 characters</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h4 className="font-medium text-blue-900 mb-2">Tips for a good feature request:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Clearly describe the problem you're trying to solve</li>
                <li>• Explain how the feature would benefit users</li>
                <li>• Include specific use cases or examples</li>
                <li>• Consider how it might integrate with existing features</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/tech/feature-requests')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
