import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { getHomeRoute } from './auth/demoAuth';
import RequireRole from './components/RequireRole';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import ModulePreview from './pages/ModulePreview';
import RoleDashboardPreview from './pages/RoleDashboardPreview';
import StudentsPage from './pages/StudentsPage';
import { StudentsProvider } from './context/StudentsContext';
import { AcademicsProvider } from './context/AcademicsContext';
import { TeachersProvider } from './context/TeachersContext';
import TeachersPage from './pages/TeachersPage';
import AcademicsPage from './pages/AcademicsPage';

const modules = ['attendance','routine','exams','notices','settings','help'];

function HomeRedirect() {
  const { user } = useAuth();
  return <Navigate to={user ? getHomeRoute(user.role) : '/login'} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage/>}/>
      <Route element={<RequireRole role="admin"/>}>
        <Route element={<DashboardLayout/>}>
          <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
          <Route path="/admin/students" element={<StudentsPage/>}/>
          <Route path="/admin/teachers" element={<TeachersPage/>}/>
          <Route path="/admin/academics" element={<AcademicsPage/>}/>
          {modules.map((id) => <Route key={id} path={`/admin/${id}`} element={<ModulePreview moduleId={id}/>}/>)}
        </Route>
      </Route>
      <Route element={<RequireRole role="teacher"/>}>
        <Route path="/teacher/dashboard" element={<RoleDashboardPreview/>}/>
      </Route>
      <Route element={<RequireRole role="student"/>}>
        <Route path="/student/dashboard" element={<RoleDashboardPreview/>}/>
      </Route>
      <Route path="*" element={<HomeRedirect/>}/>
    </Routes>
  );
}

export default function App() {
  return <BrowserRouter><AuthProvider><StudentsProvider><AcademicsProvider><TeachersProvider><AppRoutes/></TeachersProvider></AcademicsProvider></StudentsProvider></AuthProvider></BrowserRouter>;
}
