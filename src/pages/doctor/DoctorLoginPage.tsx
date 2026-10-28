import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Activity, AlertCircle, ShieldCheck } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';

export const DoctorLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('drsaadobhaya@gmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (!password) {
      setErrorMsg('Please enter your doctor password.');
      setLoading(false);
      return;
    }

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!error && data?.session) {
          sessionStorage.setItem('saad_doctor_auth', 'true');
          setLoading(false);
          navigate('/dashboard');
          return;
        }
      } catch (e: any) {
        console.warn('Supabase auth fallback:', e);
      }
    }

    // Doctor Password Check
    if (password === 'drsaad2026') {
      sessionStorage.setItem('saad_doctor_auth', 'true');
      sessionStorage.setItem('saad_doctor_email', email);
      setLoading(false);
      navigate('/dashboard');
    } else {
      setErrorMsg('Invalid doctor credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-card space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-medical-600 to-teal-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Activity className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Doctor Portal Login</h1>
          <p className="text-xs text-slate-500 font-medium">Dr. Muhammad Saad Obhaya (MBBS)</p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs font-medium flex items-center gap-2 border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Doctor Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter doctor password"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-medical-600 hover:bg-medical-700 text-white font-bold text-xs py-3.5 rounded-xl shadow transition"
          >
            {loading ? 'Authenticating...' : 'Log In to Doctor Dashboard'}
          </button>

        </form>

        <div className="pt-2 text-center border-t border-slate-100">
          <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> Authorized doctor access only
          </span>
        </div>

      </div>
    </div>
  );
};
