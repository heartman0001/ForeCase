
import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    <DataProvider>
      <Dashboard />
    </DataProvider>
  ) : (
    <LoginPage />
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
