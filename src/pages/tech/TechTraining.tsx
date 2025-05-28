
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Play, CheckCircle, Clock } from 'lucide-react';

export default function TechTraining() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Training Center</h1>
        <p className="text-gray-600">Enhance your skills with our comprehensive training modules</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">HVAC Fundamentals</span>
                    <span className="text-sm text-gray-600">8/10 modules</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Safety Protocols</span>
                    <span className="text-sm text-gray-600">5/6 modules</span>
                  </div>
                  <Progress value={83} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Diagnostic Tools</span>
                    <span className="text-sm text-gray-600">3/8 modules</span>
                  </div>
                  <Progress value={37} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Advanced HVAC Systems</h3>
                        <p className="text-sm text-gray-600 mb-2">
                          Learn about modern heating and cooling systems
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          4 hours • 12 modules
                        </div>
                      </div>
                    </div>
                    <Button size="sm">
                      <Play className="w-4 h-4 mr-1" />
                      Start
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Electrical Safety</h3>
                        <p className="text-sm text-gray-600 mb-2">
                          Essential safety procedures for electrical work
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          2 hours • 6 modules
                        </div>
                      </div>
                    </div>
                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Completed</span>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Customer Service Excellence</h3>
                        <p className="text-sm text-gray-600 mb-2">
                          Build better relationships with customers
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          3 hours • 8 modules
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Play className="w-4 h-4 mr-1" />
                      Resume
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Training Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <p className="text-sm text-gray-600">Courses Completed</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">45h</div>
                  <p className="text-sm text-gray-600">Total Training Time</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">3</div>
                  <p className="text-sm text-gray-600">Certifications Earned</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="border-l-4 border-yellow-500 pl-3">
                  <p className="font-medium text-sm">Safety Certification</p>
                  <p className="text-xs text-gray-600">Due in 5 days</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-3">
                  <p className="font-medium text-sm">HVAC Module 9</p>
                  <p className="text-xs text-gray-600">Due in 2 weeks</p>
                </div>
                <div className="border-l-4 border-green-500 pl-3">
                  <p className="font-medium text-sm">Annual Review</p>
                  <p className="text-xs text-gray-600">Due in 1 month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
