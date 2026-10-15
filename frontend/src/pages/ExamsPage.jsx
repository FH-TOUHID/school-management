import { useEffect, useMemo, useState } from 'react';
import { Award, BookCheck, BookOpenText, CheckCircle2, ClipboardList, Eye, FileCheck2, LockKeyhole, Plus, RotateCcw, Save, Trash2, UnlockKeyhole } from 'lucide-react';
import { useAcademics } from '../context/AcademicsContext';
import { useStudents } from '../context/StudentsContext';
import { useOperations } from '../context/OperationsContext';
import { dateDisplay, DemoNotice, EmptyState, HeroBanner, MetricCard, PageHeading, Toast } from '../components/operations/OperationsUI';
import ModalShell, { Field, inputClass, primaryButton, secondaryButton } from '../components/shared/ModalShell';

// Illustrative GPA scale for this demo only. Configure to the school's actual rules later.
export function demoGrade(mark) {
  if (mark>=80) return {letter:'A+',point:5};
  if (mark>=70) return {letter:'A',point:4};
  if (mark>=60) return {letter:'A-',point:3.5};
  if (mark>=50) return {letter:'B',point:3};
  if (mark>=40) return {letter:'C',point:2};
  if (mark>=33) return {letter:'D',point:1};
  return {letter:'F',point:0};
}
const initialExam = {name:'',className:'',section:'',academicYear:'2026'};
export default function ExamsPage() {
  const {academics}=useAcademics();
  const {students}=useStudents();
  const {exams,marks,saveMarks,addExam,deleteExam,publishExam}=useOperations();
  const [examId,setExamId]=useState('EX-01');
  const [activeTab,setActiveTab]=useState('marks');
  const [subjectId,setSubjectId]=useState('');
  const [draft,setDraft]=useState({});
  const [modal,setModal]=useState(null);
  const [examForm,setExamForm]=useState(initialExam);
  const [error,setError]=useState('');
  const [toast,setToast]=useState('');
  const selected=exams.find(e=>e.id===examId)||exams[0];
  const roster=useMemo(()=>selected?students.filter(s=>s.className===selected.className&&s.section===selected.section&&s.status==='Active').sort((a,b)=>Number(a.roll)-Number(b.roll)):[],[students,selected]);
  const subjects=useMemo(()=>selected?academics.subjects.filter(s=>(academics.classSubjects[selected.className]||[]).includes(s.id)):[],[selected,academics]);
  const currentSubject=subjects.find(s=>s.id===subjectId)||subjects[0];
  const scope=`${selected?.id||''}|${currentSubject?.id||''}`;
  const key=(studentId,subId)=>`${selected.id}|${studentId}|${subId}`;
  const markFor=(studentId,subId)=>marks[key(studentId,subId)]??'';
  const markInput=(studentId)=>draft[scope]?.[studentId]??markFor(studentId,currentSubject?.id);
  const filled=selected?roster.reduce((sum,s)=>sum+subjects.filter(sub=>markFor(s.id,sub.id)!=='').length,0):0;
  const total=roster.length*subjects.length;
  const complete=total>0&&filled===total;
  const modified=roster.some(s=>draft[scope]?.[s.id]!==undefined&&draft[scope][s.id]!==markFor(s.id,currentSubject?.id));
  const results=useMemo(()=>roster.map(s=>{
    const vals=subjects.map(sub=>marks[`${selected.id}|${s.id}|${sub.id}`]);
    const valid=vals.length>0&&vals.every(v=>v!==undefined&&v!==''&&Number.isFinite(Number(v)));
    const gradepoints=vals.map(v=>demoGrade(Number(v)));
    const failed=valid&&gradepoints.some(g=>g.point===0);
    const gpa=valid ? failed ? 0 : gradepoints.reduce((n,g)=>n+g.point,0)/vals.length : null;
    return {student:s,valid,total:valid?vals.reduce((n,v)=>n+Number(v),0):null,gpa,letter:valid?(failed?'F':gpa>=5?'A+':gpa>=4?'A':gpa>=3.5?'A-':gpa>=3?'B':gpa>=2?'C':'D'):'—'};
  }),[roster,subjects,marks,selected]);
  const classOptions=academics.classes;
  const sections=academics.classes.find(c=>c.name===examForm.className)?.sections||[];
  function chooseExam(id) {setExamId(id);setDraft({});setSubjectId('');setActiveTab('marks');}
  function setInput(studentId,raw) {
    if(raw!==''&&(!/^\d{1,3}$/.test(raw)||Number(raw)>100))return;
    setDraft(p=>({...p,[scope]:{...(p[scope]||{}),[studentId]:raw}}));
  }
  function saveCurrentMarks() {
    if(!selected||selected.published||!currentSubject)return;
    const updates=Object.fromEntries(roster.filter(s=>draft[scope]?.[s.id]!==undefined).map(s=>[`${s.id}|${currentSubject.id}`,draft[scope][s.id]]));
    saveMarks(selected.id,updates);setDraft(p=>({...p,[scope]:{}}));setToast(`Marks saved for ${currentSubject.name}.`);
  }
  function createExam(e) {
    e.preventDefault();setError('');
    const name=examForm.name.trim();
    if(!name||!examForm.className||!examForm.section){setError('Please complete all required fields.');return;}
    if(exams.some(x=>x.name.toLowerCase()===name.toLowerCase()&&x.className===examForm.className&&x.section===examForm.section)){setError('This exam already exists for the selected class and section.');return;}
    if(!(academics.classSubjects[examForm.className]||[]).length){setError('Map subjects to this class before creating an exam.');return;}
    const id=addExam({...examForm,name});setModal(null);chooseExam(id);setToast('Exam created as draft.');
  }
  function togglePublication() {
    if(selected.published){publishExam(selected.id,false);setToast('Results unpublished. Marks can now be edited.');setModal(null);return;}
    if(!complete){setError('Complete all subject marks for every active student before publishing.');return;}
    publishExam(selected.id,true);setToast('Results published for the selected section.');setModal(null);
  }
  useEffect(()=>{document.title='Exams and results · EduSphere';},[]);
  const published=exams.filter(x=>x.published).length;
  return <div className="animate-enter space-y-6 pb-4 sm:space-y-7">
    <PageHeading eyebrow="ASSESSMENT CENTER" title="Exams & results" subtitle="Set up exams, record marks and publish results with confidence." action={<button className={primaryButton} onClick={()=>{setExamForm({...initialExam,className:academics.classes[0]?.name||'',section:academics.classes[0]?.sections[0]||''});setError('');setModal({type:'create'});}}><Plus size={17}/> New exam</button>}/>
    <HeroBanner label="Examination studio" title="Celebrate every" accent="milestone." subtitle="Record subject-wise marks, check completeness and release results when the entire class is ready." badge="Demo grading • 100 marks per subject"/>
    <div className="grid gap-3 sm:grid-cols-3"><MetricCard dark icon={ClipboardList} label="Total examinations" value={exams.length} caption="All class-specific exam sessions"/><MetricCard icon={Award} label="Published" value={published} caption="Results available to view"/><MetricCard icon={BookCheck} label="Draft examinations" value={exams.length-published} caption="Still awaiting publication"/></div>
    <section className="overflow-hidden rounded-[22px] border border-[#E4E4E7] bg-white">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-zinc-100 p-5 sm:p-6"><div><p className="text-[10px] font-extrabold uppercase tracking-[.15em] text-[#84CC16]">EXAM WORKSPACE</p><h2 className="mt-1 text-lg font-extrabold">Manage results</h2><p className="mt-1 text-[11px] text-zinc-400">Choose an exam and work through each subject.</p></div><select aria-label="Select exam" className={`${inputClass} w-full sm:w-auto sm:max-w-[330px]`} value={selected?.id||''} onChange={e=>chooseExam(e.target.value)}>{exams.map(e=><option key={e.id} value={e.id}>{e.name} · {e.className}{e.section}</option>)}</select></div>
      {selected?<>
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5 sm:px-6"><div><div className="flex flex-wrap items-center gap-2"><h3 className="text-base font-extrabold text-zinc-900">{selected.name}</h3><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${selected.published?'bg-[#F0F9DC] text-[#4D7C0F]':'bg-amber-50 text-amber-700'}`}>{selected.published?'Published':'Draft'}</span></div><p className="mt-1 text-[11px] text-zinc-500">Class {selected.className} · Section {selected.section} · {dateDisplay(selected.createdAt)}</p></div><div className="flex flex-wrap gap-2"><button className={secondaryButton} onClick={()=>{setError('');setModal({type:'publish'});}}>{selected.published?<UnlockKeyhole size={16}/>:<LockKeyhole size={16}/>} {selected.published?'Unpublish':'Publish results'}</button><button className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-rose-100 px-4 text-[12px] font-bold text-rose-600 hover:bg-rose-50" onClick={()=>setModal({type:'delete'})}><Trash2 size={15}/> Delete</button></div></div>
        <div className="mx-5 mt-4 sm:mx-6"><DemoNotice>This is frontend-only. The grade scale (A+ from 80, pass from 33) is illustrative; school policy must be configured before real use.</DemoNotice></div>
        <div className="mx-5 mt-5 grid gap-2 rounded-xl bg-[#FAFAFA] p-4 sm:mx-6 sm:grid-cols-3"><div><p className="text-[10px] text-zinc-500">Students</p><p className="mt-1 text-lg font-extrabold">{roster.length}</p></div><div><p className="text-[10px] text-zinc-500">Subjects</p><p className="mt-1 text-lg font-extrabold">{subjects.length}</p></div><div><p className="text-[10px] text-zinc-500">Marks entered</p><p className="mt-1 text-lg font-extrabold">{filled} <span className="text-xs text-zinc-400">/ {total}</span></p></div><div className="h-1.5 overflow-hidden rounded-full bg-zinc-200 sm:col-span-3"><div className="h-full rounded-full bg-[#84CC16]" style={{width:`${total?Math.round(filled/total*100):0}%`}}/></div></div>
        <div className="flex flex-wrap gap-2 border-b border-zinc-100 px-5 pb-4 pt-5 sm:px-6">{[['marks','Marks entry',BookOpenText],['results','Result sheet',FileCheck2]].map(([id,title,Icon])=><button key={id} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[12px] font-bold ${activeTab===id?'bg-[#18181B] text-white':'bg-zinc-100 text-zinc-500'}`} onClick={()=>setActiveTab(id)}><Icon size={15}/>{title}</button>)}</div>
        {activeTab==='marks'?<div className="p-5 sm:p-6"><div className="flex flex-wrap items-end justify-between gap-3"><div><label className="mb-1.5 block text-[11px] font-semibold text-zinc-500">Subject</label><select aria-label="Select subject" className={`${inputClass} min-w-52`} value={currentSubject?.id||''} onChange={e=>setSubjectId(e.target.value)}>{subjects.map(s=><option value={s.id} key={s.id}>{s.name}</option>)}</select></div><button className={primaryButton} disabled={selected.published||!currentSubject||!modified} onClick={saveCurrentMarks}><Save size={16}/> Save marks</button></div>
          {selected.published&&<p className="mt-3 rounded-xl border border-[#DCF2B6] bg-[#F7FEE7] px-4 py-3 text-[11px] text-[#4D7C0F]">Published exam is read-only. Unpublish before editing marks.</p>}
          {roster.length&&subjects.length?<div className="mt-4 overflow-x-auto rounded-xl border border-zinc-100"><table className="w-full min-w-[430px] text-left"><thead className="bg-zinc-50 text-[10px] font-bold uppercase tracking-wide text-zinc-500"><tr><th className="px-4 py-3">Student</th><th className="px-4 py-3">Roll</th><th className="px-4 py-3">Obtained / 100</th><th className="px-4 py-3">Grade</th></tr></thead><tbody>{roster.map(s=>{const raw=markInput(s.id);const g=raw===''?null:demoGrade(Number(raw));return <tr key={s.id} className="border-t border-zinc-100"><td className="px-4 py-3 text-xs font-bold text-zinc-800">{s.name}<span className="mt-1 block text-[10px] font-medium text-zinc-400">{s.id}</span></td><td className="px-4 py-3 text-xs">{s.roll}</td><td className="px-4 py-3"><input aria-label={`Marks for ${s.name}`} className={`${inputClass} max-w-32`} type="number" min="0" max="100" step="1" value={raw} disabled={selected.published} placeholder="0–100" onChange={e=>setInput(s.id,e.target.value)}/></td><td className="px-4 py-3 text-xs font-bold text-[#4D7C0F]">{g?.letter||'—'}</td></tr>;})}</tbody></table></div>:<EmptyState title="No assessment roster" description="This section needs active students and mapped subjects first."/>}
        </div>:<div className="p-5 sm:p-6">{!selected.published&&<div className="mb-4 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-[11px] font-semibold text-amber-800">Preview only — students will see results after publication.</div>}{results.length?<div className="overflow-x-auto rounded-xl border border-zinc-100"><table className="w-full min-w-[500px] text-left"><thead className="bg-zinc-50 text-[10px] font-bold uppercase tracking-wide text-zinc-500"><tr><th className="px-4 py-3">Student</th><th className="px-4 py-3">Roll</th><th className="px-4 py-3">Total / {subjects.length*100}</th><th className="px-4 py-3">GPA</th><th className="px-4 py-3">Grade</th></tr></thead><tbody>{results.map(r=><tr key={r.student.id} className="border-t border-zinc-100 text-xs"><td className="px-4 py-4 font-bold">{r.student.name}</td><td className="px-4 py-4">{r.student.roll}</td><td className="px-4 py-4">{r.valid?r.total:'Incomplete'}</td><td className="px-4 py-4 font-bold">{r.valid?r.gpa.toFixed(2):'—'}</td><td className="px-4 py-4 font-extrabold text-[#4D7C0F]">{r.letter}</td></tr>)}</tbody></table></div>:<EmptyState title="No result rows yet" description="Add active students to this section first."/>}</div>}
      </>:<EmptyState title="No examinations" description="Create an examination to get started."/>}
    </section>
    {modal?.type==='create'&&<ModalShell title="Create a new exam" description="Set up an exam for a single class and section." icon={ClipboardList} onClose={()=>setModal(null)} footer={<><button className={secondaryButton} onClick={()=>setModal(null)}>Cancel</button><button type="submit" form="create-exam-form" className={primaryButton}>Create exam</button></>}><form id="create-exam-form" onSubmit={createExam} className="space-y-4"><Field label="Examination name" required><input className={inputClass} value={examForm.name} maxLength={75} placeholder="e.g. Monthly Test" onChange={e=>setExamForm(f=>({...f,name:e.target.value}))}/></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Class" required><select className={inputClass} value={examForm.className} onChange={e=>{const cls=academics.classes.find(c=>c.name===e.target.value);setExamForm(f=>({...f,className:e.target.value,section:cls?.sections[0]||''}));}}>{classOptions.map(c=><option key={c.id} value={c.name}>Class {c.name}</option>)}</select></Field><Field label="Section" required><select className={inputClass} value={examForm.section} onChange={e=>setExamForm(f=>({...f,section:e.target.value}))}>{sections.map(s=><option key={s} value={s}>Section {s}</option>)}</select></Field></div><p className="text-xs text-zinc-500">Each subject is assessed out of 100 marks in this demo. Grades use a sample policy.</p>{error&&<p role="alert" className="rounded-lg bg-rose-50 p-3 text-xs font-bold text-rose-600">{error}</p>}</form></ModalShell>}
    {modal?.type==='publish'&&<ModalShell title={selected.published?'Unpublish results?':'Publish examination results?'} description={`${selected.name} · Class ${selected.className}${selected.section}`} icon={selected.published?UnlockKeyhole:CheckCircle2} width="max-w-[500px]" onClose={()=>setModal(null)} footer={<><button className={secondaryButton} onClick={()=>setModal(null)}>Cancel</button><button className={primaryButton} onClick={togglePublication}>{selected.published?'Unpublish':'Publish'}</button></>}><p className="text-[12px] leading-6 text-zinc-600">{selected.published?'Results will return to draft status so marks can be edited.':'Publishing will lock marks and make this section’s results available for future student dashboard integration.'}</p><p className="mt-3 text-[11px] font-semibold text-zinc-500">Completeness: {filled}/{total} marks recorded</p>{error&&<p role="alert" className="mt-3 rounded-xl bg-rose-50 p-3 text-xs font-bold text-rose-600">{error}</p>}</ModalShell>}
    {modal?.type==='delete'&&<ModalShell title="Delete this examination?" description="Marks and publication state will be removed." icon={Trash2} width="max-w-[480px]" onClose={()=>setModal(null)} footer={<><button className={secondaryButton} onClick={()=>setModal(null)}>Cancel</button><button className="rounded-xl bg-rose-600 px-5 py-3 text-[12px] font-bold text-white" onClick={()=>{deleteExam(selected.id);setModal(null);chooseExam(exams.find(e=>e.id!==selected.id)?.id||'');setToast('Exam deleted.');}}>Delete exam</button></>}><p className="text-xs leading-6 text-zinc-600">Delete <strong>{selected.name}</strong> and all its demo marks? This cannot be undone except by resetting demo data.</p></ModalShell>}
    <Toast message={toast} onDismiss={()=>setToast('')}/>
  </div>;
}
