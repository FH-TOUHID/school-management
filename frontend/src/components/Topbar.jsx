import { Bell, ChevronDown, Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { navigation } from './Sidebar';

function formatDate() {
  return new Intl.DateTimeFormat('en-BD', {
    weekday: 'long', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'Asia/Dhaka',
  }).format(new Date());
}

export default function Topbar({ onMenuClick }) {
  const location = useLocation();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const containerRef = useRef(null);
  const label = [...navigation, { to: '/admin/settings', label: 'School settings' }, { to: '/admin/help', label: 'Help & support' }]
    .find((item) => item.to === location.pathname)?.label ?? 'Dashboard';

  useEffect(() => {
    function closeOnOutside(event) {
      if (!containerRef.current?.contains(event.target)) setNotificationsOpen(false);
    }
    function closeOnEscape(event) { if (event.key === 'Escape') setNotificationsOpen(false); }
    document.addEventListener('pointerdown', closeOnOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-[78px] items-center justify-between border-b border-[#E4E4E7] bg-[#F4F4F5]/95 px-5 backdrop-blur-xl sm:px-7 xl:px-10">
      <div className="flex min-w-0 items-center gap-3">
        <button type="button" onClick={onMenuClick} className="-ml-1 rounded-xl p-2.5 text-zinc-800 hover:bg-white lg:hidden" aria-label="Open navigation menu">
          <Menu size={22} />
        </button>
        <div>
          <p className="text-[11px] font-medium text-zinc-500">School overview <span className="px-1.5">/</span> <span className="text-zinc-800">{label}</span></p>
          <p className="mt-1 hidden text-[12px] text-zinc-500 sm:block">{formatDate()}</p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-4">
        <span className="hidden items-center gap-2 rounded-full border border-[#E4E4E7] bg-white px-3 py-2 text-[11px] font-semibold text-zinc-500 md:inline-flex">
          <span className="size-1.5 rounded-full bg-[#84CC16]" /> Demo environment
        </span>
        <div className="relative" ref={containerRef}>
          <button
            type="button"
            className="relative flex size-10 items-center justify-center rounded-xl border border-[#E4E4E7] bg-white text-zinc-800 transition-colors hover:bg-[#F7FEE7]"
            onClick={() => setNotificationsOpen((v) => !v)}
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
          >
            {notificationsOpen ? <X size={19} /> : <Bell size={19} />}
            <span className="absolute right-2.5 top-2.5 size-1.5 rounded-full bg-[#84CC16] ring-2 ring-white" />
          </button>
          {notificationsOpen && (
            <div className="absolute right-0 top-12 z-50 w-[min(310px,calc(100vw-32px))] rounded-2xl border border-[#E4E4E7] bg-white p-4 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
              <h3 className="text-sm font-bold text-zinc-900">Notifications</h3>
              <p className="mt-1 text-xs leading-5 text-zinc-500">This is a UI preview. Live notifications will be connected later.</p>
              <div className="mt-4 rounded-xl bg-[#F7FEE7] p-3 text-xs font-medium text-[#365314]">Academic session 2026 is active.</div>
            </div>
          )}
        </div>
        <div className="h-8 w-px bg-[#E4E4E7]" />
        <div className="flex items-center gap-2.5">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#18181B] text-xs font-bold text-[#A3E635]">AD</div>
          <div className="hidden leading-tight sm:block">
            <p className="text-xs font-bold text-zinc-900">Admin User</p>
            <p className="mt-0.5 text-[11px] text-zinc-500">Administrator</p>
          </div>
          <ChevronDown size={15} className="hidden text-zinc-400 sm:block" />
        </div>
      </div>
    </header>
  );
}
