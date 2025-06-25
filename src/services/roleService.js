import supabase from '../lib/supabase';

export const roleService = {
  // Fetch all roles with their permissions
  async getAllRoles() {
    try {
      const { data: roles, error } = await supabase
        .from('roles_rm2024')
        .select(`
          *,
          role_permissions_rm2024(
            permissions_rm2024(*)
          ),
          user_roles_rm2024(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return roles.map(role => ({
        ...role,
        userCount: role.user_roles_rm2024?.length || 0,
        permissions: role.role_permissions_rm2024?.map(rp => rp.permissions_rm2024.name) || []
      }));
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  },

  // Create a new role
  async createRole(roleData) {
    try {
      // Create the role
      const { data: role, error: roleError } = await supabase
        .from('roles_rm2024')
        .insert({
          name: roleData.name,
          description: roleData.description,
          color: roleData.color,
          is_active: true
        })
        .select()
        .single();

      if (roleError) throw roleError;

      // Add permissions to the role
      if (roleData.permissions && roleData.permissions.length > 0) {
        const permissionIds = await this.getPermissionIds(roleData.permissions);
        await this.assignPermissionsToRole(role.id, permissionIds);
      }

      return role;
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  },

  // Update an existing role
  async updateRole(roleId, roleData) {
    try {
      // Update role basic info
      const { data: role, error: roleError } = await supabase
        .from('roles_rm2024')
        .update({
          name: roleData.name,
          description: roleData.description,
          color: roleData.color,
          updated_at: new Date().toISOString()
        })
        .eq('id', roleId)
        .select()
        .single();

      if (roleError) throw roleError;

      // Update permissions
      await this.updateRolePermissions(roleId, roleData.permissions);

      return role;
    } catch (error) {
      console.error('Error updating role:', error);
      throw error;
    }
  },

  // Delete a role
  async deleteRole(roleId) {
    try {
      // Check if role has users
      const { data: userRoles, error: checkError } = await supabase
        .from('user_roles_rm2024')
        .select('id')
        .eq('role_id', roleId);

      if (checkError) throw checkError;

      if (userRoles && userRoles.length > 0) {
        throw new Error('Cannot delete role with active users. Please reassign users first.');
      }

      // Delete role permissions first
      await supabase
        .from('role_permissions_rm2024')
        .delete()
        .eq('role_id', roleId);

      // Delete the role
      const { error: deleteError } = await supabase
        .from('roles_rm2024')
        .delete()
        .eq('id', roleId);

      if (deleteError) throw deleteError;

      return true;
    } catch (error) {
      console.error('Error deleting role:', error);
      throw error;
    }
  },

  // Get all available permissions
  async getAllPermissions() {
    try {
      const { data: permissions, error } = await supabase
        .from('permissions_rm2024')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      return permissions;
    } catch (error) {
      console.error('Error fetching permissions:', error);
      throw error;
    }
  },

  // Toggle permission for a role
  async toggleRolePermission(roleId, permissionName) {
    try {
      // Get permission ID
      const { data: permission, error: permError } = await supabase
        .from('permissions_rm2024')
        .select('id')
        .eq('name', permissionName)
        .single();

      if (permError) throw permError;

      // Check if permission is already assigned
      const { data: existing, error: checkError } = await supabase
        .from('role_permissions_rm2024')
        .select('id')
        .eq('role_id', roleId)
        .eq('permission_id', permission.id);

      if (checkError) throw checkError;

      if (existing && existing.length > 0) {
        // Remove permission
        await supabase
          .from('role_permissions_rm2024')
          .delete()
          .eq('role_id', roleId)
          .eq('permission_id', permission.id);
      } else {
        // Add permission
        await supabase
          .from('role_permissions_rm2024')
          .insert({
            role_id: roleId,
            permission_id: permission.id
          });
      }

      return true;
    } catch (error) {
      console.error('Error toggling role permission:', error);
      throw error;
    }
  },

  // Helper: Get permission IDs by names
  async getPermissionIds(permissionNames) {
    try {
      const { data: permissions, error } = await supabase
        .from('permissions_rm2024')
        .select('id')
        .in('name', permissionNames);

      if (error) throw error;
      return permissions.map(p => p.id);
    } catch (error) {
      console.error('Error fetching permission IDs:', error);
      throw error;
    }
  },

  // Helper: Assign permissions to role
  async assignPermissionsToRole(roleId, permissionIds) {
    try {
      const rolePermissions = permissionIds.map(permissionId => ({
        role_id: roleId,
        permission_id: permissionId
      }));

      const { error } = await supabase
        .from('role_permissions_rm2024')
        .insert(rolePermissions);

      if (error) throw error;
    } catch (error) {
      console.error('Error assigning permissions to role:', error);
      throw error;
    }
  },

  // Helper: Update role permissions
  async updateRolePermissions(roleId, permissionNames) {
    try {
      // Delete existing permissions
      await supabase
        .from('role_permissions_rm2024')
        .delete()
        .eq('role_id', roleId);

      // Add new permissions
      if (permissionNames && permissionNames.length > 0) {
        const permissionIds = await this.getPermissionIds(permissionNames);
        await this.assignPermissionsToRole(roleId, permissionIds);
      }
    } catch (error) {
      console.error('Error updating role permissions:', error);
      throw error;
    }
  },

  // Get users by role
  async getUsersByRole(roleId) {
    try {
      const { data: userRoles, error } = await supabase
        .from('user_roles_rm2024')
        .select(`
          users_rm2024(
            id,
            name,
            email,
            avatar_url,
            status
          )
        `)
        .eq('role_id', roleId);

      if (error) throw error;
      return userRoles.map(ur => ur.users_rm2024);
    } catch (error) {
      console.error('Error fetching users by role:', error);
      throw error;
    }
  }
};