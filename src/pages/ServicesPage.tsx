import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Calendar, Clock, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';
import { DataService } from '../services/dataService';
import { MedicalService } from '../types';

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<MedicalService[]>([]);

  useEffect(() => {
    DataService.getServices().then(srvs => setServices(srvs.filter(s => s.isActive)));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-widest text-medical-600">Areas of Care</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Clinical Services & Consultations
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          Structured physical evaluation, clinical triage, preventive guidance, and sub-specialty referral advice.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft hover:shadow-hover hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-medical-50 text-medical-600 flex items-center justify-center font-bold">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">{srv.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{srv.description}</p>
            </div>

            <div className="pt-6 border-t border-slate-100 mt-6 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" /> {srv.durationMins} Mins
                </span>
                <span className="bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-md">
                  {srv.fee}
                </span>
              </div>

              <Link
                to={`/book?serviceId=${srv.id}`}
                className="block text-center w-full bg-medical-600 hover:bg-medical-700 text-white font-bold text-xs py-3 rounded-xl shadow transition"
              >
                Book This Service
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Scope Disclaimer */}
      <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold block mb-1">Clinical Scope & Regulatory Note:</strong>
          The exact scope of clinical services provided during an online consultation depends on Dr. Saad Obhaya's clinical judgment, physical examination requirements, and applicable healthcare regulations. Emergency or surgical conditions require direct emergency hospital admission.
        </div>
      </div>

    </div>
  );
};
