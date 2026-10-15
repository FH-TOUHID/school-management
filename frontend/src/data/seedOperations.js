// Entirely fictional UI demo records. Backend JSON persistence will replace this later.
function localISO(date) {
  const d = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return d.toISOString().slice(0, 10);
}
export const todayISO = () => localISO(new Date());
export const offsetISO = days => { const d = new Date(); d.setDate(d.getDate() + days); return localISO(d); };

export const seedOperations = {
  attendance: [],
  routine: [
    { id:'RT-01', className:'10', section:'A', weekday:1, period:1, subjectId:'SUB-01', teacherId:'TCH-201', room:'201' },
    { id:'RT-02', className:'10', section:'A', weekday:1, period:2, subjectId:'SUB-02', teacherId:'TCH-203', room:'201' },
    { id:'RT-03', className:'10', section:'A', weekday:2, period:1, subjectId:'SUB-03', teacherId:'TCH-206', room:'201' },
    { id:'RT-04', className:'10', section:'A', weekday:3, period:2, subjectId:'SUB-01', teacherId:'TCH-201', room:'201' },
    { id:'RT-05', className:'9', section:'B', weekday:1, period:1, subjectId:'SUB-03', teacherId:'TCH-202', room:'104' },
    { id:'RT-06', className:'9', section:'B', weekday:2, period:2, subjectId:'SUB-03', teacherId:'TCH-202', room:'104' },
  ],
  exams: [
    { id:'EX-01', name:'Half-yearly Examination', className:'10', section:'A', academicYear:'2026', published:true, createdAt:'2026-06-10' },
    { id:'EX-02', name:'Annual Examination', className:'9', section:'B', academicYear:'2026', published:false, createdAt:'2026-10-01' },
  ],
  marks: {},
  notices: [
    { id:'NT-01', title:'Half-yearly results published', category:'Examination', audience:'All', body:'Half-yearly results for Class 10 A are now available in the school portal.', published:true, pinned:true, createdAt:'2026-10-12' },
    { id:'NT-02', title:'October school assembly', category:'Event', audience:'All', body:'All students should attend the morning assembly in school uniform. Teachers are requested to arrive before the first bell.', published:true, pinned:false, createdAt:'2026-10-10' },
    { id:'NT-03', title:'Teacher coordination meeting', category:'Staff', audience:'Teachers', body:'A staff coordination meeting is planned to review attendance and examination preparation.', published:true, pinned:false, createdAt:'2026-10-07' },
    { id:'NT-04', title:'Library schedule update', category:'General', audience:'Students', body:'New library opening hours will be announced after final approval.', published:false, pinned:false, createdAt:'2026-10-05' },
  ],
};
