import { useEffect, useMemo, useState } from 'react';
import { CalendarCheck2, CheckCheck, ChevronDown, ClipboardCheck, Clock3, Save, Search, UserRoundX, UsersRound } from 'lucide-react';
import { useAcademics } from '../context/AcademicsContext';
import { useStudents } from '../context/StudentsContext';
import { useOperations } from '../context/OperationsContext';
import { dateDisplay, DemoNotice, EmptyState, HeroBanner, MetricCard, PageHeading, Toast } from '../components/operations/OperationsUI';
import { todayISO } from '../data/seedOperations';
import { inputClass, primaryButton, secondaryButton } from '../components/shared/ModalShell';

const choices = [
  {value:'present',label:'Present',cls:'border-[#D5F3A0] bg-[#F7FEE7] text-[#4D7C0F]'},
  {value:'absent',label:'Absent',cls:'border-rose-100 bg-rose-50 text-rose-600'},
  {value:'late',label:'Late',cls:'border-amber-100 bg-amber-50 text-amber-700'},
  {value:'leave',label:'Leave',cls:'border-sky-100 bg-sky-50 text-sky-700'},
];
function StatusPicker({value,onChange}) {return <div className="flex flex-wrap gap-1.5">{choices.map(c=><button type="button" aria-pressed={value===c.value} key={c.value} onClick={()=>onChange(c.value)} className={`rounded-lg border px-2.5 py-2 text-[10px] font-bold transition ${value===c.value?c.cls+' ring-1 ring-current/10':'border-zinc-200 bg-white text-zinc-400 hover:border-zinc-400'}`}>{c.label}</button>)}</div>;}

