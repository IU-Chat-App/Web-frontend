import { ReactNode, useEffect } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hideCloseButton?: boolean;
}

const sizeMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
} as const;

/**
 * Generic accessible modal. Esc-to-close, click-outside-to-close,
 * body scroll lock, fade animation.
 */
export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  hideCloseButton,
}: Props) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${sizeMap[size]} bg-white dark:bg-slate-900 rounded-2xl shadow-soft-lg border border-slate-200 dark:border-slate-800 overflow-hidden animate-fade-in-up`}
      >
        {(title || !hideCloseButton) && (
          <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-3">
            <div className="min-w-0">
              {title && (
                <h3 className="font-display font-bold text-lg text-text-dark dark:text-white">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-sm text-text-light dark:text-slate-400 mt-1">{description}</p>
              )}
            </div>
            {!hideCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="p-1.5 rounded-lg text-text-light dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        <div className="px-6 pb-5">{children}</div>

        {footer && (
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
