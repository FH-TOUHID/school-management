import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { getHomeRoute } from './auth/demoAuth';
import RequireRole from './components/RequireRole';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import ModulePreview from './pages/ModulePreview';
import PortalLayout from './layouts/PortalLayout';
import TeacherPortal from './pages/portal/TeacherPortal';
import StudentPortal from './pages/portal/StudentPortal';
import StudentsPage from './pages/StudentsPage';
import { StudentsProvider } from './context/StudentsContext';
import { AcademicsProvider } from './context/AcademicsContext';
import { TeachersProvider } from './context/TeachersContext';
import TeachersPage from './pages/TeachersPage';
import AcademicsPage from './pages/AcademicsPage';
import AttendancePage from './pages/AttendancePage';
import RoutinePage from './pages/RoutinePage';
import ExamsPage from './pages/ExamsPage';
import NoticesPage from './pages/NoticesPage';
import { OperationsProvider } from './context/OperationsContext';

const modules = ['settings','help'];

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
          <Route path="/admin/attendance" element={<AttendancePage/>}/>
          <Route path="/admin/routine" element={<RoutinePage/>}/>
          <Route path="/admin/exams" element={<ExamsPage/>}/>
          <Route path="/admin/notices" element={<NoticesPage/>}/>
          {modules.map((id) => <Route key={id} path={`/admin/${id}`} element={<ModulePreview moduleId={id}/>}/>)}
        </Route>
      </Route>
      <Route element={<RequireRole role="teacher"/>}>
        <Route element={<PortalLayout/>}>
          {['dashboard','classes','attendance','marks','routine','notices','profile'].map(view =>
            <Route key={view} path={`/teacher/${view}`} element={<TeacherPortal view={view}/>}/>
          )}
        </Route>
      </Route>
      <Route element={<RequireRole role="student"/>}>
        <Route element={<PortalLayout/>}>
          {['dashboard','profile','attendance','routine','results','notices'].map(view =>
            <Route key={view} path={`/student/${view}`} element={<StudentPortal view={view}/>}/>
          )}
        </Route>
      </Route>
      <Route path="*" element={<HomeRedirect/>}/>
    </Routes>
  );
}

export default function App() {
  return <BrowserRouter><AuthProvider><StudentsProvider><AcademicsProvider><TeachersProvider><OperationsProvider><AppRoutes/></OperationsProvider></TeachersProvider></AcademicsProvider></StudentsProvider></AuthProvider></BrowserRouter>;
}
