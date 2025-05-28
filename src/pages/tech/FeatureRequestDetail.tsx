
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ThumbsUp, MessageSquare } from 'lucide-react';

export default function TechFeatureRequestDetail() {
  const { id } = useParams();

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Feature Requests
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Feature Request #{id}</h1>
          <p className="text-gray-600 mt-1">View and vote on feature requests</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Sample Feature Request</CardTitle>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="secondary">Submitted</Badge>
                <span className="flex items-center gap-1 text-sm text-gray-600">
                  <ThumbsUp className="h-4 w-4" />
                  5 votes
                </span>
                <span className="flex items-center gap-1 text-sm text-gray-600">
                  <MessageSquare className="h-4 w-4" />
                  3 comments
                </span>
              </div>
            </div>
            <Button variant="outline">
              <ThumbsUp className="h-4 w-4 mr-2" />
              Vote
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            This is a sample feature request. In a real implementation, this would show the actual feature request details.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
