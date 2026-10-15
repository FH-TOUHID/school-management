import { createContext, useContext, useMemo, useState } from 'react';
import { seedTeachers } from '../data/seedTeachers';
const KEY = 'edusphere_teachers_ui_checkpoint4';
const TeachersContext = createContext(null);
function initialValue() {
  try { const raw=sessionStorage.getItem(KEY); if(raw){const value=JSON.parse(raw);if(Array.isArray(value))return value;} } catch {}
  return structuredClone(seedTeachers);
}
function persist(value) {try {sessionStorage.setItem(KEY,JSON.stringify(value));}catch{}}
export function TeachersProvider({children}) {
  const [teachers,setTeachers]=useState(initialValue);
  function change(fn){setTeachers(current=>{const next=fn(current);persist(next);return next;});}
  const value=useMemo(()=>({
    teachers,
    addTeacher(data){
      const highest=teachers.reduce((n,t)=>Math.max(n,Number(t.id.split('-')[1])||0),200);
      const item={...data,id:`TCH-${highest+1}`};
      change(curr=>[item,...curr]);return item;
    },
    editTeacher(id,data){change(curr=>curr.map(t=>t.id===id?{...t,...data}:t));},
    deleteTeacher(id){change(curr=>curr.filter(t=>t.id!==id));},
    resetTeachers(){const reset=structuredClone(seedTeachers); persist(reset);setTeachers(reset);},
  }),[teachers]);
  return <TeachersContext.Provider value={value}>{children}</TeachersContext.Provider>;
}
export function useTeachers(){const value=useContext(TeachersContext);if(!value)throw new Error('useTeachers must be inside TeachersProvider');return value;}
