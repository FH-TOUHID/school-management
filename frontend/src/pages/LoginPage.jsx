import { useEffect, useState } from 'react';
import {
  ArrowRight, BookOpenCheck, CalendarCheck2, Check, ChevronDown,
  Eye, EyeOff, GraduationCap, LockKeyhole, Mail, ShieldCheck,
  School, Sparkles, UsersRound,
} from 'lucide-react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { DEMO_PASSWORD, DEMO_USERS, getHomeRoute } from '../auth/demoAuth';
import { useAuth } from '../context/AuthContext';

const roleMeta = {
  admin: { label: 'Administrator', icon: ShieldCheck, accent: 'Admin workspace' },
  teacher: { label: 'Teacher', icon: BookOpenCheck, accent: 'Teacher workspace' },
  student: { label: 'Student', icon: GraduationCap, accent: 'Student workspace' },
};

function Brand({ dark = false }) {
  return (
    <div className="inline-flex items-center gap-3">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-[14px] bg-[#A3E635] text-[#18181B] shadow-[0_10px_30px_rgba(163,230,53,0.16)]">
        <School size={25} strokeWidth={2.2} aria-hidden="true" />
      </span>
      <span>
        <strong className={`block text-[21px] font-extrabold tracking-[-0.9px] ${dark ? 'text-[#18181B]' : 'text-white'}`}>Edu<span className="text-[#84CC16]">Sphere</span></strong>
        <span className={`block text-[9px] font-bold uppercase tracking-[0.27em] ${dark ? 'text-zinc-500' : 'text-zinc-500'}`}>School management</span>
      </span>
    </div>
  );
}

function HeroPreview() {
  return (
    <div className="relative mx-auto mt-12 max-w-[550px] rounded-[28px] border border-white/10 bg-[#242428]/95 p-4 shadow-[0_35px_90px_rgba(0,0,0,0.34)] sm:mt-16 sm:p-5" aria-hidden="true">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-[#A3E635] text-[#18181B]"><GraduationCap size={17}/></span>
          <div><p className="text-xs font-bold text-white">School overview</p><p className="mt-0.5 text-[10px] text-zinc-500">Academic session 2026</p></div>
        </div>
        <span className="rounded-full bg-[#A3E635]/12 px-2.5 py-1 text-[10px] font-bold text-[#BEF264]">● Live preview</span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2.5 sm:gap-3">
        {[
          { icon: UsersRound, label: 'Students', value: '1,250', color: 'text-[#A3E635]' },
          { icon: GraduationCap, label: 'Teachers', value: '48', color: 'text-white' },
          { icon: CalendarCheck2, label: 'Attendance', value: '94%', color: 'text-white' },
        ].map((metric) => {
          const Icon = metric.icon;
          return <div key={metric.label} className="rounded-2xl border border-white/5 bg-[#303035] p-3 sm:p-4">
            <Icon size={16} className="text-zinc-400"/>
            <p className={`mt-3 text-[20px] font-extrabold tracking-[-0.5px] sm:text-2xl ${metric.color}`}>{metric.value}</p>
            <p className="mt-1 text-[10px] text-zinc-400">{metric.label}</p>
          </div>;
        })}
      </div>
      <div className="mt-3 rounded-2xl bg-[#303035] p-4">
        <div className="flex items-center justify-between"><p className="text-xs font-semibold text-white">Weekly attendance</p><span className="text-[10px] text-zinc-400">Mon–Fri</span></div>
        <div className="mt-4 flex h-[94px] items-end justify-between gap-3">
          {[52, 70, 61, 83, 96].map((v, i) => <div key={i} className="flex flex-1 flex-col items-center gap-2"><div className="flex h-[75px] w-full items-end rounded-t-lg bg-white/5"><div className={`w-full rounded-t-lg ${i === 4 ? 'bg-[#A3E635]' : 'bg-[#707C50]'}`} style={{height:`${v}%`}}/></div><span className="text-[9px] font-medium text-zinc-500">{['M','T','W','T','F'][i]}</span></div>)}
        </div>
      </div>
      <div className="absolute -bottom-6 -right-2 flex items-center gap-2 rounded-2xl border border-[#D9F99D]/30 bg-[#A3E635] px-4 py-3 text-[#18181B] shadow-xl shadow-black/20 sm:-right-6">
        <span className="flex size-8 items-center justify-center rounded-xl bg-[#18181B]/10"><Check size={17}/></span>
        <span><strong className="block text-[11px]">All in one place</strong><small className="text-[10px]">A smarter school day</small></span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const { user, signIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [demoOpen, setDemoOpen] = useState(false);

  useEffect(() => { document.title = 'Sign in · EduSphere'; }, []);
  if (user) return <Navigate to={getHomeRoute(user.role)} replace />;

  const emailInvalid = submitted && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const passwordInvalid = submitted && !password;

  function fillDemo(profile) {
    setEmail(profile.email);
    setPassword(DEMO_PASSWORD);
    setError('');
    setSubmitted(false);
    setDemoOpen(false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
    setError('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || !password) return;
    const success = signIn(email, password);
    if (!success) {
      setError('Demo account not found. Choose a demo role below or check your password.');
      return;
    }
    const account = DEMO_USERS.find((item) => item.email === email.trim().toLowerCase());
    const requested = location.state?.from;
    const allowedPath = typeof requested === 'string' && requested.startsWith(`/${account.role}/`)
      ? requested : getHomeRoute(account.role);
    navigate(allowedPath, { replace: true });
  }

  return (
    <div className="min-h-screen bg-[#F4F4F5] font-sans text-[#18181B] lg:grid lg:grid-cols-[minmax(0,1.03fr)_minmax(0,0.97fr)]">
      <section className="relative hidden min-h-screen flex-col justify-between overflow-hidden bg-[#18181B] px-10 py-9 text-white lg:flex xl:px-16 xl:py-12">
        <div className="pointer-events-none absolute -right-28 -top-28 size-[470px] rounded-full border-[85px] border-[#A3E635]/[0.08]"/>
        <div className="pointer-events-none absolute -left-44 bottom-1/4 size-[470px] rounded-full border-[85px] border-white/[0.035]"/>
        <div className="relative z-10"><Brand /></div>
        <div className="relative z-10 mx-auto w-full max-w-[560px] py-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#A3E635]/25 bg-[#A3E635]/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#C4F586]"><Sparkles size={13}/> Designed for better learning</span>
          <h1 className="mt-6 max-w-[570px] text-[42px] font-extrabold leading-[1.1] tracking-[-2px] xl:text-[54px]">Everything your school needs, <span className="text-[#A3E635]">beautifully organized.</span></h1>
          <p className="mt-5 max-w-[490px] text-[14px] leading-7 text-zinc-400">One connected workspace for students, teachers, attendance, classes, results and school notices.</p>
          <HeroPreview />
        </div>
        <div className="relative z-10 flex items-center justify-between gap-4 text-[11px] text-zinc-500"><span>© {new Date().getFullYear()} EduSphere</span><span>Built for Bangladesh schools</span></div>
      </section>

      <main className="relative flex min-h-screen items-center justify-center px-5 py-8 sm:px-10 lg:px-12 xl:px-20">
        <div className="absolute left-5 top-5 lg:hidden"><Brand dark/></div>
        <div className="w-full max-w-[445px] pt-16 lg:pt-0">
          <div className="mb-8 flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#E4E4E7] bg-white px-3.5 py-2 text-[11px] font-semibold text-zinc-600"><span className="size-2 rounded-full bg-[#84CC16]"/> Academic session 2026</span>
            <span className="hidden text-[11px] font-semibold text-zinc-500 sm:block">Single school platform</span>
          </div>
          <p className="text-[11px] font-bold uppercase tracking-[0.23em] text-[#65A30D]">Welcome to EduSphere</p>
          <h2 className="mt-3 text-[36px] font-extrabold leading-[1.16] tracking-[-1.5px] sm:text-[44px]">Welcome back<span className="text-[#84CC16]">.</span></h2>
          <p className="mt-3 text-[13px] leading-6 text-zinc-500">Sign in to manage your school day with ease.</p>

          <form className="mt-9 space-y-5" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="login-email" className="mb-2 block text-xs font-bold text-zinc-700">Email address</label>
              <div className={`flex h-[54px] items-center gap-3 rounded-xl border bg-white px-4 transition focus-within:border-[#84CC16] focus-within:ring-4 focus-within:ring-[#A3E635]/15 ${emailInvalid ? 'border-red-400' : 'border-[#E4E4E7]'}`}>
                <Mail size={18} className="shrink-0 text-zinc-400" aria-hidden="true" />
                <input id="login-email" autoComplete="username" type="email" value={email} onChange={(event) => {setEmail(event.target.value);setError('');}} placeholder="name@school.edu.bd" aria-invalid={emailInvalid} aria-describedby={emailInvalid ? 'email-error' : undefined} className="min-w-0 flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"/>
              </div>
              {emailInvalid && <p id="email-error" className="mt-2 text-xs text-red-600">Please enter a valid email address.</p>}
            </div>
            <div>
              <label htmlFor="login-password" className="mb-2 block text-xs font-bold text-zinc-700">Password</label>
              <div className={`flex h-[54px] items-center gap-3 rounded-xl border bg-white px-4 transition focus-within:border-[#84CC16] focus-within:ring-4 focus-within:ring-[#A3E635]/15 ${passwordInvalid ? 'border-red-400' : 'border-[#E4E4E7]'}`}>
                <LockKeyhole size={18} className="shrink-0 text-zinc-400" aria-hidden="true" />
                <input id="login-password" autoComplete="current-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => {setPassword(event.target.value);setError('');}} placeholder="Enter your password" aria-invalid={passwordInvalid} aria-describedby={passwordInvalid ? 'password-error' : undefined} className="min-w-0 flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400" />
                <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} className="rounded-lg p-1 text-zinc-400 hover:text-zinc-900">{showPassword ? <EyeOff size={19}/> : <Eye size={19}/>}</button>
              </div>
              {passwordInvalid && <p id="password-error" className="mt-2 text-xs text-red-600">Password is required.</p>}
            </div>
            {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium leading-5 text-red-700">{error}</div>}
            <button type="submit" className="group flex h-[54px] w-full items-center justify-center gap-2 rounded-xl bg-[#18181B] text-sm font-bold text-white shadow-[0_10px_30px_rgba(24,24,27,0.12)] transition hover:bg-[#303036] active:scale-[0.99]">Sign in <ArrowRight size={17} className="transition-transform group-hover:translate-x-1"/></button>
          </form>

          <div className="my-7 flex items-center gap-3"><span className="h-px flex-1 bg-[#E4E4E7]"/><span className="text-[11px] font-medium text-zinc-400">OR EXPLORE DEMO</span><span className="h-px flex-1 bg-[#E4E4E7]"/></div>
          <div className="rounded-2xl border border-[#E4E4E7] bg-white p-3 shadow-[0_4px_20px_rgba(0,0,0,0.025)]">
            <button type="button" onClick={() => setDemoOpen((v) => !v)} aria-expanded={demoOpen} className="flex w-full items-center justify-between rounded-xl px-2 py-2 text-left hover:bg-zinc-50">
              <span className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-xl bg-[#F7FEE7] text-[#4D7C0F]"><UsersRound size={17}/></span><span><strong className="block text-xs font-bold">Try a demo account</strong><small className="mt-1 block text-[11px] text-zinc-500">Admin, Teacher or Student</small></span></span>
              <ChevronDown size={17} className={`text-zinc-400 transition-transform ${demoOpen ? 'rotate-180' : ''}`}/>
            </button>
            {demoOpen && <div className="mt-2 grid gap-2 border-t border-[#F1F1F2] pt-3 sm:grid-cols-3">
              {DEMO_USERS.map((profile) => {
                const Icon = roleMeta[profile.role].icon;
                return <button type="button" key={profile.id} onClick={() => fillDemo(profile)} className="flex items-center gap-2 rounded-xl border border-[#E4E4E7] px-3 py-3 text-left transition hover:border-[#A3E635] hover:bg-[#F7FEE7] sm:flex-col sm:items-start">
                  <Icon size={17} className="text-[#4D7C0F]"/><span className="text-[11px] font-bold text-zinc-800">{roleMeta[profile.role].label}</span>
                </button>;
              })}
            </div>}
          </div>
          <p className="mt-6 text-center text-[11px] leading-5 text-zinc-500">UI demo only — no real authentication or database connection yet.</p>
          <p className="mt-3 text-center text-[10px] text-zinc-400">Use a demo role to autofill credentials, then select Sign in.</p>
        </div>
      </main>
    </div>
  );
}
