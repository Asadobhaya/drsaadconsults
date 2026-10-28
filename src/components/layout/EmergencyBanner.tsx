import React, { useState } from 'react';
import { AlertTriangle, PhoneCall, X } from 'lucide-react';

export const EmergencyBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-amber-500 text-slate-950 px-4 py-2.5 shadow-sm text-sm font-medium border-b border-amber-600/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="w-5 h-5 text-slate-950 shrink-0 animate-pulse" />
          <span>
            <strong>Medical Emergency?</strong> If you are experiencing severe chest pain, breathlessness, sudden weakness, or trauma, do NOT rely on an online portal. Call emergency services or visit the nearest hospital immediately.
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="tel:1122"
            className="inline-flex items-center gap-1.5 bg-slate-950 text-amber-400 hover:bg-slate-900 px-3 py-1 rounded-full text-xs font-semibold transition"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            Emergency 1122
          </a>
          <button
            onClick={() => setDismissed(true)}
            className="text-slate-950 hover:bg-amber-600/30 p-1 rounded-md transition"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
