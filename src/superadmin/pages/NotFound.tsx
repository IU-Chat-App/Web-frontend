import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <p className="text-6xl font-display font-bold text-text-dark dark:text-white">404</p>
        <p className="text-text-light dark:text-slate-400 mt-2">This admin page does not exist.</p>
        <Link
          to="/admin/dashboard"
          className="inline-block mt-6 px-4 py-2 rounded-lg bg-primary-blue text-white font-medium hover:bg-dark-blue"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
