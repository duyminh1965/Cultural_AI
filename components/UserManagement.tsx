import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Shield, 
  ShieldCheck,
  UserCheck,
  UserX,
  Mail,
  Calendar
} from 'lucide-react';
import { User, UserManagementFilters } from '../types';
import { useAuthContext } from '../hooks/useAuth';

// Mock users data for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@culturalconcierge.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
    lastLoginAt: new Date(),
    isActive: true,
  },
  {
    id: '2',
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    createdAt: new Date('2024-01-15'),
    lastLoginAt: new Date(Date.now() - 86400000),
    isActive: true,
  },
  {
    id: '3',
    email: 'moderator@culturalconcierge.com',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'moderator',
    createdAt: new Date('2024-02-01'),
    lastLoginAt: new Date(Date.now() - 3600000),
    isActive: true,
  },
  {
    id: '4',
    email: 'inactive@example.com',
    firstName: 'Inactive',
    lastName: 'User',
    role: 'user',
    createdAt: new Date('2024-01-20'),
    lastLoginAt: new Date(Date.now() - 604800000),
    isActive: false,
  },
];

export const UserManagement: React.FC = () => {
  const { hasPermission } = useAuthContext();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [filters, setFilters] = useState<UserManagementFilters>({
    search: '',
    role: undefined,
    status: undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // Check permissions
  if (!hasPermission('manage_users')) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <Shield className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-600">You don't have permission to manage users.</p>
        </div>
      </div>
    );
  }

  const filteredUsers = useMemo(() => {
    let filtered = users.filter(user => {
      const matchesSearch = !filters.search || 
        user.firstName.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.lastName.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesRole = !filters.role || user.role === filters.role;
      const matchesStatus = !filters.status || 
        (filters.status === 'active' ? user.isActive : !user.isActive);

      return matchesSearch && matchesRole && matchesStatus;
    });

    // Sort users
    filtered.sort((a, b) => {
      const aValue = a[filters.sortBy as keyof User];
      const bValue = b[filters.sortBy as keyof User];
      
      if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [users, filters]);

  const handleToggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    ));
  };

  const handleChangeUserRole = (userId: string, newRole: User['role']) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  const getRoleIcon = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return <ShieldCheck className="h-4 w-4 text-red-600" />;
      case 'moderator':
        return <Shield className="h-4 w-4 text-yellow-600" />;
      default:
        return <Users className="h-4 w-4 text-blue-600" />;
    }
  };

  const getRoleBadgeColor = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'moderator':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">
          User Management
        </h1>
        <p className="text-lg text-slate-600">
          Manage user accounts, roles, and permissions
        </p>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 mb-8"
      >
        <div className="grid md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>

          <select
            value={filters.role || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value as User['role'] || undefined }))}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
            <option value="user">User</option>
          </select>

          <select
            value={filters.status || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' || undefined }))}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              setFilters(prev => ({ 
                ...prev, 
                sortBy: sortBy as keyof User, 
                sortOrder: sortOrder as 'asc' | 'desc' 
              }));
            }}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="firstName-asc">Name A-Z</option>
            <option value="firstName-desc">Name Z-A</option>
            <option value="lastLoginAt-desc">Recent Login</option>
          </select>
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/50 border-b border-slate-200/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Last Login</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Created</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/50">
              {filteredUsers.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-cultural-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.firstName[0]}{user.lastName[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-slate-600 flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(user.role)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {user.isActive ? (
                        <UserCheck className="h-4 w-4 text-green-600" />
                      ) : (
                        <UserX className="h-4 w-4 text-red-600" />
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                        user.isActive 
                          ? 'bg-green-100 text-green-800 border-green-200' 
                          : 'bg-red-100 text-red-800 border-red-200'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {user.lastLoginAt 
                          ? new Date(user.lastLoginAt).toLocaleDateString()
                          : 'Never'
                        }
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleToggleUserStatus(user.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                          user.isActive
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      
                      <select
                        value={user.role}
                        onChange={(e) => handleChangeUserRole(user.id, e.target.value as User['role'])}
                        className="px-2 py-1 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-primary-500 outline-none"
                      >
                        <option value="user">User</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>

                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No users found</h3>
            <p className="text-slate-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 text-center">
          <div className="text-2xl font-bold text-primary-600 mb-1">
            {users.length}
          </div>
          <div className="text-sm text-slate-600">Total Users</div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {users.filter(u => u.isActive).length}
          </div>
          <div className="text-sm text-slate-600">Active Users</div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 text-center">
          <div className="text-2xl font-bold text-yellow-600 mb-1">
            {users.filter(u => u.role === 'admin' || u.role === 'moderator').length}
          </div>
          <div className="text-sm text-slate-600">Staff Members</div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 text-center">
          <div className="text-2xl font-bold text-cultural-600 mb-1">
            {users.filter(u => u.lastLoginAt && new Date(u.lastLoginAt) > new Date(Date.now() - 86400000)).length}
          </div>
          <div className="text-sm text-slate-600">Active Today</div>
        </div>
      </motion.div>
    </div>
  );
};