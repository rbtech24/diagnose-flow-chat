
import { useState, useEffect } from 'react';
import { 
  fetchSupportTickets, 
  fetchSupportTicketById, 
  fetchTicketMessages,
  createSupportTicket,
  updateSupportTicket,
  addTicketMessage
} from '@/api/supportTicketsApi';
import { SupportTicket, SupportTicketMessage } from '@/types/support';

export function useSupportTickets(initialStatus?: string, companyId?: string) {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const loadTickets = async (status?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchSupportTickets(status, companyId);
      setTickets(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred while fetching tickets'));
    } finally {
      setIsLoading(false);
    }
  };

  // Load tickets on component mount
  useEffect(() => {
    loadTickets(initialStatus);
  }, [initialStatus, companyId]);

  const getTicketById = async (id: string): Promise<SupportTicket> => {
    try {
      return await fetchSupportTicketById(id);
    } catch (err) {
      throw err instanceof Error ? err : new Error(`Failed to fetch ticket ${id}`);
    }
  };

  const getTicketMessages = async (ticketId: string): Promise<SupportTicketMessage[]> => {
    try {
      return await fetchTicketMessages(ticketId);
    } catch (err) {
      throw err instanceof Error ? err : new Error(`Failed to fetch messages for ticket ${ticketId}`);
    }
  };

  const createTicket = async (ticketData: Partial<SupportTicket>): Promise<SupportTicket> => {
    try {
      const newTicket = await createSupportTicket(ticketData);
      // Reload tickets to include the new one
      loadTickets(initialStatus);
      return newTicket;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create ticket');
    }
  };

  const updateTicket = async (ticketId: string, updateData: Partial<SupportTicket>): Promise<SupportTicket> => {
    try {
      const updatedTicket = await updateSupportTicket(ticketId, updateData);
      // Update the ticket in the local state
      setTickets(prevTickets => 
        prevTickets.map(ticket => 
          ticket.id === ticketId ? { ...ticket, ...updateData } : ticket
        )
      );
      return updatedTicket;
    } catch (err) {
      throw err instanceof Error ? err : new Error(`Failed to update ticket ${ticketId}`);
    }
  };

  const addMessage = async (messageData: Partial<SupportTicketMessage>): Promise<SupportTicketMessage> => {
    try {
      return await addTicketMessage(messageData);
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add message');
    }
  };

  return {
    tickets,
    isLoading,
    error,
    loadTickets,
    getTicketById,
    getTicketMessages,
    createTicket,
    updateTicket,
    addMessage
  };
}
