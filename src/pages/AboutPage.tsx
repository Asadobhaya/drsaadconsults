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
              className="w-36 h-36 rounded-3xl object-cover object-top border-4 border-tint shadow-soft shrink-0"
            />
          ) : (
            <div className="w-32 h-32 rounded-3xl bg-brand text-white flex items-center justify-center font-extrabold text-4xl shadow-soft shrink-0">
              SO
            </div>
          )}

          <div className="space-y-2 flex-1">
            <div className="inline-flex items-center gap-2 bg-tint text-brand px-3 py-1 rounded-full text-xs font-bold">
              Verified Medical Credentials • PMDC Reg: 962063-01-M
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight">
              Dr. Muhammad Saad Obhaya
            </h1>
            <p className="text-sm font-bold text-brand">MBBS • PMDC Reg: 962063-01-M</p>
            <p className="text-sm text-muted font-medium">
              Sir Ganga Ram Hospital, Lahore, Pakistan
            </p>
            
            <div className="pt-4 flex flex-wrap justify-center sm:justify-start gap-3">
              <Link
                to="/book"
                className="inline-flex items-center gap-2 btn-accent font-bold text-xs px-5 py-2.5 rounded-xl shadow-soft active:scale-95 transition"
              >
                <Calendar className="w-4 h-4" />
                Book Consultation
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 btn-secondary text-xs px-4 py-2.5 rounded-xl transition"
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Education */}
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-soft space-y-4">
          <div className="w-10 h-10 rounded-xl bg-tint text-brand flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-text">Medical Education</h3>
          <div className="space-y-2 text-xs">
            <p className="font-bold text-text text-sm">Tashkent State Medical Academy</p>
            <p className="text-muted">Degree: MBBS (Bachelor of Medicine, Surgery)</p>
            <p className="text-muted">Location: Tashkent, Uzbekistan</p>
          </div>
        </div>

        {/* Hospital Affiliation */}
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-soft space-y-4">
          <div className="w-10 h-10 rounded-xl bg-tint text-brand flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-text">Current Position</h3>
          <div className="space-y-2 text-xs">
            <p className="font-bold text-text text-sm">Sir Ganga Ram Hospital</p>
            <p className="text-muted">Medical Physician</p>
            <p className="text-muted">Location: Lahore, Pakistan</p>
          </div>
        </div>

        {/* PMDC Registration */}
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-soft space-y-4">
          <div className="w-10 h-10 rounded-xl bg-tint text-brand flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-text">PMDC Registration</h3>
          <div className="space-y-2 text-xs">
            <p className="font-bold text-text text-sm">Reg: 962063-01-M</p>
            <p className="text-muted">Authority: Pakistan Medical Commission</p>
            <p className="text-muted">Status: Active Registered Practitioner</p>
          </div>
        </div>

      </div>

      {/* Verified Data Note */}
      <div className="p-6 rounded-2xl bg-tint/60 border border-border text-xs text-muted space-y-2">
        <h4 className="font-bold text-text flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-brand" /> Information Verification Standard
        </h4>
        <p>
          In accordance with PMDC (Pakistan Medical &amp; Dental Commission) and medical ethics standards, only verified clinical credentials (MBBS, PMDC Reg: 962063-01-M, Tashkent State Medical Academy, Sir Ganga Ram Hospital, Lahore) are published.
        </p>
      </div>

    </div>
  );
};
