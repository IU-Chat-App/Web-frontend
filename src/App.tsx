import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Landing from './pages/Landing';
import { AuthProvider } from './superadmin/context/AuthContext';
import { ThemeProvider } from './superadmin/context/ThemeContext';
import SuperAdminRoutes from './superadmin/routes/SuperAdminRoutes';

/**
 * Top-level app shell:
 *   /                    → public landing page (untouched)
 *   /admin/*             → Super Admin Portal (canonical, handled in SuperAdminRoutes)
 *   /super-admin/*       → backwards-compat redirect to /admin
 *   any other            → redirect to landing
 */
export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: '10px',
                background: '#0F172A',
                color: '#fff',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
              error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
            }}
          />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/admin/*" element={<SuperAdminRoutes />} />
            <Route path="/super-admin" element={<Navigate to="/admin" replace />} />
            <Route path="/super-admin/*" element={<Navigate to="/admin" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
