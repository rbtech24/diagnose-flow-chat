
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  PenLine,
  MessageSquare,
  HelpCircle,
  Clock,
  Activity,
  CheckSquare,
  Users,
  Calendar,
  Stethoscope,
  Smartphone,
  Download,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';

export default function TechDashboard() {
  const navigate = useNavigate();
  const { userRole } = useUserRole();
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Tech Dashboard</h1>

      {/* Diagnostic Banner - New Section */}
      <div className="mb-8">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
          <div className="flex flex-col md:flex-row items-center justify-between p-6">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <Stethoscope className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-blue-800">Diagnostic Procedures</h2>
                <p className="text-blue-600">Step-by-step troubleshooting guides for appliance repair</p>
              </div>
            </div>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate('/diagnostics')}
            >
              Access Diagnostics
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Mobile App Downloads Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Download Mobile App</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-black p-3 rounded-full mr-4">
                  <Smartphone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">iOS App</h3>
                  <p className="text-gray-600 text-sm">Download for iPhone and iPad</p>
                </div>
              </div>
              <Button 
                className="w-full bg-black hover:bg-gray-800 text-white"
                onClick={() => alert('iOS app will be available soon! Export this project to GitHub and follow the setup instructions to build the iOS app.')}
              >
                <Download className="mr-2 h-4 w-4" />
                Download for iOS
              </Button>
            </div>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-green-600 p-3 rounded-full mr-4">
                  <Smartphone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Android App</h3>
                  <p className="text-gray-600 text-sm">Download for Android devices</p>
                </div>
              </div>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={() => alert('Android app will be available soon! Export this project to GitHub and follow the setup instructions to build the Android app.')}
              >
                <Download className="mr-2 h-4 w-4" />
                Download for Android
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button 
            className="flex items-center justify-between py-6" 
            variant="outline"
            onClick={() => navigate('/diagnostics')}
          >
            <span>Start Diagnostics</span>
            <Stethoscope className="ml-2 h-4 w-4" />
          </Button>
          <Button 
            className="flex items-center justify-between py-6" 
            variant="outline"
            onClick={() => navigate('/tech/support/new')}
          >
            <span>Create Support Ticket</span>
            <MessageSquare className="ml-2 h-4 w-4" />
          </Button>
          <Button 
            className="flex items-center justify-between py-6" 
            variant="outline"
            onClick={() => navigate('/tech/feature-requests/new')}
          >
            <span>Submit Feature Request</span>
            <PenLine className="ml-2 h-4 w-4" />
          </Button>
          <Button 
            className="flex items-center justify-between py-6" 
            variant="outline"
            onClick={() => navigate('/tech/community/new')}
          >
            <span>Ask Community</span>
            <HelpCircle className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
