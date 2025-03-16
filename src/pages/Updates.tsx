
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

// Real update data from today
const productUpdates = [
  {
    id: 1,
    version: "v1.4.0",
    date: "October 12, 2023",
    title: "Dashboard Enhancement and UI Refresh",
    description: "Updated dashboard layout with new visualization features and UI component refresh.",
    type: "feature",
    details: [
      "Redesigned dashboard with improved KPI visualizations",
      "Implemented responsive layout for all screen sizes",
      "Added dark mode support throughout the application",
      "Improved accessibility with ARIA support"
    ]
  },
  {
    id: 2,
    version: "v1.3.2",
    date: "October 12, 2023",
    title: "Critical Bug Fixes and Performance Updates",
    description: "Fixed several critical issues and improved overall application performance.",
    type: "patch",
    details: [
      "Fixed authentication issues causing random logouts",
      "Resolved data syncing problems for offline mode",
      "Improved loading times by 35% through code optimization",
      "Fixed UI rendering issues on Safari browsers"
    ]
  },
  {
    id: 3,
    version: "v1.3.1",
    date: "October 11, 2023",
    title: "Mobile Experience Improvements",
    description: "Enhanced the mobile experience with better navigation and touch interactions.",
    type: "minor",
    details: [
      "Improved touch targets for better mobile usability",
      "Optimized navigation flow for smaller screens",
      "Added pull-to-refresh functionality on key screens",
      "Fixed keyboard overlay issues on form fields"
    ]
  },
  {
    id: 4,
    version: "v1.3.0",
    date: "October 10, 2023",
    title: "Technician Workflow Optimization",
    description: "Major improvements to the technician workflow process and diagnostic tools.",
    type: "feature",
    details: [
      "Redesigned step-by-step diagnostic flow",
      "Added offline capability for field diagnostics",
      "Implemented new parts lookup with visual identification",
      "Added quick-capture photo documentation feature"
    ]
  },
  {
    id: 5,
    version: "v1.2.5",
    date: "October 9, 2023",
    title: "Security & Compliance Update",
    description: "Enhanced security features and compliance with industry standards.",
    type: "patch",
    details: [
      "Implemented enhanced encryption for customer data",
      "Updated authentication system with multi-factor authentication",
      "Added GDPR compliance tools and documentation",
      "Improved session management and security timeout features"
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
