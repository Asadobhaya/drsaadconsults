import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  Stethoscope, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Printer, 
  Download, 
  ArrowLeft, 
  HelpCircle, 
  ShieldAlert,
  FileText
} from 'lucide-react';
import { SymptomAssessmentResult } from '../types';

export const SymptomResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result as SymptomAssessmentResult | undefined;

  if (!result) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">No Assessment Found</h2>
        <p className="text-xs text-slate-600">Please complete the symptom questionnaire first.</p>
        <Link to="/symptom-assessment" className="inline-block bg-teal-600 text-white font-semibold text-xs px-4 py-2 rounded-xl">
          Start Assessment
        </Link>
      </div>
    );
  }

  const handleBookWithSummary = () => {
    const summaryText = `[Symptom Triage Assessment - ${result.urgencyLevel} URGENCY]\nPrimary Concern: ${result.input.primaryConcern}\nSymptoms: ${result.input.symptoms.join(', ')}\nDuration: ${result.input.duration} (${result.input.severity} severity)\nMedical History: ${result.input.existingConditions || 'None provided'}`;
    
    sessionStorage.setItem('prefill_symptom_summary', JSON.stringify({
      symptomSummary: summaryText,
      reason: result.input.primaryConcern,
      age: result.input.age,
      gender: result.input.gender,
    }));

    navigate('/book');
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'EMERGENCY':
        return <span className="bg-red-600 text-white font-extrabold px-3 py-1 rounded-full uppercase text-xs">Emergency Urgency</span>;
      case 'HIGH':
        return <span className="bg-amber-500 text-slate-950 font-extrabold px-3 py-1 rounded-full uppercase text-xs">High Urgency</span>;
      case 'MODERATE':
        return <span className="bg-sky-100 text-sky-800 font-extrabold px-3 py-1 rounded-full uppercase text-xs">Moderate Urgency</span>;
      default:
        return <span className="bg-emerald-100 text-emerald-800 font-extrabold px-3 py-1 rounded-full uppercase text-xs">Low Urgency</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Result Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-card space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-6">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-teal-600">Clinical Triage Summary</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Preliminary Symptom Assessment</h1>
            <p className="text-xs text-slate-500">Evaluated on {new Date(result.createdAt).toLocaleString()}</p>
          </div>
          <div>
            {getUrgencyBadge(result.urgencyLevel)}
          </div>
        </div>

        {/* Emergency Alert Box if Emergency */}
        {result.isEmergency && (
          <div className="p-6 rounded-2xl bg-red-600 text-white space-y-3">
            <div className="flex items-center gap-2 font-bold text-lg">
              <AlertTriangle className="w-6 h-6 text-amber-300" />
              <span>Immediate Medical Attention Recommended</span>
            </div>
            <p className="text-xs text-red-100 leading-relaxed">{result.recommendedAction}</p>
          </div>
        )}

        {/* Recommended Action */}
        {!result.isEmergency && (
          <div className="p-5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 space-y-1">
            <h3 className="font-bold text-sm">Recommended Next Step:</h3>
            <p className="text-xs leading-relaxed">{result.recommendedAction}</p>
          </div>
        )}

        {/* Possible Explanations Grid */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Potential Causes for Discussion</h3>
          {result.possibleConditions.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No specific common clinical pattern triggered. Please discuss your symptoms directly with Dr. Saad Obhaya.</p>
          ) : (
            <div className="space-y-3">
              {result.possibleConditions.map((cond, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{cond.name}</span>
                    <span className="bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded text-[10px]">
                      {cond.likelihood}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{cond.rationale}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Questions to Discuss With Doctor */}
        <div className="space-y-3 pt-2">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-teal-600" /> Suggested Questions for Your Consultation
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {result.questionsForDoctor.map((q, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Mandatory Medical Safety Disclaimer */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 space-y-1">
          <strong className="font-bold flex items-center gap-1">
            <ShieldAlert className="w-4 h-4 text-amber-600" /> Mandatory Medical Disclaimer
          </strong>
          <p>
            This automated assessment tool provides educational information and clinical triage guidance only. It does NOT provide a confirmed medical diagnosis. Always consult Dr. Muhammad Saad Obhaya or another qualified physician for professional evaluation.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t no-print">
          <button
            onClick={() => navigate('/symptom-assessment')}
            className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" /> Retake Assessment
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs px-4 py-3 rounded-xl border border-slate-300 transition"
            >
              <Printer className="w-4 h-4" /> Print Summary Report
            </button>

            <button
              onClick={handleBookWithSummary}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-medical-600 to-teal-600 hover:from-medical-700 hover:to-teal-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow transition"
            >
              <Calendar className="w-4 h-4" /> Book Appointment Using This Summary
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
