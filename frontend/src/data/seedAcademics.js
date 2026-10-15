// Fictional school configuration, for frontend demonstrations only.
export const seedAcademics = {
  activeYear: '2026',
  years: ['2025', '2026'],
  classes: Array.from({ length: 10 }, (_, i) => ({
    id: `CLS-${String(i + 1).padStart(2, '0')}`,
    name: String(i + 1),
    sections: i < 5 ? ['A', 'B'] : ['A', 'B', 'C'],
  })),
  subjects: [
    { id:'SUB-01', code:'BAN', name:'Bangla', category:'Core' },
    { id:'SUB-02', code:'ENG', name:'English', category:'Core' },
    { id:'SUB-03', code:'MAT', name:'Mathematics', category:'Core' },
    { id:'SUB-04', code:'SCI', name:'General Science', category:'Core' },
    { id:'SUB-05', code:'BGS', name:'Bangladesh & Global Studies', category:'Core' },
    { id:'SUB-06', code:'ICT', name:'Information & Communication Technology', category:'Core' },
    { id:'SUB-07', code:'REL', name:'Religion & Moral Education', category:'Core' },
    { id:'SUB-08', code:'PHY', name:'Physics', category:'Science' },
    { id:'SUB-09', code:'CHE', name:'Chemistry', category:'Science' },
    { id:'SUB-10', code:'BIO', name:'Biology', category:'Science' },
  ],
  classSubjects: Object.fromEntries(Array.from({ length: 10 }, (_, i) => [String(i + 1), i < 8 ? ['SUB-01','SUB-02','SUB-03','SUB-04','SUB-05','SUB-06','SUB-07'] : ['SUB-01','SUB-02','SUB-03','SUB-05','SUB-06','SUB-07','SUB-08','SUB-09','SUB-10']])),
};
