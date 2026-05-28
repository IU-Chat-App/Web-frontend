import Modal from './Modal';

interface Props {
  open: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'danger';
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

/**
 * Pre-styled confirmation dialog. Use for destructive actions.
 */
export default function ConfirmationDialog({
  open,
  title = 'Are you sure?',
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  loading,
  onConfirm,
  onClose,
}: Props) {
  const confirmCls =
    variant === 'danger'
      ? 'bg-rose-600 hover:bg-rose-700 text-white'
      : 'bg-primary-blue hover:bg-dark-blue text-white';

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 text-text-dark dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${confirmCls} disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {loading ? 'Working…' : confirmLabel}
          </button>
        </>
      }
    >
      {variant === 'danger' && (
        <div className="flex items-start gap-3 p-3 mt-1 rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30">
          <svg className="w-5 h-5 mt-0.5 text-rose-600 dark:text-rose-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 3h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <p className="text-sm text-rose-700 dark:text-rose-300">
            This action cannot be undone.
          </p>
        </div>
      )}
    </Modal>
  );
}
