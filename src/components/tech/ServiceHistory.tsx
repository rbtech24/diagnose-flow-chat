
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Define the type for service records
interface ServiceRecord {
  id: string;
  company_id?: string;
  customer: string;
  device: string;
  date: string;
  status: string;
  rating: number;
  notes?: string;
  technician_id?: string;
  created_at?: string;
  updated_at?: string;
}

export function ServiceHistory() {
  const [serviceHistory, setServiceHistory] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchServiceHistory();
  }, []);

  const fetchServiceHistory = async () => {
    try {
      // Using any type here to bypass TypeScript's strict checking
      // We'll properly type the response afterward
      const response = await (supabase as any)
        .from('service_records')
        .select('*')
        .order('date', { ascending: false });
      
      if (response.error) throw response.error;

      setServiceHistory(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching service history:', error);
      toast({
        description: "Failed to load service history",
        type: "error"
      });
      setLoading(false);
    }
  };

  const insertSampleRecords = async () => {
    try {
      const sampleRecords = [
        {
          customer: 'John Smith',
          device: 'Refrigerator XL5200',
          date: new Date().toISOString(),
          status: 'completed',
          rating: 5,
          notes: 'Fixed cooling issue. Replaced compressor.',
        },
        {
          customer: 'Alice Johnson',
          device: 'Washing Machine WM300',
          date: new Date().toISOString(),
          status: 'completed',
          rating: 4,
          notes: 'Repaired water inlet valve.',
        },
        {
          customer: 'Bob Williams',
          device: 'Dryer DR100',
          date: new Date().toISOString(),
          status: 'completed',
          rating: 5,
          notes: 'Fixed heating element.',
        }
      ];

      // Using any type here to bypass TypeScript's strict checking
      const response = await (supabase as any)
        .from('service_records')
        .insert(sampleRecords);

      if (response.error) throw response.error;

      toast({
        description: "Sample service records added successfully",
        type: "success"
      });

      // Refresh the list
      fetchServiceHistory();
    } catch (error) {
      console.error('Error inserting sample records:', error);
      toast({
        description: "Failed to add sample records",
        type: "error"
      });
    }
  };

  if (loading) {
    return <div className="animate-pulse p-4">Loading service history...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Recent Service History</CardTitle>
          <Button 
            variant="outline" 
            onClick={insertSampleRecords}
          >
            Insert Sample Records
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {serviceHistory.length > 0 ? (
            serviceHistory.map((service) => (
              <div key={service.id} className="flex justify-between items-start border-b pb-3">
                <div>
                  <h3 className="font-medium">{service.customer}</h3>
                  <p className="text-sm text-gray-500">{service.device}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(service.date).toLocaleDateString()}</p>
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
        </div>
      </CardContent>
    </Card>
  );
}

export default ServiceHistory;
