import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      
      {/* Header */}
      <div className="space-y-3 border-b border-slate-200 pb-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-medical-600 hover:text-medical-700">
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Home
        </Link>
        <div className="inline-flex items-center gap-2 bg-medical-50 text-medical-700 px-3 py-1 rounded-full text-xs font-bold">
          <FileText className="w-3.5 h-3.5" /> Clinical Policies
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Terms of Medical Service</h1>
        <p className="text-xs text-slate-500">Last updated: October 2026 • Dr. Muhammad Saad Obhaya Clinic</p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-soft text-slate-700 space-y-6 text-xs sm:text-sm leading-relaxed">
        
        <div className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Nature of Medical Consultations</h2>
          <p>
            All consultations provided through this portal are conducted by Dr. Muhammad Saad Obhaya (MBBS), medical doctor at Sir Ganga Ram Hospital, Lahore, Pakistan. Clinical advice, prescription review, and guidance are provided in accordance with evidence-based medical standards in Pakistan.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Emergency Disclaimer</h2>
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-900">
            <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
            <p className="text-xs leading-relaxed font-medium">
              This online portal and triage tools are NOT equipped for critical life-threatening medical emergencies. If you or someone in your care experiences severe chest pressure, sudden numbness or speech difficulty, severe breathing distress, or acute trauma, you must call <strong>1122</strong> or proceed directly to an emergency department.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. Appointment Scheduling & Rescheduling</h2>
          <p>
            Patients may reserve appointments in Pakistan Standard Time (PKT). If you are unable to attend your scheduled consultation, please notify the clinic via telephone (+92 339 6999200) or our contact form at least 2 hours in advance to allow reallocation of the slot.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">4. Patient Accuracy of Health Records</h2>
          <p>
            You agree to provide true, current, and comprehensive health information including allergies, current medications, and past medical history. Misrepresentation may compromise clinical diagnosis and care.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">5. Automated Triage Tool Limitations</h2>
          <p>
            The on-site symptom assessment and triage engine generates educational estimations of symptom urgency based on clinical protocols. It does not provide definitive computerized diagnoses or substitute for a formal clinical consultation.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">6. Confidentiality & Privacy</h2>
          <p>
            Your health records and consultation notes are safeguarded under strict medical confidentiality obligations as outlined in our Privacy Policy.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Dr. Muhammad Saad Obhaya (MBBS)</span>
          <Link to="/contact" className="font-bold text-medical-600 hover:underline">
            Questions regarding our terms?
          </Link>
        </div>

      </div>

    </div>
  );
};
