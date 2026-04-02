import{Routes, Route} from 'react-router-dom';
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import ProductPage from './pages/ProductPage';

export default function App() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <Routes>
        <Route path='/' element={<MainContent />} />
        <Route path='/product' element={<ProductPage/>}/>
        </Routes>
      </div>
    </div>
  );
}
