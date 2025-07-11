import React, { useState } from 'react';
import { Ticket, TeamMember } from '../types';
import { 
  X, 
  Plus, 
  Calendar, 
  User, 
  Tag, 
  AlertCircle, 
  Upload,
  Link,
  Mail,
  FileText
} from 'lucide-react';

interface GoogleFormTicketCreatorProps {
  onSubmit: (ticket: Omit<Ticket, 'id' | 'ticketId' | 'createdAt' | 'updatedAt'>) => void;
  teamMembers: TeamMember[];
  onClose: () => void;
  currentUser: any;
}

export const GoogleFormTicketCreator: React.FC<GoogleFormTicketCreatorProps> = ({ 
  onSubmit, 
  teamMembers, 
  onClose,
  currentUser 
}) => {
  const [formData, setFormData] = useState({
    summary: '',
    description: '',
    priority: 'Medium' as Ticket['priority'],
    assignedTo: '',
    reporterEmail: currentUser?.email || '',
    attachmentLink: '',
    lastComment: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.summary.trim()) {
      newErrors.summary = 'Summary is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.reporterEmail.trim()) {
      newErrors.reporterEmail = 'Reporter email is required';
    }
    if (!formData.assignedTo) {
      newErrors.assignedTo = 'Please assign the ticket to a team member';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit({
        ...formData,
        status: 'Open',
        lastComment: formData.lastComment || 'Ticket created via Google Form'
      });
      
      onClose();
    } catch (error) {
      console.error('Error submitting ticket:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-blue-50">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Create New Ticket</h2>
              <p className="text-sm text-gray-600">Powered by Google Forms & Apps Script</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Auto-generated Ticket ID Notice */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <Tag className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">Auto-Generated Ticket ID</p>
                <p className="text-xs text-green-600">Apps Script will automatically assign a unique ID (TKT-0001, TKT-0002, etc.)</p>
              </div>
            </div>
          </div>

          {/* Reporter Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-1" />
              Reporter Email *
            </label>
            <input
              type="email"
              value={formData.reporterEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, reporterEmail: e.target.value }))}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.reporterEmail ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="your.email@company.com"
              disabled={!!currentUser?.email}
            />
            {errors.reporterEmail && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.reporterEmail}
              </p>
            )}
          </div>

          {/* Summary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Summary *
            </label>
            <input
              type="text"
              value={formData.summary}
              onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.summary ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Brief description of the issue"
            />
            {errors.summary && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.summary}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Detailed description of the issue or request"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Ticket['priority'] }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Low">Low - Can wait</option>
              <option value="Medium">Medium - Normal priority</option>
              <option value="High">High - Urgent attention needed</option>
            </select>
          </div>

          {/* Assignee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Assign to *
            </label>
            <select
              value={formData.assignedTo}
              onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.assignedTo ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select team member</option>
              {teamMembers.filter(m => m.role === 'Agent' || m.role === 'Admin').map(member => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.role}) - {member.workload} active tickets
                </option>
              ))}
            </select>
            {errors.assignedTo && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.assignedTo}
              </p>
            )}
          </div>

          {/* Attachment Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Link className="w-4 h-4 inline mr-1" />
              Attachment Link (Google Drive URL)
            </label>
            <input
              type="url"
              value={formData.attachmentLink}
              onChange={(e) => setFormData(prev => ({ ...prev, attachmentLink: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://drive.google.com/file/d/..."
            />
            <p className="mt-1 text-xs text-gray-500">
              Upload files to Google Drive and paste the shareable link here
            </p>
          </div>

          {/* Initial Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Comments
            </label>
            <textarea
              value={formData.lastComment}
              onChange={(e) => setFormData(prev => ({ ...prev, lastComment: e.target.value }))}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Any additional information or context"
            />
          </div>

          {/* Priority Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(formData.priority)}`}>
                {formData.priority} Priority
              </span>
              <span className="text-sm text-gray-600">Status: Open</span>
            </div>
          </div>

          {/* Apps Script Features Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">🤖 Automated Features</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Unique Ticket ID will be auto-generated</li>
              <li>• Email notification will be sent to assignee</li>
              <li>• Creation timestamp will be automatically recorded</li>
              <li>• SLA tracking will begin based on priority level</li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Ticket
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};