import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, AlertTriangle, ArrowRight, ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';
import { SymptomEngine } from '../features/symptoms/symptomEngine';
import { RED_FLAG_SYMPTOMS } from '../data/symptomRules';
import { SymptomAssessmentInput } from '../types';

export const SymptomAssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Form input state
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [primaryConcern, setPrimaryConcern] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [duration, setDuration] = useState('2-3 days');
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('moderate');
  const [onset, setOnset] = useState<'gradual' | 'sudden'>('gradual');
  const [existingConditions, setExistingConditions] = useState('');
  const [medications, setMedications] = useState('');
  const [emergencyDetected, setEmergencyDetected] = useState<string | null>(null);

  const commonSymptomChips = [
    'Fever / Chills',
    'Cough',
    'Shortness of breath',
    'Headache',
    'Chest pain or pressure',
    'Abdominal pain',
    'Nausea / Vomiting',
    'Sore throat',
    'Body aches / Fatigue',
    'Skin rash / Itching',
    'Dizziness',
    'Severe sudden headache',
    'Sudden weakness or numbness'
  ];

  const toggleSymptom = (sym: string) => {
    // Check immediate red flag triggers
    if (RED_FLAG_SYMPTOMS.some(rf => rf.toLowerCase().includes(sym.toLowerCase()) || sym.toLowerCase().includes(rf.toLowerCase()))) {
      if (sym.includes('Chest pain') || sym.includes('weakness') || sym.includes('breath')) {
        setEmergencyDetected(sym);
      }
    }

    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const handleAddCustom = () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms([...selectedSymptoms, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

  const handleRunAssessment = async () => {
    const inputPayload: SymptomAssessmentInput = {
      age: Number(age),
      gender,
      primaryConcern: primaryConcern || selectedSymptoms.join(', ') || 'General symptoms',
      symptoms: selectedSymptoms,
      duration,
      severity,
      onset,
      existingConditions,
      medications,
    };

    const result = await SymptomEngine.evaluate(inputPayload);
    navigate('/symptom-result', { state: { result } });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-widest text-teal-600">Educational Triage Tool</span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Symptom Assessment & Triage</h1>
        <p className="text-xs text-slate-600 max-w-xl mx-auto">
          Answer a few questions regarding your symptoms to evaluate urgency levels and prepare a summary for your medical consultation.
        </p>
      </div>

      {/* Emergency Intercept Modal / Warning */}
      {emergencyDetected && (
        <div className="p-6 rounded-3xl bg-red-600 text-white shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-amber-300 animate-bounce" />
            <h2 className="text-xl font-extrabold">Emergency Red Flag Detected</h2>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-red-100">
            You selected a severe symptom indicator: <strong>"{emergencyDetected}"</strong>.
            Online symptom tools cannot evaluate life-threatening conditions.
          </p>
          <div className="bg-red-800/80 p-4 rounded-2xl text-xs space-y-2 border border-red-500">
            <p className="font-bold text-amber-200">Immediate Action Required:</p>
            <p>Do NOT proceed with an online questionnaire. Call emergency medical services (1122) or go to the nearest emergency department immediately.</p>
          </div>
          <button
            onClick={() => setEmergencyDetected(null)}
            className="text-xs underline text-red-200 hover:text-white"
          >
            I selected this by mistake (Dismiss warning)
          </button>
        </div>
      )}

      {/* Step Wizard Progress */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-soft flex items-center justify-between text-xs font-semibold text-slate-600">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-teal-600 font-bold' : ''}`}>
          <span className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-teal-800 font-bold text-xs">1</span>
          <span>Basics</span>
        </div>
        <div className="w-8 h-0.5 bg-slate-200" />
        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-teal-600 font-bold' : ''}`}>
          <span className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-teal-800 font-bold text-xs">2</span>
          <span>Symptoms</span>
        </div>
        <div className="w-8 h-0.5 bg-slate-200" />
        <div className={`flex items-center gap-2 ${step >= 3 ? 'text-teal-600 font-bold' : ''}`}>
          <span className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-teal-800 font-bold text-xs">3</span>
          <span>Details & History</span>
        </div>
      </div>

      {/* STEP 1: BASICS */}
      {step === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b pb-3">Step 1: Patient Basics & Main Concern</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Patient Age *</label>
              <input
                type="number"
                min={1}
                max={120}
                value={age}
                onChange={e => setAge(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Gender *</label>
              <select
                value={gender}
                onChange={e => setGender(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Primary Health Concern *</label>
            <input
              type="text"
              value={primaryConcern}
              onChange={e => setPrimaryConcern(e.target.value)}
              placeholder="e.g. Cough with fever for 3 days"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setStep(2)}
              disabled={!primaryConcern.trim()}
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs px-6 py-3 rounded-xl shadow transition"
            >
              Continue to Symptoms <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SYMPTOMS CHIPS */}
      {step === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b pb-3">Step 2: Select All Applicable Symptoms</h2>

          <div className="flex flex-wrap gap-2">
            {commonSymptomChips.map(sym => {
              const isSelected = selectedSymptoms.includes(sym);
              return (
                <button
                  key={sym}
                  type="button"
                  onClick={() => toggleSymptom(sym)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
                    isSelected
                      ? 'bg-teal-600 text-white border-teal-600 shadow'
                      : 'bg-slate-50 hover:bg-teal-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {sym}
                </button>
              );
            })}
          </div>

          {/* Add custom symptom */}
          <div className="flex gap-2 pt-2">
            <input
              type="text"
              value={customSymptom}
              onChange={e => setCustomSymptom(e.target.value)}
              placeholder="Add additional specific symptom..."
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="button"
              onClick={handleAddCustom}
              className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
            >
              Add
            </button>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow transition"
            >
              Continue to Details <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: DETAILS & HISTORY */}
      {step === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b pb-3">Step 3: Duration, Severity & Medical History</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Duration</label>
              <select
                value={duration}
                onChange={e => setDuration(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Less than 24 hours">Less than 24 hours</option>
                <option value="2-3 days">2-3 days</option>
                <option value="1 week">1 week</option>
                <option value="More than 2 weeks">More than 2 weeks</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Severity</label>
              <select
                value={severity}
                onChange={e => setSeverity(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="mild">Mild (Discomforting)</option>
                <option value="moderate">Moderate (Interferes with routine)</option>
                <option value="severe">Severe (Distressing)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Onset</label>
              <select
                value={onset}
                onChange={e => setOnset(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="gradual">Gradual over time</option>
                <option value="sudden">Sudden onset</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Existing Medical Conditions (Optional)</label>
            <input
              type="text"
              value={existingConditions}
              onChange={e => setExistingConditions(e.target.value)}
              placeholder="e.g. Hypertension, Diabetes, Asthma"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Current Medications (Optional)</label>
            <input
              type="text"
              value={medications}
              onChange={e => setMedications(e.target.value)}
              placeholder="e.g. Panadol, Insulin, Antihypertensives"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleRunAssessment}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs px-7 py-3.5 rounded-xl shadow-lg transition"
            >
              Generate Triage Assessment <Stethoscope className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
