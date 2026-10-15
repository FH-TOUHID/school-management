import {
  ArrowDownRight, ArrowRight, ArrowUpRight, CalendarCheck2,
  ChevronRight, GraduationCap, Layers3, Megaphone,
  Plus, Search, Sparkles, UsersRound,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AttendanceChart from '../components/AttendanceChart';
import { notices, statistics, todaySchedule } from '../data/mockData';
import { useStudents } from '../context/StudentsContext';

const statIcons = { students: GraduationCap, teachers: UsersRound, attendance: CalendarCheck2, classes: Layers3 };
const avatarTones = {
  lilac: 'bg-violet-100 text-violet-700',
  peach: 'bg-orange-100 text-orange-700',
  mint: 'bg-emerald-100 text-emerald-700',
  blue: 'bg-blue-100 text-blue-700',
  rose: 'bg-rose-100 text-rose-700',
};

function SectionHeading({ eyebrow, title, action, to }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && <p className="text-[10px] font-bold uppercase tracking-[0.19em] text-[#84CC16]">{eyebrow}</p>}
        <h2 className="mt-1 text-lg font-extrabold tracking-[-0.4px] text-[#18181B] sm:text-xl">{title}</h2>
      </div>
      {action && <Link to={to} className="inline-flex items-center gap-1.5 rounded-lg text-xs font-bold text-[#4D7C0F] hover:underline">{action}<ArrowRight size={14}/></Link>}
    </div>
  );
}

