
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smartphone, Download, ExternalLink, Github } from 'lucide-react';

export function MobileAppDownload() {
  const handleiOSDownload = () => {
    window.open('https://docs.lovable.dev/blogs/TODO', '_blank');
  };

  const handleAndroidDownload = () => {
    window.open('https://docs.lovable.dev/blogs/TODO', '_blank');
  };

  const handleGitHubGuide = () => {
    alert('To build the mobile apps:\n\n1. Clone the GitHub repository\n2. Run `npm install`\n3. Add iOS platform: `npx cap add ios`\n4. Add Android platform: `npx cap add android`\n5. Build the project: `npm run build`\n6. Sync with native platforms: `npx cap sync`\n7. Run on device: `npx cap run ios` or `npx cap run android`\n\nFor detailed instructions, visit the Lovable mobile development documentation.');
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Download Mobile App</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-black p-3 rounded-full mr-4">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">iOS App</h3>
                <p className="text-gray-600 text-sm">Build for iPhone and iPad</p>
              </div>
            </div>
            <Button 
              className="w-full bg-black hover:bg-gray-800 text-white"
              onClick={handleiOSDownload}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              iOS Build Guide
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
                <p className="text-gray-600 text-sm">Build for Android devices</p>
              </div>
            </div>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={handleAndroidDownload}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Android Build Guide
            </Button>
          </div>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-blue-600 p-3 rounded-full mr-4">
                <Github className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-800">Build Instructions</h3>
                <p className="text-blue-600">Step-by-step guide to build mobile apps from the GitHub repository</p>
              </div>
            </div>
            <Button 
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
              onClick={handleGitHubGuide}
            >
              <Github className="mr-2 h-4 w-4" />
              View Instructions
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
