import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Stethoscope, 
  Activity, 
  CheckCircle2, 
  Award, 
  GraduationCap, 
  Building2, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Phone, 
  HeartHandshake, 
  FileText, 
  MessageSquare,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { DataService } from '../services/dataService';
import { Announcement, DoctorProfile, MedicalService } from '../types';

export const HomePage: React.FC = () => {
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [services, setServices] = useState<MedicalService[]>([]);

  useEffect(() => {
    DataService.getDoctorProfile().then(setProfile);
    DataService.getAnnouncements().then(anns => setAnnouncements(anns.filter(a => a.isActive)));
    DataService.getServices().then(srvs => setServices(srvs.filter(s => s.isActive)));
  }, []);

  return (
    <div className="space-y-16 pb-16">
      
      {/* Active Announcement Banner */}
      {announcements.length > 0 && (
        <div className="bg-medical-50 border-b border-medical-200/60 py-3 px-4 text-center">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs font-semibold text-medical-900">
            <Sparkles className="w-4 h-4 text-medical-600 shrink-0" />
            <span><strong>Notice:</strong> {announcements[0].message}</span>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 bg-bg">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Text Column */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Doctor Badge */}
              <div className="inline-flex items-center gap-2 bg-surface border border-border text-brand px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-soft">
                <span className="w-2 h-2 rounded-full bg-brand" />
                <span>Dr. Muhammad Saad Obhaya — MBBS | PMDC Reg: 962063-01-M</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text tracking-tight leading-[1.12]">
                Compassionate Care. <br />
                <span className="text-brand">Evidence-Based Medicine.</span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-muted max-w-2xl leading-relaxed">
                Professional medical care focused on listening, clinical assessment, patient guidance, and tailored health evaluation.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/book"
                  className="inline-flex items-center gap-2.5 btn-accent text-sm sm:text-base px-6 py-3.5 rounded-2xl shadow-soft active:scale-95 transition-all duration-200"
                >
                  <Calendar className="w-5 h-5" />
                  Book an Appointment
                </Link>

                <Link
                  to="/symptom-assessment"
                  className="inline-flex items-center gap-2 btn-secondary text-sm sm:text-base px-5 py-3.5 rounded-2xl shadow-soft transition-all"
                >
                  <Stethoscope className="w-5 h-5 text-current" />
                  Check Your Symptoms
                </Link>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-1.5 text-brand hover:underline font-semibold text-sm px-4 py-3 rounded-xl transition"
                >
                  <Phone className="w-4 h-4 text-brand" />
                  Contact Doctor
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-border grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-semibold text-muted">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand shrink-0" />
                  <span>Verified Credentials</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand shrink-0" />
                  <span>PST Scheduled Slots</span>
                </div>
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-brand shrink-0" />
                  <span>Patient Privacy First</span>
                </div>
              </div>

            </div>

            {/* Right Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Visual Card Frame */}
                <div className="relative rounded-3xl border-2 border-brand bg-surface p-1 shadow-card">
                  <div className="bg-surface rounded-[22px] p-6 sm:p-8 space-y-6">
                    
                    {/* Doctor Avatar / Placeholder Header */}
                    <div className="flex items-center gap-4">
                      {profile?.avatarUrl ? (
                        <img
                          src={profile.avatarUrl}
                          alt="Dr. Muhammad Saad Obhaya"
                          className="w-20 h-20 rounded-2xl object-cover object-top border-2 border-border shadow-soft"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-2xl bg-brand text-white flex items-center justify-center font-extrabold text-2xl shadow-soft">
                          SO
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-text text-lg">Dr. Muhammad Saad Obhaya</h3>
                        <p className="text-xs font-bold text-brand">MBBS • PMDC Reg: 962063-01-M</p>
                        <p className="text-[11px] text-muted font-medium">Sir Ganga Ram Hospital, Lahore</p>
                      </div>
                    </div>

                    {/* Qualifications Grid */}
                    <div className="space-y-3 pt-2 text-xs">
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-tint/60 border border-border">
                        <GraduationCap className="w-5 h-5 text-brand shrink-0" />
                        <div>
                          <p className="font-bold text-text">Tashkent State Medical Academy</p>
                          <p className="text-muted text-[11px]">MBBS Degree • Uzbekistan</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-xl bg-tint/60 border border-border">
                        <Building2 className="w-5 h-5 text-brand shrink-0" />
                        <div>
                          <p className="font-bold text-text">Sir Ganga Ram Hospital</p>
                          <p className="text-muted text-[11px]">Lahore, Pakistan</p>
                        </div>
                      </div>
                    </div>

                    {/* Quick CTA */}
                    <Link
                      to="/book"
                      className="block text-center w-full bg-brand hover:bg-brand-hover text-white font-semibold text-xs py-3 rounded-xl transition shadow-soft"
                    >
                      Schedule a Consultation
                    </Link>

                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* AT A GLANCE BADGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft text-center space-y-1">
            <GraduationCap className="w-6 h-6 text-medical-600 mx-auto mb-2" />
            <h4 className="font-bold text-slate-900 text-sm">MBBS Qualified</h4>
            <p className="text-xs text-slate-500">Tashkent State Med Academy</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft text-center space-y-1">
            <Building2 className="w-6 h-6 text-teal-600 mx-auto mb-2" />
            <h4 className="font-bold text-slate-900 text-sm">Sir Ganga Ram Hospital</h4>
            <p className="text-xs text-slate-500">Medical Doctor, Lahore</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft text-center space-y-1">
            <Calendar className="w-6 h-6 text-medical-600 mx-auto mb-2" />
            <h4 className="font-bold text-slate-900 text-sm">Online Booking</h4>
            <p className="text-xs text-slate-500">Dynamic Slot Generator</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft text-center space-y-1">
            <Stethoscope className="w-6 h-6 text-teal-600 mx-auto mb-2" />
            <h4 className="font-bold text-slate-900 text-sm">Symptom Assessment</h4>
            <p className="text-xs text-slate-500">Automated Triage System</p>
          </div>
        </div>
      </section>

      {/* AREAS OF CARE / SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-medical-600">Areas of Care</h2>
          <h3 className="text-3xl font-extrabold text-slate-900">Comprehensive Medical Consultations</h3>
          <p className="text-slate-600 text-sm">
            Structured physical evaluations, clinical guidance, and referral assessments tailored to patient health needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-soft hover:shadow-hover hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-medical-50 text-medical-600 flex items-center justify-center font-bold">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">{srv.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{srv.description}</p>
              </div>

              <div className="pt-6 border-t border-slate-100 mt-4 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Est. {srv.durationMins} Mins</span>
                <Link
                  to="/book"
                  className="text-xs font-bold text-medical-600 hover:text-medical-800 flex items-center gap-1"
                >
                  Book <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-text text-white py-16 rounded-3xl max-w-7xl mx-auto px-6 lg:px-12 shadow-card">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-tint">Simple Process</h2>
          <h3 className="text-3xl font-extrabold text-white">How Your Consultation Works</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-brand text-white flex items-center justify-center font-extrabold text-lg mx-auto sm:mx-0 shadow-soft">
              1
            </div>
            <h4 className="font-bold text-white text-base">Book an Appointment</h4>
            <p className="text-xs text-tint/80 leading-relaxed">
              Choose your consultation service, pick an available date and time slot, and submit your contact information.
            </p>
          </div>

          <div className="space-y-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-brand text-white flex items-center justify-center font-extrabold text-lg mx-auto sm:mx-0 shadow-soft">
              2
            </div>
            <h4 className="font-bold text-white text-base">Optional Symptom Check</h4>
            <p className="text-xs text-tint/80 leading-relaxed">
              Utilize our automated triage tool to summarize your symptoms and generate discussion points for your doctor.
            </p>
          </div>

          <div className="space-y-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-brand text-white flex items-center justify-center font-extrabold text-lg mx-auto sm:mx-0 shadow-soft">
              3
            </div>
            <h4 className="font-bold text-white text-base">Consultation & Guidance</h4>
            <p className="text-xs text-tint/80 leading-relaxed">
              Receive attentive evaluation, clinical explanation, advice on next diagnostic steps, or appropriate sub-specialty referral.
            </p>
          </div>
        </div>
      </section>

      {/* SYMPTOM ASSESSMENT CTA BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-card">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h3 className="text-2xl font-extrabold tracking-tight">Unsure which appointment you need?</h3>
            <p className="text-xs sm:text-sm text-tint">
              Run our automated Symptom Assessment &amp; Triage engine to check urgency levels and prepare a medical summary for your visit.
            </p>
          </div>
          <Link
            to="/symptom-assessment"
            className="inline-flex items-center gap-2 bg-surface text-brand hover:bg-tint font-bold text-sm px-6 py-3.5 rounded-2xl shadow-soft transition shrink-0"
          >
            <Stethoscope className="w-5 h-5 text-brand" />
            Start Symptom Assessment
          </Link>
        </div>
      </section>

    </div>
  );
};
