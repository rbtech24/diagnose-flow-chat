
import { User } from "./user";

export type SupportTicketStatus = "open" | "in-progress" | "resolved" | "closed";
export type SupportTicketPriority = "low" | "medium" | "high" | "critical";

export interface SupportTicketMessage {
  id: string;
  ticketId: string;
  content: string;
  createdAt: Date;
  sender: User;
}

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
  createdAt: Date;
  updatedAt: Date;
  createdBy: User;
  messages: SupportTicketMessage[];
}
