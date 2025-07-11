export interface Ticket {
  id: string;
  ticketId: string; // TKT-0001 format
  summary: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  assignedTo: string;
  status: 'Open' | 'In Progress' | 'Closed';
  reporterEmail: string;
  createdAt: Date;
  updatedAt: Date;
  lastComment: string;
  attachmentLink?: string;
  slaBreached?: boolean;
  inactiveHours?: number;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Agent' | 'Reporter';
  avatar?: string;
  workload: number;
}

export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  closed: number;
  highPriority: number;
  slaBreached: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  byAgent: Record<string, number>;
}

export interface Comment {
  id: string;
  ticketId: string;
  author: string;
  content: string;
  timestamp: Date;
}

export interface SLAConfig {
  lowPriority: number; // hours
  mediumPriority: number;
  highPriority: number;
  inactivityThreshold: number; // hours for auto-close
}

export interface UserRole {
  email: string;
  role: 'Admin' | 'Agent' | 'Reporter';
  permissions: string[];
}