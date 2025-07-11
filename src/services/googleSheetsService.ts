// Google Sheets API integration service
// This simulates the Google Sheets backend integration

export class GoogleSheetsService {
  private static instance: GoogleSheetsService;
  private tickets: any[] = [];
  private nextTicketNumber = 1;

  static getInstance(): GoogleSheetsService {
    if (!GoogleSheetsService.instance) {
      GoogleSheetsService.instance = new GoogleSheetsService();
    }
    return GoogleSheetsService.instance;
  }

  // Simulate Google Sheets data structure
  private initializeMockData() {
    this.tickets = [
      {
        id: '1',
        ticketId: 'TKT-0001',
        summary: 'Login page not responding',
        description: 'Users are unable to access the login page. The page loads but the submit button is not working.',
        priority: 'High',
        assignedTo: 'john-doe',
        status: 'Open',
        reporterEmail: 'user@company.com',
        createdAt: new Date('2025-01-15T10:30:00'),
        updatedAt: new Date('2025-01-15T10:30:00'),
        lastComment: 'Initial report submitted',
        attachmentLink: 'https://drive.google.com/file/d/example1',
        slaBreached: false,
        inactiveHours: 2
      },
      {
        id: '2',
        ticketId: 'TKT-0002',
        summary: 'Database connection timeout',
        description: 'API requests are timing out when trying to connect to the database during peak hours.',
        priority: 'High',
        assignedTo: 'alice-johnson',
        status: 'In Progress',
        reporterEmail: 'admin@company.com',
        createdAt: new Date('2025-01-14T14:20:00'),
        updatedAt: new Date('2025-01-15T09:15:00'),
        lastComment: 'Working on database optimization',
        slaBreached: true,
        inactiveHours: 0
      },
      {
        id: '3',
        ticketId: 'TKT-0003',
        summary: 'Feature request: Dark mode',
        description: 'Users have requested a dark mode option for better accessibility.',
        priority: 'Low',
        assignedTo: 'mike-davis',
        status: 'Closed',
        reporterEmail: 'feedback@company.com',
        createdAt: new Date('2025-01-13T16:45:00'),
        updatedAt: new Date('2025-01-14T11:30:00'),
        lastComment: 'Feature implemented and deployed',
        inactiveHours: 24
      }
    ];
    this.nextTicketNumber = 4;
  }

  constructor() {
    this.initializeMockData();
  }

  // Generate unique ticket ID in TKT-0001 format
  generateTicketId(): string {
    const ticketId = `TKT-${this.nextTicketNumber.toString().padStart(4, '0')}`;
    this.nextTicketNumber++;
    return ticketId;
  }

  // Create new ticket (simulates Google Form submission + Apps Script)
  async createTicket(ticketData: Omit<any, 'id' | 'ticketId' | 'createdAt' | 'updatedAt'>): Promise<any> {
    const ticket = {
      id: Date.now().toString(),
      ticketId: this.generateTicketId(),
      ...ticketData,
      createdAt: new Date(),
      updatedAt: new Date(),
      slaBreached: false,
      inactiveHours: 0
    };

    this.tickets.unshift(ticket);
    
    // Simulate Apps Script automation
    await this.triggerAppsScriptAutomation('ticket_created', ticket);
    
    return ticket;
  }

  // Update ticket (simulates sheet cell updates + Apps Script triggers)
  async updateTicket(id: string, updates: Partial<any>): Promise<any> {
    const ticketIndex = this.tickets.findIndex(t => t.id === id);
    if (ticketIndex === -1) throw new Error('Ticket not found');

    const oldTicket = { ...this.tickets[ticketIndex] };
    this.tickets[ticketIndex] = {
      ...this.tickets[ticketIndex],
      ...updates,
      updatedAt: new Date()
    };

    // Trigger Apps Script automation for status/assignment changes
    if (updates.status && updates.status !== oldTicket.status) {
      await this.triggerAppsScriptAutomation('status_changed', this.tickets[ticketIndex]);
    }
    if (updates.assignedTo && updates.assignedTo !== oldTicket.assignedTo) {
      await this.triggerAppsScriptAutomation('assignment_changed', this.tickets[ticketIndex]);
    }

    return this.tickets[ticketIndex];
  }

