
import { SupportTicket } from "@/types/support";

export const mockSupportTickets: SupportTicket[] = [
  {
    id: "ticket-1",
    title: "Issue with technician assignment",
    description: "When trying to assign a technician to a repair job, the application freezes and I have to reload the page. This has been happening consistently for the past two days.",
    status: "open",
    priority: "high",
    user_id: "user-1",
    company_id: "company-1",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_by_user: {
      name: "John Manager",
      email: "john@acme.com",
      role: "company",
      avatar_url: "https://i.pravatar.cc/150?u=john"
    }
  },
  {
    id: "ticket-2",
    title: "Need help with customer billing",
    description: "I'm trying to create a custom invoice for a customer but I can't find the option to add custom line items. The documentation says this should be possible.",
    status: "in_progress",
    priority: "medium",
    user_id: "user-2",
    company_id: "company-1",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    created_by_user: {
      name: "Sarah Admin",
      email: "sarah@acme.com",
      role: "company",
      avatar_url: "https://i.pravatar.cc/150?u=sarah"
    }
  },
  {
    id: "ticket-3",
    title: "Mobile app crashes on startup",
    description: "After the latest update, the mobile app crashes immediately after opening. I'm using an iPhone 12 with iOS 15.5.",
    status: "resolved",
    priority: "critical",
    user_id: "user-3",
    company_id: "company-2",
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_by_user: {
      name: "Mike Technician",
      email: "mike@fastfix.com",
      role: "tech",
      avatar_url: "https://i.pravatar.cc/150?u=mike"
    }
  }
];