export default function AttendancePage() {
  const {academics}=useAcademics();
  const {students}=useStudents();
  const {attendance,saveAttendance}=useOperations();
  const [className,setClassName]=useState(academics.classes[0]?.name||'1');
  const [section,setSection]=useState('A');
  const [date,setDate]=useState(todayISO());
  const [query,setQuery]=useState('');
  const [draft,setDraft]=useState({});
  const [toast,setToast]=useState('');
  const [tab,setTab]=useState('mark');
  const sections=academics.classes.find(c=>c.name===className)?.sections||[];
  useEffect(()=>{if(!sections.includes(section))setSection(sections[0]||'');},[className,section,academics.classes]);
  const roster=useMemo(()=>students.filter(s=>s.status==='Active'&&s.className===className&&s.section===section).sort((a,b)=>Number(a.roll)-Number(b.roll)),[students,className,section]);
  const saved=useMemo(()=>Object.fromEntries(attendance.filter(r=>r.date===date).map(r=>[r.studentId,r.status])),[attendance,date]);
  // Unsaved changes are scoped per day + class + section; switching roster never carries stale statuses.
  const scope=`${date}|${className}|${section}`;
  const values=Object.fromEntries(roster.map(s=>[s.id,(draft[scope]||{})[s.id] ?? saved[s.id] ?? '']));
  const count=value=>roster.filter(s=>values[s.id]===value).length;
  const marked=roster.filter(s=>values[s.id]).length;
  const dirty=roster.some(s=>((draft[scope]||{})[s.id]??saved[s.id]??'')!== (saved[s.id]??''));
  const listed=roster.filter(s=>`${s.id} ${s.name} ${s.roll}`.toLowerCase().includes(query.toLowerCase().trim()));
  const history=useMemo(()=>{
    return [...new Set(attendance.map(r=>r.date))].sort().reverse().slice(0,7).map(d=>{
      const rows=attendance.filter(r=>r.date===d&&roster.some(s=>s.id===r.studentId));
      return {date:d,rows, present:rows.filter(r=>r.status==='present').length, absent:rows.filter(r=>r.status==='absent').length, late:rows.filter(r=>r.status==='late').length};
    });
  },[attendance,roster]);
  function mark(id,status){setDraft(prev=>({...prev,[scope]:{...(prev[scope]||{}),[id]:status}}));}
  function bulkPresent(){setDraft(prev=>({...prev,[scope]:{...(prev[scope]||{}),...Object.fromEntries(roster.map(s=>[s.id,'present']))}}));}
  function save(){saveAttendance(date,roster.filter(s=>values[s.id]).map(s=>({studentId:s.id,status:values[s.id]})));setDraft(p=>({...p,[scope]:{}}));setToast('Attendance saved for '+dateDisplay(date));}
  useEffect(()=>{document.title='Attendance · EduSphere';},[]);
  return <div className="animate-enter space-y-6 pb-4 sm:space-y-7">
    <PageHeading eyebrow="DAILY OPERATIONS" title="Student attendance" subtitle="Keep every class on track with an effortless daily roll call." action={<button className={primaryButton} onClick={save} disabled={!roster.length||!marked}><Save size={17}/> Save attendance</button>}/>
    <HeroBanner label="Attendance workspace" title="Every school day" accent="counts." subtitle="Select a class, mark attendance and save your changes. Historical records remain available for quick review." badge="Academic session 2026"/>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><MetricCard dark label="Students in section" value={roster.length} caption={`Class ${className} · Section ${section}`} icon={UsersRound}/><MetricCard label="Present" value={count('present')} caption="Marked present today" icon={CheckCheck}/><MetricCard label="Absent" value={count('absent')} caption="Needs attendance follow-up" icon={UserRoundX}/><MetricCard label="Unmarked" value={roster.length-marked} caption="Pending review" icon={Clock3}/></div>
    <div className="rounded-[22px] border border-[#E4E4E7] bg-white">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-zinc-100 p-5 sm:p-6"><div><p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[#84CC16]">CLASS ATTENDANCE</p><h2 className="mt-1 text-lg font-extrabold">Attendance register</h2><p className="mt-1 text-[11px] text-zinc-400">Daily attendance for active students only.</p></div><div className="flex gap-2 rounded-xl bg-zinc-100 p-1">{[['mark','Mark attendance'],['history','History']].map(([id,label])=><button key={id} aria-pressed={tab===id} onClick={()=>setTab(id)} className={`rounded-lg px-3 py-2 text-[11px] font-bold ${tab===id?'bg-white text-zinc-900 shadow-sm':'text-zinc-500'}`}>{label}</button>)}</div></div>
      <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4"><div><label className="mb-1.5 block text-[11px] font-semibold text-zinc-500">Academic class</label><select className={inputClass} value={className} onChange={e=>setClassName(e.target.value)}>{academics.classes.map(c=><option key={c.id} value={c.name}>Class {c.name}</option>)}</select></div><div><label className="mb-1.5 block text-[11px] font-semibold text-zinc-500">Section</label><select className={inputClass} value={section} onChange={e=>setSection(e.target.value)}>{sections.map(s=><option key={s} value={s}>Section {s}</option>)}</select></div><div><label className="mb-1.5 block text-[11px] font-semibold text-zinc-500">Attendance date</label><input type="date" className={inputClass} value={date} onChange={e=>setDate(e.target.value)} /></div><div><label className="mb-1.5 block text-[11px] font-semibold text-zinc-500">Student search</label><label className="flex h-11 items-center gap-2 rounded-xl border border-zinc-200 px-3"><Search size={16} className="text-zinc-400"/><input aria-label="Search students in section" className="w-full min-w-0 bg-transparent text-xs outline-none" placeholder="Name, ID or roll" value={query} onChange={e=>setQuery(e.target.value)}/></label></div></div>
      <div className="mx-5 mb-4 sm:mx-6"><DemoNotice>Attendance is saved only in this browser tab for the UI demo. Go API + JSON storage will be connected later.</DemoNotice></div>
      {tab==='mark'?<>
        <div className="flex flex-wrap items-center justify-between gap-3 border-y border-zinc-100 bg-[#FAFAFA] px-5 py-3 sm:px-6"><p className="text-[12px] font-semibold text-zinc-700">{marked} of {roster.length} students marked {dirty&&<span className="ml-2 text-amber-600">• Unsaved changes</span>}</p><button onClick={bulkPresent} disabled={!roster.length} className={secondaryButton}><CheckCheck size={16}/> Mark all present</button></div>
        {listed.length?<div className="divide-y divide-zinc-100">{listed.map(s=><div key={s.id} className="flex flex-col gap-3 p-4 hover:bg-[#FCFDF8] sm:flex-row sm:items-center sm:justify-between sm:px-6"><div className="flex items-center gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#F1F5E9] text-[12px] font-extrabold text-[#4D7C0F]">{String(s.roll).padStart(2,'0')}</span><div><p className="text-[12px] font-bold text-zinc-900">{s.name}</p><p className="mt-1 text-[10px] text-zinc-400">{s.id} · Roll {s.roll}</p></div></div><StatusPicker value={values[s.id]} onChange={value=>mark(s.id,value)}/></div>)}</div>:<EmptyState title="No students in this section" description="Choose a different class or section, or add active students first."/>}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-b-[22px] border-t border-zinc-100 bg-[#FAFAFA] px-5 py-4 sm:px-6"><span className="text-[11px] text-zinc-500">{dirty?'You have unsaved changes.':'Save after marking attendance.'}</span><button onClick={save} disabled={!roster.length||!marked} className={primaryButton}><Save size={16}/> Save {marked} records</button></div>
      </>:<div className="px-5 pb-6 sm:px-6"><div className="overflow-hidden rounded-xl border border-zinc-100"><div className="grid grid-cols-4 bg-zinc-50 px-3 py-3 text-[10px] font-extrabold uppercase tracking-wide text-zinc-500 sm:px-5"><span>Date</span><span>Present</span><span>Absent</span><span>Late</span></div>{history.filter(d=>d.rows.length>0).length?history.filter(d=>d.rows.length>0).map(d=><div key={d.date} className="grid grid-cols-4 border-t border-zinc-100 px-3 py-3.5 text-[11px] sm:px-5"><span className="font-bold">{dateDisplay(d.date)}</span><span className="font-bold text-[#4D7C0F]">{d.present}</span><span className="font-bold text-rose-600">{d.absent}</span><span className="font-bold text-amber-600">{d.late}</span></div>):<EmptyState title="No saved history" description="Save attendance for this section to view it here."/>}</div></div>}
    </div><Toast message={toast} onDismiss={()=>setToast('')}/>
  </div>;
}
