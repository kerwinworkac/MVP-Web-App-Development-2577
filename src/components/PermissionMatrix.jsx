import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiCheck, FiX } = FiIcons;

const PermissionMatrix = ({ roles, permissions, onPermissionToggle }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Permission Matrix</h3>
        <p className="text-sm text-gray-600 mt-1">Manage permissions for each role</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Permission
              </th>
              {roles.map((role) => (
                <th
                  key={role.id}
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div className="flex flex-col items-center space-y-1">
                    <span>{role.name}</span>
                    <span className="text-xs text-gray-400">({role.userCount} users)</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {permissions.map((permission, permIndex) => (
              <motion.tr
                key={permission.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: permIndex * 0.05 }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{permission.name}</div>
                    <div className="text-sm text-gray-500">{permission.description}</div>
                  </div>
                </td>
                {roles.map((role) => {
                  const hasPermission = role.permissions.includes(permission.name);
                  return (
                    <td key={role.id} className="px-6 py-4 text-center">
                      <button
                        onClick={() => onPermissionToggle(role.id, permission.name)}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          hasPermission
                            ? 'bg-green-100 text-green-600 hover:bg-green-200'
                            : 'bg-red-100 text-red-600 hover:bg-red-200'
                        }`}
                      >
                        <SafeIcon
                          icon={hasPermission ? FiCheck : FiX}
                          className="w-4 h-4"
                        />
                      </button>
                    </td>
                  );
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PermissionMatrix;