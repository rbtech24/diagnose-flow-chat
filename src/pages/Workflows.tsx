
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Edit, Trash, Share } from 'lucide-react';
import { getFolders, getWorkflowsInFolder } from '@/utils/flowUtils';

export default function Workflows() {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const folders = getFolders();

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Appliances</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Re-arrange:</span>
            <Switch />
            <span className="text-sm font-medium">OFF</span>
          </div>
          <Button className="bg-[#14162F] hover:bg-[#14162F]/90">+ Add Appliance</Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Electric Dryers Card */}
        <Card className="p-4 shadow-sm border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#14162F]">Electric Dryers</h2>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            {['Not Drying Clothes', 'Dead or Not Spinning', 'No Heat', 'Loud Noises'].map((issue) => (
              <div 
                key={issue}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
              >
                <span className="text-gray-700">{issue}</span>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600 h-8 w-8 p-0">
                    <Share className="h-4 w-4" />
                  </Button>
                  <Switch />
                </div>
              </div>
            ))}
          </div>
          
          <Button 
            variant="ghost" 
            className="mt-4 text-[#14162F] hover:bg-gray-100 w-full"
          >
            Add Issue
          </Button>
        </Card>

        {/* Gas Dryers Card */}
        <Card className="p-4 shadow-sm border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#14162F]">Gas Dryers</h2>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            {['Not Drying Clothes', 'Dead or Not Spinning', 'No Heat', 'Loud Noises'].map((issue) => (
              <div 
                key={issue}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
              >
                <span className="text-gray-700">{issue}</span>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600 h-8 w-8 p-0">
                    <Share className="h-4 w-4" />
                  </Button>
                  <Switch />
                </div>
              </div>
            ))}
          </div>
          
          <Button 
            variant="ghost" 
            className="mt-4 text-[#14162F] hover:bg-gray-100 w-full"
          >
            Add Issue
          </Button>
        </Card>

        {/* Top Load Washer Card */}
        <Card className="p-4 shadow-sm border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#14162F]">Top Load Washer</h2>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            {[
              'Not Draining',
              'Not Filling',
              'Not Spinning',
              'Not Agitating',
              'Does Not Finish Cycle',
              'Leaking'
            ].map((issue) => (
              <div 
                key={issue}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
              >
                <span className="text-gray-700">{issue}</span>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600 h-8 w-8 p-0">
                    <Share className="h-4 w-4" />
                  </Button>
                  <Switch />
                </div>
              </div>
            ))}
          </div>
          
          <Button 
            variant="ghost" 
            className="mt-4 text-[#14162F] hover:bg-gray-100 w-full"
          >
            Add Issue
          </Button>
        </Card>
      </div>
    </div>
  );
}
