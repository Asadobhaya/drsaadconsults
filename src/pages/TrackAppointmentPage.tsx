import React, { useState } from 'react';
import { Search, Calendar, Clock, User, CheckCircle2, AlertCircle } from 'lucide-react';
import { DataService } from '../services/dataService';
import { Appointment } from '../types';

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

export const TrackAppointmentPage: React.FC = () => {
  const [refNo, setRefNo] = useState('');
  const [verification, setVerification] = useState('');
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSearched(false);
    setAppointment(null);

    if (!refNo.trim()) {
      setErrorMsg('Please enter your Appointment Reference ID.');
      return;
    }

    const match = await DataService.getAppointmentByReference(refNo.trim(), verification.trim());
    setSearched(true);

    if (match) {
      setAppointment(match);
    } else {
      setErrorMsg('No matching appointment found with the provided Reference ID and verification contact.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Track Your Appointment</h1>
        <p className="text-xs text-slate-600">
          Enter your reference ID and contact details to check current consultation status.
        </p>
      </div>

      {/* Lookup Form */}
      <form onSubmit={handleLookup} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-4">
        
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">Appointment Reference ID *</label>
          <input
            type="text"
            value={refNo}
            onChange={e => setRefNo(e.target.value)}
            placeholder="e.g. SAAD-2026-123456"
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs font-mono font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-medical-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">Email or Phone Verification Factor *</label>
          <input
            type="text"
            value={verification}
            onChange={e => setVerification(e.target.value)}
            placeholder="Enter email or phone used during booking"
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-medical-600 hover:bg-medical-700 text-white font-bold text-xs py-3.5 rounded-xl shadow transition flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" /> Check Status
        </button>

      </form>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Result Card */}
      {searched && appointment && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Reference Number</span>
              <span className="text-lg font-bold font-mono text-medical-700">{appointment.referenceNo}</span>
            </div>
            <span className="bg-medical-100 text-medical-800 font-bold text-xs px-3 py-1 rounded-full uppercase">
              {appointment.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 font-bold block text-[10px]">Service</span>
              <span className="font-semibold text-slate-800">{appointment.serviceTitle || 'General Consultation'}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold block text-[10px]">Date & Time</span>
              <span className="font-semibold text-slate-800">{appointment.appointmentDate} @ {format12Hour(appointment.appointmentTime)} ({appointment.appointmentTime} PKT)</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold block text-[10px]">Patient</span>
              <span className="font-semibold text-slate-800">{appointment.patientName} ({appointment.age} yrs)</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold block text-[10px]">Reason</span>
              <span className="font-semibold text-slate-800">{appointment.reason}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
