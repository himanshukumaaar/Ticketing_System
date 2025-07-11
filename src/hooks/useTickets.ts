import { useState, useEffect } from 'react';
import { Ticket, TeamMember, TicketStats } from '../types';

// Mock data
const initialTickets: Ticket[] = [
  {
    id: '1',
    title: 'Login page not responding',
    description: 'Users are unable to access the login page. The page loads but the submit button is not working.',
    priority: 'Critical',
    status: 'Open',
    category: 'Bug',
    assignedTo: 'john-doe',
    createdBy: 'jane-smith',
    createdAt: new Date('2025-01-15T10:30:00'),
    updatedAt: new Date('2025-01-15T10:30:00'),
    dueDate: new Date('2025-01-16T17:00:00'),
    tags: ['frontend', 'authentication']
  },
  {
    id: '2',
    title: 'Add dark mode toggle',
    description: 'Users have requested a dark mode option for better accessibility and user experience.',
    priority: 'Medium',
    status: 'In Progress',
    category: 'Feature Request',
    assignedTo: 'alice-johnson',
    createdBy: 'bob-wilson',
    createdAt: new Date('2025-01-14T14:20:00'),
    updatedAt: new Date('2025-01-15T09:15:00'),
    dueDate: new Date('2025-01-20T17:00:00'),
    tags: ['ui', 'accessibility']
  },
  {
    id: '3',
    title: 'Database connection timeout',
    description: 'API requests are timing out when trying to connect to the database during peak hours.',
    priority: 'High',
    status: 'Resolved',
    category: 'Bug',
    assignedTo: 'mike-davis',
    createdBy: 'sarah-brown',
    createdAt: new Date('2025-01-13T16:45:00'),
    updatedAt: new Date('2025-01-14T11:30:00'),
    dueDate: new Date('2025-01-15T12:00:00'),
    tags: ['backend', 'database', 'performance']
  },
  {
    id: '4',
    title: 'Update API documentation',
    description: 'The API documentation needs to be updated to reflect the latest changes in version 2.0.',
    priority: 'Low',
    status: 'Open',
    category: 'Documentation',
    assignedTo: 'lisa-garcia',
    createdBy: 'tom-miller',
    createdAt: new Date('2025-01-12T11:15:00'),
    updatedAt: new Date('2025-01-12T11:15:00'),
    tags: ['documentation', 'api']
  }
];

const teamMembers: TeamMember[] = [
  { id: 'john-doe', name: 'John Doe', email: 'john@company.com', role: 'Senior Developer', workload: 3 },
  { id: 'alice-johnson', name: 'Alice Johnson', email: 'alice@company.com', role: 'Frontend Developer', workload: 2 },
  { id: 'mike-davis', name: 'Mike Davis', email: 'mike@company.com', role: 'Backend Developer', workload: 4 },
  { id: 'lisa-garcia', name: 'Lisa Garcia', email: 'lisa@company.com', role: 'Technical Writer', workload: 1 },
  { id: 'sarah-brown', name: 'Sarah Brown', email: 'sarah@company.com', role: 'QA Engineer', workload: 2 }
];

export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [stats, setStats] = useState<TicketStats>({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    overdue: 0,
    avgResolutionTime: 0
  });

  const calculateStats = (ticketList: Ticket[]) => {
    const now = new Date();
    const newStats: TicketStats = {
      total: ticketList.length,
      open: ticketList.filter(t => t.status === 'Open').length,
      inProgress: ticketList.filter(t => t.status === 'In Progress').length,
      resolved: ticketList.filter(t => t.status === 'Resolved').length,
      closed: ticketList.filter(t => t.status === 'Closed').length,
      overdue: ticketList.filter(t => t.dueDate && t.dueDate < now && t.status !== 'Closed').length,
      avgResolutionTime: 24 // Mock average resolution time in hours
    };
    setStats(newStats);
  };

  useEffect(() => {
    calculateStats(tickets);
  }, [tickets]);

  const addTicket = (newTicket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => {
    const ticket: Ticket = {
      ...newTicket,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setTickets(prev => [ticket, ...prev]);
    
    // Simulate email notification
    simulateEmailNotification('ticket_created', ticket);
  };

  const updateTicket = (id: string, updates: Partial<Ticket>) => {
    setTickets(prev => 
      prev.map(ticket => 
        ticket.id === id 
          ? { ...ticket, ...updates, updatedAt: new Date() }
          : ticket
      )
    );
    
    // Simulate email notification for status changes
    if (updates.status) {
      const ticket = tickets.find(t => t.id === id);
      if (ticket) {
        simulateEmailNotification('status_changed', { ...ticket, ...updates });
      }
    }
  };

  const deleteTicket = (id: string) => {
    setTickets(prev => prev.filter(ticket => ticket.id !== id));
  };

  const simulateEmailNotification = (type: string, ticket: Ticket) => {
    const member = teamMembers.find(m => m.id === ticket.assignedTo);
    console.log(`📧 Email sent to ${member?.email}: ${type} - ${ticket.title}`);
  };

  return {
    tickets,
    teamMembers,
    stats,
    addTicket,
    updateTicket,
    deleteTicket
  };
};