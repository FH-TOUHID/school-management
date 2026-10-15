import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export default function DashboardLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuTriggerRef = useRef(null);
  const closeMenu = () => {
    setMenuOpen(false);
    menuTriggerRef.current?.focus({preventScroll: true});
  };
  const location = useLocation();

  useEffect(() => { setMenuOpen(false); window.scrollTo(0, 0); document.title = ({'/admin/students':'Student management','/admin/teachers':'Teacher management','/admin/academics':'Academic management','/admin/attendance':'Attendance','/admin/routine':'Class routine','/admin/exams':'Exams and results','/admin/notices':'Notice board'}[location.pathname] || 'Admin dashboard') + ' · EduSphere'; }, [location.pathname]);
  useEffect(() => {
    function handleEscape(event) { if (event.key === 'Escape') {setMenuOpen(false); menuTriggerRef.current?.focus({preventScroll:true});} }
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [menuOpen]);

  return (
    <div className="min-h-screen bg-[#F4F4F5] text-[#18181B]">
      <Sidebar open={menuOpen} onClose={closeMenu} />
      <div className="min-h-screen lg:pl-[272px]">
        <Topbar onMenuClick={() => setMenuOpen(true)} menuOpen={menuOpen} menuTriggerRef={menuTriggerRef} />
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-[1660px] px-4 pb-12 pt-7 sm:px-7 sm:pt-9 xl:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
