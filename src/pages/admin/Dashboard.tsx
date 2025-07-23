import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Plus, Settings, Users, Gamepad as Games } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AddGame from '../../components/Admin/AddGame';
import ManageGames from '../../components/Admin/ManageGames';
import AdminManagement from '../../components/Admin/AdminManagement';

const Dashboard: React.FC = () => {
  const { isAuthenticated, admin } = useAuth();
  const [activeTab, setActiveTab] = useState('add-game');

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const tabs = [
    { id: 'add-game', label: 'Add New Game', icon: Plus },
    { id: 'manage-games', label: 'Manage Games', icon: Games },
    { id: 'admin-management', label: 'Admin Management', icon: Users },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'add-game':
        return <AddGame />;
      case 'manage-games':
        return <ManageGames />;
      case 'admin-management':
        return <AdminManagement />;
      default:
        return <AddGame />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Welcome back, {admin?.username}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Admin Panel
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Navigation
              </h3>
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;