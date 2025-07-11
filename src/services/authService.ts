// Authentication and role-based access control service
export interface User {
  email: string;
  name: string;
  role: 'Admin' | 'Agent' | 'Reporter';
  permissions: string[];
}

export class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Mock users for demonstration
  private users: User[] = [
    {
      email: 'admin@company.com',
      name: 'System Admin',
      role: 'Admin',
      permissions: ['create_ticket', 'edit_all_tickets', 'delete_ticket', 'view_all_tickets', 'manage_users', 'view_reports']
    },
    {
      email: 'john@company.com',
      name: 'John Doe',
      role: 'Agent',
      permissions: ['create_ticket', 'edit_assigned_tickets', 'view_assigned_tickets', 'comment_tickets']
    },
    {
      email: 'user@company.com',
      name: 'Regular User',
      role: 'Reporter',
      permissions: ['create_ticket', 'view_own_tickets', 'comment_own_tickets']
    }
  ];

  constructor() {
    // Set default user for demo
    this.currentUser = this.users[0]; // Admin user
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  login(email: string): User | null {
    const user = this.users.find(u => u.email === email);
    if (user) {
      this.currentUser = user;
      return user;
    }
    return null;
  }

  logout(): void {
    this.currentUser = null;
  }

  hasPermission(permission: string): boolean {
    return this.currentUser?.permissions.includes(permission) || false;
  }

  canEditTicket(ticket: any): boolean {
    if (!this.currentUser) return false;
    
    if (this.hasPermission('edit_all_tickets')) return true;
    if (this.hasPermission('edit_assigned_tickets') && ticket.assignedTo === this.currentUser.email) return true;
    if (this.hasPermission('edit_own_tickets') && ticket.reporterEmail === this.currentUser.email) return true;
    
    return false;
  }

  canViewTicket(ticket: any): boolean {
    if (!this.currentUser) return false;
    
    if (this.hasPermission('view_all_tickets')) return true;
    if (this.hasPermission('view_assigned_tickets') && ticket.assignedTo === this.currentUser.email) return true;
    if (this.hasPermission('view_own_tickets') && ticket.reporterEmail === this.currentUser.email) return true;
    
    return false;
  }

  getFilteredTickets(tickets: any[]): any[] {
    if (!this.currentUser) return [];
    
    if (this.hasPermission('view_all_tickets')) {
      return tickets;
    }
    
    return tickets.filter(ticket => this.canViewTicket(ticket));
  }
}