
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

// Sample update data
const productUpdates = [
  {
    id: 1,
    version: "v2.3.0",
    date: "June 15, 2023",
    title: "Smart Diagnostic Engine Upgrade",
    description: "Major improvements to the diagnostic engine with enhanced troubleshooting capabilities for newer appliance models.",
    type: "major",
    details: [
      "Added support for 2023 refrigerator models from major manufacturers",
      "Improved error code detection for dishwashers",
      "Enhanced diagnostic flowcharts for washing machines",
      "New troubleshooting steps for microwave ovens",
    ]
  },
  {
    id: 2,
    version: "v2.2.5",
    date: "May 28, 2023",
    title: "Performance Enhancements",
    description: "Multiple performance improvements and bug fixes for a smoother diagnostic experience.",
    type: "minor",
    details: [
      "Fixed lag issues when navigating between diagnostic steps",
      "Improved loading time for appliance diagrams",
      "Fixed incorrect part number display for certain models",
      "Enhanced mobile responsiveness for technicians in the field",
    ]
  },
  {
    id: 3,
    version: "v2.2.0",
    date: "April 10, 2023",
    title: "Mobile App Integration",
    description: "New mobile app integration allowing technicians to access diagnostics on the go.",
    type: "feature",
    details: [
      "Added QR code scanning for quick appliance identification",
      "Offline mode for accessing diagnostic workflows without internet",
      "Camera integration for capturing issues and attaching to repair tickets",
      "Push notifications for important alerts and updates",
    ]
  },
  {
    id: 4,
    version: "v2.1.2",
    date: "March 3, 2023",
    title: "Bug Fixes and UI Improvements",
    description: "Various bug fixes and user interface enhancements for a better user experience.",
    type: "patch",
    details: [
      "Fixed search functionality for part catalog",
      "Improved contrast for better readability of diagnostic steps",
      "Fixed incorrect part suggestions for certain error codes",
      "Enhanced printer compatibility for service reports",
    ]
  },
  {
    id: 5,
    version: "v2.1.0",
    date: "February 15, 2023",
    title: "Parts Inventory Management",
    description: "New feature for tracking and managing parts inventory integrated with diagnostic recommendations.",
    type: "feature",
    details: [
      "Real-time inventory tracking of common replacement parts",
      "Automatic reorder suggestions based on usage patterns",
      "Integration with supplier catalogs for price comparisons",
      "Parts usage history for better inventory forecasting",
    ]
  }
];

export default function Updates() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get the badge color based on update type
  const getUpdateTypeBadge = (type: string) => {
    switch (type) {
      case "major":
        return "bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium";
      case "feature":
        return "bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium";
      case "minor":
        return "bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium";
      case "patch":
        return "bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-medium";
      default:
        return "bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium";
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
                    <span className={getUpdateTypeBadge(update.type)}>
                      {update.type}
                    </span>
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
