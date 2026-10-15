import { Bell, ChevronDown, LogOut, Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { navigation } from './Sidebar';

function formatDate() {
  return new Intl.DateTimeFormat('en-BD', {weekday:'long',month:'short',day:'numeric',year:'numeric',timeZone:'Asia/Dhaka'}).format(new Date());
}

export default function Topbar({ onMenuClick, menuOpen = false, menuTriggerRef }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const containerRef = useRef(null);
  const label = [...navigation, {to:'/admin/settings',label:'School settings'}, {to:'/admin/help',label:'Help & support'}]
    .find((item) => item.to === location.pathname)?.label ?? 'Dashboard';

  useEffect(() => {
    function closeOnOutside(event) {
      if (!containerRef.current?.contains(event.target)) { setNotificationsOpen(false); setAccountOpen(false); }
    }
    function closeOnEscape(event) { if (event.key === 'Escape') { setNotificationsOpen(false); setAccountOpen(false); } }
    document.addEventListener('pointerdown', closeOnOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {document.removeEventListener('pointerdown', closeOnOutside);document.removeEventListener('keydown',closeOnEscape);};
  }, []);
  useEffect(() => {setAccountOpen(false);setNotificationsOpen(false);}, [location.pathname]);

  function handleSignOut() { signOut(); navigate('/login', {replace:true}); }

  return (
    <header className="sticky top-0 z-30 flex h-[78px] items-center justify-between border-b border-[#E4E4E7] bg-[#F4F4F5]/95 px-5 backdrop-blur-xl sm:px-7 xl:px-10">
      <div className="flex min-w-0 items-center gap-3">
        <button type="button" ref={menuTriggerRef} onClick={onMenuClick} className="-ml-1 rounded-xl p-2.5 text-zinc-800 hover:bg-white lg:hidden" aria-label="Open navigation menu" aria-controls="admin-sidebar" aria-expanded={menuOpen}><Menu size={22}/></button>
        <div><p className="text-[11px] font-medium text-zinc-500">School overview <span className="px-1.5">/</span> <span className="text-zinc-800">{label}</span></p><p className="mt-1 hidden text-[12px] text-zinc-500 sm:block">{formatDate()}</p></div>
      </div>
      <div className="flex items-center gap-2.5 sm:gap-4" ref={containerRef}>
        <span className="hidden items-center gap-2 rounded-full border border-[#E4E4E7] bg-white px-3 py-2 text-[11px] font-semibold text-zinc-500 md:inline-flex"><span className="size-1.5 rounded-full bg-[#84CC16]"/> Demo environment</span>
        <div className="relative">
          <button type="button" className="relative flex size-10 items-center justify-center rounded-xl border border-[#E4E4E7] bg-white text-zinc-800 transition-colors hover:bg-[#F7FEE7]" onClick={() => {setNotificationsOpen(v=>!v);setAccountOpen(false);}} aria-label="Notifications" aria-expanded={notificationsOpen}>
            {notificationsOpen ? <X size={19}/> : <Bell size={19}/>}<span className="absolute right-2.5 top-2.5 size-1.5 rounded-full bg-[#84CC16] ring-2 ring-white"/>
          </button>
          {notificationsOpen && <div className="absolute right-0 top-12 z-50 w-[min(310px,calc(100vw-32px))] rounded-2xl border border-[#E4E4E7] bg-white p-4 shadow-[0_20px_60px_rgba(0,0,0,0.12)]"><h3 className="text-sm font-bold text-zinc-900">Notifications</h3><p className="mt-1 text-xs leading-5 text-zinc-500">UI preview. Live notifications will be connected later.</p><div className="mt-4 rounded-xl bg-[#F7FEE7] p-3 text-xs font-medium text-[#365314]">Academic session 2026 is active.</div></div>}
        </div>
        <div className="h-8 w-px bg-[#E4E4E7]"/>
        <div className="relative">
          <button type="button" onClick={() => {setAccountOpen(v=>!v);setNotificationsOpen(false);}} aria-label="Account menu" aria-expanded={accountOpen} className="flex items-center gap-2.5 rounded-xl text-left focus-visible:outline-2 focus-visible:outline-lime-500">
            <span className="flex size-10 items-center justify-center rounded-xl bg-[#18181B] text-xs font-bold text-[#A3E635]">{user?.initials ?? 'AD'}</span>
            <span className="hidden leading-tight sm:block"><span className="block text-xs font-bold text-zinc-900">{user?.name ?? 'Admin'}</span><span className="mt-0.5 block text-[11px] text-zinc-500">Administrator</span></span>
            <ChevronDown size={15} className={`hidden text-zinc-400 transition-transform sm:block ${accountOpen ? 'rotate-180' : ''}`}/>
          </button>
          {accountOpen && <div className="absolute right-0 top-12 z-50 w-[220px] rounded-2xl border border-[#E4E4E7] bg-white p-2 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
            <div className="border-b border-zinc-100 px-3 py-3"><p className="truncate text-xs font-bold text-zinc-900">{user?.name}</p><p className="mt-1 truncate text-[11px] text-zinc-500">{user?.email}</p></div>
            <button type="button" onClick={handleSignOut} className="mt-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-3 text-left text-xs font-bold text-zinc-700 hover:bg-[#F7FEE7]"><LogOut size={16}/> Sign out</button>
          </div>}
        </div>
      </div>
    </header>
  );
}
