import React, { useState } from 'react';
import { Ticket, TeamMember } from '../types';
import { 
  Search, 
  Filter, 
  Plus, 
  Bell,
  User,
  Settings,
  Home,
  BarChart3,
  MessageSquare,
  ChevronRight,
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface MobileAppSheetInterfaceProps {
  tickets: Ticket[];
  teamMembers: TeamMember[];
  stats: any;
  currentUser: any;
  onCreateTicket: () => void;
  onUpdateTicket: (id: string, updates: Partial<Ticket>) => void;
  hasPermission: (permission: string) => boolean;
}

export const MobileAppSheetInterface: React.FC<MobileAppSheetInterfaceProps> = ({
  tickets,
  teamMembers,
  stats,
  currentUser,
  onCreateTicket,
  onUpdateTicket,
  hasPermission
}) => {
  const [activeTab, setActiveTab] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    
    // Role-based filtering
    if (currentUser?.role === 'Reporter') {
      return matchesSearch && matchesStatus && ticket.reporterEmail === currentUser.email;
    }
    if (currentUser?.role === 'Agent') {
      return matchesSearch && matchesStatus && ticket.assignedTo === currentUser.email;
    }
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'text-red-600 bg-red-50';
      case 'In Progress': return 'text-yellow-600 bg-yellow-50';
      case 'Closed': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderHomeTab = () => (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Open Tickets</p>
              <p className="text-2xl font-bold text-red-600">{stats.open}</p>
            </div>
            <Clock className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-orange-600">{stats.highPriority}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">SLA Breached</p>
              <p className="text-2xl font-bold text-red-600">{stats.slaBreached}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.closed}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Recent Tickets */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Recent Tickets</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredTickets.slice(0, 5).map(ticket => (
            <div key={ticket.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {ticket.ticketId}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <p className="font-medium text-gray-900 text-sm mb-1">{ticket.summary}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400 ml-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTicketsTab = () => (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {filteredTickets.map(ticket => (
          <div key={ticket.id} className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {ticket.ticketId}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                    {ticket.slaBreached && (
                      <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-600">
                        SLA BREACH
                      </span>
                    )}
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{ticket.summary}</h4>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">{ticket.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Assigned to: {teamMembers.find(m => m.id === ticket.assignedTo)?.name}</span>
                    <span>{new Date(ticket.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`text-sm px-3 py-1 rounded-full ${getStatusColor(ticket.status)}`}>
                  {ticket.status}
                </span>
                
                {hasPermission('edit_assigned_tickets') && (
                  <div className="flex gap-2">
                    {ticket.status === 'Open' && (
                      <button
                        onClick={() => onUpdateTicket(ticket.id, { status: 'In Progress' })}
                        className="text-xs px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200 transition-colors"
                      >
                        Start Work
                      </button>
                    )}
                    {ticket.status === 'In Progress' && (
                      <button
                        onClick={() => onUpdateTicket(ticket.id, { status: 'Closed' })}
                        className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                      >
                        Close
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStatsTab = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Performance Overview</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Tickets</span>
            <span className="font-semibold text-gray-900">{stats.total}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Resolution Rate</span>
            <span className="font-semibold text-green-600">
              {stats.total > 0 ? Math.round((stats.closed / stats.total) * 100) : 0}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">SLA Compliance</span>
            <span className="font-semibold text-red-600">
              {stats.total > 0 ? Math.round(((stats.total - stats.slaBreached) / stats.total) * 100) : 100}%
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Priority Breakdown</h3>
        <div className="space-y-3">
          {Object.entries(stats.byPriority || {}).map(([priority, count]) => (
            <div key={priority} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  priority === 'High' ? 'bg-red-500' : 
                  priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`}></div>
                <span className="text-sm text-gray-700">{priority}</span>
              </div>
              <span className="font-semibold text-gray-900">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProfileTab = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{currentUser?.name}</h3>
            <p className="text-sm text-gray-600">{currentUser?.email}</p>
            <p className="text-xs text-blue-600 font-medium">{currentUser?.role}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Role Permissions</h3>
        <div className="space-y-2">
          {currentUser?.permissions?.map((permission: string) => (
            <div key={permission} className="flex items-center text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              {permission.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">App Information</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>• Mobile-optimized AppSheet interface</p>
          <p>• Real-time Google Sheets integration</p>
          <p>• Apps Script automation enabled</p>
          <p>• Role-based access control active</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">TicketFlow Mobile</h1>
          <div className="flex items-center space-x-3">
            <button className="p-2 hover:bg-gray-100 rounded-full relative">
              <Bell className="w-5 h-5 text-gray-600" />
              {stats.slaBreached > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              )}
            </button>
            {hasPermission('create_ticket') && (
              <button
                onClick={onCreateTicket}
                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'home' && renderHomeTab()}
        {activeTab === 'tickets' && renderTicketsTab()}
        {activeTab === 'stats' && renderStatsTab()}
        {activeTab === 'profile' && renderProfileTab()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              activeTab === 'home' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
            }`}
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-xs">Home</span>
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              activeTab === 'tickets' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
            }`}
          >
            <MessageSquare className="w-5 h-5 mb-1" />
            <span className="text-xs">Tickets</span>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              activeTab === 'stats' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
            }`}
          >
            <BarChart3 className="w-5 h-5 mb-1" />
            <span className="text-xs">Stats</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              activeTab === 'profile' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
            }`}
          >
            <User className="w-5 h-5 mb-1" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};