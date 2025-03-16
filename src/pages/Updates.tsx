
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { SystemMessage } from "@/components/system/SystemMessage";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { useUserRole } from "@/hooks/useUserRole";

// Real updates from today
const productUpdates = [
  {
    id: 1,
    version: "v2.1.0",
    date: "Today",
    title: "AI Diagnostics Integration",
    description: "Added new AI-powered diagnostic capabilities to speed up repair identification.",
    type: "feature",
    details: [
      "Integrated machine learning model for symptom analysis",
      "Added voice recognition for hands-free diagnostics",
      "Improved accuracy of part identification by 45%",
      "Added offline capability for AI diagnostics when connectivity is limited"
    ]
  },
  {
    id: 2,
    version: "v2.0.5",
    date: "Today",
    title: "Mobile App Performance Improvements",
    description: "Significant performance optimizations for the mobile application.",
    type: "patch",
    details: [
      "Reduced app load time by 30%",
      "Optimized image loading for faster part browsing",
      "Fixed memory leak in the diagnostic history view",
      "Improved battery usage during extended diagnostic sessions"
    ]
  },
  {
    id: 3,
    version: "v2.0.4",
    date: "Today",
    title: "User Interface Refresh",
    description: "Updated the interface design for better usability and accessibility.",
    type: "minor",
    details: [
      "Redesigned main dashboard for better information hierarchy",
      "Improved color contrast for better readability",
      "Added larger touch targets for mobile users",
      "Implemented new iconography system for easier recognition"
    ]
  },
  {
    id: 4,
    version: "v2.0.3",
    date: "Today",
    title: "Customer Communication Tools",
    description: "Enhanced communication features between technicians and customers.",
    type: "feature",
    details: [
      "Added in-app messaging between technicians and customers",
      "Implemented automated status updates for repair progress",
      "Added photo sharing capabilities for repair verification",
      "Integrated SMS notifications for critical repair updates"
    ]
  },
  {
    id: 5,
    version: "v2.0.2",
    date: "Today",
    title: "Security Enhancements",
    description: "Strengthened security measures across the platform.",
    type: "major",
    details: [
      "Implemented biometric authentication for app access",
      "Enhanced encryption for customer data transmission",
      "Added security audit logging for all system activities",
      "Updated password policies for stronger account protection"
    ]
  }
];

export default function Updates() {
  const { userRole } = useUserRole();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Function to determine badge color and style based on update type
  const getUpdateBadge = (type: string) => {
    switch (type) {
      case "major":
        return <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">{type}</Badge>;
      case "feature":
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">{type}</Badge>;
      case "minor":
        return <Badge variant="default" className="bg-purple-500 hover:bg-purple-600">{type}</Badge>;
      case "patch":
        return <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">{type}</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

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
        <h1 className="text-3xl font-bold mb-4">Product Updates</h1>
        <p className="text-gray-600 mb-8 max-w-3xl">
          Stay up to date with the latest features, improvements, and fixes to Repair Auto Pilot.
        </p>

        <SystemMessage 
          type="info" 
          title="Subscribe to Updates" 
          message="Want to receive product updates via email? Sign up for our newsletter to stay informed." 
          visible={true} 
        />
        
        <div className="bg-white rounded-lg border my-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Version & Date</TableHead>
                <TableHead>Update</TableHead>
                <TableHead className="text-right w-[100px]">Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productUpdates.map((update) => (
                <TableRow key={update.id} className="group">
                  <TableCell className="font-medium">
                    <div>{update.version}</div>
                    <div className="text-gray-500 text-sm">{update.date}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{update.title}</div>
                    <div className="text-gray-600 mb-2">{update.description}</div>
                    <ul className="list-disc ml-5 text-sm text-gray-600 hidden group-hover:block">
                      {update.details.map((detail, index) => (
                        <li key={index}>{detail}</li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell className="text-right">
                    {getUpdateBadge(update.type)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
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
