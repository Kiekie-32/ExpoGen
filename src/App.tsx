import { Routes, Route } from 'react-router-dom';
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import ProductPage from './pages/ProductPage';
import CompliancePage from './pages/CompliancePage';
import ReadinessPage from './pages/ReadinessPage';
import DocumentsPage from './pages/DocumentPage';

export default function App() {
  return (
    <div className="flex h-screen font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <Routes>
          <Route path='/' element={<MainContent />} />
          <Route path='/product' element={<ProductPage />} />
          <Route path='/compliance' element={<CompliancePage />} />
          <Route path='/readiness' element={<ReadinessPage />} />
          <Route path='/documents' element={<DocumentsPage />} />
        </Routes>
      </div>
    </div>
  );
}