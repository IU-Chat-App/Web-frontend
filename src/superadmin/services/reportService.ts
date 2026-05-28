import api, { unwrap } from './api';
import type {
  Paginated,
  SupportTicket,
  SupportTicketDetail,
  TicketPriority,
  TicketReply,
  TicketStatus,
} from '../types';

export interface ListTicketsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: '' | TicketStatus;
  priority?: '' | TicketPriority;
}

/**
 * Support ticket service. Powers /admin/reports (the Support Center).
 *
 * Backend endpoints (every call goes to your real API — no client-side
 * mocking is applied):
 *
 *   GET  /admin/reports/tickets?page=&pageSize=&status=&priority=&search=
 *        → Paginated<SupportTicket>
 *
 *   GET  /admin/reports/tickets/:id
 *        → SupportTicketDetail (ticket + replies[])
 *
 *   POST /admin/reports/tickets/:id/replies
 *        body: { body: string }
 *        → TicketReply (the newly-created reply)
 *
 *   PUT  /admin/reports/tickets/:id/status
 *        body: { status: 'open' | 'in_progress' | 'resolved' | 'closed' }
 *        → SupportTicket
 *
 *   PUT  /admin/reports/tickets/:id/priority
 *        body: { priority: 'low' | 'medium' | 'high' | 'urgent' }
 *        → SupportTicket
 *
 * Tickets are created by end-users from the IU Chat mobile/web app via
 * `POST /users/support/tickets` (or whatever public route your backend
 * exposes). They land in this admin queue automatically.
 */
export const reportService = {
  listTickets: (params: ListTicketsParams = {}) =>
    unwrap<Paginated<SupportTicket>>(api.get('/admin/reports/tickets', { params })),

  getTicket: (id: string) =>
    unwrap<SupportTicketDetail>(api.get(`/admin/reports/tickets/${id}`)),

  replyTicket: (id: string, body: string) =>
    unwrap<TicketReply>(api.post(`/admin/reports/tickets/${id}/replies`, { body })),

  setTicketStatus: (id: string, status: TicketStatus) =>
    unwrap<SupportTicket>(api.put(`/admin/reports/tickets/${id}/status`, { status })),

  setTicketPriority: (id: string, priority: TicketPriority) =>
    unwrap<SupportTicket>(api.put(`/admin/reports/tickets/${id}/priority`, { priority })),
};

export default reportService;
