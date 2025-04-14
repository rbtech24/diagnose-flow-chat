
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function ServiceHistory() {
  const [serviceHistory, setServiceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchServiceHistory = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setServiceHistory([
          {
            id: 'srh-001',
            customer: 'John Smith',
            device: 'Refrigerator XL5200',
            date: '2023-05-15',
            status: 'completed',
            rating: 5,
            notes: 'Fixed cooling issue. Replaced compressor.'
          },
          {
            id: 'srh-002',
            customer: 'Alice Johnson',
            device: 'Washing Machine WM300',
            date: '2023-05-12',
            status: 'completed',
            rating: 4,
            notes: 'Repaired water inlet valve.'
          },
          {
            id: 'srh-003',
            customer: 'Bob Williams',
            device: 'Dryer DR100',
            date: '2023-05-10',
            status: 'completed',
            rating: 5,
            notes: 'Fixed heating element.'
          }
        ]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching service history:', error);
        setLoading(false);
        toast({
          description: "Failed to load service history",
          type: "error",
          variant: "destructive"
        });
      }
    };

    fetchServiceHistory();
  }, [toast]);

  if (loading) {
    return <div className="animate-pulse p-4">Loading service history...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Service History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {serviceHistory.length > 0 ? (
            serviceHistory.map((service: any) => (
              <div key={service.id} className="flex justify-between items-start border-b pb-3">
                <div>
                  <h3 className="font-medium">{service.customer}</h3>
                  <p className="text-sm text-gray-500">{service.device}</p>
                  <p className="text-xs text-gray-400 mt-1">{service.date}</p>
                  <p className="text-sm mt-2">{service.notes}</p>
                </div>
                <div className="flex flex-col items-end">
                  <Badge className={service.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue'}>
                    {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                  </Badge>
                  <div className="flex items-center mt-2">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span>{service.rating}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No service history available</p>
          )}
          <Button variant="outline" className="w-full mt-2">View Full History</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ServiceHistory;
