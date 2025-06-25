import { useState, useEffect } from 'react';
import { userService } from '../services/userService';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error('Error loading users:', err);
      setError(err.message);
      // Fallback to mock data if Supabase is not configured
      setUsers([
        {
          id: 1,
          name: 'Alice Johnson',
          email: 'alice@example.com',
          phone: '+1 (555) 123-4567',
          status: 'Active',
          avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
          roles: [{ id: 1, name: 'Admin', color: 'blue' }]
        },
        {
          id: 2,
          name: 'Bob Smith',
          email: 'bob@example.com',
          phone: '+1 (555) 234-5678',
          status: 'Active',
          avatar_url: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=50&h=50&fit=crop&crop=face',
          roles: [{ id: 3, name: 'Manager', color: 'purple' }]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData) => {
    try {
      const newUser = await userService.createUser(userData);
      await loadUsers(); // Refresh the list
      return newUser;
    } catch (err) {
      console.error('Error creating user:', err);
      throw err;
    }
  };

  const updateUser = async (userId, userData) => {
    try {
      const updatedUser = await userService.updateUser(userId, userData);
      await loadUsers(); // Refresh the list
      return updatedUser;
    } catch (err) {
      console.error('Error updating user:', err);
      throw err;
    }
  };

  const deleteUser = async (userId) => {
    try {
      await userService.deleteUser(userId);
      await loadUsers(); // Refresh the list
    } catch (err) {
      console.error('Error deleting user:', err);
      throw err;
    }
  };

  const toggleUserStatus = async (userId) => {
    try {
      const updatedUser = await userService.toggleUserStatus(userId);
      await loadUsers(); // Refresh the list
      return updatedUser;
    } catch (err) {
      console.error('Error toggling user status:', err);
      throw err;
    }
  };

  return {
    users,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    refreshUsers: loadUsers
  };
};