
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Wrench, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';

export default function TechEquipment() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Equipment & Tools</h1>
          <p className="text-gray-600">Track your equipment, tools, and maintenance schedules</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Equipment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Equipment</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <Wrench className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Operational</p>
                <p className="text-2xl font-bold text-green-600">21</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Under Maintenance</p>
                <p className="text-2xl font-bold text-yellow-600">2</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Due for Service</p>
                <p className="text-2xl font-bold text-red-600">1</p>
              </div>
              <Calendar className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Equipment Inventory</CardTitle>
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Search equipment..." className="pl-10" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Wrench className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold">Digital Multimeter - Fluke 87V</h3>
                      <Badge variant="outline" className="text-green-600 border-green-600">Operational</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Professional-grade multimeter for electrical diagnostics</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-500">
                      <span>Serial: FL87V-2024-001</span>
                      <span>Purchased: Jan 2024</span>
                      <span>Last Calibration: Nov 2024</span>
                      <span>Next Service: May 2025</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Wrench className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold">Refrigerant Recovery Unit - Robinair</h3>
                      <Badge variant="outline" className="text-green-600 border-green-600">Operational</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Automatic refrigerant recovery, recycling, and recharging station</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-500">
                      <span>Serial: RB-34988-2023</span>
                      <span>Purchased: Mar 2023</span>
                      <span>Last Service: Sep 2024</span>
                      <span>Next Service: Mar 2025</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold">Vacuum Pump - Yellow Jacket 93560</h3>
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600">Under Maintenance</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">High-performance two-stage vacuum pump for HVAC systems</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-500">
                      <span>Serial: YJ93560-2022</span>
                      <span>Purchased: Aug 2022</span>
                      <span>Issue: Oil seal replacement</span>
                      <span>ETA: Dec 15, 2024</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold">Digital Torque Wrench Set</h3>
                      <Badge variant="outline" className="text-red-600 border-red-600">Service Due</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Precision torque wrench set for accurate fastening</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-500">
                      <span>Serial: TW-SET-2021</span>
                      <span>Purchased: Nov 2021</span>
                      <span>Last Calibration: Nov 2023</span>
                      <span>Overdue by: 15 days</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Schedule Service
                </Button>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Wrench className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold">Thermal Imaging Camera - FLIR</h3>
                      <Badge variant="outline" className="text-green-600 border-green-600">Operational</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Advanced thermal imaging for diagnostics and inspections</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-500">
                      <span>Serial: FLIR-TG165-2024</span>
                      <span>Purchased: Jun 2024</span>
                      <span>Warranty: 2 years</span>
                      <span>Next Service: Jun 2025</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
