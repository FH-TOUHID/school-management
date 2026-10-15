import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Bell, BookOpen, CalendarCheck2, CalendarDays, ChevronRight, ClipboardList, GraduationCap, LayoutDashboard, LogOut, Megaphone, Menu, School, UserRound, UsersRound, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const menus = {
  teacher: [
    {key:'dashboard',title:'Dashboard',icon:LayoutDashboard},
    {key:'classes',title:'My classes',icon:UsersRound},
    {key:'attendance',title:'Attendance',icon:CalendarCheck2},
    {key:'marks',title:'Marks entry',icon:ClipboardList},
    {key:'routine',title:'My routine',icon:CalendarDays},
    {key:'notices',title:'Notices',icon:Megaphone},
    {key:'profile',title:'My profile',icon:UserRound},
  ],
  student: [
    {key:'dashboard',title:'Dashboard',icon:LayoutDashboard},
    {key:'profile',title:'My profile',icon:UserRound},
    {key:'attendance',title:'My attendance',icon:CalendarCheck2},
    {key:'routine',title:'Class routine',icon:CalendarDays},
    {key:'results',title:'My results',icon:GraduationCap},
    {key:'notices',title:'Notices',icon:Megaphone},
  ],
};

export default function PortalLayout() {
  const {user, signOut} = useAuth();
  const role=user?.role === 'teacher' ? 'teacher' : 'student';
  const location=useLocation();
  const navigate=useNavigate();
  const [open,setOpen]=useState(false);
  const [notificationOpen,setNotificationOpen]=useState(false);
  const current=menus[role].find(m=>location.pathname.endsWith('/'+m.key));
  useEffect(()=>{setOpen(false);setNotificationOpen(false);document.title=`${current?.title||'Dashboard'} · EduSphere`;},[location.pathname,current?.title]);
  useEffect(()=>{
    const onKey=e=>{if(e.key==='Escape'){setOpen(false);setNotificationOpen(false);}};
    window.addEventListener('keydown',onKey);
    return ()=>window.removeEventListener('keydown',onKey);
  },[]);
  const logout=()=>{signOut();navigate('/login',{replace:true});};
  return <div className="min-h-screen bg-[#F4F4F5] text-[#18181B]">
    {open&&<button aria-label="Close mobile navigation" onClick={()=>setOpen(false)} className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] lg:hidden"/>}
    <aside aria-label={`${role} navigation`} className={`fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col bg-[#18181B] text-white transition-transform duration-300 lg:translate-x-0 ${open?'translate-x-0':'-translate-x-full'}`}>
      <div className="flex h-[88px] shrink-0 items-center justify-between px-6">
        <NavLink to={`/${role}/dashboard`} onClick={()=>setOpen(false)} className="flex min-w-0 items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-[14px] bg-[#A3E635] text-[#18181B]"><School size={25}/></span>
          <span><span className="block text-[19px] font-extrabold tracking-tight">Edu<span className="text-[#A3E635]">Sphere</span></span><span className="block text-[10px] uppercase tracking-[.18em] text-zinc-500">{role} workspace</span></span>
        </NavLink>
        <button aria-label="Close menu" onClick={()=>setOpen(false)} className="p-2 text-zinc-400 lg:hidden"><X size={21}/></button>
      </div>
      <p className="px-6 pt-4 pb-3 text-[10px] font-extrabold uppercase tracking-[.18em] text-zinc-500">My workspace</p>
      <nav className="sidebar-scroll min-h-0 flex-1 space-y-1 overflow-y-auto px-3.5 pb-4">
        {menus[role].map(({key,title,icon:Icon})=><NavLink key={key} to={`/${role}/${key}`} onClick={()=>setOpen(false)} className={({isActive})=>`group flex min-h-11 items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold transition-colors ${isActive?'bg-[#A3E635] text-[#18181B]':'text-zinc-400 hover:bg-white/10 hover:text-white'}`}><Icon size={18}/><span className="flex-1">{title}</span><ChevronRight size={14} className="opacity-40"/></NavLink>)}
      </nav>
      <div className="m-4 rounded-2xl border border-white/10 bg-[#242428] p-4">
        <div className="flex items-center gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#A3E635] text-xs font-extrabold text-[#18181B]">{user?.initials}</span><div className="min-w-0"><p className="truncate text-xs font-bold">{user?.name}</p><p className="mt-1 text-[10px] capitalize text-zinc-400">{role} · Demo account</p></div></div>
        <button onClick={logout} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 px-3 py-2.5 text-xs font-bold text-zinc-200 hover:bg-white/10"><LogOut size={15}/> Sign out</button>
      </div>
    </aside>
    <div className="min-h-screen lg:pl-[272px]">
      <header className="sticky top-0 z-30 flex h-[78px] items-center justify-between gap-3 border-b border-[#E4E4E7] bg-[#F4F4F5]/95 px-4 backdrop-blur-xl sm:px-7 xl:px-10">
        <div className="flex min-w-0 items-center gap-3"><button onClick={()=>setOpen(true)} aria-label="Open navigation menu" className="rounded-xl p-2.5 hover:bg-white lg:hidden"><Menu size={23}/></button><div className="min-w-0"><p className="truncate text-[11px] font-medium text-zinc-500">{role==='teacher'?'Teaching':'Learning'} workspace / <span className="font-bold text-zinc-800">{current?.title||'Dashboard'}</span></p><p className="mt-1 hidden text-xs text-zinc-400 sm:block">Academic session 2026</p></div></div>
        <div className="flex items-center gap-2.5 sm:gap-4"><span className="hidden rounded-full border border-[#E4E4E7] bg-white px-3 py-2 text-[11px] font-bold text-zinc-500 md:block">● Demo environment</span><div className="relative"><button onClick={()=>setNotificationOpen(x=>!x)} aria-label="Notifications" aria-expanded={notificationOpen} className="flex size-10 items-center justify-center rounded-xl border border-[#E4E4E7] bg-white hover:bg-[#F7FEE7]"><Bell size={18}/></button>{notificationOpen&&<div className="absolute right-0 top-12 w-[min(290px,calc(100vw-28px))] rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl"><p className="text-xs font-extrabold">Notifications</p><p className="mt-2 text-xs leading-5 text-zinc-500">Demo preview — live notifications will be added with Go backend.</p><button className="mt-3 text-xs font-bold text-lime-700" onClick={()=>setNotificationOpen(false)}>Close</button></div>}</div><NavLink to={`/${role}/profile`} aria-label="Open my profile" className="flex size-10 items-center justify-center rounded-xl bg-[#18181B] text-xs font-extrabold text-[#A3E635]">{user?.initials}</NavLink></div>
      </header>
      <main className="mx-auto w-full max-w-[1660px] px-4 pb-12 pt-7 sm:px-7 sm:pt-9 xl:px-10"><Outlet/></main>
    </div>
  </div>;
}
