
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

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
              <div className="bg-black p-3 rounded-full mr-4 flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">iOS App</h3>
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
              <div className="bg-green-600 p-3 rounded-full mr-4 flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zM20.5 8c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zM15.53 2.16l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Android App</h3>
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
