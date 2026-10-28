import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Calendar, Clock, User, FileText, Printer, Home, Download, ShieldCheck } from 'lucide-react';
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

export const AppointmentConfirmationPage: React.FC = () => {
  const { ref } = useParams<{ ref: string }>();
  const location = useLocation();
  const [appointment, setAppointment] = useState<Appointment | null>(location.state?.appointment || null);
  const [loading, setLoading] = useState(!location.state?.appointment);

  useEffect(() => {
    if (!appointment && ref) {
      DataService.getAppointmentByReference(ref).then(apt => {
        setAppointment(apt);
        setLoading(false);
      });
    }
  }, [ref, appointment]);

  const handleDownloadICS = () => {
    if (!appointment) return;
    const dateFormatted = appointment.appointmentDate.replace(/-/g, '');
    const [h, m] = appointment.appointmentTime.split(':');
    const startTimeStr = `${dateFormatted}T${h}${m}00`;
    
    // 30 min duration
    const endMins = Number(h) * 60 + Number(m) + 30;
    const endH = Math.floor(endMins / 60).toString().padStart(2, '0');
    const endM = (endMins % 60).toString().padStart(2, '0');
    const endTimeStr = `${dateFormatted}T${endH}${endM}00`;

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Dr Saad Obhaya Clinic//Appointment Calendar//EN
BEGIN:VEVENT
UID:${appointment.referenceNo}@drsaadobhaya.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${startTimeStr}
DTEND:${endTimeStr}
SUMMARY:Medical Consultation with Dr. Muhammad Saad Obhaya
DESCRIPTION:Service: ${appointment.serviceTitle || 'General Consultation'}. Ref: ${appointment.referenceNo}. Doctor: Dr. Muhammad Saad Obhaya (MBBS).
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `appointment-${appointment.referenceNo}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div className="py-20 text-center text-xs text-slate-500">Loading appointment details...</div>;
  }

  if (!appointment) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Appointment Not Found</h2>
        <p className="text-xs text-slate-600">We could not locate reference ID {ref}.</p>
        <Link to="/" className="inline-block bg-medical-600 text-white font-semibold text-xs px-4 py-2 rounded-xl">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Confirmation Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-card text-center space-y-6">
        
        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600">Booking Confirmed</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Appointment Request Received</h1>
          <p className="text-xs text-slate-600">
            Your consultation request has been logged. Please save your reference number for status tracking.
          </p>
        </div>

        {/* Reference Number Badge */}
        <div className="inline-block bg-slate-100 border border-slate-300 px-6 py-3 rounded-2xl">
          <span className="text-[10px] text-slate-500 font-bold uppercase block tracking-wider">Booking Reference ID</span>
          <span className="text-xl font-extrabold text-medical-700 tracking-wider font-mono">{appointment.referenceNo}</span>
        </div>

        {/* Key Appointment Details Table */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 text-left text-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-slate-400 font-bold uppercase block text-[10px]">Doctor</span>
              <span className="font-bold text-slate-900 text-sm">Dr. Muhammad Saad Obhaya (MBBS)</span>
              <span className="text-[11px] text-slate-500 block">Sir Ganga Ram Hospital, Lahore</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase block text-[10px]">Service</span>
              <span className="font-bold text-medical-700 text-sm">{appointment.serviceTitle || 'General Consultation'}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase block text-[10px]">Date & Time</span>
              <span className="font-bold text-slate-900">{appointment.appointmentDate} @ {format12Hour(appointment.appointmentTime)} ({appointment.appointmentTime} PKT)</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase block text-[10px]">Current Status</span>
              <span className="inline-block bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full uppercase text-[10px]">
                {appointment.status}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-slate-400 font-bold uppercase block text-[10px]">Patient Name</span>
              <span className="font-bold text-slate-900">{appointment.patientName} ({appointment.age} yrs)</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase block text-[10px]">Contact</span>
              <span className="text-slate-700">{appointment.patientPhone} • {appointment.patientEmail}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3 no-print">
          <button
            onClick={handleDownloadICS}
            className="inline-flex items-center gap-2 bg-medical-600 hover:bg-medical-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow transition"
          >
            <Download className="w-4 h-4" /> Add to Calendar (.ICS)
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs px-4 py-3 rounded-xl border border-slate-300 transition"
          >
            <Printer className="w-4 h-4" /> Print Receipt
          </button>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-semibold text-xs px-4 py-3 rounded-xl transition"
          >
            <Home className="w-4 h-4" /> Return Home
          </Link>
        </div>

      </div>

    </div>
  );
};
