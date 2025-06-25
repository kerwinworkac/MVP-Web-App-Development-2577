import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiUser, FiShoppingBag, FiDollarSign, FiSettings, FiEye, FiMoreHorizontal } = FiIcons;

const RecentActivity = ({ showNotification }) => {
  const activities = [
    {
      id: 1,
      type: 'user',
      message: 'New user registered',
      user: 'Alice Johnson',
      time: '2 minutes ago',
      icon: FiUser,
      color: 'blue'
    },
    {
      id: 2,
      type: 'order',
      message: 'Order completed',
      user: 'Bob Smith',
      time: '5 minutes ago',
      icon: FiShoppingBag,
      color: 'green'
    },
    {
      id: 3,
      type: 'payment',
      message: 'Payment received',
      user: 'Carol Davis',
      time: '10 minutes ago',
      icon: FiDollarSign,
      color: 'purple'
    },
    {
      id: 4,
      type: 'system',
      message: 'System updated',
      user: 'System',
      time: '1 hour ago',
      icon: FiSettings,
      color: 'orange'
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  const handleViewDetails = (activity) => {
    showNotification(`Viewing details for: ${activity.message}`, 'info');
  };

  const handleMarkAsRead = (activity) => {
    showNotification(`Activity marked as read`, 'success');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <button
          onClick={() => showNotification('Refreshing activity feed...', 'info')}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
        >
          View All
        </button>
      </div>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className={`p-2 rounded-lg ${colorClasses[activity.color]}`}>
              <SafeIcon icon={activity.icon} className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{activity.message}</p>
              <p className="text-sm text-gray-500">{activity.user}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400">{activity.time}</span>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                <button
                  onClick={() => handleViewDetails(activity)}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  title="View Details"
                >
                  <SafeIcon icon={FiEye} className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleMarkAsRead(activity)}
                  className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                  title="More Options"
                >
                  <SafeIcon icon={FiMoreHorizontal} className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;