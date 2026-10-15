import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  BookOpenText, CalendarDays,
  Check, ChevronDown, ChevronLeft, ChevronRight, CircleUserRound,
  GraduationCap, Info, Mail, Pencil, Phone, Plus,
  RotateCcw, Search, SlidersHorizontal, Trash2, UserCheck, UserRoundX,
  UsersRound, X,
} from 'lucide-react';
import StudentFormModal from '../components/students/StudentFormModal';
import { useStudents } from '../context/StudentsContext';
import { useAcademics } from '../context/AcademicsContext';

const PAGE_SIZE = 7;
const tones = ['bg-violet-100 text-violet-700', 'bg-orange-100 text-orange-700', 'bg-[#E9F8F0] text-emerald-700', 'bg-blue-100 text-blue-700', 'bg-rose-100 text-rose-700'];
const initialFilters = { query: '', className: '', section: '', status: '' };
const fieldClass = 'h-11 w-full rounded-xl border border-[#E4E4E7] bg-white px-3.5 text-[12px] font-medium text-[#18181B] outline-none transition focus:border-[#84CC16] focus:ring-4 focus:ring-[#A3E635]/10';

function getInitials(name) { return name.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]?.toUpperCase()).join('') || '?'; }
function avatarTone(id) { return tones[(Number(id?.split('-')[1]) || 0) % tones.length]; }
function StudentAvatar({ student, large = false }) {
  return <span className={`flex shrink-0 items-center justify-center rounded-[13px] font-extrabold ${avatarTone(student.id)} ${large ? 'size-16 text-lg' : 'size-10 text-[11px]'}`}>{getInitials(student.name)}</span>;
}
function StatusBadge({ status }) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${status === 'Active' ? 'bg-[#F0F9DC] text-[#4D7C0F]' : 'bg-zinc-100 text-zinc-500'}`}><span className={`size-1.5 rounded-full ${status === 'Active' ? 'bg-[#65A30D]' : 'bg-zinc-400'}`}/>{status}</span>;
}
function InfoLine({ icon: Icon, label, value }) {
  return <div className="flex items-start gap-3 rounded-xl border border-[#F0F0F1] p-3.5"><span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-zinc-50 text-zinc-500"><Icon size={17}/></span><div className="min-w-0"><p className="text-[11px] text-zinc-500">{label}</p><p className="mt-1 break-words text-[13px] font-semibold text-[#18181B]">{value || 'Not provided'}</p></div></div>;
}
function StudentDetail({ student, onClose, onEdit, onDelete }) {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function onKey(event) { if (event.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = previous; window.removeEventListener('keydown', onKey); };
  }, [onClose]);
  return createPortal(<div className="fixed inset-0 z-[90] flex justify-end bg-[#09090B]/55 backdrop-blur-[2px]" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
    <aside role="dialog" aria-modal="true" aria-label={`${student.name} student profile`} className="flex h-full w-full max-w-[480px] flex-col overflow-hidden bg-white shadow-2xl animate-enter">
      <div className="flex items-center justify-between border-b border-zinc-100 p-5 sm:px-7"><span className="text-[13px] font-bold">Student profile <span className="ml-2 text-[11px] font-normal text-zinc-400">/ {student.id}</span></span><button type="button" className="rounded-xl p-2 text-zinc-600 hover:bg-zinc-100" onClick={onClose} aria-label="Close details"><X size={19}/></button></div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="bg-[#18181B] p-7 text-white"><StudentAvatar student={student} large/><h2 className="mt-4 text-2xl font-extrabold tracking-tight">{student.name}</h2><p className="mt-1.5 text-xs text-zinc-400">{student.id} · Academic year 2026</p><div className="mt-4"><StatusBadge status={student.status}/></div></div>
        <div className="space-y-6 p-5 sm:p-7">
          <div><h3 className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.16em] text-zinc-400">Academic details</h3><div className="grid grid-cols-2 gap-3"><InfoLine icon={BookOpenText} label="Class / section" value={`Class ${student.className} · ${student.section}`}/><InfoLine icon={GraduationCap} label="Roll number" value={student.roll}/><InfoLine icon={CalendarDays} label="Admission date" value={student.admissionDate}/><InfoLine icon={CircleUserRound} label="Gender" value={student.gender}/></div></div>
          <div><h3 className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.16em] text-zinc-400">Contact information</h3><div className="grid gap-3"><InfoLine icon={Mail} label="Email" value={student.email}/><InfoLine icon={Phone} label="Phone" value={student.phone}/><InfoLine icon={CalendarDays} label="Date of birth" value={student.dateOfBirth}/></div></div>
          <div className="rounded-xl bg-[#F7FEE7] p-4 text-[12px] leading-5 text-[#3F6212]"><Info size={16} className="mr-2 inline"/>Demo profile only. Real enrollment history and login credentials will come from the Go backend later.</div>
        </div>
      </div>
      <div className="flex gap-3 border-t border-zinc-100 p-5 sm:px-7"><button type="button" onClick={onDelete} className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-[12px] font-bold text-red-600 hover:bg-red-50"><Trash2 size={16}/> Delete</button><button type="button" onClick={onEdit} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#18181B] px-4 py-3 text-[12px] font-bold text-white hover:bg-zinc-700"><Pencil size={16}/> Edit student</button></div>
    </aside>
  </div>, document.body);
}
function DeleteConfirmation({ student, onClose, onConfirm }) {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function onKey(event) { if (event.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = previous; window.removeEventListener('keydown', onKey); };
  }, [onClose]);
  return createPortal(<div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#09090B]/65 p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
    <section role="alertdialog" aria-modal="true" aria-label="Confirm student deletion" className="w-full max-w-[420px] rounded-[24px] bg-white p-6 shadow-2xl sm:p-7"><span className="flex size-12 items-center justify-center rounded-2xl bg-red-50 text-red-600"><Trash2 size={22}/></span><h2 className="mt-4 text-xl font-extrabold">Delete student?</h2><p className="mt-2 text-[13px] leading-6 text-zinc-500">This will remove <strong className="text-zinc-900">{student.name}</strong> ({student.id}) from your demo directory. This cannot be undone, except by resetting the sample data.</p><div className="mt-7 flex justify-end gap-3"><button type="button" onClick={onClose} className="rounded-xl border border-zinc-200 px-4 py-3 text-xs font-bold text-zinc-700 hover:bg-zinc-50">Cancel</button><button type="button" onClick={onConfirm} className="rounded-xl bg-red-600 px-4 py-3 text-xs font-bold text-white hover:bg-red-700">Yes, delete</button></div></section>
  </div>, document.body);
}
function MetricCard({ icon: Icon, label, value, helper, dark = false }) {
  return <div className={`rounded-[20px] border px-5 py-5 ${dark ? 'border-[#18181B] bg-[#18181B] text-white' : 'border-[#E4E4E7] bg-white text-[#18181B]'}`}><div className="flex items-start justify-between gap-3"><span className={`text-[12px] font-medium ${dark ? 'text-zinc-300' : 'text-zinc-500'}`}>{label}</span><span className={`flex size-10 items-center justify-center rounded-xl ${dark ? 'bg-[#A3E635] text-[#18181B]' : 'bg-[#F7FEE7] text-[#4D7C0F]'}`}><Icon size={19}/></span></div><p className="mt-1 text-[30px] font-extrabold tracking-[-1px]">{value}</p><p className={`mt-2 text-[11px] ${dark ? 'text-[#C1ED88]' : 'text-zinc-400'}`}>{helper}</p></div>;
}

export default function StudentsPage() {
  const { students, addStudent, editStudent, deleteStudent, resetStudents } = useStudents();
  const { academics } = useAcademics();
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null); // {type, id?}
  const [toast, setToast] = useState('');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const selected = modal?.id ? students.find((student) => student.id === modal.id) : null;

  const counts = useMemo(() => ({ total: students.length, active: students.filter((s) => s.status === 'Active').length, inactive: students.filter((s) => s.status === 'Inactive').length, sections: new Set(students.map((s) => `${s.className}-${s.section}`)).size }), [students]);
  const filtered = useMemo(() => students.filter((s) => {
    const haystack = `${s.name} ${s.id} ${s.roll} ${s.email} ${s.className}`.toLowerCase();
    return haystack.includes(filters.query.toLowerCase().trim()) && (!filters.className || filters.className === s.className) && (!filters.section || filters.section === s.section) && (!filters.status || filters.status === s.status);
  }), [students, filters]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const first = filtered.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const last = Math.min(currentPage * PAGE_SIZE, filtered.length);
  const hasFilters = Object.values(filters).some(Boolean);
  function changeFilter(field, value) { setFilters((current) => ({ ...current, [field]: value })); setPage(1); }
  function clearFilters() { setFilters(initialFilters); setPage(1); }
  function notify(message) { setToast(message); }
  function saveStudent(data) {
    if (modal.type === 'edit' && selected) { editStudent(selected.id, data); notify(`${data.name} updated successfully.`); }
    else { const record = addStudent(data); notify(`${record.name} added (${record.id}).`); }
    setModal(null); setPage(1);
  }
  function confirmDelete() { if (selected) { deleteStudent(selected.id); notify(`${selected.name} deleted from demo directory.`); } setModal(null); setPage(1); }
  useEffect(() => { document.title = 'Student management · EduSphere'; }, []);

  return <div className="animate-enter space-y-6 pb-4 sm:space-y-7">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><p className="text-[11px] font-extrabold uppercase tracking-[0.17em] text-[#65A30D]">ACADEMIC MANAGEMENT <span className="px-1 text-zinc-400">/</span> 2026</p><h1 className="mt-2 text-[27px] font-extrabold tracking-[-1.1px] sm:text-[35px]">Student directory<span className="text-[#84CC16]">.</span></h1><p className="mt-2 text-[13px] text-zinc-500">Keep student profiles and class details beautifully organized.</p></div>
      <button type="button" onClick={() => setModal({ type: 'add' })} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#18181B] px-5 py-3 text-[12px] font-bold text-white shadow-[0_9px_25px_rgba(24,24,27,0.10)] transition hover:bg-zinc-700"><Plus size={18}/> Add student</button>
    </div>

    <div className="relative isolate overflow-hidden rounded-[24px] bg-[#18181B] px-6 py-7 text-white sm:px-8 sm:py-8">
      <div className="pointer-events-none absolute -right-10 -top-24 -z-10 size-64 rounded-full border-[50px] border-[#A3E635]/15"/>
      <div className="pointer-events-none absolute bottom-[-120px] left-[40%] -z-10 size-56 rounded-full border-[38px] border-white/5"/>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><span className="inline-flex items-center gap-2 rounded-full border border-[#A3E635]/25 bg-[#A3E635]/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#C5F689]"><GraduationCap size={14}/> Student workspace</span><h2 className="mt-4 max-w-xl text-[22px] font-extrabold leading-[1.2] tracking-[-0.6px] sm:text-[28px]">Every learner, <span className="text-[#A3E635]">one clear view.</span></h2><p className="mt-2 max-w-lg text-[12px] leading-6 text-zinc-400">Search students, maintain profiles, and organize classes and sections—all from one simple workspace.</p></div><span className="flex shrink-0 items-center gap-2 self-start rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-[11px] font-semibold text-white"><span className="size-2 rounded-full bg-[#A3E635]"/> Demo records • 2026</span></div>
    </div>

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><MetricCard icon={UsersRound} label="Total students" value={counts.total} helper="In demo student directory" dark/><MetricCard icon={UserCheck} label="Active students" value={counts.active} helper="Currently marked active"/><MetricCard icon={UserRoundX} label="Inactive students" value={counts.inactive} helper="Inactive profiles"/><MetricCard icon={BookOpenText} label="Class sections" value={counts.sections} helper="With students in demo data"/></div>

    <section className="overflow-hidden rounded-[22px] border border-[#E4E4E7] bg-white shadow-[0_12px_30px_rgba(24,24,27,0.025)]">
      <div className="border-b border-[#F0F0F1] px-5 pb-4 pt-6 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#84CC16]">Directory</p><h2 className="mt-1 text-xl font-extrabold tracking-tight">All students <span className="ml-1 rounded-lg bg-[#F7FEE7] px-2 py-1 align-middle text-[10px] font-extrabold text-[#4D7C0F]">{students.length}</span></h2><p className="mt-1 text-[11px] text-zinc-500">All updates are stored temporarily in this browser tab.</p></div><button type="button" onClick={() => { resetStudents(); clearFilters(); setModal(null); notify('Sample student records restored.'); }} className="inline-flex items-center gap-2 rounded-xl border border-[#E4E4E7] px-3.5 py-2.5 text-[11px] font-semibold text-zinc-600 hover:bg-zinc-50" title="Restore original demo records"><RotateCcw size={15}/> Reset demo</button></div>
        <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="flex h-11 min-w-0 flex-1 items-center gap-2.5 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] px-3.5 focus-within:border-[#84CC16] focus-within:ring-4 focus-within:ring-[#A3E635]/10"><Search size={18} className="shrink-0 text-zinc-400"/><input type="search" className="min-w-0 flex-1 bg-transparent text-[12px] outline-none placeholder:text-zinc-400" placeholder="Search by name, student ID, roll..." aria-label="Search students" value={filters.query} onChange={(e) => changeFilter('query', e.target.value)}/></label>
          <button type="button" onClick={() => setShowFiltersMobile((v) => !v)} aria-expanded={showFiltersMobile} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E4E4E7] bg-white px-4 text-[12px] font-bold text-zinc-700 hover:bg-zinc-50 lg:hidden"><SlidersHorizontal size={16}/> Filters <ChevronDown size={16} className={showFiltersMobile ? 'rotate-180' : ''}/></button>
          <div className={`${showFiltersMobile ? 'grid' : 'hidden'} gap-3 sm:grid-cols-3 lg:flex lg:items-center`}>
            <select aria-label="Filter by class" className={fieldClass} value={filters.className} onChange={(e) => changeFilter('className', e.target.value)}><option value="">All classes</option>{academics.classes.map(c => <option key={c.id} value={c.name}>Class {c.name}</option>)}</select>
            <select aria-label="Filter by section" className={fieldClass} value={filters.section} onChange={(e) => changeFilter('section', e.target.value)}><option value="">All sections</option>{Array.from(new Set(academics.classes.flatMap(c=>c.sections))).sort().map(s=><option key={s} value={s}>Section {s}</option>)}</select>
            <select aria-label="Filter by status" className={fieldClass} value={filters.status} onChange={(e) => changeFilter('status', e.target.value)}><option value="">All status</option><option>Active</option><option>Inactive</option></select>
          </div>
        </div>
        {hasFilters && <button type="button" className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-[#4D7C0F] hover:underline" onClick={clearFilters}><X size={13}/> Clear filters</button>}
      </div>

      <div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[720px] border-collapse text-left"><thead><tr className="border-b border-[#F0F0F1] bg-[#FAFAFA] text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-400"><th className="py-4 pl-6 pr-3">Student</th><th className="px-3 py-4">Student ID</th><th className="px-3 py-4">Class / Section</th><th className="px-3 py-4">Roll</th><th className="px-3 py-4">Status</th><th className="py-4 pl-3 pr-6 text-right">Actions</th></tr></thead><tbody>
        {visible.map((student) => <tr key={student.id} className="border-b border-[#F4F4F5] last:border-0 transition-colors hover:bg-[#FCFDF9]"><td className="py-3.5 pl-6 pr-3"><button type="button" onClick={() => setModal({ type: 'details', id: student.id })} className="flex items-center gap-3 text-left"><StudentAvatar student={student}/><span><strong className="block text-[12px] font-bold text-zinc-900 hover:underline">{student.name}</strong><small className="mt-1 block text-[10px] text-zinc-400">Academic year 2026</small></span></button></td><td className="px-3 py-3.5 text-[11px] font-semibold text-zinc-500">{student.id}</td><td className="px-3 py-3.5 text-[12px] font-semibold text-zinc-700">Class {student.className} <span className="text-zinc-400">/</span> {student.section}</td><td className="px-3 py-3.5 text-[12px] text-zinc-600">{student.roll}</td><td className="px-3 py-3.5"><StatusBadge status={student.status}/></td><td className="py-3.5 pl-3 pr-6"><div className="flex items-center justify-end gap-1"><button type="button" aria-label={`View ${student.name}`} title="View student" onClick={() => setModal({ type: 'details', id: student.id })} className="rounded-lg p-2 text-zinc-500 hover:bg-[#F7FEE7] hover:text-[#4D7C0F]"><CircleUserRound size={17}/></button><button type="button" aria-label={`Edit ${student.name}`} title="Edit student" onClick={() => setModal({ type: 'edit', id: student.id })} className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"><Pencil size={17}/></button><button type="button" aria-label={`Delete ${student.name}`} title="Delete student" onClick={() => setModal({ type: 'delete', id: student.id })} className="rounded-lg p-2 text-zinc-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={17}/></button></div></td></tr>)}
        {visible.length === 0 && <tr><td colSpan={6}><div className="py-16 text-center"><Search size={28} className="mx-auto text-zinc-300"/><p className="mt-3 text-sm font-bold text-zinc-800">No matching students</p><p className="mt-1 text-xs text-zinc-500">Try a different search or clear your filters.</p><button onClick={clearFilters} type="button" className="mt-4 text-xs font-bold text-[#4D7C0F] hover:underline">Clear filters</button></div></td></tr>}
      </tbody></table></div>

      <div className="divide-y divide-[#F1F1F2] md:hidden">{visible.map((student) => <div key={student.id} className="p-4 sm:px-6"><div className="flex items-start gap-3"><StudentAvatar student={student}/><div className="min-w-0 flex-1"><p className="truncate text-[13px] font-bold">{student.name}</p><p className="mt-1 text-[11px] text-zinc-500">{student.id}</p></div><StatusBadge status={student.status}/></div><div className="mt-4 flex items-center justify-between rounded-xl bg-[#FAFAFA] px-3 py-3 text-[11px]"><span className="font-medium text-zinc-600">Class {student.className} / Section {student.section}</span><span className="font-semibold text-zinc-500">Roll {student.roll}</span></div><div className="mt-3 flex items-center gap-2"><button type="button" onClick={() => setModal({ type: 'details', id: student.id })} className="flex-1 rounded-lg bg-[#F7FEE7] px-3 py-2.5 text-[11px] font-bold text-[#3F6212]">View details</button><button type="button" onClick={() => setModal({ type: 'edit', id: student.id })} className="flex items-center justify-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2.5 text-[11px] font-bold text-zinc-700"><Pencil size={13}/> Edit</button><button type="button" aria-label={`Delete ${student.name}`} onClick={() => setModal({ type: 'delete', id: student.id })} className="rounded-lg border border-zinc-200 p-2.5 text-red-600"><Trash2 size={14}/></button></div></div>)}
        {visible.length === 0 && <div className="py-14 text-center"><Search size={28} className="mx-auto text-zinc-300"/><p className="mt-3 text-sm font-bold">No matching students</p><button onClick={clearFilters} type="button" className="mt-3 text-xs font-bold text-[#4D7C0F]">Clear filters</button></div>}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#F0F0F1] px-5 py-4 sm:px-6"><p className="text-[11px] text-zinc-500">Showing <strong className="text-zinc-900">{first}–{last}</strong> of <strong className="text-zinc-900">{filtered.length}</strong> students</p><div className="flex items-center gap-2"><button type="button" aria-label="Previous page" onClick={() => setPage(Math.max(1, currentPage - 1))} disabled={currentPage <= 1} className="rounded-lg border border-[#E4E4E7] p-2 text-zinc-600 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-30"><ChevronLeft size={17}/></button><span className="min-w-16 text-center text-[11px] font-semibold text-zinc-600">{currentPage} / {totalPages}</span><button type="button" aria-label="Next page" onClick={() => setPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage >= totalPages} className="rounded-lg border border-[#E4E4E7] p-2 text-zinc-600 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-30"><ChevronRight size={17}/></button></div></div>
    </section>

    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E4E4E7] bg-[#FAF9F5] px-5 py-4"><div className="flex items-center gap-3"><span className="rounded-xl bg-[#F7FEE7] p-2.5 text-[#4D7C0F]"><Info size={18}/></span><div><p className="text-[12px] font-bold">Frontend demo mode</p><p className="mt-1 text-[11px] leading-5 text-zinc-500">No Go API or JSON files are modified in this checkpoint. Demo changes last within this browser tab.</p></div></div><span className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[10px] font-bold text-zinc-500">Checkpoint 03</span></div>
    {toast && <div role="status" aria-live="polite" className="fixed bottom-5 right-4 z-[90] flex max-w-[calc(100vw-32px)] items-center gap-3 rounded-2xl border border-[#D9F99D] bg-white px-4 py-3 shadow-[0_20px_60px_rgba(0,0,0,0.15)] sm:right-7"><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#F7FEE7] text-[#4D7C0F]"><Check size={18}/></span><p className="text-[12px] font-semibold text-zinc-800">{toast}</p><button type="button" className="ml-2 text-zinc-500" aria-label="Dismiss notification" onClick={() => setToast('')}><X size={16}/></button></div>}
    {modal?.type === 'add' && <StudentFormModal mode="add" students={students} onClose={() => setModal(null)} onSave={saveStudent}/>}
    {modal?.type === 'edit' && selected && <StudentFormModal mode="edit" student={selected} students={students} onClose={() => setModal(null)} onSave={saveStudent}/>}
    {modal?.type === 'details' && selected && <StudentDetail student={selected} onClose={() => setModal(null)} onEdit={() => setModal({ type: 'edit', id: selected.id })} onDelete={() => setModal({ type: 'delete', id: selected.id })}/>}
    {modal?.type === 'delete' && selected && <DeleteConfirmation student={selected} onClose={() => setModal(null)} onConfirm={confirmDelete}/>}
  </div>;
}