  // Get all tickets with filtering
  async getTickets(filters?: any): Promise<any[]> {
    let filteredTickets = [...this.tickets];

    if (filters?.status && filters.status !== 'all') {
      filteredTickets = filteredTickets.filter(t => t.status === filters.status);
    }
    if (filters?.priority && filters.priority !== 'all') {
      filteredTickets = filteredTickets.filter(t => t.priority === filters.priority);
    }
    if (filters?.assignedTo && filters.assignedTo !== 'all') {
      filteredTickets = filteredTickets.filter(t => t.assignedTo === filters.assignedTo);
    }
    if (filters?.reporterEmail) {
      filteredTickets = filteredTickets.filter(t => t.reporterEmail === filters.reporterEmail);
    }

    return filteredTickets;
  }

  // Get ticket by ID
  async getTicket(id: string): Promise<any | null> {
    return this.tickets.find(t => t.id === id) || null;
  }

  // Delete ticket
  async deleteTicket(id: string): Promise<boolean> {
    const index = this.tickets.findIndex(t => t.id === id);
    if (index === -1) return false;
    
    this.tickets.splice(index, 1);
    return true;
  }

  // Get dashboard statistics
  async getDashboardStats(): Promise<any> {
    const stats = {
      total: this.tickets.length,
      open: this.tickets.filter(t => t.status === 'Open').length,
      inProgress: this.tickets.filter(t => t.status === 'In Progress').length,
      closed: this.tickets.filter(t => t.status === 'Closed').length,
      highPriority: this.tickets.filter(t => t.priority === 'High').length,
      slaBreached: this.tickets.filter(t => t.slaBreached).length,
      byStatus: {} as Record<string, number>,
      byPriority: {} as Record<string, number>,
      byAgent: {} as Record<string, number>
    };

    // Calculate by status
    ['Open', 'In Progress', 'Closed'].forEach(status => {
      stats.byStatus[status] = this.tickets.filter(t => t.status === status).length;
    });

    // Calculate by priority
    ['Low', 'Medium', 'High'].forEach(priority => {
      stats.byPriority[priority] = this.tickets.filter(t => t.priority === priority).length;
    });

    // Calculate by agent
    const agents = [...new Set(this.tickets.map(t => t.assignedTo))];
    agents.forEach(agent => {
      stats.byAgent[agent] = this.tickets.filter(t => t.assignedTo === agent).length;
    });

    return stats;
  }

  // Simulate Apps Script automation triggers
  private async triggerAppsScriptAutomation(trigger: string, ticket: any): Promise<void> {
    console.log(`🤖 Apps Script Automation: ${trigger}`, ticket);
    
    switch (trigger) {
      case 'ticket_created':
        await this.sendEmailNotification('ticket_created', ticket);
        break;
      case 'status_changed':
        await this.sendEmailNotification('status_changed', ticket);
        await this.checkSLABreach(ticket);
        break;
      case 'assignment_changed':
        await this.sendEmailNotification('assignment_changed', ticket);
        break;
    }
  }

  // Simulate email notifications
  private async sendEmailNotification(type: string, ticket: any): Promise<void> {
    const emailTemplates = {
      ticket_created: `New ticket created: ${ticket.ticketId} - ${ticket.summary}`,
      status_changed: `Ticket ${ticket.ticketId} status changed to: ${ticket.status}`,
      assignment_changed: `Ticket ${ticket.ticketId} assigned to you`,
      sla_breach: `SLA BREACH: Ticket ${ticket.ticketId} requires immediate attention`
    };

    console.log(`📧 Email Notification: ${emailTemplates[type as keyof typeof emailTemplates]}`);
  }

  // Check SLA breach
  private async checkSLABreach(ticket: any): Promise<void> {
    const slaHours = {
      'Low': 72,
      'Medium': 24,
      'High': 4
    };

    const hoursSinceCreated = (new Date().getTime() - new Date(ticket.createdAt).getTime()) / (1000 * 60 * 60);
    const slaThreshold = slaHours[ticket.priority as keyof typeof slaHours];

    if (hoursSinceCreated > slaThreshold && ticket.status !== 'Closed') {
      ticket.slaBreached = true;
      await this.sendEmailNotification('sla_breach', ticket);
    }
  }

  // Auto-close inactive tickets (simulates scheduled Apps Script)
  async autoCloseInactiveTickets(): Promise<void> {
    const inactivityThreshold = 168; // 7 days in hours
    const now = new Date();

    for (const ticket of this.tickets) {
      if (ticket.status !== 'Closed') {
        const hoursSinceUpdate = (now.getTime() - new Date(ticket.updatedAt).getTime()) / (1000 * 60 * 60);
        
        if (hoursSinceUpdate > inactivityThreshold) {
          await this.updateTicket(ticket.id, { 
            status: 'Closed', 
            lastComment: 'Auto-closed due to inactivity' 
          });
        }
      }
    }
  }
}