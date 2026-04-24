import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import ProductPage from "./pages/ProductPage";
import CompliancePage from "./pages/CompliancePage";
import ReadinessPage from "./pages/ReadinessPage";
import DocumentsPage from "./pages/DocumentPage";
import LoginPage from "./pages/LoginPage";
import { useAuth } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import NotificationsPage from "./NavItems/NotificationPage";
import SettingsPage from "./NavItems/SettingsPage";
import AIGeneratorPage from "./pages/AIGeneratorPage";

export default function App() {
  const { user, isLoading } = useAuth();
  const { pathname } = useLocation();

  if (isLoading) {
    return null; // Or a loading spinner
  }

  const isPublicRoute = pathname === "/" || pathname === "/login";

  // Public pages (Landing, Login) render without the app shell
  if (isPublicRoute) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    );
  }

  // Authenticated app shell for all other routes
  return (
    <div className="flex h-screen font-sans bg-white">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route
              path="/dashboard"
              element={
                user ? <MainContent /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/product"
              element={
                user ? <ProductPage /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/compliance"
              element={
                user ? <CompliancePage /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/readiness"
              element={
                user ? <ReadinessPage /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/documents"
              element={
                user ? <DocumentsPage /> : <Navigate to="/login" replace />
              }
            />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/ai" element={<AIGeneratorPage />} />

            {/* Catch all and redirect to login or dashboard based on auth */}
            <Route
              path="*"
              element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}
