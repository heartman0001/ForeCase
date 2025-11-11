import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import Dashboard from "./components/Dashboard";
import CustomersPage from "./page/CustomersPage";
import ProjectsPage from "./page/ProjectsPage";
import InstallmentsPage from "./page/InstallmentsPage";
import UsersPage from "./page/UsersPage";
import NotificationsPage from "./page/NotificationsPage";
import InvoiceRecordPage from "./page/InvoiceRecordPage";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import ReportsPage from "./page/ReportsPage";
import CustomerDashboardPage from "./page/CustomerDashboardPage";
import CustomerDetailPage from "./page/CustomerDetailPage";
import PaymentCalendarPage from "./page/PaymentCalendarPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* หน้าก่อน login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* <Route path="/customers/:id" element={<CustomerDetailPage />} /> */}

          {/* ✅ หน้าหลัง login ใช้ Layout */}
          <Route
            path="/dashboard"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/customers/:id"
            element={
              <Layout>
                <CustomerDetailPage />
              </Layout>
            }
          />
          <Route
            path="/dashboard/customer"
            element={
              <Layout>
                <CustomerDashboardPage />
              </Layout>
            }
          />
          <Route
            path="/dashboard/calendar"
            element={
              <Layout>
                <PaymentCalendarPage />
              </Layout>
            }
          />

          <Route
            path="/invoiceRecord"
            element={
              <Layout>
                <InvoiceRecordPage />
              </Layout>
            }
          />

          <Route
            path="/customers"
            element={
              <Layout>
                <CustomersPage />
              </Layout>
            }
          />
          <Route
            path="/projects"
            element={
              <Layout>
                <ProjectsPage />
              </Layout>
            }
          />
          <Route
            path="/installments"
            element={
              <Layout>
                <InstallmentsPage />
              </Layout>
            }
          />
          <Route
            path="/users"
            element={
              <Layout>
                <UsersPage />
              </Layout>
            }
          />
          <Route
            path="/notifications"
            element={
              <Layout>
                <NotificationsPage />
              </Layout>
            }
          />
          <Route path="/reports" element={<Layout><ReportsPage /></Layout>} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
