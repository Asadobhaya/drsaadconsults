import React, { useEffect, useState } from 'react';
import { Phone, Mail, MapPin, Send, MessageCircle, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { DataService } from '../services/dataService';
import { EmailService } from '../services/emailService';
import { DoctorProfile } from '../types';

export const ContactPage: React.FC = () => {
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  
  // Contact form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    DataService.getDoctorProfile().then(setProfile);
  }, []);

  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!name || !email || !phone || !message) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    const newMsg = await DataService.createMessage({
      name,
      email,
      phone,
      subject: subject || 'General Inquiry',
      message,
    });

    // Send via Netlify Forms natively
    try {
      const formData = new URLSearchParams();
      formData.append('form-name', 'contact');
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('subject', subject || 'General Inquiry');
      formData.append('message', message);

      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });
    } catch (err) {
      console.warn('Netlify contact form post error:', err);
    }

    await EmailService.sendContactMessageNotification(newMsg);

    setLoading(false);
    setSubmitted(true);
  };

  const handleWhatsAppClick = () => {
    const defaultMsg = encodeURIComponent('Hello Dr. Saad, I would like information about booking an appointment.');
    window.open(`https://wa.me/923396999200?text=${defaultMsg}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-widest text-medical-600">Get in Touch</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Contact & Location</h1>
        <p className="text-slate-600 text-sm">
          Reach out to Dr. Muhammad Saad Obhaya for general inquiries or clinic scheduling details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Direct Contact Details */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-6">
            <h2 className="text-lg font-bold text-slate-900 border-b pb-3">Contact Information</h2>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <Phone className="w-5 h-5 text-medical-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block text-sm">Phone Contact</span>
                  <a href="tel:+923396999200" className="text-slate-600 hover:text-medical-600 font-medium">
                    +92 339 6999200
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <Mail className="w-5 h-5 text-medical-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block text-sm">Email Address</span>
                  <a href="mailto:drsaadobhaya@gmail.com" className="text-slate-600 hover:text-medical-600 font-medium">
                    drsaadobhaya@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <MapPin className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block text-sm">Hospital / Clinic Address</span>
                  <p className="text-slate-600 font-medium">
                    {profile?.clinicAddress || 'Sir Ganga Ram Hospital, Lahore, Pakistan'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <Clock className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block text-sm">Consultation Hours</span>
                  <p className="text-slate-600 font-medium">
                    {profile?.clinicTimings || 'Mon - Sun: 08:00 AM - 02:00 PM & 07:00 PM - 10:00 PM (PKT)'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick WhatsApp Button */}
            <div className="pt-2">
              <button
                onClick={handleWhatsAppClick}
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3.5 rounded-2xl shadow transition"
              >
                <MessageCircle className="w-4 h-4" /> Message on WhatsApp (+923396999200)
              </button>
            </div>

          </div>

        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-6">
            <h2 className="text-lg font-bold text-slate-900 border-b pb-3">Send a Message</h2>

            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Message Received</h3>
                <p className="text-xs text-slate-600">
                  Thank you for reaching out. Your message has been stored securely for Dr. Saad to review.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-bold text-medical-600 underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitMessage} className="space-y-4">
                
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Full Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Phone Number *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+92 300 1234567"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Email Address *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Subject</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      placeholder="General inquiry"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Message *</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Enter your message or inquiry..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-medical-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-medical-600 hover:bg-medical-700 text-white font-bold text-xs py-3.5 rounded-xl shadow transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> {loading ? 'Sending...' : 'Send Message'}
                </button>

              </form>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
