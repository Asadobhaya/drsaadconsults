import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Calendar, Phone, ArrowLeft, Stethoscope, Search } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto py-20 px-4 sm:px-6 lg:px-8 text-center space-y-8">
      
      {/* 404 Visual Icon */}
      <div className="relative mx-auto w-24 h-24 rounded-3xl bg-brand flex items-center justify-center text-white shadow-soft">
        <Stethoscope className="w-12 h-12 stroke-[2.2]" />
        <span className="absolute -top-2 -right-2 bg-slate-900 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full border-2 border-white shadow">
          404
        </span>
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Clinical Page Not Located
        </h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          The requested page or resource may have moved, expired, or been entered with an invalid URL.
        </p>
      </div>

      {/* Recommended Clinical Pathways */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft text-left space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Recommended Destinations
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            to="/book"
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-medical-50/60 hover:bg-medical-100/70 border border-medical-200/60 transition group"
          >
            <div className="w-9 h-9 rounded-xl bg-medical-600 text-white flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-xs group-hover:text-medical-700 transition">Book Consultation</p>
              <p className="text-[11px] text-slate-500">View morning & evening slots</p>
            </div>
          </Link>

          <Link
            to="/track-appointment"
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-teal-50/60 hover:bg-teal-100/70 border border-teal-200/60 transition group"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-xs group-hover:text-teal-700 transition">Track Appointment</p>
              <p className="text-[11px] text-slate-500">Check Reference ID status</p>
            </div>
          </Link>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Need clinic directions?</span>
          <a href="tel:+923396999200" className="font-bold text-medical-600 hover:underline flex items-center gap-1">
            <Phone className="w-3.5 h-3.5" /> +92 339 6999200
          </a>
        </div>
      </div>

      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-md transition"
        >
          <Home className="w-4 h-4" /> Return to Clinic Home
        </Link>
      </div>

    </div>
  );
};
