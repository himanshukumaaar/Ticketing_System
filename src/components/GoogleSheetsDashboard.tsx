import React from 'react';
import { TicketStats } from '../types';
import { 
  Ticket, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  TrendingUp,
  Users,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Zap
} from 'lucide-react';

interface GoogleSheetsDashboardProps {
  stats: TicketStats;
}

export const GoogleSheetsDashboard: React.FC<GoogleSheetsDashboardProps> = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Tickets',
      value: stats.total,
      icon: Ticket,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'All tickets in system'
    },
    {
      title: 'Open Tickets',
      value: stats.open,
      icon: Clock,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
      description: 'Awaiting assignment'
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: TrendingUp,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      description: 'Being worked on'
    },
    {
      title: 'Closed',
      value: stats.closed,
      icon: CheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Completed tickets'
    },
    {
      title: 'High Priority',
      value: stats.highPriority,
      icon: AlertTriangle,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Urgent attention needed'
    },
    {
      title: 'SLA Breached',
      value: stats.slaBreached,
      icon: AlertTriangle,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
      description: 'Past due deadline'
    }
  ];

  const priorityData = [
    { name: 'High', value: stats.byPriority?.High || 0, color: 'bg-red-500' },
    { name: 'Medium', value: stats.byPriority?.Medium || 0, color: 'bg-yellow-500' },
    { name: 'Low', value: stats.byPriority?.Low || 0, color: 'bg-green-500' }
  ];

  const statusData = [
    { name: 'Open', value: stats.byStatus?.Open || 0, color: 'bg-red-500' },
    { name: 'In Progress', value: stats.byStatus?.['In Progress'] || 0, color: 'bg-yellow-500' },
    { name: 'Closed', value: stats.byStatus?.Closed || 0, color: 'bg-green-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-sm text-gray-600 mt-1">
            Real-time data from Google Sheets • Powered by Apps Script
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
          <Activity className="w-4 h-4 text-green-600" />
          <span className="text-green-700">Live Data</span>
        </div>
      </div>

      {/* Apps Script Automation Status */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Apps Script Automations</h3>
              <p className="text-sm text-gray-600">Auto-ID generation, email alerts, SLA tracking active</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Auto-ID Active
            </div>
            <div className="flex items-center text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Email Alerts On
            </div>
            <div className="flex items-center text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              SLA Monitoring
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${stat.bgColor} rounded-xl p-6 border-2 border-opacity-20 hover:shadow-lg transition-all duration-200 hover:scale-105`}
              style={{ borderColor: stat.color.replace('bg-', '').replace('-500', '') }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className={`text-3xl font-bold ${stat.textColor} mt-1`}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Distribution */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tickets by Priority</h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {priorityData.map((item, index) => {
              const percentage = stats.total > 0 ? Math.round((item.value / stats.total) * 100) : 0;
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 ${item.color} rounded-full mr-3`}></div>
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{item.value}</span>
                    <span className="text-xs text-gray-500">({percentage}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tickets by Status</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {statusData.map((item, index) => {
              const percentage = stats.total > 0 ? Math.round((item.value / stats.total) * 100) : 0;
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 ${item.color} rounded-full mr-3`}></div>
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{item.value}</span>
                    <span className="text-xs text-gray-500">({percentage}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Agent Workload */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Agent Workload</h3>
          <Users className="w-5 h-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(stats.byAgent || {}).map(([agentId, count]) => (
            <div key={agentId} className="bg-gray-50 rounded-lg p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <p className="text-sm text-gray-600 capitalize">{agentId.replace('-', ' ')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Google Sheets Integration Info */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Google Sheets Backend</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2 text-green-600" />
                Auto-timestamps on create/update
              </div>
              <div className="flex items-center text-gray-600">
                <AlertTriangle className="w-4 h-4 mr-2 text-orange-600" />
                SLA breach monitoring
              </div>
              <div className="flex items-center text-gray-600">
                <CheckCircle className="w-4 h-4 mr-2 text-blue-600" />
                Conditional formatting applied
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Last sync:</p>
            <p className="text-sm font-medium text-gray-900">{new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};