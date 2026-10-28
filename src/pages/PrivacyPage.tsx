import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900">Privacy Policy</h1>
        <p className="text-xs text-slate-500">Last updated: August 2026</p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft text-xs text-slate-700 space-y-4 leading-relaxed">
        <p>
          At the medical practice portal of <strong>Dr. Muhammad Saad Obhaya (MBBS)</strong>, patient privacy and data security are fundamental priorities.
        </p>

        <h3 className="text-sm font-bold text-slate-900 border-b pb-1">1. Information Collection</h3>
        <p>
          We only collect personal and health information (such as name, contact details, age, gender, appointment reasons, and uploaded medical reports) that you explicitly provide when booking an appointment or running a symptom assessment.
        </p>

        <h3 className="text-sm font-bold text-slate-900 border-b pb-1">2. Use of Information</h3>
        <p>
          Your information is used solely to facilitate your consultation, manage appointment schedules, generate clinical summaries for Dr. Saad's review, and communicate appointment status. We do NOT sell or market patient data.
        </p>

        <h3 className="text-sm font-bold text-slate-900 border-b pb-1">3. Document & Record Protection</h3>
        <p>
          Uploaded laboratory reports or medical documents are stored in secure cloud infrastructure with strict Row Level Security (RLS) policies. Only authorized clinical personnel can access uploaded medical files.
        </p>

        <h3 className="text-sm font-bold text-slate-900 border-b pb-1">4. Analytics & Cookies</h3>
        <p>
          We utilize minimal technical cookies strictly necessary for application functionality. We do not track private medical inputs for advertising analytics.
        </p>
      </div>
    </div>
  );
};
