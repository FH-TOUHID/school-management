// Fake records for UI demonstration ONLY. Nothing here is a real student's data.
const samples = [
  ['Nusrat Jahan', '10', 'A', 4, 'Active', 'Female', '2009-03-12', '2026-01-04'],
  ['Arif Hossain', '9', 'B', 17, 'Active', 'Male', '2010-08-21', '2026-01-05'],
  ['Mehjabin Akter', '8', 'A', 9, 'Active', 'Female', '2011-11-03', '2026-01-05'],
  ['Siam Rahman', '7', 'C', 21, 'Active', 'Male', '2012-02-09', '2026-01-07'],
  ['Farhana Islam', '6', 'A', 12, 'Active', 'Female', '2013-05-15', '2026-01-08'],
  ['Tanvir Hasan', '10', 'B', 13, 'Active', 'Male', '2009-07-02', '2026-01-09'],
  ['Jannatul Ferdous', '9', 'A', 7, 'Active', 'Female', '2010-09-18', '2026-01-10'],
  ['Rafi Ahmed', '8', 'C', 11, 'Inactive', 'Male', '2011-06-25', '2026-01-11'],
  ['Sumaiya Khan', '7', 'B', 2, 'Active', 'Female', '2012-12-06', '2026-01-11'],
  ['Mahin Chowdhury', '6', 'B', 5, 'Active', 'Male', '2013-01-17', '2026-01-12'],
  ['Tania Sultana', '10', 'C', 8, 'Active', 'Female', '2009-10-10', '2026-01-13'],
  ['Fahim Islam', '9', 'C', 14, 'Active', 'Male', '2010-02-24', '2026-01-14'],
  ['Mim Akter', '8', 'B', 6, 'Active', 'Female', '2011-04-01', '2026-01-14'],
  ['Shakib Ahmed', '7', 'A', 19, 'Inactive', 'Male', '2012-09-05', '2026-01-15'],
  ['Nabil Rahman', '6', 'C', 15, 'Active', 'Male', '2013-08-20', '2026-01-15'],
  ['Tasnim Jahan', '10', 'A', 22, 'Active', 'Female', '2009-01-09', '2026-01-16'],
];
export const seedStudents = samples.map((row, i) => ({
  id: `STU-${1048 + i}`,
  name: row[0], className: row[1], section: row[2], roll: String(row[3]),
  status: row[4], gender: row[5], dateOfBirth: row[6], admissionDate: row[7],
  email: '', phone: '', academicYear: '2026',
}));
