import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import AdminDashboard from './pages/AdminDashboard';
import ModulePreview from './pages/ModulePreview';

const modules = ['students', 'teachers', 'academics', 'attendance', 'routine', 'exams', 'notices', 'settings', 'help'];

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          {modules.map((moduleId) => <Route key={moduleId} path={`/admin/${moduleId}`} element={<ModulePreview moduleId={moduleId} />} />)}
        </Route>
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
