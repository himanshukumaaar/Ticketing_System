import React from 'react';
import { Ticket } from '../types';
import { 
  Calendar, 
  Clock, 
  User, 
  Tag, 
  MoreHorizontal,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Link,
  MessageSquare
} from 'lucide-react';

interface ConditionalFormattingCardProps {
  ticket: Ticket;
  teamMembers: any[];
  onUpdate: (id: string, updates: Partial<Ticket>) => void;
  onDelete: (id: string) => void;
  canEdit: boolean;
  onAddComment?: (ticketId: string, comment: string) => void;
}

export const ConditionalFormattingCard: React.FC<ConditionalFormattingCardProps> = ({
  ticket,
  teamMembers,
  onUpdate,
  onDelete,
  canEdit,
  onAddComment
}) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [showCommentBox, setShowCommentBox] = React.useState(false);
  const [newComment, setNewComment] = React.useState('');
  const [editData, setEditData] = React.useState({
    status: ticket.status,
    priority: ticket.priority,
    assignedTo: ticket.assignedTo
  });

  const assignedMember = teamMembers.find(m => m.id === ticket.assignedTo);
  const isOverdue = ticket.dueDate && new Date(ticket.dueDate) < new Date() && ticket.status !== 'Closed';

  // Google Sheets conditional formatting colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-red-100 text-red-800 border-red-300 shadow-red-100'; // Red
      case 'In Progress': return 'bg-yellow-100 text-yellow-800 border-yellow-300 shadow-yellow-100'; // Yellow
      case 'Closed': return 'bg-green-100 text-green-800 border-green-300 shadow-green-100'; // Green
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-500 text-white';
      case 'Medium': return 'bg-yellow-500 text-white';
      case 'Low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getCardBorderColor = (status: string) => {
    switch (status) {
      case 'Open': return 'border-l-4 border-l-red-500';
      case 'In Progress': return 'border-l-4 border-l-yellow-500';
      case 'Closed': return 'border-l-4 border-l-green-500';
      default: return 'border-l-4 border-l-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open': return <Clock className="w-4 h-4" />;
      case 'In Progress': return <Clock className="w-4 h-4" />;
      case 'Closed': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleSaveEdit = () => {
    onUpdate(ticket.id, editData);
    setIsEditing(false);
  };

  const handleAddComment = () => {
    if (newComment.trim() && onAddComment) {
      onAddComment(ticket.id, newComment.trim());
      setNewComment('');
      setShowCommentBox(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 ${
      getCardBorderColor(ticket.status)
    } ${ticket.slaBreached ? 'ring-2 ring-red-300 ring-opacity-50' : ''}`}>
      
      {/* SLA Breach Alert */}
      {ticket.slaBreached && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2">
          <div className="flex items-center text-red-700">
            <AlertTriangle className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">SLA BREACH - Immediate attention required</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                {ticket.ticketId}
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                {ticket.priority}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
              {ticket.summary}
            </h3>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border-2 ${getStatusColor(ticket.status)}`}>
                {getStatusIcon(ticket.status)}
                <span className="ml-1">{ticket.status}</span>
              </span>
            </div>
          </div>
          {canEdit && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <MoreHorizontal className="w-4 h-4 text-gray-500" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-32">
                  <button
                    onClick={() => { setIsEditing(true); setShowMenu(false); }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => { setShowCommentBox(true); setShowMenu(false); }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Comment
                  </button>
                  <button
                    onClick={() => { onDelete(ticket.id); setShowMenu(false); }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {ticket.description}
        </p>

        {/* Quick Edit Mode */}
        {isEditing && (
          <div className="bg-gray-50 rounded-lg p-3 mb-4 space-y-3">
            <div className="grid grid-cols-1 gap-3">
              <select
                value={editData.status}
                onChange={(e) => setEditData(prev => ({ ...prev, status: e.target.value as Ticket['status'] }))}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
              <select
                value={editData.priority}
                onChange={(e) => setEditData(prev => ({ ...prev, priority: e.target.value as Ticket['priority'] }))}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <select
                value={editData.assignedTo}
                onChange={(e) => setEditData(prev => ({ ...prev, assignedTo: e.target.value }))}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                {teamMembers.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSaveEdit}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Comment Box */}
        {showCommentBox && (
          <div className="bg-blue-50 rounded-lg p-3 mb-4 space-y-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              rows={3}
              className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddComment}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                Add Comment
              </button>
              <button
                onClick={() => { setShowCommentBox(false); setNewComment(''); }}
                className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <User className="w-4 h-4 mr-2" />
            <span>
              Assigned to {assignedMember?.name || 'Unknown'} 
              <span className="text-gray-400 ml-1">({assignedMember?.role})</span>
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Created {formatDate(ticket.createdAt)}</span>
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-2" />
            <span>Updated {formatDate(ticket.updatedAt)}</span>
          </div>

          {ticket.attachmentLink && (
            <div className="flex items-center text-sm text-blue-600">
              <Link className="w-4 h-4 mr-2" />
              <a 
                href={ticket.attachmentLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline"
              >
                View Attachment
              </a>
            </div>
          )}
        </div>

        {/* Last Comment */}
        {ticket.lastComment && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Latest Comment:</p>
            <p className="text-sm text-gray-700">{ticket.lastComment}</p>
          </div>
        )}

        {/* Apps Script Automation Indicators */}
        <div className="mt-3 flex flex-wrap gap-1">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
            <Tag className="w-3 h-3 mr-1" />
            Auto-ID: {ticket.ticketId}
          </span>
          {ticket.slaBreached && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">
              <AlertTriangle className="w-3 h-3 mr-1" />
              SLA Alert Sent
            </span>
          )}
        </div>
      </div>
    </div>
  );
};