function SummaryCard({ item, index }) {
  const Icon = statIcons[item.icon];
  return (
    <div className={`group rounded-[20px] border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5 sm:p-5 ${index === 0 ? 'border-[#18181B] bg-[#18181B] text-white' : 'border-[#E4E4E7] bg-white text-[#18181B]'}`}>
      <div className="flex items-start justify-between gap-3">
        <span className={`text-xs font-semibold ${index === 0 ? 'text-zinc-300' : 'text-zinc-500'}`}>{item.label}</span>
        <span className={`flex size-10 items-center justify-center rounded-xl ${index === 0 ? 'bg-[#A3E635] text-[#18181B]' : 'bg-[#F7FEE7] text-[#4D7C0F]'}`}><Icon size={20} strokeWidth={1.8}/></span>
      </div>
      <div className="mt-2 text-[32px] font-extrabold tracking-[-1.3px] sm:text-[34px]">{item.value}</div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
        <span className={`inline-flex items-center gap-0.5 rounded-md px-2 py-1 font-extrabold ${index === 0 ? 'bg-[#A3E635] text-[#18181B]' : 'bg-[#F7FEE7] text-[#4D7C0F]'}`}>
          {item.change.startsWith('+') ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12}/>} {item.change}
        </span>
        <span className={index === 0 ? 'text-zinc-400' : 'text-zinc-500'}>{item.detail}</span>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { students } = useStudents();
  const recentStudents = useMemo(() => students.slice(0, 7).map((student) => ({ ...student, className: `Class ${student.className}`, initials: student.name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase(), tone: 'mint' })), [students]);
  const dashboardStatistics = useMemo(() => statistics.map((item) => item.icon === 'students' ? { ...item, value: String(students.length), change: 'Demo', detail: 'profiles in browser' } : item), [students]);
  const [query, setQuery] = useState('');
  const [showAllStudents, setShowAllStudents] = useState(false);
  const filteredStudents = useMemo(() => recentStudents.filter((student) =>
    `${student.name} ${student.id} ${student.className} ${student.section}`.toLowerCase().includes(query.toLowerCase().trim())
  ), [query]);
  const visibleStudents = showAllStudents ? filteredStudents : filteredStudents.slice(0, 4);

  return (
    <div className="space-y-6 sm:space-y-7 animate-enter">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#84CC16]">ADMIN WORKSPACE <span className="mx-1 text-zinc-400">·</span> 2026</p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-[-0.9px] text-[#18181B] sm:text-[32px]">Good to see you, Admin <span role="img" aria-label="waving hand">👋</span></h1>
          <p className="mt-2 text-sm text-zinc-500">Here’s what’s happening around your school today.</p>
        </div>
        <Link to="/admin/students" className="inline-flex items-center gap-2 rounded-xl bg-[#18181B] px-4 py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#313136] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-500">
          <Plus size={17} /> Students workspace
        </Link>
      </div>

      <section className="relative isolate overflow-hidden rounded-[24px] bg-[#18181B] px-6 py-7 text-white sm:px-8 sm:py-8 xl:px-10" aria-label="Welcome message">
        <div className="pointer-events-none absolute -right-10 -top-28 -z-10 size-72 rounded-full border-[42px] border-[#A3E635]/20 sm:right-16" />
        <div className="pointer-events-none absolute -bottom-44 right-[10%] -z-10 size-80 rounded-full border-[52px] border-white/5" />
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#A3E635]/30 bg-[#A3E635]/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#C8F58B]"><Sparkles size={13}/> Every school day matters</span>
        <h2 className="mt-4 max-w-[530px] text-2xl font-extrabold leading-[1.2] tracking-[-0.7px] sm:text-[30px]">One place for a <span className="text-[#A3E635]">smarter school day.</span></h2>
        <p className="mt-3 max-w-[480px] text-[13px] leading-6 text-zinc-300">Stay close to student progress, teachers, attendance and everyday academic activities—all in one simple workspace.</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link to="/admin/academics" className="inline-flex items-center gap-2 rounded-xl bg-[#A3E635] px-4 py-3 text-xs font-extrabold text-[#18181B] transition hover:bg-[#BEF264]">Explore academics <ArrowRight size={16}/></Link>
          <span className="text-[11px] text-zinc-400">Academic year 2026</span>
        </div>
      </section>

      <div>
        <SectionHeading eyebrow="At a glance" title="School overview" />
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {dashboardStatistics.map((item, index) => <SummaryCard key={item.label} item={item} index={index}/>)}
        </div>
        <p className="mt-2.5 text-[11px] text-zinc-400">All figures on this dashboard are sample data for UI preview.</p>
      </div>

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,1fr)]">
        <AttendanceChart />
        <section className="rounded-[22px] border border-[#E4E4E7] bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">Academic activities</p>
              <h2 className="mt-1.5 text-lg font-extrabold tracking-[-0.4px]">Class schedule</h2>
            </div>
            <span className="rounded-xl bg-[#F7FEE7] p-2.5 text-[#4D7C0F]"><CalendarCheck2 size={19}/></span>
          </div>
          <p className="mt-2 text-xs text-zinc-500">A preview of the school timetable.</p>
          <div className="mt-5 space-y-3">
            {todaySchedule.map((slot) => (
              <div className="flex items-center gap-3 rounded-xl border border-[#F1F1F2] px-3 py-3.5" key={slot.time}>
                <span className="w-[48px] shrink-0 text-center text-[12px] font-extrabold text-zinc-800">{slot.time}</span>
                <span className="h-10 w-1 shrink-0 rounded-full" style={{backgroundColor:slot.accent}} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-bold text-zinc-900">{slot.title}</p>
                  <p className="mt-1 text-[11px] text-zinc-500">{slot.meta}</p>
                </div>
                <span className="hidden text-[10px] font-medium text-zinc-400 sm:block">{slot.period}</span>
              </div>
            ))}
          </div>
          <Link to="/admin/routine" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#4D7C0F] hover:underline">View class routines <ArrowRight size={14}/></Link>
        </section>
      </div>

      <div className="grid grid-cols-1 items-start gap-5 2xl:grid-cols-[minmax(0,1.6fr)_minmax(340px,1fr)]">
        <section className="min-w-0 overflow-hidden rounded-[22px] border border-[#E4E4E7] bg-white">
          <div className="flex flex-wrap items-start justify-between gap-4 px-5 pb-4 pt-5 sm:px-6 sm:pt-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">Students</p>
              <h2 className="mt-1 text-lg font-extrabold tracking-[-0.4px]">Recently enrolled</h2>
            </div>
            <label className="flex h-9 w-full items-center gap-2 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] px-3 text-zinc-500 focus-within:border-[#84CC16] sm:w-[195px]">
              <Search size={15} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search sample students" aria-label="Search sample students" className="min-w-0 flex-1 bg-transparent text-[11px] text-zinc-900 outline-none placeholder:text-zinc-400"/>
            </label>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[600px] w-full border-collapse text-left">
              <thead className="border-y border-[#F0F0F1] bg-[#FAFAFA] text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-400">
                <tr><th className="py-3 pl-6 pr-3">Student</th><th className="px-3 py-3">Class / Section</th><th className="px-3 py-3">Roll</th><th className="px-3 py-3">Status</th><th className="py-3 pl-3 pr-6 text-right">ID</th></tr>
              </thead>
              <tbody>
                {visibleStudents.map((student) => (
                  <tr key={student.id} className="border-b border-[#F1F1F2] last:border-0 hover:bg-[#FCFCFC]">
                    <td className="py-3.5 pl-6 pr-3"><div className="flex items-center gap-3"><div className={`flex size-9 shrink-0 items-center justify-center rounded-xl text-[10px] font-extrabold ${avatarTones[student.tone]}`}>{student.initials}</div><div><p className="whitespace-nowrap text-xs font-bold text-zinc-900">{student.name}</p><p className="mt-1 text-[10px] text-zinc-400">Student</p></div></div></td>
                    <td className="px-3 py-3.5 text-xs font-medium text-zinc-700">{student.className} <span className="text-zinc-400">·</span> {student.section}</td>
                    <td className="px-3 py-3.5 text-xs text-zinc-600">{student.roll}</td>
                    <td className="px-3 py-3.5"><span className="rounded-full bg-[#F7FEE7] px-2.5 py-1 text-[10px] font-bold text-[#4D7C0F]">{student.status}</span></td>
                    <td className="py-3.5 pl-3 pr-6 text-right text-[11px] font-medium text-zinc-400">{student.id}</td>
                  </tr>
                ))}
                {visibleStudents.length === 0 && <tr><td colSpan={5} className="px-6 py-10 text-center text-sm text-zinc-500">No matching sample students.</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-[#F1F1F2] px-5 py-3.5 sm:px-6">
            <span className="text-[11px] text-zinc-500">Showing {visibleStudents.length} of {filteredStudents.length} sample students</span>
            <button type="button" onClick={() => setShowAllStudents((v) => !v)} className="inline-flex items-center gap-1 text-[11px] font-bold text-[#4D7C0F] hover:underline">{showAllStudents ? 'Show less' : 'Show all'} <ChevronRight size={14}/></button>
          </div>
        </section>

        <section className="rounded-[22px] border border-[#E4E4E7] bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">Announcements</p>
              <h2 className="mt-1 text-lg font-extrabold tracking-[-0.4px]">School notices</h2>
            </div>
            <span className="rounded-xl bg-[#F7FEE7] p-2.5 text-[#4D7C0F]"><Megaphone size={19}/></span>
          </div>
          <div className="mt-5 space-y-4">
            {notices.map((notice) => (
              <div className="flex gap-3.5" key={notice.title}>
                <div className="flex h-[58px] w-[52px] shrink-0 flex-col items-center justify-center rounded-xl bg-[#F4F4F5]">
                  <span className="text-lg font-extrabold leading-none">{notice.day}</span>
                  <span className="mt-1 text-[9px] font-bold tracking-[0.13em] text-zinc-500">{notice.month}</span>
                </div>
                <div className="min-w-0 flex-1 border-b border-[#F1F1F2] pb-4 last:border-0">
                  <span className="text-[10px] font-bold uppercase tracking-[0.09em] text-[#65A30D]">{notice.category}</span>
                  <p className="mt-1 text-[12px] font-bold leading-5 text-zinc-900">{notice.title}</p>
                  <p className="mt-1 text-[11px] text-zinc-500">{notice.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
          <Link to="/admin/notices" className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-[#4D7C0F] hover:underline">Open notice board <ArrowRight size={14}/></Link>
        </section>
      </div>
      <div className="pb-1 text-center text-[11px] text-zinc-400">EduSphere • University project preview • UI checkpoint 3</div>
    </div>
  );
}
