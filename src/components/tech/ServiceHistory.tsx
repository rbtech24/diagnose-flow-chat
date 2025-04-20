
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { showToast } from '@/utils/toast-helpers';

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
  const { user } = useAuth();

  useEffect(() => {
    fetchServiceHistory();
  }, [user?.id]);

  const fetchServiceHistory = async () => {
    try {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      const { data, error } = await supabase
        .from('service_records')
        .select('*')
        .eq('technician_id', user.id)
        .order('date', { ascending: false })
        .limit(10);
      
      if (error) throw error;

      if (data && data.length > 0) {
        setServiceHistory(data);
      } else {
        // No data found, use sample data but mark it clearly
        const sampleData = [
          {
            id: '1',
            customer: 'Sample: John Smith',
            device: 'Refrigerator XL5200',
            date: new Date().toISOString(),
            status: 'completed',
            rating: 5,
            notes: 'Example record - Fixed cooling issue.',
          },
          {
            id: '2',
            customer: 'Sample: Alice Johnson',
            device: 'Washing Machine WM300',
            date: new Date(Date.now() - 86400000).toISOString(), // yesterday
            status: 'completed',
            rating: 4,
            notes: 'Example record - Repaired water inlet valve.',
          }
        ];
        setServiceHistory(sampleData as ServiceRecord[]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching service history:', error);
      showToast.error("Failed to load service history");
      setLoading(false);
    }
  };

  const insertSampleRecords = async () => {
    try {
      if (!user?.id) {
        showToast.error("User not authenticated");
        return;
      }
      
      const sampleRecords = [
        {
          customer: 'John Smith',
          device: 'Refrigerator XL5200',
          date: new Date().toISOString(),
          status: 'completed',
          rating: 5,
          notes: 'Fixed cooling issue. Replaced compressor.',
          technician_id: user.id,
          company_id: user.companyId
        },
        {
          customer: 'Alice Johnson',
          device: 'Washing Machine WM300',
          date: new Date().toISOString(),
          status: 'completed',
          rating: 4,
          notes: 'Repaired water inlet valve.',
          technician_id: user.id,
          company_id: user.companyId
        },
        {
          customer: 'Bob Williams',
          device: 'Dryer DR100',
          date: new Date().toISOString(),
          status: 'completed',
          rating: 5,
          notes: 'Fixed heating element.',
          technician_id: user.id,
          company_id: user.companyId
        }
      ];

      const { error } = await supabase
        .from('service_records')
        .insert(sampleRecords);

      if (error) throw error;

      showToast.success("Sample service records added successfully");

      // Refresh the list
      fetchServiceHistory();
    } catch (error) {
      console.error('Error inserting sample records:', error);
      showToast.error("Failed to add sample records");
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
            {serviceHistory.length === 0 ? "Add Sample Records" : "Add More Samples"}
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
