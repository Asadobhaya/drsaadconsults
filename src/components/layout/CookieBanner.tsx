import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, X } from 'lucide-react';

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('saad_cookie_consent');
    if (!consent) {
      // Delay display slightly for smooth page entrance
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('saad_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('saad_cookie_consent', 'essential_only');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-4 sm:p-5 shadow-2xl border border-slate-800 text-xs space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-medical-400 font-bold text-sm">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Privacy & Cookie Choice</span>
          </div>
          <button
            onClick={handleDecline}
            className="text-slate-400 hover:text-white p-0.5 rounded transition"
            aria-label="Close cookie banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-slate-300 leading-relaxed text-[11px]">
          We utilize essential technical storage to manage appointment scheduling and maintain secure portal access. No sensitive patient health inputs are shared for advertising. Learn more in our{' '}
          <Link to="/privacy" className="text-medical-400 hover:underline font-semibold">
            Privacy Policy
          </Link>.
        </p>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleAccept}
            className="flex-1 bg-medical-600 hover:bg-medical-700 text-white font-bold py-2 rounded-xl text-xs shadow transition text-center"
          >
            Accept Essential
          </button>
          <button
            onClick={handleDecline}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-3 py-2 rounded-xl text-xs transition"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};
