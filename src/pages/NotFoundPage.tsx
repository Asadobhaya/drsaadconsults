import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Stethoscope } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-medical-50 text-medical-600 flex items-center justify-center mx-auto text-2xl font-extrabold">
        404
      </div>
      <h1 className="text-2xl font-extrabold text-slate-900">Page Not Found</h1>
      <p className="text-xs text-slate-600">The page you requested does not exist or has been moved.</p>
      <div className="pt-2 flex justify-center gap-3">
        <Link to="/" className="inline-flex items-center gap-2 bg-medical-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow">
          <Home className="w-4 h-4" /> Return Home
        </Link>
      </div>
    </div>
  );
};
