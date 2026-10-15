import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

// Always portals to BODY, so page transitions/transforms cannot shift the dialog.
// Header and footer stay visible; only the middle section can scroll.
export default function ModalShell({ title, description, icon: Icon, children, footer, onClose, width = 'max-w-[680px]' }) {
  useEffect(() => {
    const previous=document.body.style.overflow;
    document.body.style.overflow='hidden';
    const onKey=e=>{ if (e.key==='Escape') onClose(); };
    document.addEventListener('keydown',onKey);
    return ()=>{document.body.style.overflow=previous;document.removeEventListener('keydown',onKey);};
  },[onClose]);
  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#09090B]/65 p-3 backdrop-blur-[3px] sm:p-6" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}>
      <section role="dialog" aria-modal="true" aria-label={title} className={`flex w-full ${width} max-h-[calc(100dvh-1.5rem)] flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_30px_90px_rgba(0,0,0,0.25)] sm:max-h-[calc(100dvh-3rem)] sm:rounded-[26px]`}>
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-zinc-100 px-5 py-4 sm:px-7 sm:py-5">
          <div className="flex min-w-0 items-center gap-3">
            {Icon && <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#F7FEE7] text-[#4D7C0F]"><Icon size={21}/></span>}
            <div className="min-w-0"><h2 className="truncate text-[16px] font-extrabold text-zinc-900 sm:text-lg">{title}</h2>{description && <p className="mt-1 text-[11px] text-zinc-500">{description}</p>}</div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="rounded-xl p-2.5 text-zinc-500 hover:bg-zinc-100"><X size={19}/></button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 [scrollbar-width:thin] sm:px-7 sm:py-6">{children}</div>
        {footer && <footer className="flex shrink-0 flex-wrap items-center justify-end gap-3 border-t border-zinc-100 bg-white px-5 py-3 sm:px-7 sm:py-4">{footer}</footer>}
      </section>
    </div>,document.body
  );
}
export const inputClass='h-11 w-full rounded-xl border border-[#E4E4E7] bg-white px-3.5 text-[12px] font-medium text-[#18181B] outline-none transition focus:border-[#84CC16] focus:ring-4 focus:ring-[#A3E635]/15 disabled:bg-zinc-50';
export const primaryButton='inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#18181B] px-5 py-2.5 text-[12px] font-bold text-white transition hover:bg-[#333339] disabled:cursor-not-allowed disabled:opacity-50';
export const secondaryButton='inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#E4E4E7] bg-white px-4 py-2.5 text-[12px] font-bold text-zinc-700 transition hover:bg-zinc-50';
export function Field({ label, error, required, children }) {
  return <div className="min-w-0"><label className="mb-2 block text-[12px] font-semibold text-zinc-700">{label}{required && <span className="ml-1 text-red-600">*</span>}</label>{children}{error && <p role="alert" className="mt-1.5 text-[11px] font-medium text-red-600">{error}</p>}</div>;
}
