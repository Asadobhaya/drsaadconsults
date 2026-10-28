import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  LogOut, 
  Search, 
  FileText, 
  MessageSquare, 
  Stethoscope, 
  Bell, 
  ShieldCheck, 
  Eye,
  Building2,
  ListFilter
} from 'lucide-react';
import { DataService } from '../../services/dataService';
import { EmailService } from '../../services/emailService';
import { 
  Appointment, 
  AppointmentStatus, 
  AvailabilitySlot, 
  BlockedDate, 
  DoctorProfile, 
  FAQItem, 
  MedicalService, 
  PatientMessage, 
  SymptomRule,
  Announcement,
  AuditLog
} from '../../types';

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

export const DoctorDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  // Auth Guard
  useEffect(() => {
    const isAuth = sessionStorage.getItem('saad_doctor_auth');
    if (!isAuth) {
      navigate('/login');
    }
  }, [navigate]);

  // Dashboard Active Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'calendar' | 'availability' | 'services' | 'content' | 'symptoms' | 'messages' | 'audit'>('overview');

  // Data States
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<MedicalService[]>([]);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [messages, setMessages] = useState<PatientMessage[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [symptomRules, setSymptomRules] = useState<SymptomRule[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Filter & Search states
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [editServiceModal, setEditServiceModal] = useState<Partial<MedicalService> | null>(null);
  const [editFaqModal, setEditFaqModal] = useState<Partial<FAQItem> | null>(null);
  const [editAnnModal, setEditAnnModal] = useState<Partial<Announcement> | null>(null);
  const [newBlockDate, setNewBlockDate] = useState('');
  const [newBlockReason, setNewBlockReason] = useState('Holiday');

  // Notification state
  const [saveToast, setSaveToast] = useState('');

  const loadData = async () => {
    const p = await DataService.getDoctorProfile();
    const apts = await DataService.getAppointments();
    const srvs = await DataService.getServices();
    const avail = await DataService.getAvailability();
    const blk = await DataService.getBlockedDates();
    const msgs = await DataService.getMessages();
    const fqs = await DataService.getFAQs();
    const anns = await DataService.getAnnouncements();
    const rules = await DataService.getSymptomRules();
    const logs = await DataService.getAuditLogs();

    setProfile(p);
    setAppointments(apts);
    setServices(srvs);
    setAvailability(avail);
    setBlockedDates(blk);
    setMessages(msgs);
    setFaqs(fqs);
    setAnnouncements(anns);
    setSymptomRules(rules);
    setAuditLogs(logs);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000); // Auto-refresh every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const triggerToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(''), 3000);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('saad_doctor_auth');
    navigate('/login');
  };

  const handleStatusChange = async (aptId: string, status: AppointmentStatus) => {
    const updated = await DataService.updateAppointmentStatus(aptId, status);
    setAppointments(updated);
    if (selectedAppointment && selectedAppointment.id === aptId) {
      setSelectedAppointment({ ...selectedAppointment, status });
    }

    if (status === 'confirmed') {
      const targetApt = updated.find(a => a.id === aptId);
      if (targetApt) {
        await EmailService.sendConfirmationEmailToPatient(targetApt);
      }
    }

    triggerToast(`Appointment status updated to ${status.toUpperCase()}`);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    const updated = await DataService.updateDoctorProfile(profile);
    setProfile(updated);
    triggerToast('Doctor profile content updated successfully!');
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editServiceModal) return;
    const updated = await DataService.saveService(editServiceModal);
    setServices(updated);
    setEditServiceModal(null);
    triggerToast('Medical service saved!');
  };

  const handleDeleteService = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      const updated = await DataService.deleteService(id);
      setServices(updated);
      triggerToast('Service removed.');
    }
  };

  const handleSaveFAQ = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFaqModal) return;
    const updated = await DataService.saveFAQ(editFaqModal);
    setFaqs(updated);
    setEditFaqModal(null);
    triggerToast('FAQ item updated.');
  };

  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editAnnModal) return;
    const updated = await DataService.saveAnnouncement(editAnnModal);
    setAnnouncements(updated);
    setEditAnnModal(null);
    triggerToast('Announcement updated.');
  };

  const handleToggleBlockDate = async (dateStr: string) => {
    if (!dateStr) return;
    const updated = await DataService.toggleBlockDate(dateStr, newBlockReason);
    setBlockedDates(updated);
    setNewBlockDate('');
    triggerToast('Blocked date list updated.');
  };

  // Filtered Appointments list
  const filteredAppointments = appointments.filter(a => {
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchesSearch = 
      a.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.referenceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.patientPhone.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.appointmentDate === todayStr && a.status !== 'cancelled');
  const pendingRequests = appointments.filter(a => a.status === 'pending');

  return (
    <div className="min-h-screen bg-slate-100/70 pb-20">
      
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white font-semibold text-xs px-4 py-3 rounded-2xl shadow-xl animate-in slide-in-from-top-2 duration-200">
          {saveToast}
        </div>
      )}

      {/* Doctor Dashboard Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm mb-6 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-medical-600 text-white flex items-center justify-center font-bold text-sm">
                SO
              </div>
              <div>
                <h1 className="font-extrabold text-slate-900 text-sm tracking-tight">Doctor Control Center</h1>
                <p className="text-[11px] text-slate-500 font-medium">Dr. Muhammad Saad Obhaya (MBBS)</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-red-600 bg-slate-100 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-slate-200 transition"
            >
              <LogOut className="w-3.5 h-3.5" /> Log Out
            </button>

          </div>

          {/* Nav Tabs */}
          <div className="flex space-x-1 overflow-x-auto border-t border-slate-100 text-xs font-semibold text-slate-600 py-1">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'appointments', label: `Appointments (${appointments.length})` },
              { id: 'calendar', label: 'Calendar' },
              { id: 'availability', label: 'Working Hours' },
              { id: 'services', label: 'Services' },
              { id: 'content', label: 'CMS Content' },
              { id: 'symptoms', label: 'Symptom Rules' },
              { id: 'messages', label: `Messages (${messages.filter(m => m.status === 'unread').length})` },
              { id: 'audit', label: 'Audit Logs' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-2 rounded-lg transition shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-medical-600 text-white font-bold shadow-xs'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>
      </header>

      {/* Main Dashboard Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Today's Appointments</span>
                  <h3 className="text-2xl font-extrabold text-slate-900">{todayAppointments.length}</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-medical-50 text-medical-600 flex items-center justify-center font-bold">
                  <CalendarIcon className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Pending Requests</span>
                  <h3 className="text-2xl font-extrabold text-amber-600">{pendingRequests.length}</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Clock className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Total Bookings</span>
                  <h3 className="text-2xl font-extrabold text-teal-600">{appointments.length}</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Unread Messages</span>
                  <h3 className="text-2xl font-extrabold text-sky-600">{messages.filter(m => m.status === 'unread').length}</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                  <MessageSquare className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Today's Schedule Table */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-bold text-slate-900 text-base">Today's Consultations ({todayStr})</h3>
                <button onClick={() => setActiveTab('appointments')} className="text-xs font-bold text-medical-600 underline">View All</button>
              </div>

              {todayAppointments.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-4">No appointments scheduled for today.</p>
              ) : (
                <div className="divide-y divide-slate-100 text-xs">
                  {todayAppointments.map(apt => (
                    <div key={apt.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{apt.patientName}</span>
                          <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">{apt.referenceNo}</span>
                        </div>
                        <p className="text-slate-500">{apt.serviceTitle} • {format12Hour(apt.appointmentTime)} ({apt.appointmentTime} PKT)</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStatusChange(apt.id, 'completed')}
                          className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold px-3 py-1 rounded-lg transition text-[11px]"
                        >
                          Mark Completed
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
              <h2 className="font-bold text-slate-900 text-lg">Appointment Management</h2>
              
              {/* Search & Status Filter */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search name or ref..."
                    className="bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold focus:outline-none"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b">
                    <th className="p-3">Ref ID</th>
                    <th className="p-3">Patient</th>
                    <th className="p-3">Service</th>
                    <th className="p-3">Date & Time</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-400 italic">
                        No matching appointments found.
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map(apt => (
                      <tr key={apt.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-3 font-mono font-bold text-slate-900">{apt.referenceNo}</td>
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{apt.patientName}</div>
                          <div className="text-[10px] text-slate-500">{apt.patientPhone}</div>
                        </td>
                        <td className="p-3 text-slate-700">{apt.serviceTitle}</td>
                        <td className="p-3 text-slate-700">{apt.appointmentDate} @ {format12Hour(apt.appointmentTime)} ({apt.appointmentTime} PKT)</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-full uppercase text-[10px] font-bold ${
                            apt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                            apt.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                            apt.status === 'completed' ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {apt.status}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1">
                          <button
                            onClick={() => setSelectedAppointment(apt)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg text-[11px] font-bold"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Appointment Detail Modal */}
            {selectedAppointment && (
              <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl animate-in zoom-in-95">
                  <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="font-extrabold text-slate-900 text-base">Appointment Details</h3>
                    <button onClick={() => setSelectedAppointment(null)} className="text-slate-400 hover:text-slate-700">✕</button>
                  </div>

                  <div className="space-y-2 text-xs">
                    <p><strong>Ref:</strong> {selectedAppointment.referenceNo}</p>
                    <p><strong>Date & Time:</strong> {selectedAppointment.appointmentDate} @ {format12Hour(selectedAppointment.appointmentTime)} ({selectedAppointment.appointmentTime} PKT)</p>
                    <p><strong>Patient:</strong> {selectedAppointment.patientName} ({selectedAppointment.age} yrs, {selectedAppointment.gender})</p>
                    <p><strong>Phone:</strong> {selectedAppointment.patientPhone}</p>
                    <p><strong>Email:</strong> {selectedAppointment.patientEmail}</p>
                    <p><strong>Reason:</strong> {selectedAppointment.reason}</p>
                    {selectedAppointment.symptomSummary && (
                      <div className="p-3 rounded-xl bg-slate-50 text-slate-700 whitespace-pre-line border text-[11px]">
                        <strong>Symptom Summary:</strong><br />
                        {selectedAppointment.symptomSummary}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex flex-wrap gap-2 border-t">
                    <button
                      onClick={() => handleStatusChange(selectedAppointment.id, 'confirmed')}
                      className="bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedAppointment.id, 'completed')}
                      className="bg-sky-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedAppointment.id, 'cancelled')}
                      className="bg-red-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 3: CALENDAR */}
        {activeTab === 'calendar' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-6">
            <h2 className="font-bold text-slate-900 text-lg border-b pb-3">Consultation Schedule Calendar</h2>
            <div className="grid grid-cols-1 sm:grid-cols-7 gap-3 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
                <div key={d} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700">
                  {d}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 italic text-center">Schedule slots automatically synchronized with Pakistan Standard Time (PST).</p>
          </div>
        )}

        {/* TAB 4: AVAILABILITY & WORKING HOURS */}
        {activeTab === 'availability' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-6">
            <h2 className="font-bold text-slate-900 text-lg border-b pb-3">Working Hours & Schedule Rules</h2>

            <div className="space-y-3">
              {availability.map(slot => (
                <div key={slot.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 w-28">{slot.dayName}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-slate-700">
                      {slot.shifts && slot.shifts.length > 0
                        ? slot.shifts.map(s => `${s.startTime} - ${s.endTime}`).join(' & ') + ' PKT'
                        : '08:00 - 14:00 & 19:00 - 22:00 PKT'}
                    </span>
                    <button
                      onClick={async () => {
                        const updated = availability.map(a => a.id === slot.id ? { ...a, isEnabled: !a.isEnabled } : a);
                        setAvailability(updated);
                        await DataService.updateAvailability(updated);
                        triggerToast('Schedule availability saved.');
                      }}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                        slot.isEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {slot.isEnabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Blocked Dates */}
            <div className="pt-4 border-t space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">Blocked Dates / Holidays</h3>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={newBlockDate}
                  onChange={e => setNewBlockDate(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                />
                <input
                  type="text"
                  value={newBlockReason}
                  onChange={e => setNewBlockReason(e.target.value)}
                  placeholder="Reason (e.g. Holiday)"
                  className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                />
                <button
                  onClick={() => handleToggleBlockDate(newBlockDate)}
                  className="bg-slate-900 text-white font-bold text-xs px-4 py-2 rounded-xl"
                >
                  Block Date
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {blockedDates.map(b => (
                  <span key={b.id} className="bg-red-50 text-red-800 border border-red-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                    {b.date} ({b.reason})
                    <button onClick={() => handleToggleBlockDate(b.date)} className="text-red-500 hover:text-red-900 font-extrabold">✕</button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SERVICES */}
        {activeTab === 'services' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="font-bold text-slate-900 text-lg">Medical Services Management</h2>
              <button
                onClick={() => setEditServiceModal({ title: '', description: '', durationMins: 30, fee: 'To be configured', isActive: true })}
                className="bg-medical-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow"
              >
                + Add Service
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map(srv => (
                <div key={srv.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm">{srv.title}</h4>
                    <span className="font-bold text-medical-700">{srv.fee}</span>
                  </div>
                  <p className="text-slate-600">{srv.description}</p>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">{srv.durationMins} Mins</span>
                    <div className="space-x-2">
                      <button onClick={() => setEditServiceModal(srv)} className="text-medical-600 font-bold">Edit</button>
                      <button onClick={() => handleDeleteService(srv.id)} className="text-red-600 font-bold">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Service Modal */}
            {editServiceModal && (
              <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
                <form onSubmit={handleSaveService} className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
                  <h3 className="font-bold text-slate-900 text-base">{editServiceModal.id ? 'Edit Service' : 'Add Service'}</h3>
                  <input
                    type="text"
                    value={editServiceModal.title || ''}
                    onChange={e => setEditServiceModal({ ...editServiceModal, title: e.target.value })}
                    placeholder="Service Title"
                    className="w-full bg-slate-50 border p-2.5 text-xs rounded-xl"
                  />
                  <textarea
                    rows={3}
                    value={editServiceModal.description || ''}
                    onChange={e => setEditServiceModal({ ...editServiceModal, description: e.target.value })}
                    placeholder="Description"
                    className="w-full bg-slate-50 border p-2.5 text-xs rounded-xl"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={editServiceModal.durationMins || 30}
                      onChange={e => setEditServiceModal({ ...editServiceModal, durationMins: Number(e.target.value) })}
                      placeholder="Duration (Mins)"
                      className="bg-slate-50 border p-2.5 text-xs rounded-xl"
                    />
                    <input
                      type="text"
                      value={editServiceModal.fee || ''}
                      onChange={e => setEditServiceModal({ ...editServiceModal, fee: e.target.value })}
                      placeholder="Consultation Fee"
                      className="bg-slate-50 border p-2.5 text-xs rounded-xl"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setEditServiceModal(null)} className="px-4 py-2 text-xs font-bold text-slate-500">Cancel</button>
                    <button type="submit" className="bg-medical-600 text-white font-bold text-xs px-4 py-2 rounded-xl">Save Service</button>
                  </div>
                </form>
              </div>
            )}

          </div>
        )}

        {/* TAB 6: CMS CONTENT */}
        {activeTab === 'content' && profile && (
          <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-6">
            <h2 className="font-bold text-slate-900 text-lg border-b pb-3">CMS Live Content Management</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Doctor Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={e => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-slate-50 border p-2.5 rounded-xl font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Phone</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={e => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full bg-slate-50 border p-2.5 rounded-xl font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={e => setProfile({ ...profile, email: e.target.value })}
                  className="w-full bg-slate-50 border p-2.5 rounded-xl font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Clinic Address</label>
                <input
                  type="text"
                  value={profile.clinicAddress}
                  onChange={e => setProfile({ ...profile, clinicAddress: e.target.value })}
                  className="w-full bg-slate-50 border p-2.5 rounded-xl font-semibold"
                />
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-700">Doctor Bio</label>
              <textarea
                rows={3}
                value={profile.bio}
                onChange={e => setProfile({ ...profile, bio: e.target.value })}
                className="w-full bg-slate-50 border p-2.5 rounded-xl font-medium"
              />
            </div>

            <button type="submit" className="bg-medical-600 text-white font-bold text-xs px-6 py-3 rounded-xl shadow">
              Save Content Changes
            </button>
          </form>
        )}

        {/* TAB 7: SYMPTOM RULES */}
        {activeTab === 'symptoms' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-6">
            <h2 className="font-bold text-slate-900 text-lg border-b pb-3">Symptom Assessment Triage Rules</h2>
            <div className="space-y-3">
              {symptomRules.map(rule => (
                <div key={rule.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm">{rule.conditionName}</h4>
                    <span className="font-bold uppercase text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800">{rule.urgencyLevel}</span>
                  </div>
                  <p className="text-slate-600"><strong>Primary:</strong> {rule.primarySymptoms.join(', ')}</p>
                  <p className="text-slate-600"><strong>Rationale:</strong> {rule.rationale}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: MESSAGES */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
            <h2 className="font-bold text-slate-900 text-lg border-b pb-3">Patient Contact Messages</h2>
            {messages.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4">No patient messages received.</p>
            ) : (
              <div className="space-y-3 text-xs">
                {messages.map(msg => (
                  <div key={msg.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{msg.name} ({msg.email})</span>
                      <span className="text-[10px] text-slate-400">{new Date(msg.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="font-semibold text-medical-700">{msg.subject}</p>
                    <p className="text-slate-600">{msg.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 9: AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
            <h2 className="font-bold text-slate-900 text-lg border-b pb-3">System Audit Logs</h2>
            <div className="space-y-2 text-xs">
              {auditLogs.map(log => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-50 border flex justify-between">
                  <span><strong>[{log.action}]</strong> {log.entity} ({log.entityId})</span>
                  <span className="text-slate-400">{new Date(log.createdAt).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
