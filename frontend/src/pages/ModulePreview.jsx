import { ArrowLeft, CheckCircle2, Construction, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const modulePlans = {
  students: { title: 'Students', subtitle: 'Manage admissions, student profiles and enrollment.', features: ['Student directory', 'Admission form', 'Academic enrollment', 'Student promotion'] },
  teachers: { title: 'Teachers', subtitle: 'Keep teacher profiles and class assignments organized.', features: ['Teacher directory', 'Teacher profile', 'Subject assignment', 'Class teacher assignment'] },
  academics: { title: 'Classes & subjects', subtitle: 'Set up academic years, classes, sections and subjects.', features: ['Academic years', 'Class and section setup', 'Subjects', 'Class-subject mapping'] },
  attendance: { title: 'Attendance', subtitle: 'Take and review daily student attendance.', features: ['Class-wise attendance', 'Daily status', 'Attendance history', 'Teacher access control'] },
  routine: { title: 'Class routine', subtitle: 'Organize class periods and teacher schedules.', features: ['Weekly timetable', 'Periods', 'Assigned teacher', 'Room information'] },
  exams: { title: 'Exams & results', subtitle: 'Create examinations, record marks and publish results.', features: ['Exam setup', 'Marks entry', 'Grade calculation', 'Result publication'] },
  notices: { title: 'Notices', subtitle: 'Share announcements with teachers and students.', features: ['Create notice', 'Target audience', 'Publish notice', 'Notice list'] },
  settings: { title: 'School settings', subtitle: 'Manage the school name, logo and basic academic settings.', features: ['School profile', 'Academic session', 'Branding', 'Basic settings'] },
  help: { title: 'Help & support', subtitle: 'A future home for help and project instructions.', features: ['Getting started', 'System guidelines', 'FAQ', 'Support information'] },
};

export default function ModulePreview({ moduleId }) {
  const module = modulePlans[moduleId];
  return (
    <div className="animate-enter max-w-5xl space-y-6">
      <Link to="/admin/dashboard" className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-[#18181B]"><ArrowLeft size={16}/> Back to dashboard</Link>
      <div className="relative overflow-hidden rounded-[24px] bg-[#18181B] p-7 text-white sm:p-10">
        <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full border-[45px] border-[#A3E635]/15" />
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#A3E635]"><Construction size={14}/> UI placeholder</span>
        <h1 className="relative mt-5 text-3xl font-extrabold tracking-[-1px] sm:text-4xl">{module.title}</h1>
        <p className="relative mt-3 max-w-xl text-sm leading-6 text-zinc-300">{module.subtitle}</p>
        <p className="relative mt-4 text-xs text-[#A3E635]">This module will be built in upcoming checkpoints.</p>
      </div>
      <div className="rounded-[22px] border border-[#E4E4E7] bg-white p-6 sm:p-8">
        <div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-[#F7FEE7] text-[#4D7C0F]"><Sparkles size={19}/></span><h2 className="text-lg font-extrabold">What we'll build here</h2></div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {module.features.map((feature) => <div key={feature} className="flex items-center gap-2.5 rounded-xl border border-[#E4E4E7] px-4 py-4 text-[13px] font-semibold text-zinc-700"><CheckCircle2 size={17} className="text-[#84CC16]"/>{feature}</div>)}
        </div>
      </div>
    </div>
  );
}
