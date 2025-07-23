import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { UserPlus, Key, Users, Trash2 } from 'lucide-react';
import { Eye, EyeOff } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { Admin } from '../../types';
import LoadingSpinner from '../UI/LoadingSpinner';
import ConfirmDialog from '../UI/ConfirmDialog';
import toast from 'react-hot-toast';

interface AddAdminForm {
  username: string;
  password: string;
  confirmPassword: string;
}

interface ResetPasswordForm {
  username: string;
  newPassword: string;
  confirmPassword: string;
}

const AdminManagement: React.FC = () => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<string | null>(null);

  const handleDeleteAdmin = (username: string) => {
    setAdminToDelete(username);
    setConfirmOpen(true);
  };

  const confirmDeleteAdmin = async () => {
    if (!adminToDelete) return;
    try {
      await adminAPI.delete(adminToDelete);
      toast.success('Admin deleted successfully');
      fetchAdmins();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete admin');
    } finally {
      setConfirmOpen(false);
      setAdminToDelete(null);
    }
  };

  const cancelDeleteAdmin = () => {
    setConfirmOpen(false);
    setAdminToDelete(null);
  };
  // ...existing code...
  const [showAddPassword, setShowAddPassword] = useState(false);
  const [showAddConfirm, setShowAddConfirm] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'add' | 'reset' | 'list'>('add');

  const addAdminForm = useForm<AddAdminForm>();
  const resetPasswordForm = useForm<ResetPasswordForm>();

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await adminAPI.getAll();
      setAdmins(response.data);
    } catch (error) {
      console.error('Error fetching admins:', error);
      toast.error('Failed to load admin list');
    } finally {
      setLoading(false);
    }
  };

  const onAddAdmin = async (data: AddAdminForm) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await adminAPI.register(data.username, data.password);
      toast.success('Admin added successfully');
      addAdminForm.reset();
      fetchAdmins();
    } catch (error: any) {
      console.error('Error adding admin:', error);
      toast.error(error.response?.data?.message || 'Failed to add admin');
    }
  };

  const onResetPassword = async (data: ResetPasswordForm) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await adminAPI.resetPassword(data.username, data.newPassword);
      toast.success('Password reset successfully');
      resetPasswordForm.reset();
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast.error(error.response?.data?.message || 'Failed to reset password');
    }
  };

  const tabs = [
    { id: 'add', label: 'Add Admin', icon: UserPlus },
    { id: 'reset', label: 'Reset Password', icon: Key },
    { id: 'list', label: 'Admin List', icon: Users },
  ] as const;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Admin"
        message={`Are you sure you want to delete admin '${adminToDelete}'? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteAdmin}
        onCancel={cancelDeleteAdmin}
      />
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Admin Management
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage administrator accounts and permissions
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-6">
        {/* Add Admin Tab */}
        {activeTab === 'add' && (
          <div className="max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Add New Administrator
            </h3>
            <form onSubmit={addAdminForm.handleSubmit(onAddAdmin)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  {...addAdminForm.register('username', { required: 'Username is required' })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter username"
                />
                {addAdminForm.formState.errors.username && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {addAdminForm.formState.errors.username.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showAddPassword ? 'text' : 'password'}
                    {...addAdminForm.register('password', { 
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' }
                    })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter password"
                  />
                  <button type="button" className="absolute right-3 top-3" onClick={() => setShowAddPassword(v => !v)}>
                    {showAddPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
                {addAdminForm.formState.errors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {addAdminForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showAddConfirm ? 'text' : 'password'}
                    {...addAdminForm.register('confirmPassword', { required: 'Please confirm password' })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Confirm password"
                  />
                  <button type="button" className="absolute right-3 top-3" onClick={() => setShowAddConfirm(v => !v)}>
                    {showAddConfirm ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
                {addAdminForm.formState.errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {addAdminForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={addAdminForm.formState.isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addAdminForm.formState.isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <UserPlus className="h-5 w-5" />
                    <span>Add Admin</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Reset Password Tab */}
        {activeTab === 'reset' && (
          <div className="max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Reset Administrator Password
            </h3>
            <form onSubmit={resetPasswordForm.handleSubmit(onResetPassword)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Username *
                </label>
                <select
                  {...resetPasswordForm.register('username', { required: 'Please select an admin' })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select admin to reset password</option>
                  {admins.map((admin) => (
                    <option key={admin._id} value={admin.username}>
                      {admin.username}
                    </option>
                  ))}
                </select>
                {resetPasswordForm.formState.errors.username && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {resetPasswordForm.formState.errors.username.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Password *
                </label>
                <div className="relative">
                  <input
                    type={showResetPassword ? 'text' : 'password'}
                    {...resetPasswordForm.register('newPassword', { 
                      required: 'New password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' }
                    })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter new password"
                  />
                  <button type="button" className="absolute right-3 top-3" onClick={() => setShowResetPassword(v => !v)}>
                    {showResetPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
                {resetPasswordForm.formState.errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {resetPasswordForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <input
                    type={showResetConfirm ? 'text' : 'password'}
                    {...resetPasswordForm.register('confirmPassword', { required: 'Please confirm new password' })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Confirm new password"
                  />
                  <button type="button" className="absolute right-3 top-3" onClick={() => setShowResetConfirm(v => !v)}>
                    {showResetConfirm ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
                {resetPasswordForm.formState.errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {resetPasswordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={resetPasswordForm.formState.isSubmitting}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resetPasswordForm.formState.isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Key className="h-5 w-5" />
                    <span>Reset Password</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Admin List Tab */}
        {activeTab === 'list' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Administrator List
            </h3>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
                <div className="px-6 py-3 bg-gray-100 dark:bg-gray-600 border-b border-gray-200 dark:border-gray-500">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      Active Administrators ({admins.length})
                    </h4>
                  </div>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-600">
                  {admins.map((admin) => (
                    <div key={admin._id} className="px-6 py-4 flex items-center justify-between">
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                          {admin.username}
                        </h5>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Created: {new Date(admin.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          Active
                        </span>
                        {!admin.undeletable && (
                          <button
                            className="ml-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            title="Delete admin"
                            onClick={() => handleDeleteAdmin(admin.username)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManagement;