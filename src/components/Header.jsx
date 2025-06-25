import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import Modal from './Modal';

const { FiBell, FiSearch, FiMenu, FiSettings, FiUser, FiLogOut } = FiIcons;

const Header = ({ onMenuToggle, showNotification }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = [
    { id: 1, message: 'New user registered', time: '2 minutes ago', read: false },
    { id: 2, message: 'System update completed', time: '1 hour ago', read: true },
    { id: 3, message: 'Payment received', time: '2 hours ago', read: false }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      showNotification(`Searching for: ${searchQuery}`, 'info');
      setSearchQuery('');
    }
  };

  const markAsRead = (id) => {
    showNotification('Notification marked as read', 'success');
  };

  const handleLogout = () => {
    showNotification('Logging out...', 'info');
    setTimeout(() => {
      showNotification('Logged out successfully', 'success');
    }, 1000);
  };

  return (
    <>
      <motion.header
        className="bg-white shadow-sm border-b border-gray-200 px-6 py-4"
        style={{ zIndex: 1000 }}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              className="lg:hidden hover:bg-gray-100 p-2 rounded-lg transition-colors"
              onClick={onMenuToggle}
            >
              <SafeIcon icon={FiMenu} className="w-6 h-6 text-gray-600" />
            </button>
            <form onSubmit={handleSearch} className="relative">
              <SafeIcon
                icon={FiSearch}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </form>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setShowNotifications(true)}
            >
              <SafeIcon icon={FiBell} className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            <button 
              className="flex items-center space-x-3 hover:bg-gray-100 p-2 rounded-lg transition-colors"
              onClick={() => setShowProfile(true)}
            >
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-700">John Doe</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Notifications Modal */}
      <Modal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        title="Notifications"
      >
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border ${
                notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Profile Modal */}
      <Modal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        title="Profile Menu"
      >
        <div className="space-y-2">
          <button
            className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
            onClick={() => {
              setShowProfile(false);
              showNotification('Opening profile settings...', 'info');
            }}
          >
            <SafeIcon icon={FiUser} className="w-5 h-5 text-gray-600" />
            <span>Profile Settings</span>
          </button>
          <button
            className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
            onClick={() => {
              setShowProfile(false);
              showNotification('Opening account settings...', 'info');
            }}
          >
            <SafeIcon icon={FiSettings} className="w-5 h-5 text-gray-600" />
            <span>Account Settings</span>
          </button>
          <button
            className="w-full flex items-center space-x-3 p-3 text-left hover:bg-red-50 rounded-lg transition-colors text-red-600"
            onClick={() => {
              setShowProfile(false);
              handleLogout();
            }}
          >
            <SafeIcon icon={FiLogOut} className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Header;