import api, { unwrap } from './api';
import type { AppSettings } from '../types';

/**
 * Settings service. All data comes from the backend.
 *
 * Backend endpoints:
 *   GET /admin/settings
 *   PUT /admin/settings  (partial update)
 */
export const settingsService = {
  get: () => unwrap<AppSettings>(api.get('/admin/settings')),
  update: (payload: Partial<AppSettings>) =>
    unwrap<AppSettings>(api.put('/admin/settings', payload)),
};

export default settingsService;
