import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Clock3, Pencil, Plus, RotateCcw, Trash2, UsersRound } from 'lucide-react';
import { useAcademics } from '../context/AcademicsContext';
import { useTeachers } from '../context/TeachersContext';
import { useOperations } from '../context/OperationsContext';
import { days, DemoNotice, EmptyState, HeroBanner, MetricCard, PageHeading, periods, Toast } from '../components/operations/OperationsUI';
import ModalShell, { Field, inputClass, primaryButton, secondaryButton } from '../components/shared/ModalShell';

const empty = { weekday:0,period:1,subjectId:'',teacherId:'',room:'' };
export default function RoutinePage() {
  const {academics}=useAcademics();
  const {teachers}=useTeachers();
  const {routine,saveRoutine,deleteRoutine,resetOperations}=useOperations();
  const [className,setClassName]=useState('10');
  const [section,setSection]=useState('A');
  const [weekday,setWeekday]=useState(1);
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState(empty);
  const [error,setError]=useState('');
  const [toast,setToast]=useState('');
  const sections=academics.classes.find(c=>c.name===className)?.sections||[];
  useEffect(()=>{if(!sections.includes(section))setSection(sections[0]||'');},[sections.join('|'),section]);
  const offeredIds=academics.classSubjects[className]||[];
  const subjects=academics.subjects.filter(s=>offeredIds.includes(s.id));
  const availableTeachers=teachers.filter(t=>t.status==='Active');
  const display=useMemo(()=>routine.filter(r=>r.className===className&&r.section===section),[routine,className,section]);
  const visible=display.filter(r=>r.weekday===weekday).sort((a,b)=>a.period-b.period);
  function subjectName(id){return academics.subjects.find(s=>s.id===id)?.name||'Subject unavailable';}
  function teacherName(id){return teachers.find(t=>t.id===id)?.name||'Teacher unavailable';}
  function open(entry) {setForm(entry?{...entry}:{...empty,weekday,period:1,subjectId:subjects[0]?.id||'',teacherId:'',room:''});setError('');setModal(entry?'edit':'add');}
  function save(e) {
    e.preventDefault();setError('');
    if(!form.subjectId||!form.teacherId){setError('Choose both a subject and an active teacher.');return;}
    if(!offeredIds.includes(form.subjectId)){setError('Selected subject is not mapped to this class.');return;}
    const dup=routine.find(r=>r.className===className&&r.section===section&&Number(r.weekday)===Number(form.weekday)&&Number(r.period)===Number(form.period)&&r.id!==form.id);
    if(dup){setError('This section already has a class in that slot.');return;}
    const busy=routine.find(r=>r.teacherId===form.teacherId&&Number(r.weekday)===Number(form.weekday)&&Number(r.period)===Number(form.period)&&r.id!==form.id);
    if(busy){setError('This teacher is already assigned to another class during that period.');return;}
    saveRoutine({...form,weekday:Number(form.weekday),period:Number(form.period),className,section});setModal(null);setToast('Class routine updated.');
  }
  useEffect(()=>{document.title='Class routine · EduSphere';},[]);
  return <div className="animate-enter space-y-6 pb-4 sm:space-y-7">
    <PageHeading eyebrow="CLASS PLANNING" title="Class routine" subtitle="A balanced week starts with a beautifully organized timetable." action={<button className={primaryButton} onClick={()=>open()}><Plus size={17}/> Add period</button>}/>
    <HeroBanner label="Timetable studio" title="Make every" accent="period count." subtitle="Assign subjects, select teachers and organize your weekly learning schedule without overlapping class periods." badge="Sunday to Thursday · 5 demo periods"/>
    <div className="grid gap-3 sm:grid-cols-3"><MetricCard dark icon={CalendarDays} label="Scheduled periods" value={display.length} caption={`Class ${className} · Section ${section}`}/><MetricCard icon={Clock3} label="Learning days" value={days.filter(d=>display.some(r=>r.weekday===d.n)).length} caption="Days containing scheduled periods"/><MetricCard icon={UsersRound} label="Assigned teachers" value={new Set(display.map(r=>r.teacherId)).size} caption="Unique teacher assignments"/></div>
    <section className="overflow-hidden rounded-[22px] border border-[#E4E4E7] bg-white">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-zinc-100 p-5 sm:p-6"><div><p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[#84CC16]">WEEKLY PLANNER</p><h2 className="mt-1 text-lg font-extrabold">Your timetable</h2><p className="mt-1 text-[11px] text-zinc-400">Change class and section to view the schedule.</p></div><div className="flex flex-wrap gap-2"><select aria-label="Select class" className={`${inputClass} min-w-28`} value={className} onChange={e=>setClassName(e.target.value)}>{academics.classes.map(c=><option value={c.name} key={c.id}>Class {c.name}</option>)}</select><select aria-label="Select section" className={`${inputClass} min-w-28`} value={section} onChange={e=>setSection(e.target.value)}>{sections.map(s=><option key={s} value={s}>Section {s}</option>)}</select></div></div>
      <div className="px-5 pt-5 sm:px-6"><DemoNotice>Routine entries are demo-only. A teacher cannot be booked into two sections for the same weekday and period.</DemoNotice></div>
      <div className="flex gap-2 overflow-x-auto px-5 pb-3 pt-5 sm:px-6">{days.map(d=><button key={d.n} onClick={()=>setWeekday(d.n)} className={`min-w-[74px] rounded-xl border px-4 py-2.5 text-xs font-bold transition ${weekday===d.n?'border-[#A3E635] bg-[#A3E635] text-zinc-900':'border-zinc-200 bg-white text-zinc-500 hover:border-lime-400'}`}>{d.label}</button>)}</div>
      <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-3">{periods.map(p=>{
        const entry=visible.find(r=>r.period===p.id);
        return <div key={p.id} className={`flex min-h-44 flex-col rounded-[20px] border p-4 ${entry?'border-zinc-200 bg-[#FAFAF8]':'border-dashed border-zinc-200 bg-white'}`}>
          <div className="flex items-center justify-between gap-2"><span className="text-[10px] font-extrabold uppercase tracking-[.13em] text-zinc-400">{p.label}</span><span className="text-[10px] font-semibold text-zinc-400">{p.time}</span></div>
          {entry?<><h3 className="mt-4 text-[15px] font-extrabold text-zinc-900">{subjectName(entry.subjectId)}</h3><p className="mt-1 text-[11px] text-zinc-500">{teacherName(entry.teacherId)}</p><div className="mt-auto flex items-center justify-between pt-5"><span className="rounded-lg bg-[#F0F9DC] px-2.5 py-1.5 text-[10px] font-bold text-[#4D7C0F]">Room {entry.room||'TBA'}</span><div className="flex gap-1"><button title="Edit period" aria-label="Edit period" onClick={()=>open(entry)} className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-200"><Pencil size={15}/></button><button title="Delete period" aria-label="Delete period" onClick={()=>setModal({type:'delete',entry})} className="rounded-lg p-2 text-rose-500 hover:bg-rose-50"><Trash2 size={15}/></button></div></div></>:<><p className="mt-5 text-[13px] font-semibold text-zinc-400">Available slot</p><button className="mt-auto flex items-center gap-1.5 pt-4 text-[11px] font-bold text-[#65A30D]" onClick={()=>{open();setForm(f=>({...f,period:p.id}));}}><Plus size={15}/> Schedule a class</button></>}
        </div>;
      })}</div>
    </section>
    {['add','edit'].includes(modal)&&<ModalShell title={modal==='edit'?'Edit class period':'Schedule a class'} description={`Class ${className} · Section ${section}`} icon={CalendarDays} onClose={()=>setModal(null)} footer={<><button type="button" className={secondaryButton} onClick={()=>setModal(null)}>Cancel</button><button form="routine-form" className={primaryButton} type="submit">Save period</button></>}><form id="routine-form" onSubmit={save} className="space-y-5"><div className="grid gap-4 sm:grid-cols-2"><Field label="Day" required><select className={inputClass} value={form.weekday} onChange={e=>setForm(f=>({...f,weekday:Number(e.target.value)}))}>{days.map(d=><option key={d.n} value={d.n}>{d.label}</option>)}</select></Field><Field label="Period" required><select className={inputClass} value={form.period} onChange={e=>setForm(f=>({...f,period:Number(e.target.value)}))}>{periods.map(p=><option key={p.id} value={p.id}>{p.label} · {p.time}</option>)}</select></Field><Field label="Subject" required><select className={inputClass} value={form.subjectId} onChange={e=>setForm(f=>({...f,subjectId:e.target.value}))}><option value="">Choose subject</option>{subjects.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></Field><Field label="Teacher" required><select className={inputClass} value={form.teacherId} onChange={e=>setForm(f=>({...f,teacherId:e.target.value}))}><option value="">Choose teacher</option>{availableTeachers.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></Field></div><Field label="Classroom"><input className={inputClass} maxLength={20} placeholder="e.g. 201" value={form.room} onChange={e=>setForm(f=>({...f,room:e.target.value}))}/></Field>{error&&<p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-[12px] font-semibold text-red-600">{error}</p>}</form></ModalShell>}
    {modal?.type==='delete'&&<ModalShell title="Remove this period?" description="This will free the selected timetable slot." icon={Trash2} width="max-w-[460px]" onClose={()=>setModal(null)} footer={<><button className={secondaryButton} onClick={()=>setModal(null)}>Cancel</button><button className="rounded-xl bg-rose-600 px-5 py-3 text-[12px] font-bold text-white" onClick={()=>{deleteRoutine(modal.entry.id);setModal(null);setToast('Period removed.');}}>Delete period</button></>}><p className="text-[13px] text-zinc-600">Remove {subjectName(modal.entry.subjectId)} from this timetable?</p></ModalShell>}
    <Toast message={toast} onDismiss={()=>setToast('')}/>
  </div>;
}
