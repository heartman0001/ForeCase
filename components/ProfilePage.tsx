import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowLeftIcon, SaveIcon, MailIcon, UserCircleIcon } from './icons';

interface ProfilePageProps {
  onNavigateToDashboard: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigateToDashboard }) => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      updateUser({ ...user, name, email });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000); // Hide after 3 seconds
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <button 
          onClick={onNavigateToDashboard} 
          className="flex items-center gap-2 text-[#2826a9] dark:text-[#2b71e0] hover:underline mb-6"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back to Dashboard
        </button>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Manage Profile</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <div className="absolute inset-y-0 left-0 pl-3 pt-7 flex items-center pointer-events-none">
                <UserCircleIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2826a9] focus:border-transparent"
                required
              />
            </div>
            
            <div className="relative">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
              <div className="absolute inset-y-0 left-0 pl-3 pt-7 flex items-center pointer-events-none">
                <MailIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2826a9] focus:border-transparent"
                required
              />
            </div>
            
            <div className="flex items-center justify-end gap-4">
               {showSuccess && (
                <div className="text-green-600 dark:text-green-400 text-sm transition-opacity duration-300">
                  Profile updated successfully!
                </div>
              )}
              <button
                type="submit"
                className="inline-flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2826a9] hover:bg-[#22208a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2826a9] transition duration-150"
              >
                <SaveIcon className="h-5 w-5 mr-2" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;