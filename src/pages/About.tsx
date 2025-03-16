
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function About() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-24 items-center justify-between px-4">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/a942106a-6512-4888-a5c2-dcf6c5d18b64.png" 
              alt="Repair Auto Pilot" 
              className="h-16"
            />
          </div>
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">About Repair Auto Pilot</h1>
        
        <div className="prose max-w-none">
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
          <p className="mb-6">
            At Repair Auto Pilot, our mission is to empower appliance repair technicians with intelligent diagnostic tools that streamline workflows, 
            reduce diagnostic time, and improve first-time fix rates. We believe that by combining industry expertise with cutting-edge technology, 
            we can transform the appliance repair industry.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 my-12">
            <div>
              <h3 className="text-xl font-semibold mb-4">Our Story</h3>
              <p>
                Repair Auto Pilot was founded in 2020 by a team of experienced appliance repair technicians and software engineers who recognized 
                the need for better diagnostic tools in the field. After years of witnessing inefficient troubleshooting processes and unnecessary 
                repeat visits, our founders set out to create a solution that would revolutionize how technicians approach appliance repairs.
              </p>
              <p className="mt-4">
                What started as a simple workflow tool has evolved into a comprehensive platform that serves hundreds of appliance repair companies 
                across the country, helping them improve efficiency, reduce training time, and increase customer satisfaction.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <img 
                src="/lovable-uploads/eecdb784-4fd9-47a5-9588-f4299e2dbd04.png" 
                alt="Technician using Repair Auto Pilot" 
                className="rounded-lg shadow-lg max-w-full h-auto"
              />
            </div>
          </div>
          
          <h3 className="text-xl font-semibold mb-4">Our Values</h3>
          <ul className="list-disc pl-6 space-y-2 mb-8">
            <li><strong>Innovation:</strong> We constantly push the boundaries of what's possible in appliance diagnostics.</li>
            <li><strong>Excellence:</strong> We strive for the highest quality in every aspect of our platform.</li>
            <li><strong>Empowerment:</strong> We build tools that empower technicians to do their best work.</li>
            <li><strong>Collaboration:</strong> We work closely with our customers to develop solutions that meet their needs.</li>
            <li><strong>Integrity:</strong> We conduct our business with honesty and transparency.</li>
          </ul>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-8 my-12">
          <h3 className="text-xl font-semibold mb-4 text-center">Join Our Team</h3>
          <p className="text-center mb-6">
            We're always looking for talented individuals who share our passion for technology and innovation.
          </p>
          <div className="flex justify-center">
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link to="/careers">
                View Open Positions
              </Link>
            </Button>
          </div>
        </div>
      </main>
      
      <footer className="border-t bg-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">© 2023 Repair Auto Pilot. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-4">
            <Link to="/terms-of-use" className="text-sm text-gray-500 hover:text-blue-600">Terms of Use</Link>
            <span className="text-gray-400">|</span>
            <Link to="/privacy-policy" className="text-sm text-gray-500 hover:text-blue-600">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
