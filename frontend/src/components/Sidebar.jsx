import {
  BookOpenText, CalendarCheck2, CalendarDays, ChevronRight, CircleHelp,
  ClipboardList, GraduationCap, LayoutDashboard, Megaphone,
  School, Settings2, UsersRound, X,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useEffect, useRef } from 'react';

export const navigation = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Students', to: '/admin/students', icon: GraduationCap },
  { label: 'Teachers', to: '/admin/teachers', icon: UsersRound },
  { label: 'Classes & subjects', to: '/admin/academics', icon: BookOpenText },
  { label: 'Attendance', to: '/admin/attendance', icon: CalendarCheck2 },
  { label: 'Class routine', to: '/admin/routine', icon: CalendarDays },
  { label: 'Exams & results', to: '/admin/exams', icon: ClipboardList },
  { label: 'Notices', to: '/admin/notices', icon: Megaphone },
];

const secondaryNavigation = [
  { label: 'School settings', to: '/admin/settings', icon: Settings2 },
  { label: 'Help & support', to: '/admin/help', icon: CircleHelp },
];

function SidebarLink({ item, onNavigate }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `group relative flex min-h-11 items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-medium transition-all duration-200 ${
          isActive
            ? 'bg-[#A3E635] text-[#18181B] shadow-[0_4px_18px_rgba(163,230,53,0.13)]'
            : 'text-zinc-400 hover:bg-white/8 hover:text-white'
        }`
      }
    >
      <Icon size={18} strokeWidth={1.9} aria-hidden="true" />
      <span className="flex-1">{item.label}</span>
      <ChevronRight size={15} className="opacity-0 group-hover:opacity-80" aria-hidden="true" />
    </NavLink>
  );
}

export default function Sidebar({ open, onClose }) {
  const closeRef = useRef(null);
  useEffect(() => { if (open) closeRef.current?.focus({ preventScroll: true }); }, [open]);
  return (
    <>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/55 backdrop-blur-[2px] lg:hidden"
          onClick={onClose}
          aria-label="Close sidebar"
        />
      )}
      <aside
        id="admin-sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col bg-[#18181B] text-white transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0 visible' : '-translate-x-full invisible lg:visible'
        }`}
        aria-label="Main navigation"
      >
        <div className="flex h-[88px] shrink-0 items-center justify-between px-6">
          <NavLink to="/admin/dashboard" onClick={onClose} className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-[14px] bg-[#A3E635] text-[#18181B] shadow-[0_8px_24px_rgba(163,230,53,0.15)]">
              <School size={25} strokeWidth={2.2} />
            </span>
            <span>
              <strong className="block text-[19px] font-extrabold tracking-[-0.6px]">Edu<span className="text-[#A3E635]">Sphere</span></strong>
              <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500">School management</span>
            </span>
          </NavLink>
          <button ref={closeRef} type="button" onClick={onClose} className="rounded-lg p-2 text-zinc-400 hover:bg-white/10 lg:hidden" aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 pt-4 pb-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500">Workspace</span>
        </div>
        <nav className="sidebar-scroll min-h-0 flex-1 space-y-1 overflow-y-auto px-3.5 pb-4">
          {navigation.map((item) => <SidebarLink item={item} key={item.to} onNavigate={onClose} />)}
          <div className="px-3.5 pt-7 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500">Support</span>
          </div>
          {secondaryNavigation.map((item) => <SidebarLink item={item} key={item.to} onNavigate={onClose} />)}
        </nav>

        <div className="mx-4 mb-4 mt-2 shrink-0 rounded-2xl border border-white/10 bg-[#242428] p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <span className="size-2 rounded-full bg-[#A3E635] shadow-[0_0_0_4px_rgba(163,230,53,0.09)]" />
            Academic session 2026
          </div>
          <p className="mt-2 text-[11px] leading-[1.65] text-zinc-400">Your school workspace is ready. Keep everything in one place.</p>
        </div>
      </aside>
    </>
  );
}
