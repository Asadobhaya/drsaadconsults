import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Calendar, FileText, ArrowRight, Home, Phone, Stethoscope } from 'lucide-react';

export const ThankYouPage: React.FC = () => {
  const location = useLocation();
  const type = location.state?.type || 'inquiry';
  const name = location.state?.name || 'Patient';

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
      
      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-md border border-emerald-100 animate-in zoom-in-90 duration-300">
        <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
      </div>

      {/* Heading */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-medical-600 bg-medical-50 px-3 py-1 rounded-full">
          Submission Received
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Thank You, {name}!
        </h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          {type === 'contact' 
            ? 'Your message has been securely submitted to Dr. Muhammad Saad Obhaya. Our clinical team reviews all inquiries promptly during working hours.'
            : 'Your submission has been securely recorded. Thank you for choosing Dr. Muhammad Saad Obhaya Clinic.'}
        </p>
      </div>

      {/* Helpful Information Box */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 text-left text-xs space-y-3 shadow-soft">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Stethoscope className="w-4 h-4 text-medical-600" /> Clinic Consultation Hours
        </h3>
        <p className="text-slate-600 leading-relaxed">
          Dr. Muhammad Saad Obhaya (MBBS) is available daily:
        </p>
        <ul className="list-disc list-inside text-slate-700 space-y-1 font-medium pl-1">
          <li><strong>Morning Shift:</strong> 08:00 AM – 02:00 PM (PKT)</li>
          <li><strong>Evening Shift:</strong> 07:00 PM – 10:00 PM (PKT)</li>
        </ul>
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-slate-500">
          <Phone className="w-3.5 h-3.5 text-medical-600" />
          <span>Need immediate assistance? Call <strong>+92 339 6999200</strong></span>
        </div>
      </div>

      {/* Action Navigation */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-5 py-3 rounded-xl transition"
        >
          <Home className="w-4 h-4" /> Return to Home
        </Link>
        <Link
          to="/book"
          className="inline-flex items-center gap-2 bg-medical-600 hover:bg-medical-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow transition"
        >
          <Calendar className="w-4 h-4" /> Book Appointment
        </Link>
      </div>

    </div>
  );
};
