import { useState, useEffect } from 'react';
import { GoogleSheetsService } from '../services/googleSheetsService';
import { AuthService } from '../services/authService';
import { Ticket, TicketStats, TeamMember } from '../types';

// Team members data (would typically come from Google Sheets)
const teamMembers: TeamMember[] = [
  { id: 'john-doe', name: 'John Doe', email: 'john@company.com', role: 'Agent', workload: 3 },
  { id: 'alice-johnson', name: 'Alice Johnson', email: 'alice@company.com', role: 'Agent', workload: 2 },
  { id: 'mike-davis', name: 'Mike Davis', email: 'mike@company.com', role: 'Agent', workload: 4 },
  { id: 'lisa-garcia', name: 'Lisa Garcia', email: 'lisa@company.com', role: 'Agent', workload: 1 },
  { id: 'sarah-brown', name: 'Sarah Brown', email: 'sarah@company.com', role: 'Admin', workload: 2 }
];

export const useGoogleSheetsTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<TicketStats>({
    total: 0,
    open: 0,
    inProgress: 0,
    closed: 0,
    highPriority: 0,
    slaBreached: 0,
    byStatus: {},
    byPriority: {},
    byAgent: {}
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sheetsService = GoogleSheetsService.getInstance();
  const authService = AuthService.getInstance();

  // Load tickets from Google Sheets
  const loadTickets = async (filters?: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const allTickets = await sheetsService.getTickets(filters);
      const filteredTickets = authService.getFilteredTickets(allTickets);
      setTickets(filteredTickets);
      
      // Load dashboard stats
      const dashboardStats = await sheetsService.getDashboardStats();
      setStats(dashboardStats);
    } catch (err) {
      setError('Failed to load tickets from Google Sheets');
      console.error('Error loading tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create new ticket (simulates Google Form submission)
  const createTicket = async (ticketData: Omit<Ticket, 'id' | 'ticketId' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const currentUser = authService.getCurrentUser();
      const newTicketData = {
        ...ticketData,
        reporterEmail: currentUser?.email || ticketData.reporterEmail,
        lastComment: 'Ticket created'
      };
      
      await sheetsService.createTicket(newTicketData);
      await loadTickets(); // Refresh tickets
      
      // Show success notification
      console.log('✅ Ticket created successfully via Google Sheets');
    } catch (err) {
      setError('Failed to create ticket');
      console.error('Error creating ticket:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update ticket (triggers Apps Script automation)
  const updateTicket = async (id: string, updates: Partial<Ticket>) => {
    setLoading(true);
    setError(null);
    
    try {
      const ticket = tickets.find(t => t.id === id);
      if (!ticket) throw new Error('Ticket not found');
      
      if (!authService.canEditTicket(ticket)) {
        throw new Error('Permission denied');
      }
      
      await sheetsService.updateTicket(id, updates);
      await loadTickets(); // Refresh tickets
      
      console.log('✅ Ticket updated successfully');
    } catch (err) {
      setError('Failed to update ticket');
      console.error('Error updating ticket:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete ticket (Admin only)
  const deleteTicket = async (id: string) => {
    if (!authService.hasPermission('delete_ticket')) {
      setError('Permission denied');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await sheetsService.deleteTicket(id);
      await loadTickets(); // Refresh tickets
      
      console.log('✅ Ticket deleted successfully');
    } catch (err) {
      setError('Failed to delete ticket');
      console.error('Error deleting ticket:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add comment to ticket
  const addComment = async (ticketId: string, comment: string) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;
    
    if (!authService.canEditTicket(ticket)) {
      setError('Permission denied');
      return;
    }
    
    await updateTicket(ticketId, { 
      lastComment: comment,
      updatedAt: new Date()
    });
  };

  // Run scheduled maintenance (simulates Apps Script triggers)
  const runScheduledMaintenance = async () => {
    try {
      await sheetsService.autoCloseInactiveTickets();
      await loadTickets();
      console.log('🔧 Scheduled maintenance completed');
    } catch (err) {
      console.error('Error running scheduled maintenance:', err);
    }
  };

  // Load tickets on component mount
  useEffect(() => {
    loadTickets();
    
    // Simulate periodic refresh (like Apps Script triggers)
    const interval = setInterval(() => {
      loadTickets();
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  return {
    tickets,
    teamMembers,
    stats,
    loading,
    error,
    createTicket,
    updateTicket,
    deleteTicket,
    addComment,
    loadTickets,
    runScheduledMaintenance,
    currentUser: authService.getCurrentUser(),
    hasPermission: authService.hasPermission.bind(authService),
    canEditTicket: authService.canEditTicket.bind(authService)
  };
};