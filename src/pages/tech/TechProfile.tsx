
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Edit, Mail, Phone, MapPin, Award } from 'lucide-react';

export default function TechProfile() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Manage your personal information and settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src="https://i.pravatar.cc/150" alt="Profile" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Change Photo
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" defaultValue="John Doe" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="john.doe@techflow.com" />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" defaultValue="+1 (555) 123-4567" />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" defaultValue="San Francisco, CA" />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  defaultValue="Experienced HVAC technician with 8+ years in commercial and residential systems. Specialized in energy-efficient solutions and preventive maintenance."
                  rows={3}
                />
              </div>
              <Button className="w-full">Save Changes</Button>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-gray-600">john.doe@techflow.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-gray-600">San Francisco, CA</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Employee ID</p>
                    <p className="text-sm text-gray-600">TECH-001</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills & Certifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="font-medium mb-2">Technical Skills</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">HVAC Systems</Badge>
                    <Badge variant="secondary">Electrical Work</Badge>
                    <Badge variant="secondary">Plumbing</Badge>
                    <Badge variant="secondary">Refrigeration</Badge>
                    <Badge variant="secondary">Troubleshooting</Badge>
                    <Badge variant="secondary">Preventive Maintenance</Badge>
                  </div>
                </div>
                <div>
                  <p className="font-medium mb-2">Certifications</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">EPA Section 608 Certification</span>
                      <Badge variant="outline" className="text-green-600 border-green-600">Valid</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">OSHA 10-Hour Safety</span>
                      <Badge variant="outline" className="text-green-600 border-green-600">Valid</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">NATE Certification</span>
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600">Expires Soon</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">156</div>
                  <p className="text-sm text-gray-600">Jobs Completed</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">4.8</div>
                  <p className="text-sm text-gray-600">Avg Rating</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">94%</div>
                  <p className="text-sm text-gray-600">On-Time Rate</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">8</div>
                  <p className="text-sm text-gray-600">Years Experience</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
