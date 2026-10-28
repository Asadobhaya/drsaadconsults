import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Building2, Award, Calendar, CheckCircle2, Shield, Stethoscope, ArrowRight } from 'lucide-react';
import { DataService } from '../services/dataService';
import { DoctorProfile } from '../types';

export const AboutPage: React.FC = () => {
  const [profile, setProfile] = useState<DoctorProfile | null>(null);

  useEffect(() => {
    DataService.getDoctorProfile().then(setProfile);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header Profile Summary */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-soft space-y-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          
          {profile?.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt="Dr. Muhammad Saad Obhaya"
              className="w-36 h-36 rounded-3xl object-cover object-top border-4 border-medical-100 shadow-md shrink-0"
            />
          ) : (
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-medical-600 to-teal-600 text-white flex items-center justify-center font-extrabold text-4xl shadow-md shrink-0">
              SO
            </div>
          )}

          <div className="space-y-2 flex-1">
            <div className="inline-flex items-center gap-2 bg-medical-50 text-medical-800 px-3 py-1 rounded-full text-xs font-bold">
              Verified Medical Credentials
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Dr. Muhammad Saad Obhaya
            </h1>
            <p className="text-sm font-bold text-medical-600">MBBS</p>
            <p className="text-sm text-slate-600 font-medium">
              Sir Ganga Ram Hospital, Lahore, Pakistan
            </p>
            
            <div className="pt-4 flex flex-wrap justify-center sm:justify-start gap-3">
              <Link
                to="/book"
                className="inline-flex items-center gap-2 bg-medical-600 hover:bg-medical-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition"
              >
                <Calendar className="w-4 h-4" />
                Book Consultation
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-4 py-2.5 rounded-xl transition"
              >
                Contact Information
              </Link>
            </div>
          </div>

        </div>

        {/* Bio Paragraph */}
        <div className="pt-6 border-t border-slate-100 space-y-4 text-slate-600 text-sm leading-relaxed">
          <h2 className="text-lg font-extrabold text-slate-900">Professional Profile</h2>
          <p>
            {profile?.bio || 'Dr. Muhammad Saad Obhaya earned his Bachelor of Medicine, Bachelor of Surgery (MBBS) degree from Tashkent State Medical Academy in Uzbekistan. He currently serves at Sir Ganga Ram Hospital in Lahore, Pakistan.'}
          </p>
          <p>
            Dr. Saad Obhaya focuses on clinical evaluation, structured symptom assessment, evidence-based guidance, and patient-centered communication.
          </p>
        </div>
      </div>

      {/* Verified Medical Background */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Education */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft space-y-4">
          <div className="w-10 h-10 rounded-xl bg-medical-50 text-medical-600 flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Medical Education</h3>
          <div className="space-y-2 text-xs">
            <p className="font-bold text-slate-800 text-sm">Tashkent State Medical Academy</p>
            <p className="text-slate-500">Degree: MBBS (Bachelor of Medicine, Bachelor of Surgery)</p>
            <p className="text-slate-500">Location: Tashkent, Uzbekistan</p>
          </div>
        </div>

        {/* Hospital Affiliation */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft space-y-4">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Current Position</h3>
          <div className="space-y-2 text-xs">
            <p className="font-bold text-slate-800 text-sm">Sir Ganga Ram Hospital</p>
            <p className="text-slate-500">Medical Physician</p>
            <p className="text-slate-500">Location: Lahore, Pakistan</p>
          </div>
        </div>

      </div>

      {/* Verified Data Note Placeholder */}
      <div className="p-6 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 space-y-2">
        <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-medical-600" /> Information Verification Standard
        </h4>
        <p>
          In accordance with strict medical website standards, only verified qualifications (MBBS, Tashkent State Medical Academy, Sir Ganga Ram Hospital, Lahore) are published. Additional specialty certifications, awards, or clinical sub-specializations will be updated after official verification.
        </p>
      </div>

    </div>
  );
};
