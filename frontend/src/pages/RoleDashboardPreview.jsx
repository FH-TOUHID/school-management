import { ArrowRight, BookOpenText, CalendarCheck2, GraduationCap, LogOut, Megaphone, School, Sparkles } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const dashboards = {
  teacher: {
    heading: 'Your classroom, beautifully organized.', subtitle: 'Your teaching workspace is getting ready.',
    message: 'The full Teacher Dashboard will arrive in Checkpoint 6. For now, explore the role-based login and navigation.',
    items: [
      { name: 'My classes', detail: 'Class assignments', icon: BookOpenText },
      { name: 'Attendance', detail: 'Mark student presence', icon: CalendarCheck2 },
      { name: 'School notices', detail: 'Latest updates', icon: Megaphone },
    ],
  },
  student: {
    heading: 'Your learning journey starts here.', subtitle: 'Your student workspace is getting ready.',
    message: 'The full Student Dashboard will arrive in Checkpoint 6. For now, explore the role-based login and navigation.',
    items: [
      { name: 'My routine', detail: 'Weekly class schedule', icon: BookOpenText },
      { name: 'Attendance', detail: 'Your class history', icon: CalendarCheck2 },
      { name: 'My results', detail: 'Published exam results', icon: GraduationCap },
    ],
  },
};

export default function RoleDashboardPreview() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const config = dashboards[user.role];

  useEffect(() => { document.title = `${user.role === 'teacher' ? 'Teacher' : 'Student'} workspace · EduSphere`; }, [user.role]);
  function leave() { signOut(); navigate('/login', { replace: true }); }

  return (
    <div className="min-h-screen bg-[#F4F4F5] text-[#18181B]">
      <header className="border-b border-[#E4E4E7] bg-white/95 px-4 py-4 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-2.5"><span className="flex size-10 items-center justify-center rounded-xl bg-[#A3E635]"><School size={22}/></span><span className="text-lg font-extrabold tracking-[-0.5px]">Edu<span className="text-[#65A30D]">Sphere</span></span></div>
          <button type="button" onClick={leave} className="inline-flex items-center gap-2 rounded-xl border border-[#E4E4E7] px-3.5 py-2.5 text-xs font-bold hover:bg-zinc-50"><LogOut size={16}/> Sign out</button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-8 sm:pt-12">
        <div className="mb-6 flex items-center gap-3"><div className="flex size-11 items-center justify-center rounded-xl bg-[#18181B] text-xs font-bold text-[#A3E635]">{user.initials}</div><div><p className="text-sm font-bold">{user.name}</p><p className="mt-1 text-xs capitalize text-zinc-500">{user.role} • Demo account</p></div></div>
        <section className="relative overflow-hidden rounded-[26px] bg-[#18181B] p-7 text-white sm:p-12">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#A3E635]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#A3E635]"><Sparkles size={14}/> {user.role} workspace</span>
          <div className="pointer-events-none absolute -right-32 -top-28 size-[380px] rounded-full border-[74px] border-[#A3E635]/10"/>
          <h1 className="relative mt-6 max-w-2xl text-3xl font-extrabold leading-tight tracking-[-1px] sm:text-5xl">{config.heading}</h1>
          <p className="relative mt-4 max-w-xl text-sm leading-7 text-zinc-300">{config.subtitle}</p>
        </section>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {config.items.map(({name,detail,icon:Icon}) => <div key={name} className="rounded-2xl border border-[#E4E4E7] bg-white p-6"><span className="flex size-11 items-center justify-center rounded-xl bg-[#F7FEE7] text-[#4D7C0F]"><Icon size={20}/></span><p className="mt-5 text-sm font-extrabold">{name}</p><p className="mt-2 text-xs text-zinc-500">{detail}</p><div className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-[#65A30D]">Coming in later checkpoints <ArrowRight size={13}/></div></div>)}
        </div>
        <div className="mt-7 flex items-start gap-3 rounded-2xl border border-[#E4E4E7] bg-[#F7FEE7] p-5"><Sparkles size={19} className="mt-0.5 shrink-0 text-[#4D7C0F]"/><p className="text-sm leading-6 text-[#365314]">{config.message}</p></div>
      </main>
    </div>
  );
}
