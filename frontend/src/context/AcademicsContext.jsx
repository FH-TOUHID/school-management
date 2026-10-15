import { createContext, useContext, useMemo, useState } from 'react';
import { seedAcademics } from '../data/seedAcademics';

const KEY = 'edusphere_academics_ui_checkpoint4';
const AcademicsContext = createContext(null);
const initialValue = () => {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) {
      const value = JSON.parse(raw);
      if (Array.isArray(value.classes) && Array.isArray(value.subjects) && value.classSubjects) return value;
    }
  } catch { /* demo can run in memory */ }
  return structuredClone(seedAcademics);
};
function persist(value) { try { sessionStorage.setItem(KEY, JSON.stringify(value)); } catch { /* optional session persistence */ } }
function updateState(setData, update) {
  setData(current => { const next = update(current); persist(next); return next; });
}

export function AcademicsProvider({children}) {
  const [academics,setAcademics] = useState(initialValue);
  const methods = useMemo(()=>({
    academics,
    addClass(name) {
      updateState(setAcademics, a => ({...a,
        classes:[...a.classes,{id:`CLS-${Date.now()}`, name, sections:['A']}].sort((x,y)=>Number(x.name)-Number(y.name) || x.name.localeCompare(y.name)),
        classSubjects:{...a.classSubjects,[name]:[]},
      }));
    },
    removeClass(name) {
      updateState(setAcademics, a => {
        const nextMap = {...a.classSubjects}; delete nextMap[name];
        return {...a,classes:a.classes.filter(c=>c.name!==name), classSubjects:nextMap};
      });
    },
    addSection(className,section) {
      updateState(setAcademics, a=>({...a,classes:a.classes.map(c=>c.name===className?{...c,sections:[...c.sections,section].sort()}:c)}));
    },
    removeSection(className,section) {
      updateState(setAcademics,a=>({...a,classes:a.classes.map(c=>c.name===className?{...c,sections:c.sections.filter(s=>s!==section)}:c)}));
    },
    addSubject(data) {
      updateState(setAcademics,a=>({...a, subjects:[...a.subjects,{...data,id:`SUB-${Date.now()}`}]}));
    },
    editSubject(id,data) {
      updateState(setAcademics,a=>({...a,subjects:a.subjects.map(s=>s.id===id?{...s,...data}:s)}));
    },
    removeSubject(id) {
      updateState(setAcademics,a=>({...a,subjects:a.subjects.filter(s=>s.id!==id),classSubjects:Object.fromEntries(Object.entries(a.classSubjects).map(([name,ids])=>[name,ids.filter(x=>x!==id)]))}));
    },
    toggleClassSubject(className,id) {
      updateState(setAcademics,a=>{
        const ids = a.classSubjects[className] || [];
        const next = ids.includes(id) ? ids.filter(x=>x!==id) : [...ids,id];
        return {...a,classSubjects:{...a.classSubjects,[className]:next}};
      });
    },
    resetAcademics() { const reset = structuredClone(seedAcademics); persist(reset); setAcademics(reset); },
  }),[academics]);
  return <AcademicsContext.Provider value={methods}>{children}</AcademicsContext.Provider>;
}
export function useAcademics() {
  const value = useContext(AcademicsContext);
  if (!value) throw new Error('useAcademics must be inside AcademicsProvider');
  return value;
}
