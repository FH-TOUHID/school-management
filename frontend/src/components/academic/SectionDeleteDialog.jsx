import { useMemo, useState } from 'react';
import { AlertTriangle, ArrowRight, Trash2, UsersRound, GraduationCap } from 'lucide-react';
import ModalShell, { inputClass, secondaryButton } from '../shared/ModalShell';
import { useAcademics } from '../../context/AcademicsContext';
import { useStudents } from '../../context/StudentsContext';
import { useTeachers } from '../../context/TeachersContext';
import { planStudentMoves, planTeacherMoves } from '../../utils/sectionTransfer';

/** Safe section removal: empty sections can be deleted directly; sections
 * with records require a destination for the students and teacher assignments. */
export default function SectionDeleteDialog({ className, section, onClose, onSuccess }) {
  const { academics, removeSection } = useAcademics();
  const { students, editStudent } = useStudents();
  const { teachers, editTeacher } = useTeachers();
  const [target, setTarget] = useState('');

  const currentClass = academics.classes.find(item => item.name === className);
  const destinations = currentClass?.sections.filter(item => item !== section) || [];
  const affectedStudents = students.filter(item => item.className === className && item.section === section);
  const affectedTeacherAssignments = teachers.reduce((count, teacher) => count + teacher.assignments.filter(
    assignment => assignment.className === className && assignment.section === section
  ).length, 0);
  const isUsed = affectedStudents.length > 0 || affectedTeacherAssignments > 0;
  const lastSection = destinations.length === 0;
  const validTarget = destinations.includes(target);

  const studentMoves = useMemo(
    () => planStudentMoves(students, className, section, target),
    [students, className, section, target]
  );
  const teacherMoves = useMemo(
    () => planTeacherMoves(teachers, className, section, target),
    [teachers, className, section, target]
  );
  const changedRolls = studentMoves.filter(move => move.roll !== move.previousRoll);
  const canRemove = Boolean(currentClass) && !lastSection && (!isUsed || validTarget);

  function confirmRemoval() {
    if (!canRemove) return;

    if (isUsed) {
      // Coordinated updates for frontend demo state. The backend will later
      // perform this as one validated storage operation.
      studentMoves.forEach(move => editStudent(move.id, { section: move.section, roll: move.roll }));
      teacherMoves.forEach(move => editTeacher(move.id, { assignments: move.assignments }));
    }

    removeSection(className, section);
    const suffix = isUsed
      ? ` ${studentMoves.length} student(s) and ${affectedTeacherAssignments} teaching assignment(s) moved to Section ${target}.`
      : '';
    onSuccess(`Section ${section} removed from Class ${className}.${suffix}`);
  }

  return (
    <ModalShell
      title={`Remove Section ${section}?`}
      description={`Class ${className} · Academic year ${academics.activeYear}`}
      icon={Trash2}
      width="max-w-[510px]"
      onClose={onClose}
      footer={<>
        <button type="button" className={secondaryButton} onClick={onClose}>Cancel</button>
        <button
          type="button"
          disabled={!canRemove}
          onClick={confirmRemoval}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-[12px] font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Trash2 size={15}/>{isUsed ? 'Move & remove section' : 'Remove section'}
        </button>
      </>}
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <AlertTriangle size={19} className="mt-0.5 shrink-0 text-amber-600"/>
          <div>
            <p className="text-[13px] font-bold text-zinc-900">
              {lastSection ? 'This is the last section in the class.' : isUsed ? 'This section has linked records.' : 'This section is empty.'}
            </p>
            <p className="mt-1 text-[12px] leading-5 text-zinc-600">
              {lastSection
                ? 'Add another section first. A class must have at least one section.'
                : isUsed
                  ? 'Choose another section to move the linked students and teaching assignments before removing this one.'
                  : 'No student or teacher assignments will be affected.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-zinc-200 p-3.5">
            <div className="flex items-center gap-2 text-zinc-500"><GraduationCap size={16}/><span className="text-[11px] font-semibold">Students</span></div>
            <p className="mt-2 text-[23px] font-extrabold text-zinc-900">{affectedStudents.length}</p>
          </div>
          <div className="rounded-xl border border-zinc-200 p-3.5">
            <div className="flex items-center gap-2 text-zinc-500"><UsersRound size={16}/><span className="text-[11px] font-semibold">Teaching assignments</span></div>
            <p className="mt-2 text-[23px] font-extrabold text-zinc-900">{affectedTeacherAssignments}</p>
          </div>
        </div>

        {isUsed && !lastSection && <div>
          <label htmlFor="section-transfer-target" className="mb-2 block text-[12px] font-bold text-zinc-800">
            Move records to <span className="text-red-500">*</span>
          </label>
          <select id="section-transfer-target" value={target} onChange={event => setTarget(event.target.value)} className={inputClass}>
            <option value="">Select a destination section</option>
            {destinations.map(destination => <option key={destination} value={destination}>Class {className} — Section {destination}</option>)}
          </select>
          {validTarget && <div className="mt-3 rounded-xl bg-[#F7FEE7] p-3.5 text-[12px] leading-5 text-[#365314]">
            <p className="flex items-center gap-1.5 font-bold"><span>Section {section}</span><ArrowRight size={14}/><span>Section {target}</span></p>
            <p className="mt-1">{studentMoves.length} student(s) and {affectedTeacherAssignments} teaching assignment(s) will be moved before deletion.</p>
            {changedRolls.length > 0 && <p className="mt-2 font-semibold">
              {changedRolls.length} student roll number(s) will change to prevent duplicate rolls in Section {target}.
            </p>}
          </div>}
        </div>}
        {!isUsed && !lastSection && <p className="text-[12px] text-zinc-500">Press “Remove section” to delete this unused section.</p>}
      </div>
    </ModalShell>
  );
}
