import { useState, useEffect } from 'react';
import { roleService } from '../services/roleService';

export const useRoles = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRoles();
    loadPermissions();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const data = await roleService.getAllRoles();
      setRoles(data);
    } catch (err) {
      console.error('Error loading roles:', err);
      setError(err.message);
      // Fallback to mock data if Supabase is not configured
      setRoles([
        {
          id: 1,
          name: 'Super Admin',
          description: 'Full system access with all permissions',
          color: 'red',
          userCount: 2,
          permissions: ['Create Users', 'Delete Users', 'Manage Roles', 'System Settings', 'View Analytics', 'Export Data']
        },
        {
          id: 2,
          name: 'Admin',
          description: 'Administrative access with most permissions',
          color: 'blue',
          userCount: 5,
          permissions: ['Create Users', 'Edit Users', 'View Analytics', 'Manage Content', 'Export Data']
        },
        {
          id: 3,
          name: 'Manager',
          description: 'Management level access for team oversight',
          color: 'purple',
          userCount: 12,
          permissions: ['View Users', 'Edit Users', 'View Analytics', 'Manage Content']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadPermissions = async () => {
    try {
      const data = await roleService.getAllPermissions();
      setPermissions(data);
    } catch (err) {
      console.error('Error loading permissions:', err);
      // Fallback to mock data
      setPermissions([
        { id: 1, name: 'Create Users', description: 'Add new users to the system', category: 'User Management' },
        { id: 2, name: 'Edit Users', description: 'Modify existing user information', category: 'User Management' },
        { id: 3, name: 'Delete Users', description: 'Remove users from the system', category: 'User Management' },
        { id: 4, name: 'View Users', description: 'View user information and profiles', category: 'User Management' },
        { id: 5, name: 'Manage Roles', description: 'Create and modify user roles', category: 'Role Management' },
        { id: 6, name: 'System Settings', description: 'Access system configuration', category: 'Administration' },
        { id: 7, name: 'View Analytics', description: 'Access analytics and reports', category: 'Analytics' },
        { id: 8, name: 'Export Data', description: 'Export system data', category: 'Data Management' }
      ]);
    }
  };

  const createRole = async (roleData) => {
    try {
      const newRole = await roleService.createRole(roleData);
      await loadRoles(); // Refresh the list
      return newRole;
    } catch (err) {
      console.error('Error creating role:', err);
      throw err;
    }
  };

  const updateRole = async (roleId, roleData) => {
    try {
      const updatedRole = await roleService.updateRole(roleId, roleData);
      await loadRoles(); // Refresh the list
      return updatedRole;
    } catch (err) {
      console.error('Error updating role:', err);
      throw err;
    }
  };

  const deleteRole = async (roleId) => {
    try {
      await roleService.deleteRole(roleId);
      await loadRoles(); // Refresh the list
    } catch (err) {
      console.error('Error deleting role:', err);
      throw err;
    }
  };

  const toggleRolePermission = async (roleId, permissionName) => {
    try {
      await roleService.toggleRolePermission(roleId, permissionName);
      await loadRoles(); // Refresh the list
    } catch (err) {
      console.error('Error toggling role permission:', err);
      throw err;
    }
  };

  const getUsersByRole = async (roleId) => {
    try {
      return await roleService.getUsersByRole(roleId);
    } catch (err) {
      console.error('Error getting users by role:', err);
      throw err;
    }
  };

  return {
    roles,
    permissions,
    loading,
    error,
    createRole,
    updateRole,
    deleteRole,
    toggleRolePermission,
    getUsersByRole,
    refreshRoles: loadRoles
  };
};