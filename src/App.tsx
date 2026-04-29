import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
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
import NotificationsPage from "./DashNavItems/NotificationPage";
import SettingsPage from "./DashNavItems/SettingsPage";
import AIGeneratorPage from "./pages/AIGeneratorPage";
import Home from "./NavItems/Home";
import AboutUs from "./NavItems/AboutUs";
import Profile from "./NavItems/Profile";
import Contact from "./NavItems/Contact";
import PublicLayout from "./components/PublicLayout";
import Onboarding from "./components/Onboarding";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const isPublicRoute =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/onboarding" ||
    pathname === "/about" ||
    pathname === "/profile" ||
    pathname === "/contact" ||
    pathname === "/home";

  // Public pages (Landing, Login, etc.) render within PublicLayout
  if (isPublicRoute) {
    return (
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    );
  }

  // Authenticated app shell for all other routes
  return (
    <ProtectedRoute>
      <div className="flex h-screen font-sans bg-white overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto bg-gray-50/50">
            <Routes>
              <Route path="/dashboard" element={<MainContent />} />
              <Route path="/product" element={<ProductPage />} />
              <Route path="/compliance" element={<CompliancePage />} />
              <Route path="/readiness" element={<ReadinessPage />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/ai" element={<AIGeneratorPage />} />

              {/* Catch all and redirect to dashboard */}
              <Route
                path="*"
                element={<Navigate to="/dashboard" replace />}
              />
            </Routes>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
