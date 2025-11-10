import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from "./components/Sidebar"
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import Dashboard from './components/Dashboard'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import CustomersPage from './page/CustomersPage'
import ProjectsPage from './page/ProjectsPage'
import InstallmentsPage from './page/InstallmentsPage'
import UsersPage from './page/UsersPage'
import NotificationsPage from './page/NotificationsPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Sidebar />
        <Routes>
          {/* Redirect / → /login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ✅ ป้องกันเข้าถึง Dashboard ถ้าไม่ได้ login */}
          {/* <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard onNavigateToProfile={() => { }} />
              </ProtectedRoute>
            }
          /> */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/installments" element={<InstallmentsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
