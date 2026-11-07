import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Stethoscope, Phone } from 'lucide-react';

export const StickyMobileCTA: React.FC = () => {
  const location = useLocation();

  // Hide on booking, confirmation, or dashboard pages where CTA is redundant or disruptive
  const hiddenRoutes = ['/book', '/appointment-confirmation', '/dashboard', '/login'];
  const shouldHide = hiddenRoutes.some(route => location.pathname.startsWith(route));

  if (shouldHide) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border p-3 shadow-soft animate-in slide-in-from-bottom duration-200">
      <div className="flex items-center gap-2 max-w-lg mx-auto">
        <Link
          to="/book"
          className="flex-1 inline-flex items-center justify-center gap-2 btn-accent font-bold text-xs py-3 px-4 rounded-xl shadow-soft active:scale-95 transition"
        >
          <Calendar className="w-4 h-4" />
          <span>Book Appointment</span>
        </Link>
        <Link
          to="/symptom-assessment"
          className="inline-flex items-center justify-center gap-1.5 btn-secondary font-bold text-xs py-3 px-3 rounded-xl active:scale-95 transition"
        >
          <Stethoscope className="w-4 h-4 text-current" />
          <span>Triage</span>
        </Link>
        <a
          href="tel:+923396999200"
          className="inline-flex items-center justify-center w-10 h-10 bg-tint text-brand hover:bg-border rounded-xl border border-border transition"
          aria-label="Call clinic directly"
        >
          <Phone className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};
