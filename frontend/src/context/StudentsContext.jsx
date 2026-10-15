import { createContext, useContext, useMemo, useState } from 'react';
import { seedStudents } from '../data/seedStudents';

// Frontend UI simulation. The authoritative storage will be Go + JSON files later.
const KEY = 'edusphere_students_ui_checkpoint3';
const StudentsContext = createContext(null);

function readStudents() {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch { /* blocked storage or corrupted demo data */ }
  return seedStudents;
}
function persist(items) {
  try { sessionStorage.setItem(KEY, JSON.stringify(items)); } catch { /* use in-memory state */ }
}

export function StudentsProvider({ children }) {
  const [students, setStudents] = useState(readStudents);
  const update = (fn) => setStudents((current) => {
    const next = fn(current);
    persist(next);
    return next;
  });

  const value = useMemo(() => ({
    students,
    addStudent(data) {
      const highestId = students.reduce((max, student) => Math.max(max, Number(student.id.split('-')[1]) || 0), 1047);
      const newRecord = { ...data, id: `STU-${highestId + 1}`, academicYear: '2026' };
      update((current) => [newRecord, ...current]);
      return newRecord;
    },
    editStudent(id, data) { update((current) => current.map((student) => student.id === id ? { ...student, ...data } : student)); },
    deleteStudent(id) { update((current) => current.filter((student) => student.id !== id)); },
    resetStudents() { update(() => seedStudents); },
  }), [students]);
  return <StudentsContext.Provider value={value}>{children}</StudentsContext.Provider>;
}

export function useStudents() {
  const context = useContext(StudentsContext);
  if (!context) throw new Error('useStudents must be used inside StudentsProvider');
  return context;
}
