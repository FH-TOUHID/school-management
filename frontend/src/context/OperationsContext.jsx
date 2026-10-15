import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { seedOperations, offsetISO } from '../data/seedOperations';
import { seedStudents } from '../data/seedStudents';
import { seedAcademics } from '../data/seedAcademics';

const KEY = 'edusphere_operations_ui_checkpoint5';
const OperationsContext = createContext(null);

function createSeed() {
  const value = structuredClone(seedOperations);
  for (const [index, student] of seedStudents.entries()) {
    if (student.status !== 'Active') continue;
    const statuses = ['present', 'present', 'present', 'late', 'absent'];
    value.attendance.push({ studentId:student.id, date:offsetISO(-1), status:statuses[index % statuses.length] });
  }
  const exam = value.exams[0];
  const subjectIds = seedAcademics.classSubjects[exam.className] || [];
  const students = seedStudents.filter(s => s.className===exam.className && s.section===exam.section && s.status==='Active');
  students.forEach((student, index) => subjectIds.forEach((subjectId, j) => {
    value.marks[`${exam.id}|${student.id}|${subjectId}`] = String(55 + (index * 11 + j * 7) % 41);
  }));
  return value;
}
function readSeed() {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) {
      const value = JSON.parse(raw);
      if (Array.isArray(value.attendance) && Array.isArray(value.routine) && Array.isArray(value.exams) && Array.isArray(value.notices) && value.marks && typeof value.marks==='object') return value;
    }
  } catch { /* demo still runs in memory */ }
  return createSeed();
}
function persist(value) { try { sessionStorage.setItem(KEY, JSON.stringify(value)); } catch { /* optional */ } }
const uid = prefix => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export function OperationsProvider({ children }) {
  const [data, setData] = useState(readSeed);
  const change = useCallback(fn => setData(current => {
    const next = fn(current);
    persist(next);
    return next;
  }), []);
  const value = useMemo(() => ({
    ...data,
    saveAttendance(date, records) {
      change(d => ({...d, attendance:[...d.attendance.filter(row => !(row.date===date && records.some(r=>r.studentId===row.studentId))), ...records.map(r=>({...r,date}))]}));
    },
    saveRoutine(entry) {
      const id = entry.id || uid('RT');
      change(d => ({...d, routine:entry.id ? d.routine.map(r => r.id===id ? {...entry,id} : r) : [...d.routine,{...entry,id}]}));
    },
    deleteRoutine(id) { change(d => ({...d,routine:d.routine.filter(r=>r.id!==id)})); },
    addExam(exam) { const id=uid('EX'); change(d=>({...d,exams:[{...exam,id,published:false,createdAt:offsetISO(0)},...d.exams]})); return id; },
    deleteExam(id) { change(d=>({ ...d, exams:d.exams.filter(e=>e.id!==id), marks:Object.fromEntries(Object.entries(d.marks).filter(([k])=>!k.startsWith(id+'|'))) })); },
    publishExam(id,published) { change(d=>({...d,exams:d.exams.map(e=>e.id===id?{...e,published}:e)})); },
    saveMarks(examId,updates) { change(d=>({...d,marks:{...d.marks,...Object.fromEntries(Object.entries(updates).map(([k,v])=>[`${examId}|${k}`,v]))}})); },
    saveNotice(notice) {
      const id = notice.id || uid('NT');
      change(d=>({...d, notices:notice.id ? d.notices.map(n=>n.id===id?{...notice,id}:n) : [{...notice,id,createdAt:offsetISO(0)},...d.notices]}));
    },
    deleteNotice(id) { change(d=>({...d,notices:d.notices.filter(n=>n.id!==id)})); },
    resetOperations() { const seed=createSeed();persist(seed);setData(seed); },
  }),[data,change]);
  return <OperationsContext.Provider value={value}>{children}</OperationsContext.Provider>;
}
export function useOperations() {
  const ctx=useContext(OperationsContext);
  if (!ctx) throw new Error('useOperations requires OperationsProvider');
  return ctx;
}
