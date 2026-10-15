import { useState } from 'react';
import { createPortal } from 'react-dom';
import { GraduationCap, Info, Save, X } from 'lucide-react';
import { useAcademics } from '../../context/AcademicsContext';
import useDialogAccessibility from '../../hooks/useDialogAccessibility';

const initial = {
  name: '', className: '6', section: 'A', roll: '', status: 'Active',
  gender: '', dateOfBirth: '', admissionDate: new Date().toISOString().slice(0, 10),
  email: '', phone: '',
};
const fieldClass = 'h-11 w-full rounded-xl border border-[#E4E4E7] bg-white px-3.5 text-[13px] text-[#18181B] outline-none transition focus:border-[#84CC16] focus:ring-4 focus:ring-[#A3E635]/15';

function validate(form, students, existingId) {
  const errors = {};
  if (form.name.trim().length < 2) errors.name = 'Name should be at least 2 characters.';
  if (!Number.isInteger(Number(form.roll)) || Number(form.roll) < 1 || Number(form.roll) > 999) errors.roll = 'Enter a valid roll (1–999).';
  if (students.some((student) => student.id !== existingId && student.className === form.className && student.section === form.section && Number(student.roll) === Number(form.roll))) {
    errors.roll = 'This roll already exists in the selected class & section.';
  }
  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = 'Enter a valid email or leave blank.';
  if (form.phone.trim() && !/^\+?[0-9\s-]{7,17}$/.test(form.phone.trim())) errors.phone = 'Enter a valid phone number or leave blank.';
  if (form.dateOfBirth && form.dateOfBirth > new Date().toISOString().slice(0, 10)) errors.dateOfBirth = 'Date of birth cannot be in the future.';
  if (!form.admissionDate) errors.admissionDate = 'Admission date is required.';
  return errors;
}

function FormField({ label, error, required, children }) {
  return (
    <div>
      <label className="mb-2 block text-[12px] font-semibold text-zinc-700">{label} {required && <span className="text-red-600">*</span>}{children}</label>
      {error && <p className="mt-1.5 text-[11px] font-medium text-red-600" role="alert">{error}</p>}
    </div>
  );
}

