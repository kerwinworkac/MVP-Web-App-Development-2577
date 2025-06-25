import supabase from '../lib/supabase';

export const userService = {
  // Get all users with their roles
  async getAllUsers() {
    try {
      const { data: users, error } = await supabase
        .from('users_rm2024')
        .select(`
          *,
          user_roles_rm2024(
            roles_rm2024(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return users.map(user => ({
        ...user,
        roles: user.user_roles_rm2024?.map(ur => ur.roles_rm2024) || []
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Create a new user
  async createUser(userData) {
    try {
      const { data: user, error: userError } = await supabase
        .from('users_rm2024')
        .insert({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          status: userData.status || 'Active',
          avatar_url: userData.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face`
        })
        .select()
        .single();

      if (userError) throw userError;

      // Assign role if provided
      if (userData.roleId) {
        await this.assignRoleToUser(user.id, userData.roleId);
      }

      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update user
  async updateUser(userId, userData) {
    try {
      const { data: user, error: userError } = await supabase
        .from('users_rm2024')
        .update({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          status: userData.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (userError) throw userError;

      // Update role if provided
      if (userData.roleId) {
        await this.updateUserRole(userId, userData.roleId);
      }

      return user;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Delete user
  async deleteUser(userId) {
    try {
      // Delete user roles first
      await supabase
        .from('user_roles_rm2024')
        .delete()
        .eq('user_id', userId);

      // Delete user
      const { error: deleteError } = await supabase
        .from('users_rm2024')
        .delete()
        .eq('id', userId);

      if (deleteError) throw deleteError;
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Assign role to user
  async assignRoleToUser(userId, roleId) {
    try {
      const { error } = await supabase
        .from('user_roles_rm2024')
        .insert({
          user_id: userId,
          role_id: roleId
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error assigning role to user:', error);
      throw error;
    }
  },

  // Update user role
  async updateUserRole(userId, roleId) {
    try {
      // Delete existing role assignments
      await supabase
        .from('user_roles_rm2024')
        .delete()
        .eq('user_id', userId);

      // Assign new role
      await this.assignRoleToUser(userId, roleId);
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  },

  // Toggle user status
  async toggleUserStatus(userId) {
    try {
      // Get current status
      const { data: user, error: fetchError } = await supabase
        .from('users_rm2024')
        .select('status')
        .eq('id', userId)
        .single();

      if (fetchError) throw fetchError;

      const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';

      const { data: updatedUser, error: updateError } = await supabase
        .from('users_rm2024')
        .update({ status: newStatus })
        .eq('id', userId)
        .select()
        .single();

      if (updateError) throw updateError;
      return updatedUser;
    } catch (error) {
      console.error('Error toggling user status:', error);
      throw error;
    }
  }
};