// UI-only demonstration records. Real data will come from the Go API in a later phase.
export const statistics = [
  { label: 'Total students', value: '1,284', change: '+6.2%', detail: 'from last session', icon: 'students' },
  { label: 'Teachers', value: '56', change: '+3 new', detail: 'this academic year', icon: 'teachers' },
  { label: 'Attendance today', value: '94.6%', change: '+2.4%', detail: 'vs. last week', icon: 'attendance' },
  { label: 'Active sections', value: '28', change: 'Class 1–10', detail: 'across the school', icon: 'classes' },
];

export const weeklyAttendance = [
  { label: 'Sun', value: 94 },
  { label: 'Mon', value: 97 },
  { label: 'Tue', value: 92 },
  { label: 'Wed', value: 96 },
  { label: 'Thu', value: 95 },
];

export const monthlyAttendance = [
  { label: 'Week 1', value: 91 },
  { label: 'Week 2', value: 94 },
  { label: 'Week 3', value: 96 },
  { label: 'Week 4', value: 95 },
];

export const recentStudents = [
  { id: 'STU-1048', name: 'Nusrat Jahan', initials: 'NJ', className: 'Class 10', section: 'A', roll: '04', status: 'Active', tone: 'lilac' },
  { id: 'STU-1049', name: 'Arif Hossain', initials: 'AH', className: 'Class 9', section: 'B', roll: '17', status: 'Active', tone: 'peach' },
  { id: 'STU-1050', name: 'Mehjabin Akter', initials: 'MA', className: 'Class 8', section: 'A', roll: '09', status: 'Active', tone: 'mint' },
  { id: 'STU-1051', name: 'Siam Rahman', initials: 'SR', className: 'Class 7', section: 'C', roll: '21', status: 'Active', tone: 'blue' },
  { id: 'STU-1052', name: 'Farhana Islam', initials: 'FI', className: 'Class 6', section: 'A', roll: '12', status: 'Active', tone: 'rose' },
];

export const notices = [
  { day: '18', month: 'OCT', category: 'Examination', title: 'Half-yearly exam schedule', subtitle: 'Academic office · 10:30 AM' },
  { day: '20', month: 'OCT', category: 'Meeting', title: 'Teacher coordination meeting', subtitle: 'Head teacher · 12:15 PM' },
  { day: '23', month: 'OCT', category: 'General', title: 'Updated class timetable', subtitle: 'Academic office · 09:00 AM' },
];

export const todaySchedule = [
  { time: '09:00', period: '1st period', title: 'Mathematics', meta: 'Class 9 · Section A', accent: '#A3E635' },
  { time: '10:00', period: '2nd period', title: 'English', meta: 'Class 8 · Section B', accent: '#C4B5FD' },
  { time: '11:00', period: '3rd period', title: 'Science', meta: 'Class 10 · Section A', accent: '#93C5FD' },
];
