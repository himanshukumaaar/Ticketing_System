import React from 'react';
import { TeamMember, Ticket } from '../types';
import { User, Mail, Briefcase, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

interface TeamViewProps {
  teamMembers: TeamMember[];
  tickets: Ticket[];
}

export const TeamView: React.FC<TeamViewProps> = ({ teamMembers, tickets }) => {
  const getTeamMemberStats = (memberId: string) => {
    const memberTickets = tickets.filter(t => t.assignedTo === memberId);
    const now = new Date();
    
    return {
      total: memberTickets.length,
      open: memberTickets.filter(t => t.status === 'Open').length,
      inProgress: memberTickets.filter(t => t.status === 'In Progress').length,
      resolved: memberTickets.filter(t => t.status === 'Resolved').length,
      overdue: memberTickets.filter(t => t.dueDate && t.dueDate < now && t.status !== 'Closed').length
    };
  };

  const getWorkloadColor = (workload: number) => {
    if (workload >= 5) return 'bg-red-100 text-red-800 border-red-200';
    if (workload >= 3) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getWorkloadLabel = (workload: number) => {
    if (workload >= 5) return 'High';
    if (workload >= 3) return 'Medium';
    return 'Low';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Team Overview</h2>
        <p className="text-sm text-gray-500">
          {teamMembers.length} team members • {tickets.length} total tickets
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map(member => {
          const stats = getTeamMemberStats(member.id);
          return (
            <div
              key={member.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-6"
            >
              {/* Member Info */}
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-gray-600 flex items-center">
                    <Briefcase className="w-4 h-4 mr-1" />
                    {member.role}
                  </p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {member.email}
                </p>
              </div>

              {/* Workload */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Workload</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getWorkloadColor(stats.total)}`}>
                    {getWorkloadLabel(stats.total)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{stats.total} active tickets</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-lg font-semibold text-blue-600">{stats.open}</span>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">Open</p>
                </div>

                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span className="text-lg font-semibold text-purple-600">{stats.inProgress}</span>
                  </div>
                  <p className="text-xs text-purple-600 mt-1">In Progress</p>
                </div>

                <div className="bg-green-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-lg font-semibold text-green-600">{stats.resolved}</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">Resolved</p>
                </div>

                <div className="bg-red-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-lg font-semibold text-red-600">{stats.overdue}</span>
                  </div>
                  <p className="text-xs text-red-600 mt-1">Overdue</p>
                </div>
              </div>

              {/* Performance Indicator */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Resolution Rate</span>
                  <span className="font-medium text-gray-900">
                    {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Team Performance Summary */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {tickets.filter(t => t.status === 'Open').length}
            </p>
            <p className="text-sm text-gray-600">Open Tickets</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {tickets.filter(t => t.status === 'In Progress').length}
            </p>
            <p className="text-sm text-gray-600">In Progress</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {tickets.filter(t => t.status === 'Resolved').length}
            </p>
            <p className="text-sm text-gray-600">Resolved</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-600">
              {Math.round((tickets.filter(t => t.status === 'Resolved').length / tickets.length) * 100) || 0}%
            </p>
            <p className="text-sm text-gray-600">Overall Resolution Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
};