export default function StudentFormModal({ mode, student, students, onClose, onSave }) {
  const { academics } = useAcademics();
  const classOptions = academics.classes.map(c=>c.name);
  const [form, setForm] = useState(() => student ? { ...student } : { ...initial, className: academics.classes[0]?.name || '', section: academics.classes[0]?.sections[0] || '' });
  const [errors, setErrors] = useState({});
  const dialogRef = useDialogAccessibility(onClose);
  const editing = mode === 'edit';
  const sectionOptions = academics.classes.find(c=>c.name===form.className)?.sections || []; 

  function set(field, value) {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined, roll: field === 'className' || field === 'section' ? undefined : previous.roll }));
  }
  function submit(event) {
    event.preventDefault();
    const nextErrors = validate(form, students, student?.id);
    if (!academics.classes.some(c=>c.name===form.className && c.sections.includes(form.section))) {
      nextErrors.section = 'Select a valid class and section.';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() => {
        const invalid = dialogRef.current?.querySelector('[aria-invalid=true]');
        invalid?.focus();
        invalid?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      });
      return;
    }
    const { id: _id, academicYear: _year, ...fields } = form;
    onSave({ ...fields, name: form.name.trim(), roll: String(Number(form.roll)), email: form.email.trim(), phone: form.phone.trim() });
  }
  const input = (field, props = {}) => ({ ...props, value: form[field] || '', onChange: (event) => set(field, event.target.value), className: fieldClass, 'aria-invalid': Boolean(errors[field]) });

  return createPortal(
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-[#09090B]/65 p-2 backdrop-blur-[3px] sm:p-6" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <section ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="student-form-title" className="flex w-full max-w-[720px] max-h-[calc(100dvh-1rem)] flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_30px_90px_rgba(0,0,0,0.28)] sm:max-h-[calc(100dvh-3rem)] sm:rounded-[26px]">
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-zinc-100 bg-white px-5 py-4 sm:px-7 sm:py-5">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-[#F7FEE7] text-[#4D7C0F]"><GraduationCap size={22}/></span>
            <div><h2 id="student-form-title" className="text-base font-extrabold tracking-tight sm:text-lg">{editing ? 'Edit student details' : 'Add a new student'}</h2><p className="mt-1 text-[11px] text-zinc-500">Academic session 2026 · Profile information</p></div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close student form" className="rounded-xl p-2.5 text-zinc-500 hover:bg-zinc-100"><X size={19}/></button>
        </div>
        <form onSubmit={submit} noValidate className="min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-width:thin]" id="student-form">
          <div className="space-y-5 px-5 py-5 sm:px-7 sm:py-6">
            <div className="rounded-xl border border-[#D9F99D] bg-[#F7FEE7] px-4 py-3 text-[12px] leading-5 text-[#3F6212]"><Info size={16} className="mr-2 inline"/>This creates a <strong>demo profile only</strong>. Student login credentials will be created by Admin using the Go backend in a later phase.</div>
            <div>
              <p className="mb-4 text-[11px] font-extrabold uppercase tracking-[0.14em] text-zinc-400">Personal information</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2"><FormField label="Full name" required error={errors.name}><input data-dialog-initial-focus {...input('name', { placeholder: 'e.g. Nusrat Jahan', maxLength: 80 })}/></FormField></div>
                <FormField label="Gender"><select {...input('gender')}><option value="">Select gender</option><option>Female</option><option>Male</option><option>Other</option></select></FormField>
                <FormField label="Date of birth" error={errors.dateOfBirth}><input type="date" {...input('dateOfBirth')}/></FormField>
                <FormField label="Email (optional)" error={errors.email}><input type="email" {...input('email', { placeholder: 'student@example.com' })}/></FormField>
                <FormField label="Phone (optional)" error={errors.phone}><input type="tel" {...input('phone', { placeholder: '01XXXXXXXXX' })}/></FormField>
              </div>
            </div>
            <div className="border-t border-zinc-100 pt-5">
              <p className="mb-4 text-[11px] font-extrabold uppercase tracking-[0.14em] text-zinc-400">Academic information</p>
              <div className="grid gap-4 sm:grid-cols-3">
                <FormField label="Class" required><select {...input('className')} onChange={(event)=>{ set('className',event.target.value); set('section',academics.classes.find(c=>c.name===event.target.value)?.sections[0]||''); }}>{classOptions.map((value) => <option key={value} value={value}>Class {value}</option>)}</select></FormField>
                <FormField label="Section" required error={errors.section}><select {...input('section')}>{sectionOptions.map(value=><option key={value} value={value}>Section {value}</option>)}</select></FormField>
                <FormField label="Roll no." required error={errors.roll}><input type="number" min="1" max="999" {...input('roll', { placeholder: 'e.g. 12' })}/></FormField>
                <FormField label="Admission date" required error={errors.admissionDate}><input type="date" {...input('admissionDate')}/></FormField>
                <FormField label="Status"><select {...input('status')}><option>Active</option><option>Inactive</option></select></FormField>
                {editing && <FormField label="Student ID"><input value={student.id} readOnly className={`${fieldClass} bg-zinc-50 text-zinc-500`}/></FormField>}
              </div>
            </div>
          </div>
        </form>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-zinc-100 bg-white px-4 py-3 pb-[max(.75rem,env(safe-area-inset-bottom))] sm:gap-3 sm:px-7 sm:py-4">
          <button type="button" onClick={onClose} className="rounded-xl border border-[#E4E4E7] px-4 py-3 text-[12px] font-bold text-zinc-700 hover:bg-zinc-50">Cancel</button>
          <button type="submit" form="student-form" className="inline-flex items-center gap-2 rounded-xl bg-[#18181B] px-5 py-3 text-[12px] font-bold text-white transition hover:bg-[#333339]"><Save size={16}/>{editing ? 'Save changes' : 'Add student'}</button>
        </div>
      </section>
    </div>,
    document.body,
  );
}
