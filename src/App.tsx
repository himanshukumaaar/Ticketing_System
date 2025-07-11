import React, { useState, useEffect } from 'react';
import { useGoogleSheetsTickets } from './hooks/useGoogleSheetsTickets';
import { GoogleSheetsDashboard } from './components/GoogleSheetsDashboard';
import { ConditionalFormattingCard } from './components/ConditionalFormattingCard';
import { GoogleFormTicketCreator } from './components/GoogleFormTicketCreator';
import { MobileAppSheetInterface } from './components/MobileAppSheetInterface';
import { AuthService } from './services/authService';
import { 
  LayoutDashboard, 
  Ticket, 
  Users, 
  Settings,
  Bell,
  Search,
  Menu,
  X,
  Smartphone,
  Monitor,
  Zap,
  Database,
  Mail
} from 'lucide-react';

type View = 'dashboard' | 'tickets' | 'team' | 'settings' | 'mobile';

function App() {
  const {
    tickets,
    teamMembers,
    stats,
    loading,
    error,
    createTicket,
    updateTicket,
    deleteTicket,
    addComment,
    runScheduledMaintenance,
    currentUser,
    hasPermission,
    canEditTicket
  } = useGoogleSheetsTickets();

  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  const authService = AuthService.getInstance();

  // Check if mobile view should be active
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, view: 'dashboard' as View },
    { name: 'Tickets', icon: Ticket, view: 'tickets' as View },
    { name: 'Team', icon: Users, view: 'team' as View },
    { name: 'Settings', icon: Settings, view: 'settings' as View }
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading from Google Sheets...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      );
    }

    switch (currentView) {
      case 'dashboard':
        return <GoogleSheetsDashboard stats={stats} />;
      case 'tickets':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Tickets</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={runScheduledMaintenance}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Run Maintenance
                </button>
                {hasPermission('create_ticket') && (
                  <button
                    onClick={() => setShowTicketForm(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    New Ticket
                  </button>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tickets.map(ticket => (
                <ConditionalFormattingCard
                  key={ticket.id}
                  ticket={ticket}
                  teamMembers={teamMembers}
                  onUpdate={updateTicket}
                  onDelete={deleteTicket}
                  canEdit={canEditTicket(ticket)}
                  onAddComment={addComment}
                />
              ))}
            </div>
          </div>
        );
      case 'team':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Team Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map(member => (
                <div key={member.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{member.name}</h3>
                      <p className="text-sm text-gray-600">{member.role}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Email: {member.email}</p>
                    <p className="text-sm text-gray-600">Active Tickets: {member.workload}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
            
            {/* Google Sheets Integration */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Database className="w-5 h-5 mr-2 text-green-600" />
                Google Sheets Integration
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Auto-Generate Ticket IDs</p>
                    <p className="text-sm text-gray-600">Automatically create TKT-0001, TKT-0002 format</p>
                  </div>
                  <div className="flex items-center text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Active
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Conditional Formatting</p>
                    <p className="text-sm text-gray-600">Color-code tickets by status (Red/Yellow/Green)</p>
                  </div>
                  <div className="flex items-center text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Active
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Auto-Timestamps</p>
                    <p className="text-sm text-gray-600">Automatically update Created At and Updated At fields</p>
                  </div>
                  <div className="flex items-center text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Active
                  </div>
                </div>
              </div>
            </div>

            {/* Apps Script Automation */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-blue-600" />
                Apps Script Automation
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-600">Send alerts for assignments and status changes</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">SLA Monitoring</p>
                    <p className="text-sm text-gray-600">Track and alert on SLA breaches</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Auto-Close Inactive</p>
                    <p className="text-sm text-gray-600">Close tickets inactive for 7+ days</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                </div>
              </div>
            </div>

            {/* SLA Configuration */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SLA Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">High Priority</label>
                  <input type="number" defaultValue="4" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  <p className="text-xs text-gray-500 mt-1">Hours</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Medium Priority</label>
                  <input type="number" defaultValue="24" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  <p className="text-xs text-gray-500 mt-1">Hours</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Low Priority</label>
                  <input type="number" defaultValue="72" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                  <p className="text-xs text-gray-500 mt-1">Hours</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <GoogleSheetsDashboard stats={stats} />;
    }
  };

  // Mobile AppSheet Interface
  if (isMobileView) {
    return (
      <MobileAppSheetInterface
        tickets={tickets}
        teamMembers={teamMembers}
        stats={stats}
        currentUser={currentUser}
        onCreateTicket={() => setShowTicketForm(true)}
        onUpdateTicket={updateTicket}
        hasPermission={hasPermission}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h1 className="text-xl font-bold text-gray-900">TicketFlow</h1>
            <p className="text-xs text-gray-500">Google Sheets + Apps Script</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => {
                  setCurrentView(item.view);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  currentView === item.view
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* Integration Status */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center text-green-700 mb-2">
              <Database className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Google Sheets</span>
            </div>
            <div className="flex items-center text-green-700 mb-1">
              <Zap className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Apps Script</span>
            </div>
            <div className="flex items-center text-green-700">
              <Mail className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Email Alerts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-4 lg:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg mr-4"
              >
                <Menu className="w-5 h-5 text-gray-500" />
              </button>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search tickets..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsMobileView(true)}
                className="p-2 hover:bg-gray-100 rounded-lg"
                title="Switch to Mobile View"
              >
                <Smartphone className="w-5 h-5 text-gray-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Bell className="w-5 h-5 text-gray-500" />
                {stats.slaBreached > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                )}
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">
                    {currentUser?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
                  <p className="text-xs text-gray-500">{currentUser?.role}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          {renderContent()}
        </main>
      </div>

      {/* Ticket Form Modal */}
      {showTicketForm && (
        <GoogleFormTicketCreator
          onSubmit={createTicket}
          teamMembers={teamMembers}
          onClose={() => setShowTicketForm(false)}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}

export default App;