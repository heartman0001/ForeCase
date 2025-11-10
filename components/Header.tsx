import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogoutIcon, UserCircleIcon, ChevronDownIcon } from './icons';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleProfileClick = () => {
    alert('Profile management feature coming soon!');
    setIsDropdownOpen(false);
  }

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            setIsDropdownOpen(false);
        }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Fore Cash</h1>
          </div>
          <div className="flex items-center">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center p-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-blue-500 transition"
              >
                <span className="sr-only">Open user menu</span>
                <UserCircleIcon className="h-7 w-7" />
                <span className="hidden md:block mx-2 font-medium text-gray-800 dark:text-gray-200">
                  {user?.name || 'User'}
                </span>
                <ChevronDownIcon className="h-5 w-5" />
              </button>
              
              {isDropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
                    Signed in as
                    <br/>
                    <strong className="truncate">{user?.email}</strong>
                  </div>
                  <div className="border-t border-gray-100 dark:border-gray-600"></div>
                  <a href="#" onClick={handleProfileClick} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">Manage Profile</a>
                  <a href="#" onClick={handleLogout} className="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600">
                    <div className="flex items-center">
                      <LogoutIcon className="h-5 w-5 mr-2" />
                      Logout
                    </div>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
