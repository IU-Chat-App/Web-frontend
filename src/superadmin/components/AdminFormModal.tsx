import { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Modal from './Modal';
import adminService from '../services/adminService';
import { getApiErrorMessage } from '../utils/apiDebug';
import type { AdminAccount, AdminRole } from '../types';

const ROLES: { value: AdminRole; label: string; helper: string }[] = [
  { value: 'super_admin', label: 'Super admin', helper: 'Full access, can manage other admins.' },
  { value: 'admin', label: 'Admin', helper: 'Manages users and support tickets.' },
  { value: 'moderator', label: 'Moderator', helper: 'Read-only + ticket replies.' },
];

interface Props {
  open: boolean;
  /** If provided we're editing; otherwise creating. */
  admin?: AdminAccount | null;
  onClose: () => void;
  onSaved: (a: AdminAccount) => void;
}

/**
 * Shared create/edit modal for admin accounts.
 * - In create mode: requires name + email + role (+ optional password).
 * - In edit mode: only the role can be changed (name/email are immutable from
 *   the UI; the backend can edit them via PUT if you ever surface fields).
 */
export default function AdminFormModal({ open, admin, onClose, onSaved }: Props) {
  const isEdit = !!admin;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AdminRole>('admin');
  const [password, setPassword] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (admin) {
      setName(admin.name);
      setEmail(admin.email);
      setRole(admin.role);
      setPassword('');
    } else {
      setName('');
      setEmail('');
      setRole('admin');
      setPassword('');
    }
  }, [open, admin]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isEdit && (!name.trim() || !email.trim())) {
      toast.error('Name and email are required');
      return;
    }
    setSending(true);
    const createPayload = {
      name: name.trim(),
      email: email.trim(),
      role,
      password: password.trim() || undefined,
    };

    if (!isEdit && import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log('[AdminFormModal] Submitting Add admin', createPayload);
    }

    try {
      if (isEdit && admin) {
        const updated = await adminService.update(admin.id, { role });
        toast.success(`${admin.name} updated`);
        onSaved(updated);
      } else {
        const created = await adminService.create(createPayload);
        toast.success(
          password.trim()
            ? `${created.name} added with the password you set.`
            : `${created.name} invited — they'll receive an email link.`,
        );
        onSaved(created);
      }
    } catch (err) {
      const message = getApiErrorMessage(err);
      toast.error(message);
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('[AdminFormModal] Add/Edit admin failed:', err);
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? `Edit ${admin?.name}` : 'Add admin'}
      description={
        isEdit
          ? 'Change the role for this teammate. Other fields are immutable from the UI.'
          : 'Invite a teammate to the Super Admin Portal.'
      }
      size="md"
    >
      <form onSubmit={submit} className="space-y-4">
        {!isEdit && (
          <>
            <div>
              <label
                htmlFor="adm-name"
                className="block text-sm font-medium text-text-dark dark:text-white mb-1.5"
              >
                Name
              </label>
              <input
                id="adm-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                required
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-text-dark dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue"
              />
            </div>
            <div>
              <label
                htmlFor="adm-email"
                className="block text-sm font-medium text-text-dark dark:text-white mb-1.5"
              >
                Email
              </label>
              <input
                id="adm-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@iuindia.com"
                required
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-text-dark dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue"
              />
            </div>
          </>
        )}

        <div>
          <span className="block text-sm font-medium text-text-dark dark:text-white mb-2">
            Role
          </span>
          <div className="grid grid-cols-1 gap-2">
            {ROLES.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className={`text-left p-3 rounded-xl border transition ${
                  role === r.value
                    ? 'border-primary-blue bg-blue-50 dark:bg-blue-500/10 ring-2 ring-primary-blue/20'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <p className="font-semibold text-text-dark dark:text-white text-sm">{r.label}</p>
                <p className="text-xs text-text-light dark:text-slate-400 mt-0.5">{r.helper}</p>
              </button>
            ))}
          </div>
        </div>

        {!isEdit && (
          <div>
            <label
              htmlFor="adm-password"
              className="block text-sm font-medium text-text-dark dark:text-white mb-1.5"
            >
              Temporary password <span className="text-text-light dark:text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              id="adm-password"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave empty to email an invite link"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-text-dark dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue"
            />
            <p className="text-xs text-text-light dark:text-slate-500 mt-1">
              If left blank, the backend should email an invite link instead.
            </p>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={sending}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 text-text-dark dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={sending}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-blue to-purple text-white text-sm font-semibold shadow-glow hover:shadow-glow-lg disabled:opacity-60"
          >
            {sending ? 'Saving…' : isEdit ? 'Save changes' : 'Add admin'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
