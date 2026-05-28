import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { API_URL } from '../services/api';
import { SOCKET_URL } from '../utils/socket';
import settingsService from '../services/settingsService';
import { SkeletonRows } from '../components/LoadingSkeleton';
import type { AppSettings } from '../types';

const FEATURE_KEYS: { key: keyof AppSettings['features']; label: string; helper: string }[] = [
  { key: 'voiceCalls', label: 'Voice calls', helper: 'Enable peer-to-peer voice calls.' },
  { key: 'videoCalls', label: 'Video calls', helper: 'Enable peer-to-peer video calls.' },
  { key: 'groups', label: 'Groups', helper: 'Allow users to create chat groups.' },
  { key: 'broadcasts', label: 'Broadcasts', helper: 'Allow broadcasts from accounts.' },
  { key: 'fileSharing', label: 'File sharing', helper: 'Allow file attachments.' },
  { key: 'locationSharing', label: 'Location sharing', helper: 'Allow sharing live location.' },
];

export default function Settings() {
  const { admin } = useAuth();
  const { theme, setTheme } = useTheme();

  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setSettings(await settingsService.get());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function patch(partial: Partial<AppSettings>) {
    setSettings((s) => (s ? { ...s, ...partial } : s));
  }

  function patchFeatures(key: keyof AppSettings['features'], value: boolean) {
    setSettings((s) =>
      s ? { ...s, features: { ...s.features, [key]: value } } : s,
    );
  }

  async function save() {
    if (!settings) return;
    setSaving(true);
    try {
      const updated = await settingsService.update(settings);
      setSettings(updated ?? settings);
      toast.success('Settings saved');
    } catch (e) {
      toast.error((e as { message?: string }).message ?? 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-text-dark dark:text-white">
            Settings
          </h2>
          <p className="text-sm text-text-light dark:text-slate-400 mt-1">
            Configure app behavior, content and admin profile.
          </p>
        </div>
        {settings && (
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-primary-blue to-purple text-white font-semibold shadow-glow hover:shadow-glow-lg disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        )}
      </div>

      {/* Profile */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft p-6">
        <h3 className="font-display font-semibold text-text-dark dark:text-white mb-4">Profile</h3>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <Field label="Name" value={admin?.name} />
          <Field label="Email" value={admin?.email} />
          <Field label="Role" value={admin?.role} />
          <Field label="Admin ID" value={<span className="font-mono text-xs">{admin?.id}</span>} />
        </dl>
      </section>

      {/* App configuration */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft p-6 space-y-5">
        <h3 className="font-display font-semibold text-text-dark dark:text-white">
          App configuration
        </h3>
        {loading || !settings ? (
          <SkeletonRows count={4} />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <LabeledInput
                label="App version"
                value={settings.appVersion}
                onChange={(v) => patch({ appVersion: v })}
                placeholder="e.g. 2.4.1"
              />
              <LabeledInput
                label="Maintenance message"
                value={settings.maintenanceMessage ?? ''}
                onChange={(v) => patch({ maintenanceMessage: v })}
                placeholder="Shown when maintenance mode is on"
              />
            </div>

            <Toggle
              label="Maintenance mode"
              helper="Block all client app traffic while you ship breaking changes."
              checked={settings.maintenanceMode}
              onChange={(v) => patch({ maintenanceMode: v })}
              danger
            />
          </>
        )}
      </section>

      {/* Upload limits */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft p-6">
        <h3 className="font-display font-semibold text-text-dark dark:text-white mb-4">
          Max upload limits
        </h3>
        {loading || !settings ? (
          <SkeletonRows count={2} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <NumberInput
              label="Images (MB)"
              value={settings.maxImageUploadMb}
              onChange={(v) => patch({ maxImageUploadMb: v })}
            />
            <NumberInput
              label="Videos (MB)"
              value={settings.maxVideoUploadMb}
              onChange={(v) => patch({ maxVideoUploadMb: v })}
            />
            <NumberInput
              label="Audio (MB)"
              value={settings.maxAudioUploadMb}
              onChange={(v) => patch({ maxAudioUploadMb: v })}
            />
          </div>
        )}
      </section>

      {/* Feature toggles */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft p-6">
        <h3 className="font-display font-semibold text-text-dark dark:text-white mb-4">
          Feature toggles
        </h3>
        {loading || !settings ? (
          <SkeletonRows count={3} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FEATURE_KEYS.map((f) => (
              <Toggle
                key={f.key}
                label={f.label}
                helper={f.helper}
                checked={settings.features[f.key]}
                onChange={(v) => patchFeatures(f.key, v)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Privacy / Terms editors */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft p-6 space-y-5">
        <h3 className="font-display font-semibold text-text-dark dark:text-white">
          Legal content
        </h3>
        {loading || !settings ? (
          <SkeletonRows count={3} />
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-text-dark dark:text-white mb-1.5">
                Privacy policy
              </label>
              <textarea
                value={settings.privacyPolicy}
                onChange={(e) => patch({ privacyPolicy: e.target.value })}
                rows={6}
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue resize-y"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark dark:text-white mb-1.5">
                Terms of service
              </label>
              <textarea
                value={settings.termsOfService}
                onChange={(e) => patch({ termsOfService: e.target.value })}
                rows={6}
                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue resize-y"
              />
            </div>
          </>
        )}
      </section>

      {/* Appearance */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft p-6">
        <h3 className="font-display font-semibold text-text-dark dark:text-white mb-4">
          Appearance
        </h3>
        <div className="flex items-center gap-2">
          {(['light', 'dark'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTheme(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
                theme === t
                  ? 'bg-primary-blue text-white border-primary-blue'
                  : 'bg-white dark:bg-slate-900 text-text-dark dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {t === 'light' ? '☀ Light' : '🌙 Dark'}
            </button>
          ))}
        </div>
      </section>

      {/* Environment */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft p-6">
        <h3 className="font-display font-semibold text-text-dark dark:text-white mb-4">
          Environment
        </h3>
        <dl className="space-y-3 text-sm">
          <Row label="API URL" value={API_URL} />
          <Row label="Socket URL" value={SOCKET_URL} />
          <Row label="Build mode" value={import.meta.env.MODE} />
        </dl>
      </section>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div>
      <dt className="text-text-light dark:text-slate-400">{label}</dt>
      <dd className="font-semibold text-text-dark dark:text-white mt-0.5">{value ?? '—'}</dd>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-text-light dark:text-slate-400">{label}</dt>
      <dd className="font-mono text-xs text-text-dark dark:text-slate-200 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">
        {value}
      </dd>
    </div>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-dark dark:text-white mb-1.5">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue"
      />
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-dark dark:text-white mb-1.5">
        {label}
      </label>
      <input
        type="number"
        min={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-950 text-text-dark dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue"
      />
    </div>
  );
}

function Toggle({
  label,
  helper,
  checked,
  onChange,
  danger,
}: {
  label: string;
  helper?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  danger?: boolean;
}) {
  return (
    <label
      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
        checked
          ? danger
            ? 'border-rose-200 bg-rose-50 dark:bg-rose-500/10 dark:border-rose-500/30'
            : 'border-primary-blue/30 bg-blue-50 dark:bg-blue-500/10'
          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800'
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 accent-primary-blue"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text-dark dark:text-white">{label}</p>
        {helper && (
          <p className="text-xs text-text-light dark:text-slate-400 mt-0.5">{helper}</p>
        )}
      </div>
    </label>
  );
}
