import { Routes, Route, Navigate } from 'react-router-dom';
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import ProductPage from './pages/ProductPage';
import CompliancePage from './pages/CompliancePage';
import ReadinessPage from './pages/ReadinessPage';
import DocumentsPage from './pages/DocumentPage';
import LoginPage from './pages/LoginPage';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex h-screen font-sans bg-white">
      {user && <Sidebar />}
      <div className="flex flex-col flex-1 overflow-hidden">
        {user && <Topbar />}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path='/' element={user ? <MainContent /> : <Navigate to="/login" replace />} />
            <Route path='/product' element={user ? <ProductPage /> : <Navigate to="/login" replace />} />
            <Route path='/compliance' element={user ? <CompliancePage /> : <Navigate to="/login" replace />} />
            <Route path='/readiness' element={user ? <ReadinessPage /> : <Navigate to="/login" replace />} />
            <Route path='/documents' element={user ? <DocumentsPage /> : <Navigate to="/login" replace />} />
            <Route path='/login' element={<LoginPage />} />
            {/* Catch all and redirect to login or dashboard based on auth */}
            <Route path='*' element={<Navigate to={user ? "/" : "/login"} replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}