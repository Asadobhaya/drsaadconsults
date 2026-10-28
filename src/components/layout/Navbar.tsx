import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Calendar, Stethoscope, Menu, X, ShieldCheck, UserCheck, MessageSquare } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Dr. Saad', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Symptom Triage', path: '/symptom-assessment' },
    { name: 'Book Appointment', path: '/book', highlight: true },
    { name: 'Resources', path: '/resources' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-medical-600 via-medical-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-medical-500/20 group-hover:scale-105 transition-transform duration-200">
              <Activity className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 text-lg tracking-tight group-hover:text-medical-600 transition">
                  Dr. Muhammad Saad Obhaya
                </span>
                <span className="bg-medical-100 text-medical-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  MBBS
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <span>Sir Ganga Ram Hospital, Lahore</span>
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1.5">
            {navLinks.map((link) => {
              if (link.highlight) {
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="ml-2 inline-flex items-center gap-2 bg-medical-600 hover:bg-medical-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-md shadow-medical-600/20 hover:shadow-lg hover:shadow-medical-600/30 transition-all duration-200 active:scale-95"
                  >
                    <Calendar className="w-4 h-4" />
                    {link.name}
                  </Link>
                );
              }

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'text-medical-600 bg-medical-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Track Appointment Link */}
            <Link
              to="/track-appointment"
              className="text-xs font-semibold text-slate-500 hover:text-medical-700 bg-slate-100 hover:bg-medical-50 px-3 py-2 rounded-lg border border-slate-200 transition ml-1"
              title="Track your existing appointment status"
            >
              Track Booking
            </Link>

            {/* Doctor Login */}
            <Link
              to="/login"
              className="text-slate-400 hover:text-slate-700 p-2 rounded-lg transition"
              title="Doctor Portal Login"
            >
              <UserCheck className="w-5 h-5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              to="/book"
              className="bg-medical-600 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow"
            >
              Book
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-base font-medium transition ${
                isActive(link.path)
                  ? 'text-medical-600 bg-medical-50 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to="/track-appointment"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition"
            >
              Track Existing Booking
            </Link>
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center w-full py-2.5 text-slate-500 hover:text-slate-800 text-xs font-semibold transition"
            >
              Doctor Portal Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
