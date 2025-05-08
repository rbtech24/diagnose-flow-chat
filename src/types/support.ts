
import { Database } from "@/integrations/supabase/types";

export type SupportTicketStatus = "open" | "in-progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "critical";

export type SupportTicket = Database["public"]["Tables"]["support_tickets"]["Row"] & {
  creator?: { name: string; email: string; avatar_url?: string };
  assignee?: { name: string; email: string; avatar_url?: string };
};

export type SupportTicketMessage = Database["public"]["Tables"]["ticket_messages"]["Row"] & {
  sender?: { name: string; email: string; avatar_url?: string };
};
