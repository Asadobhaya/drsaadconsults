import React from 'react';
import { BookOpen, ShieldAlert, Heart, Activity, FileText, CheckCircle2 } from 'lucide-react';

export const ResourcesPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-widest text-medical-600">Patient Education</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Patient Resources & Guidance</h1>
        <p className="text-slate-600 text-sm">
          Evidence-based healthcare information, medication safety advice, and emergency guidance.
        </p>
      </div>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">When to Seek Emergency Care</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Do not delay seeking emergency care if you experience severe crushing chest pain, difficulty breathing, sudden stroke symptoms (facial weakness, arm numbness, slurred speech), severe uncontrolled bleeding, or trauma.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-xl bg-medical-100 text-medical-600 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Preparing for Your Consultation</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            To make the most of your medical consultation, write down your key symptoms, when they started, current medications you are taking, and any recent lab work or reports.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Medication Safety & Adherence</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Always take prescribed medications exactly as instructed by your doctor. Never stop antibiotics early or alter insulin/hypertension dosages without clinical direction.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Preventive Health Screenings</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Routine blood pressure measurement, lipid panels, blood glucose screening, and age-appropriate screenings are crucial for early disease detection and long-term wellness.
          </p>
        </div>

      </div>

    </div>
  );
};
