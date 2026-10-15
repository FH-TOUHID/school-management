import { useState } from 'react';
import { BookOpenText, Plus, Save, Trash2, UserRoundPlus } from 'lucide-react';
import ModalShell, { Field, inputClass, primaryButton, secondaryButton } from '../shared/ModalShell';
import { useAcademics } from '../../context/AcademicsContext';

const today = new Date().toISOString().slice(0,10);
const blankAssignment = { className:'6',section:'A',subjectId:'SUB-03' };
const blank = {name:'',designation:'Assistant Teacher',gender:'',phone:'',email:'',qualification:'',joiningDate:today,status:'Active',assignments:[blankAssignment]};
const newBlank = () => structuredClone(blank);

export default function TeacherFormModal({teacher,onClose,onSave,teachers}) {
  const { academics }=useAcademics();
  const [form,setForm]=useState(()=>teacher?structuredClone(teacher):newBlank());
  const [errors,setErrors]=useState({});
  const editing=Boolean(teacher);
  const change=(field,value)=>{setForm(f=>({...f,[field]:value}));setErrors(e=>({...e,[field]:undefined}));};
  const changeAssignment=(index,field,value)=>setForm(f=>({...f,assignments:f.assignments.map((row,i)=>{
    if(index!==i)return row;
    if(field==='className')return {...row,className:value,section:academics.classes.find(c=>c.name===value)?.sections[0]||'A',subjectId:academics.classSubjects[value]?.[0]||''};
    return {...row,[field]:value};
  })}));
  const addAssignment=()=>setForm(f=>({...f,assignments:[...f.assignments,{className:academics.classes[0]?.name||'1',section:academics.classes[0]?.sections[0]||'A',subjectId:academics.classSubjects[academics.classes[0]?.name]?.[0]||''}]}));
  const removeAssignment=index=>setForm(f=>({...f,assignments:f.assignments.filter((_,i)=>i!==index)}));
  function save(e){
    e.preventDefault();
    const next={};
    if(form.name.trim().length<2)next.name='Enter a name of at least 2 characters.';
    if(form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))next.email='Enter a valid email.';
    if(form.phone && !/^\+?[0-9\s-]{7,17}$/.test(form.phone.trim()))next.phone='Enter a valid phone number.';
    if(!form.joiningDate)next.joiningDate='Joining date is required.';
    if(form.assignments.some(a=>!academics.classes.some(c=>c.name===a.className&&c.sections.includes(a.section)) || !academics.classSubjects[a.className]?.includes(a.subjectId)))next.assignments='Select a valid class, section and subject for each assignment.';
    if(new Set(form.assignments.map(a=>`${a.className}|${a.section}|${a.subjectId}`)).size!==form.assignments.length)next.assignments='Duplicate assignments are not allowed.';
    if(form.email && teachers.some(t=>t.id!==teacher?.id&&t.email&&t.email.toLowerCase()===form.email.trim().toLowerCase()))next.email='Email is already used by another teacher.';
    setErrors(next);if(Object.keys(next).length)return;
    const {id:_id,...rest}=form;
    onSave({...rest,name:form.name.trim(),email:form.email.trim(),phone:form.phone.trim(),assignments:form.assignments});
  }
  const field=(name,props={})=>({...props,value:form[name],onChange:e=>change(name,e.target.value),className:inputClass,'aria-invalid':!!errors[name]});
  const footer=<><button type="button" className={secondaryButton} onClick={onClose}>Cancel</button><button type="submit" form="teacher-form" className={primaryButton}><Save size={16}/>{editing?'Save changes':'Add teacher'}</button></>;
  return <ModalShell title={editing?'Edit teacher details':'Add a new teacher'} icon={UserRoundPlus} onClose={onClose} description="Academic session 2026 · Staff information" footer={footer}>
    <form id="teacher-form" onSubmit={save} className="space-y-6" noValidate>
      <div className="rounded-xl border border-[#D9F99D] bg-[#F7FEE7] p-3.5 text-[12px] leading-5 text-[#3F6212]">Frontend demo only. Adding a teacher here does not create login credentials or modify Go JSON files.</div>
      <section className="space-y-4"><h3 className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-zinc-400">Personal information</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><Field label="Full name" required error={errors.name}><input {...field('name',{placeholder:'e.g. Samira Rahman',maxLength:80})}/></Field></div>
          <Field label="Designation"><select {...field('designation')}><option>Assistant Teacher</option><option>Senior Teacher</option><option>Head Teacher</option></select></Field>
          <Field label="Gender"><select {...field('gender')}><option value="">Select gender</option><option>Female</option><option>Male</option><option>Other</option></select></Field>
          <Field label="Email (optional)" error={errors.email}><input type="email" {...field('email',{placeholder:'teacher@school.test'})}/></Field>
          <Field label="Phone (optional)" error={errors.phone}><input type="tel" {...field('phone',{placeholder:'01XXXXXXXXX'})}/></Field>
          <Field label="Qualification"><input {...field('qualification',{placeholder:'e.g. B.Ed / M.Ed'})}/></Field>
          <Field label="Joining date" required error={errors.joiningDate}><input type="date" {...field('joiningDate')}/></Field>
          <Field label="Status"><select {...field('status')}><option>Active</option><option>On leave</option><option>Inactive</option></select></Field>
        </div>
      </section>
      <section className="space-y-4 border-t border-zinc-100 pt-5">
        <div className="flex items-center justify-between gap-3"><div><h3 className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-zinc-400">Teaching assignments</h3><p className="mt-1 text-[11px] text-zinc-500">Choose from your configured classes & subjects.</p></div><span className="rounded-lg bg-[#F7FEE7] p-2 text-[#4D7C0F]"><BookOpenText size={18}/></span></div>
        {form.assignments.map((a,i)=>{
          const currentClass=academics.classes.find(c=>c.name===a.className);
          const allowed=academics.classSubjects[a.className]||[];
          return <div key={i} className="rounded-2xl border border-[#E4E4E7] bg-[#FAFAFA] p-4">
            <div className="mb-3 flex items-center justify-between"><strong className="text-[12px]">Assignment {i+1}</strong><button type="button" aria-label={`Remove assignment ${i+1}`} onClick={()=>removeAssignment(i)} className="rounded-lg p-2 text-zinc-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={16}/></button></div>
            <div className="grid gap-3 sm:grid-cols-3"><Field label="Class"><select className={inputClass} value={a.className} onChange={e=>changeAssignment(i,'className',e.target.value)}>{academics.classes.map(c=><option key={c.id} value={c.name}>Class {c.name}</option>)}</select></Field>
              <Field label="Section"><select className={inputClass} value={a.section} onChange={e=>changeAssignment(i,'section',e.target.value)}>{(currentClass?.sections||[]).map(s=><option key={s} value={s}>Section {s}</option>)}</select></Field>
              <Field label="Subject"><select className={inputClass} value={a.subjectId} onChange={e=>changeAssignment(i,'subjectId',e.target.value)}><option value="">Select subject</option>{academics.subjects.filter(s=>allowed.includes(s.id)).map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></Field>
            </div></div>;
        })}
        {errors.assignments && <p role="alert" className="text-[11px] font-semibold text-red-600">{errors.assignments}</p>}
        <button type="button" onClick={addAssignment} className="inline-flex items-center gap-2 rounded-xl border border-dashed border-[#B3D75D] bg-[#F7FEE7] px-4 py-3 text-[12px] font-bold text-[#4D7C0F] hover:bg-[#ECFCCB]"><Plus size={16}/> Add assignment</button>
      </section>
    </form>
  </ModalShell>;
}
