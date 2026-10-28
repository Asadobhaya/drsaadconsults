import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Phone, Mail, MapPin, Shield, AlertCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Column 1: Doctor Profile & Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-medical-500 text-white flex items-center justify-center font-bold">
                <Activity className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg tracking-tight">Dr. Muhammad Saad Obhaya</h3>
                <p className="text-xs text-medical-400 font-semibold">MBBS • Sir Ganga Ram Hospital</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Serving at Sir Ganga Ram Hospital, Lahore. Graduated from Tashkent State Medical Academy, Uzbekistan. Providing attentive physical evaluation, symptom triage, and health advice.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-medical-400 shrink-0" />
                <a href="tel:+923396999200" className="hover:text-white transition">+92 339 6999200</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-medical-400 shrink-0" />
                <a href="mailto:drsaadobhaya@gmail.com" className="hover:text-white transition">drsaadobhaya@gmail.com</a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-medical-400 shrink-0 mt-0.5" />
                <span>Sir Ganga Ram Hospital, Lahore, Pakistan</span>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition">About Dr. Saad</Link></li>
              <li><Link to="/services" className="hover:text-white transition">Areas of Care & Services</Link></li>
              <li><Link to="/symptom-assessment" className="hover:text-white transition">Symptom Assessment & Triage</Link></li>
              <li><Link to="/book" className="hover:text-white transition">Schedule Appointment</Link></li>
              <li><Link to="/track-appointment" className="hover:text-white transition">Track Appointment Status</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Contact & Location</Link></li>
            </ul>
          </div>

          {/* Column 3: Patient Care & Policies */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Patient Care & Policies
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/resources" className="hover:text-white transition">Patient Resources & Education</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/disclaimer" className="hover:text-white transition">Terms & Medical Disclaimer</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Doctor Portal Login</Link></li>
            </ul>
            <div className="mt-6 p-3 rounded-lg bg-slate-800/60 border border-slate-700/50 text-[11px] text-slate-400">
              <span className="font-semibold text-white flex items-center gap-1 mb-1">
                <Shield className="w-3.5 h-3.5 text-teal-400" /> Patient Privacy First
              </span>
              All clinical details and document uploads are protected by secure access protocols.
            </div>
          </div>

          {/* Column 4: Important Medical Disclaimer */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-400" /> Medical Disclaimer
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Information provided on this website is for general educational and administrative purposes only. It is not a substitute for professional in-person medical evaluation, diagnosis, or treatment.
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed mt-2">
              The automated Symptom Assessment tool provides risk categorization and educational questions only; it does NOT issue medical diagnoses.
            </p>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Dr. Muhammad Saad Obhaya. All rights reserved.</p>
          <p>MBBS — Sir Ganga Ram Hospital, Lahore, Pakistan</p>
        </div>
      </div>
    </footer>
  );
};
