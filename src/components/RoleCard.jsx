import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiUsers, FiEdit, FiTrash2, FiShield, FiEye, FiSettings } = FiIcons;

const RoleCard = ({ role, onEdit, onDelete, onViewUsers, delay = 0 }) => {
  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-500 text-blue-600 bg-blue-50 border-blue-200',
      green: 'bg-green-500 text-green-600 bg-green-50 border-green-200',
      purple: 'bg-purple-500 text-purple-600 bg-purple-50 border-purple-200',
      orange: 'bg-orange-500 text-orange-600 bg-orange-50 border-orange-200',
      red: 'bg-red-500 text-red-600 bg-red-50 border-red-200',
    };
    return colors[color] || colors.blue;
  };

  const colorClasses = getColorClasses(role.color).split(' ');

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${colorClasses[2]} ${colorClasses[3]}`}>
            <SafeIcon icon={FiShield} className={`w-6 h-6 ${colorClasses[1]}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
            <p className="text-sm text-gray-500">{role.description}</p>
          </div>
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => onEdit(role)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit Role"
          >
            <SafeIcon icon={FiEdit} className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(role)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Role"
          >
            <SafeIcon icon={FiTrash2} className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Users with this role</span>
          <span className="text-sm font-medium text-gray-900">{role.userCount}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Permissions</span>
          <span className="text-sm font-medium text-gray-900">{role.permissions.length}</span>
        </div>

        <div className="pt-3 border-t border-gray-100">
          <div className="flex flex-wrap gap-1 mb-3">
            {role.permissions.slice(0, 3).map((permission, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
              >
                {permission}
              </span>
            ))}
            {role.permissions.length > 3 && (
              <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-500 rounded-full">
                +{role.permissions.length - 3} more
              </span>
            )}
          </div>

          <button
            onClick={() => onViewUsers(role)}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiUsers} className="w-4 h-4" />
            <span>View Users</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default RoleCard;