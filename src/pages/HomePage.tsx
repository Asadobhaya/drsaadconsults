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
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 bg-gradient-to-b from-white via-medical-50/40 to-slate-50">
        
        {/* Subtle background graphics */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden opacity-40">
          <div className="absolute top-12 right-10 w-96 h-96 bg-medical-200/50 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-teal-200/40 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Text Column */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Doctor Badge */}
              <div className="inline-flex items-center gap-2 bg-white border border-medical-200 text-medical-800 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-soft">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Dr. Muhammad Saad Obhaya — MBBS</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                Compassionate Care. <br />
                <span className="gradient-text">Evidence-Based Medicine.</span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                Professional medical care focused on listening, clinical assessment, patient guidance, and tailored health evaluation.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/book"
                  className="inline-flex items-center gap-2.5 bg-medical-600 hover:bg-medical-700 text-white font-bold text-sm sm:text-base px-6 py-3.5 rounded-2xl shadow-lg shadow-medical-600/30 hover:shadow-xl hover:shadow-medical-600/40 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Calendar className="w-5 h-5" />
                  Book an Appointment
                </Link>

                <Link
                  to="/symptom-assessment"
                  className="inline-flex items-center gap-2 bg-white hover:bg-teal-50 text-teal-800 font-bold text-sm sm:text-base px-5 py-3.5 rounded-2xl border border-teal-200 shadow-soft hover:border-teal-300 transition-all"
                >
                  <Stethoscope className="w-5 h-5 text-teal-600" />
                  Check Your Symptoms
                </Link>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-semibold text-sm px-4 py-3 rounded-xl hover:bg-slate-100 transition"
                >
                  <Phone className="w-4 h-4 text-slate-500" />
                  Contact Doctor
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-medical-600 shrink-0" />
                  <span>Verified Credentials</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-medical-600 shrink-0" />
                  <span>PST Scheduled Slots</span>
                </div>
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Patient Privacy First</span>
                </div>
              </div>

            </div>

            {/* Right Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Visual Card Frame */}
                <div className="relative rounded-3xl bg-gradient-to-tr from-medical-600 via-medical-500 to-teal-600 p-1 shadow-2xl">
                  <div className="bg-white rounded-[22px] p-6 sm:p-8 space-y-6">
                    
                    {/* Doctor Avatar / Placeholder Header */}
                    <div className="flex items-center gap-4">
                      {profile?.avatarUrl ? (
                        <img
                          src={profile.avatarUrl}
                          alt="Dr. Muhammad Saad Obhaya"
                          className="w-20 h-20 rounded-2xl object-cover object-top border-2 border-medical-200 shadow-sm"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-medical-500 to-teal-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-md">
                          SO
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg">Dr. Muhammad Saad Obhaya</h3>
                        <p className="text-xs font-bold text-medical-600">MBBS</p>
                        <p className="text-[11px] text-slate-500 font-medium">Sir Ganga Ram Hospital, Lahore</p>
                      </div>
                    </div>

                    {/* Qualifications Grid */}
                    <div className="space-y-3 pt-2 text-xs">
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <GraduationCap className="w-5 h-5 text-medical-600 shrink-0" />
                        <div>
                          <p className="font-bold text-slate-800">Tashkent State Medical Academy</p>
                          <p className="text-slate-500 text-[11px]">MBBS Degree • Uzbekistan</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <Building2 className="w-5 h-5 text-teal-600 shrink-0" />
                        <div>
                          <p className="font-bold text-slate-800">Sir Ganga Ram Hospital</p>
                          <p className="text-slate-500 text-[11px]">Lahore, Pakistan</p>
                        </div>
                      </div>
                    </div>

                    {/* Quick CTA */}
                    <Link
                      to="/book"
                      className="block text-center w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-3 rounded-xl transition"
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
      <section className="bg-slate-900 text-white py-16 rounded-3xl max-w-7xl mx-auto px-6 lg:px-12 shadow-2xl">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-teal-400">Simple Process</h2>
          <h3 className="text-3xl font-extrabold text-white">How Your Consultation Works</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-medical-500 text-white flex items-center justify-center font-extrabold text-lg mx-auto sm:mx-0 shadow-lg">
              1
            </div>
            <h4 className="font-bold text-white text-base">Book an Appointment</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Choose your consultation service, pick an available date and time slot, and submit your contact information.
            </p>
          </div>

          <div className="space-y-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-teal-500 text-white flex items-center justify-center font-extrabold text-lg mx-auto sm:mx-0 shadow-lg">
              2
            </div>
            <h4 className="font-bold text-white text-base">Optional Symptom Check</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Utilize our automated triage tool to summarize your symptoms and generate discussion points for your doctor.
            </p>
          </div>

          <div className="space-y-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-extrabold text-lg mx-auto sm:mx-0 shadow-lg">
              3
            </div>
            <h4 className="font-bold text-white text-base">Consultation & Guidance</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Receive attentive evaluation, clinical explanation, advice on next diagnostic steps, or appropriate sub-specialty referral.
            </p>
          </div>
        </div>
      </section>

      {/* SYMPTOM ASSESSMENT CTA BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-medical-600 to-teal-600 rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h3 className="text-2xl font-extrabold tracking-tight">Unsure which appointment you need?</h3>
            <p className="text-xs sm:text-sm text-medical-100">
              Run our automated Symptom Assessment & Triage engine to check urgency levels and prepare a medical summary for your visit.
            </p>
          </div>
          <Link
            to="/symptom-assessment"
            className="inline-flex items-center gap-2 bg-white text-medical-900 font-bold text-sm px-6 py-3.5 rounded-2xl shadow hover:bg-medical-50 transition shrink-0"
          >
            <Stethoscope className="w-5 h-5 text-medical-600" />
            Start Symptom Assessment
          </Link>
        </div>
      </section>

    </div>
  );
};
