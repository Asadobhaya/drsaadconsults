import React from 'react';
import { AlertCircle, ShieldAlert } from 'lucide-react';

export const DisclaimerPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900">Terms & Medical Disclaimer</h1>
        <p className="text-xs text-slate-500">Official Notice</p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft text-xs text-slate-700 space-y-5 leading-relaxed">
        
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium space-y-1">
          <strong className="font-bold block">General Website Notice:</strong>
          Information provided on this website is for general educational and administrative purposes only. It is not a substitute for professional in-person medical evaluation, physical examination, diagnosis, or treatment.
        </div>

        <h3 className="text-sm font-bold text-slate-900 border-b pb-1">1. Symptom Assessment & Triage Tool</h3>
        <p>
          The automated Symptom Assessment tool is an educational triage assistant designed to help patients organize symptom information and assess urgency. It does NOT issue confirmed medical diagnoses or prescribe treatment plans.
        </p>

        <h3 className="text-sm font-bold text-slate-900 border-b pb-1">2. Medical Emergencies</h3>
        <p>
          If you are experiencing a medical emergency (such as severe chest pain, extreme breathlessness, sudden paralysis, active severe bleeding, or trauma), do NOT rely on this online portal. Immediately call emergency services (1122) or visit the nearest hospital Emergency Room.
        </p>

        <h3 className="text-sm font-bold text-slate-900 border-b pb-1">3. Physician Role</h3>
        <p>
          Dr. Muhammad Saad Obhaya (MBBS) serves at Sir Ganga Ram Hospital, Lahore, Pakistan. Online interactions provide clinical guidance and triage evaluation subject to physical examination limitations and applicable regulations.
        </p>

      </div>
    </div>
  );
};
