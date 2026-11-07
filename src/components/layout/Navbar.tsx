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
    <nav className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-border shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-brand flex items-center justify-center text-white shadow-soft group-hover:bg-brand-hover transition-colors duration-200">
              <Activity className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-extrabold text-text text-lg tracking-tight group-hover:text-brand transition">
                  Dr. Muhammad Saad Obhaya
                </span>
                <span className="bg-tint text-brand text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  MBBS
                </span>
                <span className="bg-tint text-brand text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider hidden sm:inline-block">
                  PMDC Reg: 962063-01-M
                </span>
              </div>
              <p className="text-xs text-muted font-medium flex items-center gap-1">
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
                    className="ml-2 inline-flex items-center gap-2 btn-accent font-bold text-sm px-4 py-2.5 rounded-xl shadow-soft transition-all duration-200 active:scale-95"
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
                      ? 'text-brand bg-tint font-bold'
                      : 'text-text hover:text-brand hover:underline'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Track Appointment Link */}
            <Link
              to="/track-appointment"
              className="text-xs font-semibold text-muted hover:text-brand bg-surface hover:bg-tint px-3 py-2 rounded-lg border border-border transition ml-1"
              title="Track your existing appointment status"
            >
              Track Booking
            </Link>

            {/* Doctor Login */}
            <Link
              to="/login"
              className="text-muted hover:text-brand p-2 rounded-lg transition"
              title="Doctor Portal Login"
            >
              <UserCheck className="w-5 h-5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              to="/book"
              className="btn-accent text-xs font-bold px-3 py-2 rounded-lg shadow-soft"
            >
              Book
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-text hover:bg-tint transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface border-b border-border px-4 pt-3 pb-6 space-y-2 shadow-card animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-base font-medium transition ${
                isActive(link.path)
                  ? 'text-brand bg-tint font-bold'
                  : 'text-text hover:bg-tint'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-border flex flex-col gap-2">
            <Link
              to="/track-appointment"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center w-full py-2.5 bg-tint hover:bg-border text-brand font-semibold text-sm rounded-xl transition"
            >
              Track Existing Booking
            </Link>
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center w-full py-2.5 text-muted hover:text-brand text-xs font-semibold transition"
            >
              Doctor Portal Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
