export const teacherSections = teacher => {
  const map = new Map();
  for (const item of teacher?.assignments || []) {
    if (!item.className || !item.section) continue;
    const key = `${item.className}|${item.section}`;
    if (!map.has(key)) map.set(key,{className:item.className,section:item.section,subjects:[]});
    if (!map.get(key).subjects.includes(item.subjectId)) map.get(key).subjects.push(item.subjectId);
  }
  return [...map.values()];
};
export const allowedTeacherExams = (teacher, exams) => exams.filter(e=>(teacher?.assignments||[]).some(a=>a.className===e.className&&a.section===e.section));
export const visibleNotices = (notices, role) => [...notices].filter(n=>n.published&&(n.audience==='All'||n.audience===(role==='teacher'?'Teachers':'Students'))).sort((a,b)=>Number(b.pinned)-Number(a.pinned)||b.createdAt.localeCompare(a.createdAt));
export const subjectName = (subjects,id) => subjects.find(s=>s.id===id)?.name || 'Subject unavailable';
export const gradeForMark = mark => mark >= 80 ? {point:5,letter:'A+'} : mark>=70 ? {point:4,letter:'A'} : mark>=60 ? {point:3.5,letter:'A-'} : mark>=50 ? {point:3,letter:'B'} : mark>=40 ? {point:2,letter:'C'} : mark>=33 ? {point:1,letter:'D'} : {point:0,letter:'F'};
export function studentResults(student, exams, marks, academics) {
  if(!student)return [];
  return exams.filter(e=>e.published&&e.className===student.className&&e.section===student.section&&e.academicYear===student.academicYear).map(exam=>{
    const subs=(academics.classSubjects[exam.className]||[]).map(id=>academics.subjects.find(s=>s.id===id)).filter(Boolean);
    const scores=subs.map(sub=>({subject:sub,score:marks[`${exam.id}|${student.id}|${sub.id}`]}));
    const complete=scores.length>0&&scores.every(s=>s.score!==undefined&&s.score!==''&&Number.isFinite(Number(s.score))&&Number(s.score)>=0&&Number(s.score)<=100);
    if(!complete)return {exam,complete:false,scores:[],gpa:null,letter:'—',total:null};
    const graded=scores.map(s=>({...s,grade:gradeForMark(Number(s.score))}));
    const failed=graded.some(s=>s.grade.point===0);
    const gpa=failed?0:graded.reduce((n,s)=>n+s.grade.point,0)/graded.length;
    const letter=failed?'F':gpa>=5?'A+':gpa>=4?'A':gpa>=3.5?'A-':gpa>=3?'B':gpa>=2?'C':'D';
    return {exam,complete:true,scores:graded,gpa,letter,total:graded.reduce((n,s)=>n+Number(s.score),0)};
  });
}
export const shortDate=date=>new Date(`${date}T12:00:00`).toLocaleDateString('en-BD',{day:'numeric',month:'short',year:'numeric'});
export const WEEKDAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday'];
export const SLOTS=['09:00 – 09:45','09:45 – 10:30','10:45 – 11:30','11:30 – 12:15','12:45 – 13:30'];
