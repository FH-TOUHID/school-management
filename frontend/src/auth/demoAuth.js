/** UI-only fixtures. Never use these credentials or checks in a production backend. */
export const DEMO_PASSWORD = 'Demo1234!';
export const DEMO_USERS = [
  { id: 'demo-admin', name: 'Farhan Ahmed', email: 'admin@school.test', role: 'admin', initials: 'FA' },
  { id: 'demo-teacher', name: 'Nusrat Jahan', email: 'teacher@school.test', role: 'teacher', initials: 'NJ' },
  { id: 'demo-student', name: 'Rafi Hasan', email: 'student@school.test', role: 'student', initials: 'RH' },
];

const STORAGE_KEY = 'edusphere_demo_session_v1';

export function getHomeRoute(role) {
  if (role === 'admin') return '/admin/dashboard';
  if (role === 'teacher') return '/teacher/dashboard';
  if (role === 'student') return '/student/dashboard';
  return '/login';
}

export function authenticateDemo(email, password) {
  const user = DEMO_USERS.find((item) => item.email === email.trim().toLowerCase());
  return user && password === DEMO_PASSWORD ? user : null;
}

export function loadDemoUser() {
  try {
    const id = window.sessionStorage.getItem(STORAGE_KEY);
    return DEMO_USERS.find((item) => item.id === id) ?? null;
  } catch {
    return null;
  }
}

export function saveDemoUser(user) {
  try { window.sessionStorage.setItem(STORAGE_KEY, user.id); } catch { /* no persistence in private mode */ }
}

export function clearDemoUser() {
  try { window.sessionStorage.removeItem(STORAGE_KEY); } catch { /* no-op */ }
}
