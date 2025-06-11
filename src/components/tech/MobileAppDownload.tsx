
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smartphone, Download } from 'lucide-react';

export function MobileAppDownload() {
  const handleiOSDownload = () => {
    alert('iOS app coming soon! Check back later for mobile app availability.');
  };

  const handleAndroidDownload = () => {
    alert('Android app coming soon! Check back later for mobile app availability.');
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Mobile App</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-black p-3 rounded-full mr-4">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">iOS App</h3>
                <p className="text-gray-600 text-sm">Coming soon</p>
              </div>
            </div>
            <Button 
              className="w-full bg-black hover:bg-gray-800 text-white"
              onClick={handleiOSDownload}
            >
              <Download className="mr-2 h-4 w-4" />
              iOS App
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
                <p className="text-gray-600 text-sm">Coming soon</p>
              </div>
            </div>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={handleAndroidDownload}
            >
              <Download className="mr-2 h-4 w-4" />
              Android App
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
