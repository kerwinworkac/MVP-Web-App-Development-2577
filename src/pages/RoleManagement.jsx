import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import Modal from '../components/Modal';
import RoleCard from '../components/RoleCard';
import PermissionMatrix from '../components/PermissionMatrix';
import { useRoles } from '../hooks/useRoles';

const { FiPlus, FiUsers, FiShield, FiGrid, FiList, FiSearch, FiFilter, FiLoader } = FiIcons;

const RoleManagement = ({ showNotification }) => {
  const {
    roles,
    permissions,
    loading,
    error,
    createRole,
    updateRole,
    deleteRole,
    toggleRolePermission,
    getUsersByRole
  } = useRoles();

  const [viewMode, setViewMode] = useState('cards');
  const [showAddRole, setShowAddRole] = useState(false);
  const [showEditRole, setShowEditRole] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUsersList, setShowUsersList] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleUsers, setRoleUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [submitting, setSubmitting] = useState(false);

  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    color: 'blue',
    permissions: []
  });

  const colorOptions = [
    { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
    { value: 'green', label: 'Green', class: 'bg-green-500' },
    { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
    { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
    { value: 'red', label: 'Red', class: 'bg-red-500' }
  ];

  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         role.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterBy === 'all') return matchesSearch;
    if (filterBy === 'high-users') return matchesSearch && role.userCount > 20;
    if (filterBy === 'low-users') return matchesSearch && role.userCount <= 20;
    return matchesSearch;
  });

  const handleAddRole = async () => {
    if (!newRole.name || !newRole.description) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    try {
      setSubmitting(true);
      await createRole(newRole);
      setNewRole({ name: '', description: '', color: 'blue', permissions: [] });
      setShowAddRole(false);
      showNotification(`Role "${newRole.name}" created successfully!`, 'success');
    } catch (error) {
      showNotification(`Error creating role: ${error.message}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditRole = async () => {
    if (!selectedRole.name || !selectedRole.description) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    try {
      setSubmitting(true);
      await updateRole(selectedRole.id, selectedRole);
      setShowEditRole(false);
      setSelectedRole(null);
      showNotification('Role updated successfully!', 'success');
    } catch (error) {
      showNotification(`Error updating role: ${error.message}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRole = async () => {
    try {
      setSubmitting(true);
      await deleteRole(selectedRole.id);
      setShowDeleteConfirm(false);
      setSelectedRole(null);
      showNotification('Role deleted successfully!', 'success');
    } catch (error) {
      showNotification(`Error deleting role: ${error.message}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePermissionToggle = async (roleId, permission) => {
    try {
      await toggleRolePermission(roleId, permission);
      showNotification('Permission updated successfully!', 'success');
    } catch (error) {
      showNotification(`Error updating permission: ${error.message}`, 'error');
    }
  };

  const handleViewUsers = async (role) => {
    try {
      setSelectedRole(role);
      const users = await getUsersByRole(role.id);
      setRoleUsers(users);
      setShowUsersList(true);
    } catch (error) {
      showNotification(`Error loading users: ${error.message}`, 'error');
    }
  };

  const togglePermission = (permission) => {
    const currentPermissions = selectedRole ? selectedRole.permissions : newRole.permissions;
    const hasPermission = currentPermissions.includes(permission);
    
    if (selectedRole) {
      setSelectedRole({
        ...selectedRole,
        permissions: hasPermission
          ? currentPermissions.filter(p => p !== permission)
          : [...currentPermissions, permission]
      });
    } else {
      setNewRole({
        ...newRole,
        permissions: hasPermission
          ? currentPermissions.filter(p => p !== permission)
          : [...currentPermissions, permission]
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <SafeIcon icon={FiLoader} className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading roles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <SafeIcon icon={FiShield} className="w-6 h-6 text-yellow-600" />
          <div>
            <h3 className="text-lg font-medium text-yellow-800">Supabase Connection Notice</h3>
            <p className="text-yellow-700 mt-1">
              Using mock data. To enable full functionality, please update your Supabase credentials in <code>src/lib/supabase.js</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
              <p className="text-gray-600 mt-2">Manage user roles and permissions with Supabase backend</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'cards'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <SafeIcon icon={FiGrid} className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('matrix')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'matrix'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <SafeIcon icon={FiList} className="w-4 h-4" />
                </button>
              </div>
              
              <motion.button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddRole(true)}
              >
                <SafeIcon icon={FiPlus} className="w-4 h-4" />
                <span>Add Role</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {viewMode === 'cards' && (
          <>
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="relative flex-1">
                <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search roles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="relative">
                <SafeIcon icon={FiFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Roles</option>
                  <option value="high-users">High User Count (20+)</option>
                  <option value="low-users">Low User Count (&lt;20)</option>
                </select>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRoles.map((role, index) => (
                <RoleCard
                  key={role.id}
                  role={role}
                  delay={index * 0.1}
                  onEdit={(role) => {
                    setSelectedRole({ ...role });
                    setShowEditRole(true);
                  }}
                  onDelete={(role) => {
                    setSelectedRole(role);
                    setShowDeleteConfirm(true);
                  }}
                  onViewUsers={handleViewUsers}
                />
              ))}
            </div>
          </>
        )}

        {viewMode === 'matrix' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <PermissionMatrix
              roles={roles}
              permissions={permissions}
              onPermissionToggle={handlePermissionToggle}
            />
          </motion.div>
        )}
      </div>

      {/* Add Role Modal */}
      <Modal
        isOpen={showAddRole}
        onClose={() => setShowAddRole(false)}
        title="Add New Role"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role Name *</label>
              <input
                type="text"
                value={newRole.name}
                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter role name"
                disabled={submitting}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <div className="flex space-x-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setNewRole({ ...newRole, color: color.value })}
                    disabled={submitting}
                    className={`w-8 h-8 rounded-full ${color.class} ${
                      newRole.color === color.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                    } disabled:opacity-50`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              rows={3}
              value={newRole.description}
              onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter role description"
              disabled={submitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Permissions</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
              {permissions.map((permission) => (
                <div key={permission.id} className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={newRole.permissions.includes(permission.name)}
                    onChange={() => togglePermission(permission.name)}
                    disabled={submitting}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                  />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700">{permission.name}</label>
                    <p className="text-xs text-gray-500">{permission.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => setShowAddRole(false)}
              disabled={submitting}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddRole}
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {submitting && <SafeIcon icon={FiLoader} className="w-4 h-4 animate-spin" />}
              <span>Create Role</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Role Modal */}
      <Modal
        isOpen={showEditRole}
        onClose={() => setShowEditRole(false)}
        title="Edit Role"
        size="lg"
      >
        {selectedRole && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role Name *</label>
                <input
                  type="text"
                  value={selectedRole.name}
                  onChange={(e) => setSelectedRole({ ...selectedRole, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={submitting}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <div className="flex space-x-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setSelectedRole({ ...selectedRole, color: color.value })}
                      disabled={submitting}
                      className={`w-8 h-8 rounded-full ${color.class} ${
                        selectedRole.color === color.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                      } disabled:opacity-50`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                rows={3}
                value={selectedRole.description}
                onChange={(e) => setSelectedRole({ ...selectedRole, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={submitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Permissions</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                {permissions.map((permission) => (
                  <div key={permission.id} className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedRole.permissions.includes(permission.name)}
                      onChange={() => togglePermission(permission.name)}
                      disabled={submitting}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                    />
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-700">{permission.name}</label>
                      <p className="text-xs text-gray-500">{permission.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowEditRole(false)}
                disabled={submitting}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditRole}
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                {submitting && <SafeIcon icon={FiLoader} className="w-4 h-4 animate-spin" />}
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Confirm Delete"
      >
        {selectedRole && (
          <div>
            <div className="text-center mb-6">
              <SafeIcon icon={FiShield} className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Role</h3>
              <p className="text-gray-600">
                Are you sure you want to delete the role <strong>"{selectedRole.name}"</strong>?
              </p>
              {selectedRole.userCount > 0 && (
                <p className="text-red-600 text-sm mt-2">
                  This role has {selectedRole.userCount} active users. Please reassign them first.
                </p>
              )}
            </div>
            
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={submitting}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteRole}
                disabled={submitting || selectedRole.userCount > 0}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                {submitting && <SafeIcon icon={FiLoader} className="w-4 h-4 animate-spin" />}
                <span>Delete Role</span>
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Users List Modal */}
      <Modal
        isOpen={showUsersList}
        onClose={() => setShowUsersList(false)}
        title={`Users with ${selectedRole?.name} Role`}
        size="lg"
      >
        {selectedRole && (
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              Showing {roleUsers.length} users with the {selectedRole.name} role
            </div>
            
            {roleUsers.length === 0 ? (
              <div className="text-center py-8">
                <SafeIcon icon={FiUsers} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No users assigned to this role yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {roleUsers.map((user) => (
                  <div key={user.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                    <img
                      src={user.avatar_url || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face`}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{user.name}</h4>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default RoleManagement;