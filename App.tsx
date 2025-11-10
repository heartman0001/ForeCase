import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import ProfilePage from './components/ProfilePage';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'profile'>('dashboard');

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const navigateToProfile = () => setCurrentPage('profile');
  const navigateToDashboard = () => setCurrentPage('dashboard');

  return (
    <DataProvider>
      {currentPage === 'dashboard' && <Dashboard onNavigateToProfile={navigateToProfile} />}
      {currentPage === 'profile' && <ProfilePage onNavigateToDashboard={navigateToDashboard} />}
    </DataProvider>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;