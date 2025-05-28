
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Phone, Mail, MapPin, History } from 'lucide-react';

export default function TechCustomers() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600">Manage your customer relationships and service history</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Search customers..." className="pl-10" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-blue-600">JJ</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold">Johnson Residence</h3>
                      <Badge variant="outline" className="text-green-600 border-green-600">Active</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        (555) 123-4567
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        johnson@email.com
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        123 Main Street
                      </div>
                    </div>
                    <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                      <span>Last service: 2 weeks ago</span>
                      <span>•</span>
                      <span>Total services: 12</span>
                      <span>•</span>
                      <span>Customer since: 2022</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <History className="w-4 h-4 mr-1" />
                    History
                  </Button>
                  <Button size="sm">View Details</Button>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-green-600">DB</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold">Downtown Business Center</h3>
                      <Badge variant="outline" className="text-blue-600 border-blue-600">Commercial</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        (555) 987-6543
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        facility@downtown.com
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        456 Business Ave
                      </div>
                    </div>
                    <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                      <span>Last service: 1 week ago</span>
                      <span>•</span>
                      <span>Total services: 28</span>
                      <span>•</span>
                      <span>Customer since: 2021</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <History className="w-4 h-4 mr-1" />
                    History
                  </Button>
                  <Button size="sm">View Details</Button>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-purple-600">SB</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold">Smith Building Complex</h3>
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600">Maintenance Contract</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        (555) 456-7890
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        maintenance@smith.com
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        789 Industrial Blvd
                      </div>
                    </div>
                    <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                      <span>Last service: 3 days ago</span>
                      <span>•</span>
                      <span>Total services: 45</span>
                      <span>•</span>
                      <span>Customer since: 2020</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <History className="w-4 h-4 mr-1" />
                    History
                  </Button>
                  <Button size="sm">View Details</Button>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-red-600">WR</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold">Wilson Residence</h3>
                      <Badge variant="outline" className="text-gray-600 border-gray-600">Inactive</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        (555) 321-0987
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        wilson@email.com
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        321 Oak Street
                      </div>
                    </div>
                    <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                      <span>Last service: 6 months ago</span>
                      <span>•</span>
                      <span>Total services: 4</span>
                      <span>•</span>
                      <span>Customer since: 2023</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <History className="w-4 h-4 mr-1" />
                    History
                  </Button>
                  <Button size="sm">View Details</Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
