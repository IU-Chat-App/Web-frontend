import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import SuperAdminLayout from '../layouts/SuperAdminLayout';
import { NotificationProvider } from '../context/NotificationContext';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Users from '../pages/Users';
import Admins from '../pages/Admins';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';
import NotFound from '../pages/NotFound';

/**
 * Route map for the Super Admin Portal. Mounted by App.tsx at `/admin/*`.
 *
 *   Public:    /admin/login
 *   Index:     /admin                 → redirects to /admin/dashboard
 *   Protected (under SuperAdminLayout):
 *              /admin/dashboard
 *              /admin/users
 *              /admin/admins          (manage admin teammates — super-admin only)
 *              /admin/reports         (Support center: tickets / replies / status / priority)
 *              /admin/settings
 *
 * Removed features (analytics, groups, calls, broadcast) are redirected to the
 * dashboard so any stale bookmarks land somewhere meaningful instead of 404.
 */
export default function SuperAdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <NotificationProvider>
              <SuperAdminLayout />
            </NotificationProvider>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="admins" element={<Admins />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />

        {/* Legacy / removed feature redirects — keep bookmarks alive. */}
        <Route path="analytics" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="groups" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="calls" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="broadcast" element={<Navigate to="/admin/dashboard" replace />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
