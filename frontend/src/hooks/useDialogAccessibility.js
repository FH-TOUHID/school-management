import { useEffect, useRef } from 'react';

// Shared accessibility behavior for every overlay. Nested dialogs remain safe:
// only the top dialog captures Escape/Tab and scroll locks are reference-counted.
const dialogStack = [];
let scrollLocks = 0;
let originalOverflow = '';
const FOCUSABLE = [
  'a[href]', 'button:not([disabled])', 'input:not([disabled])',
  'select:not([disabled])', 'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

export default function useDialogAccessibility(onClose) {
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    const previousFocus = document.activeElement;
    dialogStack.push(dialog);
    if (scrollLocks++ === 0) {
      originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    const getFocusable = () => Array.from(dialog.querySelectorAll(FOCUSABLE))
      .filter(el => el.getClientRects().length && !el.closest('[inert]'));
    // Delay until children and any nested conditional fields are mounted.
    const first = dialog.querySelector('[data-dialog-initial-focus]') || dialog.querySelector('[autofocus]') || getFocusable()[0] || dialog;
    first.focus({ preventScroll: true });

    function onKeyDown(event) {
      if (dialogStack.at(-1) !== dialog) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onCloseRef.current?.();
      } else if (event.key === 'Tab') {
        const nodes = getFocusable();
        if (!nodes.length) { event.preventDefault(); dialog.focus(); return; }
        const firstNode = nodes[0];
        const lastNode = nodes[nodes.length - 1];
        if (event.shiftKey && (document.activeElement === firstNode || !dialog.contains(document.activeElement))) {
          event.preventDefault();
          lastNode.focus();
        } else if (!event.shiftKey && (document.activeElement === lastNode || !dialog.contains(document.activeElement))) {
          event.preventDefault();
          firstNode.focus();
        }
      }
    }
    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      const index = dialogStack.lastIndexOf(dialog);
      if (index !== -1) dialogStack.splice(index, 1);
      scrollLocks = Math.max(0, scrollLocks - 1);
      if (scrollLocks === 0) document.body.style.overflow = originalOverflow;
      if (previousFocus?.isConnected && typeof previousFocus.focus === 'function') {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, []);
  return dialogRef;
}
