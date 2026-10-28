import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck,
  Stethoscope,
  Sun,
  Moon
} from 'lucide-react';
import { DataService } from '../services/dataService';
import { EmailService } from '../services/emailService';
import { MedicalService } from '../types';

const format12Hour = (time24: string): string => {
  if (!time24) return '';
  const clean = time24.trim().split(' ')[0];
  const [hStr, mStr] = clean.split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr || '0', 10);
  if (isNaN(h)) return time24;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  return `${String(displayH).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
};

const getLocalDateString = (offsetDays = 0): string => {
  const d = new Date();
  if (offsetDays) {
    d.setDate(d.getDate() + offsetDays);
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const AppointmentBookingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Step State: 1 = Service & Date, 2 = Time Slot, 3 = Patient Info, 4 = Review & Consent
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<MedicalService[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  
  // Date selection (default tomorrow in local Pakistan time)
  const defaultDateStr = getLocalDateString(1);
  const [selectedDate, setSelectedDate] = useState<string>(defaultDateStr);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>('08:00');
  const [customTime, setCustomTime] = useState<string>('');

  // Form Fields
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<'male' | 'female' | 'other' | 'prefer_not_to_say'>('male');
  const [reason, setReason] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [symptomSummary, setSymptomSummary] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  // Errors & Submitting State
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load initial services & pre-fill parameters
  useEffect(() => {
    DataService.getServices().then(srvs => {
      const active = srvs.filter(s => s.isActive);
      setServices(active);

      const urlSrvId = searchParams.get('serviceId');
      if (urlSrvId && active.some(s => s.id === urlSrvId)) {
        setSelectedServiceId(urlSrvId);
      } else if (active.length > 0) {
        setSelectedServiceId(active[0].id);
      }
    });

    // Check if pre-filled from Symptom Assessment
    const prefillSymptom = sessionStorage.getItem('prefill_symptom_summary');
    if (prefillSymptom) {
      try {
        const parsed = JSON.parse(prefillSymptom);
        if (parsed.symptomSummary) setSymptomSummary(parsed.symptomSummary);
        if (parsed.reason) setReason(parsed.reason);
        if (parsed.age) setAge(parsed.age);
        if (parsed.gender) setGender(parsed.gender);
        sessionStorage.removeItem('prefill_symptom_summary');
      } catch (e) {
        console.error('Error parsing prefilled symptom data:', e);
      }
    }
  }, [searchParams]);

  // Load available time slots whenever date changes
  useEffect(() => {
    if (selectedDate) {
      setLoadingSlots(true);
      DataService.getAvailableSlotsForDate(selectedDate).then(slots => {
        setAvailableSlots(slots);
        setLoadingSlots(false);
        if (slots.length > 0 && !slots.includes(selectedTime)) {
          setSelectedTime(slots[0]);
        }
      });
    }
  }, [selectedDate]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('File size must be less than 5MB.');
        return;
      }
      setDocumentFile(file);
      setErrorMsg('');
    }
  };

  const handleSubmitBooking = async () => {
    if (!consentAccepted) {
      setErrorMsg('Please accept the medical disclaimer and privacy consent to proceed.');
      return;
    }
    if (!patientName || !patientEmail || !patientPhone || !reason) {
      setErrorMsg('Please fill in all required patient fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const activeService = services.find(s => s.id === selectedServiceId);

    const bookingPayload = {
      patientName,
      patientEmail,
      patientPhone,
      age: Number(age),
      gender,
      serviceId: selectedServiceId,
      serviceTitle: activeService?.title || 'General Consultation',
      appointmentDate: selectedDate,
      appointmentTime: selectedTime.trim().split(' ')[0],
      reason,
      symptoms: symptoms || reason,
      symptomSummary: symptomSummary || symptoms || reason,
      documentUrl: documentFile ? `local-upload://${documentFile.name}` : undefined,
    };

    const res = await DataService.createAppointment(bookingPayload);

    if (!res.success || !res.appointment) {
      setIsSubmitting(false);
      setErrorMsg(res.error || 'Failed to complete appointment booking. Please try another time slot.');
      return;
    }

    // Trigger Netlify Form capture for global cross-device cloud submission
    try {
      const formParams = new URLSearchParams();
      formParams.append('form-name', 'appointment');
      formParams.append('referenceNo', res.appointment.referenceNo);
      formParams.append('patientName', res.appointment.patientName);
      formParams.append('patientPhone', res.appointment.patientPhone);
      formParams.append('patientEmail', res.appointment.patientEmail);
      formParams.append('appointmentDate', res.appointment.appointmentDate);
      formParams.append('appointmentTime', res.appointment.appointmentTime);
      formParams.append('serviceTitle', res.appointment.serviceTitle || 'General Consultation');
      formParams.append('reason', res.appointment.reason);

      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formParams.toString(),
      });
    } catch (e) {
      console.warn('Netlify form submission error:', e);
    }

    // Trigger Email Notification asynchronously
    await EmailService.sendAppointmentNotification(res.appointment);

    setIsSubmitting(false);
    navigate(`/appointment-confirmation/${res.appointment.referenceNo}`, { state: { appointment: res.appointment } });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header Title */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Schedule Your Consultation</h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Book an appointment with Dr. Muhammad Saad Obhaya (MBBS). Pakistan Standard Time (PST).
        </p>
      </div>

      {/* Progress Wizard Header */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-soft flex items-center justify-between text-xs font-semibold text-slate-600">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-medical-600 font-bold' : ''}`}>
          <span className="w-6 h-6 rounded-full bg-medical-100 flex items-center justify-center text-medical-800 font-bold text-xs">1</span>
          <span className="hidden sm:inline">Service & Date</span>
        </div>
        <div className="w-8 h-0.5 bg-slate-200" />
        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-medical-600 font-bold' : ''}`}>
          <span className="w-6 h-6 rounded-full bg-medical-100 flex items-center justify-center text-medical-800 font-bold text-xs">2</span>
          <span className="hidden sm:inline">Time Slot</span>
        </div>
        <div className="w-8 h-0.5 bg-slate-200" />
        <div className={`flex items-center gap-2 ${step >= 3 ? 'text-medical-600 font-bold' : ''}`}>
          <span className="w-6 h-6 rounded-full bg-medical-100 flex items-center justify-center text-medical-800 font-bold text-xs">3</span>
          <span className="hidden sm:inline">Patient Info</span>
        </div>
        <div className="w-8 h-0.5 bg-slate-200" />
        <div className={`flex items-center gap-2 ${step >= 4 ? 'text-medical-600 font-bold' : ''}`}>
          <span className="w-6 h-6 rounded-full bg-medical-100 flex items-center justify-center text-medical-800 font-bold text-xs">4</span>
          <span className="hidden sm:inline">Confirm</span>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: SERVICE & DATE */}
      {step === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b pb-3">1. Select Service & Preferred Date</h2>
          
          {/* Services Selector */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Select Service</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {services.map(srv => (
                <div
                  key={srv.id}
                  onClick={() => setSelectedServiceId(srv.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                    selectedServiceId === srv.id
                      ? 'border-medical-600 bg-medical-50/60 ring-2 ring-medical-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-sm">{srv.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{srv.description}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>{srv.durationMins} Mins</span>
                    <span className="font-bold text-medical-700">{srv.fee}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Date Picker */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Select Consultation Date</label>
            <input
              type="date"
              min={getLocalDateString(0)}
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setStep(2)}
              disabled={!selectedServiceId || !selectedDate}
              className="inline-flex items-center gap-2 bg-medical-600 hover:bg-medical-700 disabled:opacity-50 text-white font-bold text-sm px-6 py-3 rounded-xl shadow transition"
            >
              Continue to Time Slots <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: TIME SLOT */}
      {step === 2 && (() => {
        const morningSlots = availableSlots.filter(s => {
          const h = parseInt(s.split(':')[0], 10);
          return h >= 8 && h < 14;
        });
        const eveningSlots = availableSlots.filter(s => {
          const h = parseInt(s.split(':')[0], 10);
          return h >= 19 && h <= 22;
        });
        const otherSlots = availableSlots.filter(s => !morningSlots.includes(s) && !eveningSlots.includes(s));
        const isTimeValid = DataService.isTimeInClinicHours(selectedTime);

        return (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-2">
              <div>
                <h2 className="text-lg font-bold text-slate-900">2. Select Consultation Time Slot</h2>
                <p className="text-xs text-slate-500">
                  Consultation timings: <strong>08:00 AM – 02:00 PM</strong> & <strong>07:00 PM – 10:00 PM</strong> (Pakistan Standard Time, PKT)
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-medical-50 text-medical-800 rounded-full border border-medical-200 self-start sm:self-auto">
                Date: {selectedDate}
              </span>
            </div>

            {loadingSlots ? (
              <div className="py-12 text-center text-xs text-slate-500">
                Calculating open slots...
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="p-6 rounded-2xl bg-amber-50 text-amber-900 text-xs font-medium space-y-2 text-center">
                <p>No consultation slots on this date (Clinic is closed or day off).</p>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="underline text-amber-800 font-bold"
                >
                  Choose another date
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* MORNING SHIFT */}
                {morningSlots.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider">
                      <Sun className="w-4 h-4 text-amber-500" />
                      <span>Morning Shift (08:00 AM – 02:00 PM PKT)</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                      {morningSlots.map(slot => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => {
                            setSelectedTime(slot);
                            setCustomTime('');
                          }}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                            selectedTime === slot
                              ? 'border-medical-600 bg-medical-600 text-white shadow-md ring-2 ring-medical-400/40'
                              : 'border-slate-200 hover:border-medical-400 bg-slate-50 text-slate-800 hover:bg-medical-50/50'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>{format12Hour(slot)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* EVENING SHIFT */}
                {eveningSlots.length > 0 && (
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
                      <Moon className="w-4 h-4 text-indigo-500" />
                      <span>Evening Shift (07:00 PM – 10:00 PM PKT)</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                      {eveningSlots.map(slot => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => {
                            setSelectedTime(slot);
                            setCustomTime('');
                          }}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                            selectedTime === slot
                              ? 'border-medical-600 bg-medical-600 text-white shadow-md ring-2 ring-medical-400/40'
                              : 'border-slate-200 hover:border-medical-400 bg-slate-50 text-slate-800 hover:bg-medical-50/50'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>{format12Hour(slot)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* OTHER SLOTS (IF ANY) */}
                {otherSlots.length > 0 && (
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <div className="text-slate-700 font-bold text-xs uppercase tracking-wider">
                      <span>Other Available Times</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {otherSlots.map(slot => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => {
                            setSelectedTime(slot);
                            setCustomTime('');
                          }}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                            selectedTime === slot
                              ? 'border-medical-600 bg-medical-600 text-white shadow-md'
                              : 'border-slate-200 hover:border-medical-400 bg-slate-50 text-slate-800'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>{format12Hour(slot)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* CUSTOM PREFERRED TIME OPTION */}
                <div className="pt-4 border-t border-slate-100 bg-slate-50/80 p-4 rounded-2xl border">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Or Select a Custom Specific Time</h4>
                      <p className="text-[11px] text-slate-500">Pick any time between 08:00 AM – 02:00 PM or 07:00 PM – 10:00 PM</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={customTime}
                        onChange={e => {
                          const val = e.target.value;
                          setCustomTime(val);
                          if (val) {
                            setSelectedTime(val);
                          }
                        }}
                        className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-medical-500"
                      />
                    </div>
                  </div>
                </div>

                {/* SELECTED TIME BANNER */}
                {selectedTime && (
                  <div className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-between border ${
                    isTimeValid 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                      : 'bg-red-50 text-red-800 border-red-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        Selected Time: <strong>{format12Hour(selectedTime)}</strong> ({selectedTime} PKT)
                      </span>
                    </div>
                    {!isTimeValid && (
                      <span className="text-[11px] font-bold text-red-600">Must be within 8am-2pm or 7pm-10pm</span>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 text-xs font-bold"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Date
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!isTimeValid) {
                    setErrorMsg('Please select a time within consultation hours: 08:00 AM – 02:00 PM or 07:00 PM – 10:00 PM (PKT).');
                    return;
                  }
                  setErrorMsg('');
                  setStep(3);
                }}
                disabled={!selectedTime || !isTimeValid || availableSlots.length === 0}
                className="inline-flex items-center gap-2 bg-medical-600 hover:bg-medical-700 disabled:opacity-50 text-white font-bold text-sm px-6 py-3 rounded-xl shadow transition"
              >
                Continue to Patient Details <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })()}

      {/* STEP 3: PATIENT INFO */}
      {step === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b pb-3">3. Patient Contact & Symptom Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Full Name *</label>
              <input
                type="text"
                value={patientName}
                onChange={e => setPatientName(e.target.value)}
                placeholder="e.g. Malik Ahmad"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Phone Number *</label>
              <input
                type="tel"
                value={patientPhone}
                onChange={e => setPatientPhone(e.target.value)}
                placeholder="+92 300 1234567"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Email Address *</label>
              <input
                type="email"
                value={patientEmail}
                onChange={e => setPatientEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Age *</label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={age}
                  onChange={e => setAge(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Gender *</label>
                <select
                  value={gender}
                  onChange={e => setGender(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Reason for Visit *</label>
            <input
              type="text"
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Primary health concern or topic to discuss"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Symptom Description / Summary (Optional)</label>
            <textarea
              rows={3}
              value={symptoms}
              onChange={e => setSymptoms(e.target.value)}
              placeholder="Describe symptoms, onset duration, severity, or current medications..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-medical-500"
            />
          </div>

          {/* Optional Document Upload */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Optional Report / Prescription Upload</span>
              <span className="text-[10px] text-slate-400 font-normal">PDF, JPG, PNG (Max 5MB)</span>
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-4 py-2.5 rounded-xl border border-slate-300 transition">
                <Upload className="w-4 h-4 text-medical-600" />
                <span>{documentFile ? documentFile.name : 'Choose File'}</span>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload} className="hidden" />
              </label>
              {documentFile && (
                <button
                  type="button"
                  onClick={() => setDocumentFile(null)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-500 italic">
              Notice: Please do not upload sensitive financial or unnecessary documents. Uploaded files are saved to doctor storage.
            </p>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Time
            </button>
            <button
              onClick={() => {
                if (!patientName || !patientEmail || !patientPhone || !reason) {
                  setErrorMsg('Please complete all required fields (*)');
                  return;
                }
                setErrorMsg('');
                setStep(4);
              }}
              className="inline-flex items-center gap-2 bg-medical-600 hover:bg-medical-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow transition"
            >
              Review Booking <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW & CONSENT */}
      {step === 4 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-6">
          <h2 className="text-lg font-bold text-slate-900 border-b pb-3">4. Review Booking Details & Medical Consent</h2>

          {/* Summary Box */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Doctor</span>
                <span className="font-bold text-slate-900">Dr. Muhammad Saad Obhaya (MBBS)</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Service</span>
                <span className="font-bold text-medical-700">
                  {services.find(s => s.id === selectedServiceId)?.title}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Date & Time</span>
                <span className="font-bold text-slate-900">{selectedDate} @ {format12Hour(selectedTime)} ({selectedTime} PKT)</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Patient</span>
                <span className="font-bold text-slate-900">{patientName} ({age} yrs, {gender})</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Contact</span>
              <span className="text-slate-700">{patientEmail} • {patientPhone}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Reason for Visit</span>
              <span className="text-slate-700 font-medium">{reason}</span>
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="p-4 rounded-2xl bg-medical-50/60 border border-medical-200 space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consentAccepted}
                onChange={e => setConsentAccepted(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-medical-600 rounded border-slate-300 focus:ring-medical-500"
              />
              <span className="text-xs text-slate-700 leading-relaxed font-medium">
                I understand that this consultation appointment is conducted by Dr. Muhammad Saad Obhaya (MBBS). I agree to provide accurate medical information and understand that emergency conditions require immediate in-person emergency hospital care.
              </span>
            </label>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" /> Edit Details
            </button>
            <button
              onClick={handleSubmitBooking}
              disabled={isSubmitting || !consentAccepted}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-medical-600 to-teal-600 hover:from-medical-700 hover:to-teal-700 disabled:opacity-50 text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg transition"
            >
              {isSubmitting ? 'Confirming Appointment...' : 'Submit Appointment Request'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
