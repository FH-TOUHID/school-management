import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export default function DashboardLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => { setMenuOpen(false); document.title = ({'/admin/students':'Student management','/admin/teachers':'Teacher management','/admin/academics':'Academic management'}[location.pathname] || 'Admin dashboard') + ' · EduSphere'; }, [location.pathname]);
  useEffect(() => {
    function handleEscape(event) { if (event.key === 'Escape') setMenuOpen(false); }
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F4F5] text-[#18181B]">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="min-h-screen lg:pl-[272px]">
        <Topbar onMenuClick={() => setMenuOpen(true)} />
        <main className="mx-auto w-full max-w-[1660px] px-4 pb-12 pt-7 sm:px-7 sm:pt-9 xl:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
