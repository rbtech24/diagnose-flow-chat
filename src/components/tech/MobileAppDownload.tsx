
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
                  <path d="M17.523 15.3414c-.5511-.4875-.9993-.9988-1.3447-1.5339-.3454-.5351-.5182-1.0808-.5182-1.6372 0-.5564.1728-1.1021.5182-1.6372.3454-.5351.7936-1.0464 1.3447-1.5339l-3.429-5.9639c-.0848-.1474-.2139-.2680-.3762-.3515-.1623-.0835-.3427-.1253-.5258-.1218-.1831.0035-.3612.0534-.5191.1453-.1579.0919-.2902.2216-.3855.3782L7.477 13.8242c-.0953.1566-.1433.3347-.1398.5178.0035.1831.0554.3635.1511.5256.0957.1621.2272.2907.3827.3748.1555.0841.3300.1233.5081.1142h9.046c.178.0091.3525-.0301.508-.1142.1555-.0841.287-.2127.3827-.3748.0957-.1621.1476-.3425.1511-.5256.0035-.1831-.0445-.3612-.1398-.5178z"/>
                  <path d="M3.84 8.753c-.588 0-1.137-.233-1.546-.656-.409-.423-.622-.995-.6-1.591.022-.596.267-1.152.69-1.567.423-.415.996-.647 1.616-.652.62-.005 1.198.216 1.632.624.434.408.691.962.725 1.563.034.601-.169 1.181-.572 1.636-.403.455-.959.71-1.567.71l-.378-.067z"/>
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
