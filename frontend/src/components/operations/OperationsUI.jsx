import { ArrowUpRight, CircleHelp, Inbox, Sparkles } from 'lucide-react';

export function PageHeading({ eyebrow, title, subtitle, action }) {
  return <header className="flex flex-wrap items-start justify-between gap-4">
    <div><p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#65A30D]">{eyebrow} <span className="text-zinc-400">/ 2026</span></p>
      <h1 className="mt-2 text-[28px] font-extrabold tracking-[-1.2px] text-[#18181B] sm:text-[35px]">{title}<span className="text-[#84CC16]">.</span></h1>
      <p className="mt-2 max-w-xl text-[13px] leading-6 text-zinc-500">{subtitle}</p>
    </div>{action}
  </header>;
}
export function HeroBanner({ label, title, accent, subtitle, badge }) {
  return <section className="relative isolate overflow-hidden rounded-[24px] bg-[#18181B] px-6 py-7 text-white sm:px-8 sm:py-8">
    <div className="pointer-events-none absolute -right-14 -top-28 -z-10 size-72 rounded-full border-[44px] border-[#A3E635]/15" />
    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.16em] text-[#C9FA8E]"><Sparkles size={13}/>{label}</div>
    <h2 className="mt-4 text-[23px] font-extrabold tracking-[-.8px] sm:text-[29px]">{title} <span className="text-[#A3E635]">{accent}</span></h2>
    <p className="mt-2 max-w-2xl text-[12px] leading-6 text-zinc-300">{subtitle}</p>
    {badge && <span className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/20 px-3 py-2 text-[11px] font-semibold text-zinc-200">{badge}<ArrowUpRight size={14}/></span>}
  </section>;
}
export function MetricCard({ icon:Icon,label,value,caption,dark=false }) {
  return <article className={`rounded-[21px] border p-5 ${dark?'border-[#18181B] bg-[#18181B] text-white':'border-[#E4E4E7] bg-white text-[#18181B]'}`}>
    <div className="flex items-start justify-between gap-3"><p className={`text-[12px] font-medium ${dark?'text-zinc-300':'text-zinc-500'}`}>{label}</p><span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${dark?'bg-[#A3E635] text-[#18181B]':'bg-[#F7FEE7] text-[#4D7C0F]'}`}><Icon size={19}/></span></div>
    <p className="mt-1 text-[30px] font-extrabold tracking-[-1px]">{value}</p><p className={`mt-2 text-[11px] ${dark?'text-[#C9FA8E]':'text-zinc-400'}`}>{caption}</p>
  </article>;
}
export function EmptyState({title='No records found',description='Try changing the filters or adding a new record.'}) {
  return <div className="flex min-h-44 flex-col items-center justify-center px-6 py-10 text-center"><span className="flex size-12 items-center justify-center rounded-2xl bg-[#F7FEE7] text-[#65A30D]"><Inbox size={23}/></span><p className="mt-4 text-sm font-extrabold text-zinc-800">{title}</p><p className="mt-2 max-w-sm text-xs leading-5 text-zinc-500">{description}</p></div>;
}
export function DemoNotice({ children }) {
  return <div className="flex items-start gap-2.5 rounded-xl border border-[#DCF2B6] bg-[#F7FEE7] px-4 py-3 text-[11px] leading-5 text-[#4D7C0F]"><CircleHelp size={16} className="mt-0.5 shrink-0"/><span>{children || 'UI demo only. Data is kept in this tab and is not saved to the Go backend.'}</span></div>;
}
export function Toast({ message, onDismiss }) {
  return message ? <div role="status" className="fixed bottom-5 right-4 z-[110] flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-2xl bg-[#18181B] px-5 py-3 text-[12px] font-semibold text-white shadow-xl"><span className="size-2 rounded-full bg-[#A3E635]"/>{message}<button onClick={onDismiss} className="ml-1 text-[#A3E635] underline underline-offset-2">Dismiss</button></div> : null;
}
export const days = [{n:0,label:'Sunday',short:'Sun'},{n:1,label:'Monday',short:'Mon'},{n:2,label:'Tuesday',short:'Tue'},{n:3,label:'Wednesday',short:'Wed'},{n:4,label:'Thursday',short:'Thu'}];
export const periods = [
  {id:1,label:'Period 1',time:'09:00 – 09:45'},
  {id:2,label:'Period 2',time:'09:45 – 10:30'},
  {id:3,label:'Period 3',time:'10:45 – 11:30'},
  {id:4,label:'Period 4',time:'11:30 – 12:15'},
  {id:5,label:'Period 5',time:'12:45 – 13:30'},
];
export const dateDisplay = date => {if(!date)return '—';const d=new Date(date+'T12:00:00');return Number.isNaN(d.getTime())?date:d.toLocaleDateString('en-BD',{month:'short',day:'numeric',year:'numeric'});};
