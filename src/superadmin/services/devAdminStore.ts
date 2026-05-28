import { ADMIN_KEY } from './apiConfig';
import type {
  AdminAccount,
  AdminRole,
  AdminUser,
  CreateAdminPayload,
  Paginated,
  UpdateAdminPayload,
} from '../types';
import type { ListAdminsParams } from './adminService';

const STORE_KEY = 'iu_dev_admin_accounts';

const fallbackAdmins: AdminAccount[] = [
  {
    id: 'admin_dev',
    name: 'Super Admin',
    email: 'admin@iuindia.com',
    role: 'super_admin',
    status: 'active',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  },
  {
    id: 'admin_dev_support',
    name: 'Support Admin',
    email: 'support.admin@iuindia.com',
    role: 'admin',
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: 'admin_dev_moderator',
    name: 'Content Moderator',
    email: 'moderator@iuindia.com',
    role: 'moderator',
    status: 'suspended',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21).toISOString(),
  },
];

function readCurrentAdmin(): AdminAccount | null {
  const cached = localStorage.getItem(ADMIN_KEY);
  if (!cached) return null;

  try {
    const admin = JSON.parse(cached) as AdminUser;
    return {
      ...admin,
      status: 'active',
      createdAt: admin.createdAt ?? new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

function normalizeStoredAdmins(admins: AdminAccount[]): AdminAccount[] {
  const current = readCurrentAdmin();
  const seeded = current ? [current, ...admins] : admins;
  return Array.from(new Map(seeded.map((admin) => [admin.id, admin])).values());
}

function readAdmins(): AdminAccount[] {
  const stored = localStorage.getItem(STORE_KEY);
  if (!stored) {
    const initial = normalizeStoredAdmins(fallbackAdmins);
    writeAdmins(initial);
    return initial;
  }

  try {
    return normalizeStoredAdmins(JSON.parse(stored) as AdminAccount[]);
  } catch {
    writeAdmins(fallbackAdmins);
    return fallbackAdmins;
  }
}

function writeAdmins(admins: AdminAccount[]): void {
  localStorage.setItem(STORE_KEY, JSON.stringify(admins));
}

function paginate<T>(items: T[], page = 1, pageSize = 20): Paginated<T> {
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const start = (safePage - 1) * safePageSize;

  return {
    data: items.slice(start, start + safePageSize),
    total: items.length,
    page: safePage,
    pageSize: safePageSize,
  };
}

function matchSearch(admin: AdminAccount, search?: string): boolean {
  const query = search?.trim().toLowerCase();
  if (!query) return true;

  return `${admin.name} ${admin.email}`.toLowerCase().includes(query);
}

function requireDevAdmin(id: string, admins: AdminAccount[]): AdminAccount {
  const admin = admins.find((item) => item.id === id);
  if (!admin) {
    throw new Error('Admin not found in DEV local store.');
  }
  return admin;
}

export function listDevAdmins(params: ListAdminsParams = {}): Paginated<AdminAccount> {
  const admins = readAdmins()
    .filter((admin) => matchSearch(admin, params.search))
    .filter((admin) => (params.role ? admin.role === params.role : true))
    .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));

  return paginate(admins, params.page, params.pageSize);
}

export function createDevAdmin(payload: CreateAdminPayload): AdminAccount {
  const admins = readAdmins();
  const now = new Date().toISOString();
  const admin: AdminAccount = {
    id: `admin_dev_${crypto.randomUUID?.() ?? Date.now().toString(36)}`,
    name: payload.name.trim(),
    email: payload.email.trim(),
    role: payload.role,
    status: 'active',
    createdAt: now,
    inviteUrl: payload.password ? undefined : `http://localhost:5173/admin/login?invite=dev-${Date.now()}`,
  };

  writeAdmins([admin, ...admins]);
  return admin;
}

export function updateDevAdmin(id: string, payloadOrRole: UpdateAdminPayload | AdminRole): AdminAccount {
  const admins = readAdmins();
  const payload =
    typeof payloadOrRole === 'string' ? ({ role: payloadOrRole } satisfies UpdateAdminPayload) : payloadOrRole;
  const existing = requireDevAdmin(id, admins);
  const updated: AdminAccount = {
    ...existing,
    name: payload.name?.trim() || existing.name,
    role: payload.role ?? existing.role,
  };

  writeAdmins(admins.map((admin) => (admin.id === id ? updated : admin)));
  return updated;
}

export function setDevAdminStatus(id: string, status: AdminAccount['status']): AdminAccount {
  const admins = readAdmins();
  const existing = requireDevAdmin(id, admins);
  const updated: AdminAccount = { ...existing, status };

  writeAdmins(admins.map((admin) => (admin.id === id ? updated : admin)));
  return updated;
}

export function removeDevAdmin(id: string): void {
  writeAdmins(readAdmins().filter((admin) => admin.id !== id));
}
