import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import Modal from './Modal';

const { FiPlus, FiUpload, FiDownload, FiMail, FiUser, FiFileText } = FiIcons;

const QuickActions = ({ showNotification }) => {
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'User' });
  const [emailData, setEmailData] = useState({ to: '', subject: '', message: '' });

  const actions = [
    { name: 'Add User', icon: FiPlus, color: 'blue', action: () => setShowAddUser(true) },
    { name: 'Upload File', icon: FiUpload, color: 'green', action: handleFileUpload },
    { name: 'Export Data', icon: FiDownload, color: 'purple', action: handleExportData },
    { name: 'Send Email', icon: FiMail, color: 'orange', action: () => setShowEmailModal(true) },
  ];

  const colorClasses = {
    blue: 'bg-blue-500 hover:bg-blue-600',
    green: 'bg-green-500 hover:bg-green-600',
    purple: 'bg-purple-500 hover:bg-purple-600',
    orange: 'bg-orange-500 hover:bg-orange-600',
  };

  function handleFileUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '*/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        showNotification(`Uploading ${file.name}...`, 'info');
        setTimeout(() => {
          showNotification(`${file.name} uploaded successfully!`, 'success');
        }, 2000);
      }
    };
    input.click();
  }

  function handleExportData() {
    showNotification('Preparing data export...', 'info');
    setTimeout(() => {
      const data = 'Sample,Data,Export\nUser1,user1@example.com,Active\nUser2,user2@example.com,Inactive';
      const blob = new Blob([data], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'data-export.csv';
      a.click();
      URL.revokeObjectURL(url);
      showNotification('Data exported successfully!', 'success');
    }, 1000);
  }

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      showNotification(`User ${newUser.name} added successfully!`, 'success');
      setNewUser({ name: '', email: '', role: 'User' });
      setShowAddUser(false);
    } else {
      showNotification('Please fill in all required fields', 'error');
    }
  };

  const handleSendEmail = () => {
    if (emailData.to && emailData.subject && emailData.message) {
      showNotification(`Email sent to ${emailData.to}!`, 'success');
      setEmailData({ to: '', subject: '', message: '' });
      setShowEmailModal(false);
    } else {
      showNotification('Please fill in all email fields', 'error');
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="space-y-3">
          {actions.map((action, index) => (
            <motion.button
              key={action.name}
              onClick={action.action}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg text-white transition-colors ${colorClasses[action.color]}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <SafeIcon icon={action.icon} className="w-5 h-5" />
              <span className="font-medium">{action.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={showAddUser}
        onClose={() => setShowAddUser(false)}
        title="Add New User"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
            <input
              type="text"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
              <option value="Moderator">Moderator</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setShowAddUser(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddUser}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add User
            </button>
          </div>
        </div>
      </Modal>

      {/* Send Email Modal */}
      <Modal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        title="Send Email"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To *</label>
            <input
              type="email"
              value={emailData.to}
              onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="recipient@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
            <input
              type="text"
              value={emailData.subject}
              onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email subject"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
            <textarea
              rows={4}
              value={emailData.message}
              onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your message here..."
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setShowEmailModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSendEmail}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2"
            >
              <SafeIcon icon={FiMail} className="w-4 h-4" />
              <span>Send Email</span>
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default QuickActions;