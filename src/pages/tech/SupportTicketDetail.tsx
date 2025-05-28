
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, User } from 'lucide-react';

export default function TechSupportTicketDetail() {
  const { id } = useParams();

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Support
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support Ticket #{id}</h1>
          <p className="text-gray-600 mt-1">View and manage your support ticket</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Sample Ticket Title</CardTitle>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  Created by you
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  2 hours ago
                </span>
              </div>
            </div>
            <Badge variant="secondary">Open</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            This is a sample support ticket. In a real implementation, this would show the actual ticket details.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
