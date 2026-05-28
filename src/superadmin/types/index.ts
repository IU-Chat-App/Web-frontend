// All shared TypeScript contracts for the Super Admin Portal.
// Adjust shapes to match the real api.iuindia.com responses without
// having to touch the rest of the codebase.

// ---------------- Auth ----------------
export type AdminRole = 'super_admin' | 'admin' | 'moderator';
export type AdminStatus = 'active' | 'suspended';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar?: string;
  createdAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  admin: AdminUser;
}

// ---------------- Admin accounts (managed by super admin) ----------------
export interface AdminAccount extends AdminUser {
  status: AdminStatus;
  lastLoginAt?: string;
  /** Optional invite link if backend supports invite-by-email. */
  inviteUrl?: string;
}

export interface CreateAdminPayload {
  name: string;
  email: string;
  role: AdminRole;
  /** If omitted, backend should send an invite link to the email. */
  password?: string;
}

export interface UpdateAdminPayload {
  name?: string;
  role?: AdminRole;
}

// ---------------- Users ----------------
export type UserStatus = 'active' | 'blocked' | 'pending';

export type UserSort = 'latest' | 'oldest' | 'name_asc' | 'name_desc' | 'last_active';

export interface AppUser {
  id: string;
  name: string;
  username?: string;
  phone: string;
  email?: string;
  avatar?: string;
  status: UserStatus;
  isOnline?: boolean;
  lastSeen?: string;
  createdAt: string;
  country?: string;
  bio?: string;
  totalMessages?: number;
  totalCalls?: number;
}

// ---------------- Support Tickets ----------------
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketCategory =
  | 'bug'
  | 'account'
  | 'abuse'
  | 'payment'
  | 'feature_request'
  | 'other';

export interface TicketAuthor {
  id: string;
  name: string;
  role: 'user' | 'admin';
  avatar?: string;
}

export interface TicketReply {
  id: string;
  ticketId: string;
  author: TicketAuthor;
  body: string;
  createdAt: string;
  attachments?: { url: string; name: string }[];
}

export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  category: TicketCategory;
  status: TicketStatus;
  priority: TicketPriority;
  user: TicketAuthor;
  assignedTo?: TicketAuthor;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  repliesCount: number;
  unread?: boolean;
}

export interface SupportTicketDetail extends SupportTicket {
  replies: TicketReply[];
}

// ---------------- Dashboard ----------------
export interface DashboardOverview {
  totalUsers: number;
  activeUsers: number;
  onlineUsers: number;
  usersToday: number;
  usersThisWeek: number;
  usersThisMonth: number;
  totalReports: number;
  reportedUsers: number;
  blockedUsers: number;
  growthRate?: number;
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
}

/** Returned by `GET /admin/analytics/registrations?from=&to=`. */
export interface RegistrationsRangeResponse {
  /** Total number of users registered in the [from, to] window. */
  total: number;
  /** Daily breakdown across the same window (one point per calendar day). */
  daily: TimeSeriesPoint[];
}

export type ActivityType =
  | 'user_registered'
  | 'user_online'
  | 'user_blocked'
  | 'message_sent'
  | 'call_started'
  | 'report_filed'
  | 'admin_action'
  | 'group_created';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  message: string;
  userId?: string;
  userName?: string;
  createdAt: string;
}

export interface MessageBreakdown {
  type: string;
  count: number;
}

// ---------------- Notifications ----------------
export type NotificationSeverity = 'info' | 'success' | 'warning' | 'error';

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  severity: NotificationSeverity;
  read?: boolean;
  link?: string;
  createdAt: string;
}

// ---------------- Settings ----------------
export interface AppSettings {
  appVersion: string;
  maintenanceMode: boolean;
  maintenanceMessage?: string;
  maxImageUploadMb: number;
  maxVideoUploadMb: number;
  maxAudioUploadMb: number;
  features: {
    voiceCalls: boolean;
    videoCalls: boolean;
    groups: boolean;
    broadcasts: boolean;
    fileSharing: boolean;
    locationSharing: boolean;
  };
  privacyPolicy: string;
  termsOfService: string;
}

// ---------------- Misc ----------------
export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type DateRange = '7d' | '30d' | '90d' | '12m' | 'all';
