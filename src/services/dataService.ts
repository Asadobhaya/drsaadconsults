import { 
  Appointment, 
  DoctorProfile, 
  MedicalService, 
  AvailabilitySlot, 
  BlockedDate, 
  PatientMessage, 
  Announcement, 
  FAQItem, 
  SiteContent, 
  AuditLog, 
  AppointmentStatus,
  SymptomRule
} from '../types';
import { 
  INITIAL_DOCTOR_PROFILE, 
  INITIAL_SERVICES, 
  INITIAL_AVAILABILITY, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_FAQS, 
  INITIAL_SITE_CONTENT 
} from '../data/initialContent';
import { INITIAL_SYMPTOM_RULES } from '../data/symptomRules';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

const STORAGE_KEYS = {
  PROFILE: 'saad_doctor_profile_v2',
  SERVICES: 'saad_services_v2',
  AVAILABILITY: 'saad_availability_v2',
  BLOCKED_DATES: 'saad_blocked_dates',
  APPOINTMENTS: 'saad_appointments',
  MESSAGES: 'saad_messages',
  ANNOUNCEMENTS: 'saad_announcements',
  FAQS: 'saad_faqs',
  SITE_CONTENT: 'saad_site_content',
  SYMPTOM_RULES: 'saad_symptom_rules',
  AUDIT_LOGS: 'saad_audit_logs',
};

// Immediate cleanup of any old cached availability or timings from legacy keys
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    const oldAvail = window.localStorage.getItem('saad_availability');
    if (oldAvail && (oldAvail.includes('16:00') || !oldAvail.includes('08:00'))) {
      window.localStorage.removeItem('saad_availability');
    }
    const oldProfile = window.localStorage.getItem('saad_doctor_profile');
    if (oldProfile && oldProfile.includes('04:00 PM')) {
      window.localStorage.removeItem('saad_doctor_profile');
    }
  } catch (e) {
    // Ignore storage check issues
  }
}

// In-memory fallback for SSR / Node environment (Vitest)
const memoryStore: Record<string, string> = {};

// Helper: Local Storage Reader
function getItem<T>(key: string, defaultVal: T): T {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultVal;
    }
    const item = memoryStore[key];
    return item ? JSON.parse(item) : defaultVal;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return defaultVal;
  }
}

// Helper: Local Storage Writer
function setItem<T>(key: string, val: T): void {
  try {
    const jsonStr = JSON.stringify(val);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, jsonStr);
    }
    memoryStore[key] = jsonStr;
  } catch (e) {
    console.error(`Error writing ${key} to storage:`, e);
  }
}

// Helper: Guard async cloud calls against unresolving DNS or paused databases
function withTimeout<T>(promise: PromiseLike<T>, timeoutMs = 2500): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Cloud database request timed out')), timeoutMs)),
  ]);
}

export class DataService {

  // --- DOCTOR PROFILE ---
  static async getDoctorProfile(): Promise<DoctorProfile> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('doctor_profiles').select('*').single();
        if (!error && data) {
          return {
            id: data.id,
            name: data.name,
            qualification: data.qualification,
            medicalSchool: data.medical_school,
            currentPosition: data.current_position,
            currentHospital: data.current_hospital,
            phone: data.phone,
            email: data.email,
            clinicAddress: data.clinic_address,
            consultationFee: data.consultation_fee,
            clinicTimings: data.clinic_timings,
            bio: data.bio,
            avatarUrl: data.avatar_url || '',
            emergencyNotice: data.emergency_notice,
          };
        }
      } catch (e) {
        console.warn('Supabase fetch failed for doctor profile, falling back to local store.', e);
      }
    }
    const stored = getItem<DoctorProfile>(STORAGE_KEYS.PROFILE, INITIAL_DOCTOR_PROFILE);
    if (!stored.avatarUrl) {
      stored.avatarUrl = '/dr-saad.jpg';
    }
    // Auto-migrate older timings if present in localStorage
    if (!stored.clinicTimings || stored.clinicTimings.includes('04:00 PM') || !stored.clinicTimings.includes('08:00 AM')) {
      stored.clinicTimings = INITIAL_DOCTOR_PROFILE.clinicTimings;
      setItem(STORAGE_KEYS.PROFILE, stored);
    }
    return stored;
  }

  static async updateDoctorProfile(profile: Partial<DoctorProfile>): Promise<DoctorProfile> {
    const current = await this.getDoctorProfile();
    const updated = { ...current, ...profile };
    setItem(STORAGE_KEYS.PROFILE, updated);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('doctor_profiles').update({
          name: updated.name,
          phone: updated.phone,
          email: updated.email,
          clinic_address: updated.clinicAddress,
          consultation_fee: updated.consultationFee,
          clinic_timings: updated.clinicTimings,
          bio: updated.bio,
          avatar_url: updated.avatarUrl,
          emergency_notice: updated.emergencyNotice,
          updated_at: new Date().toISOString(),
        }).eq('id', updated.id);
      } catch (e) {
        console.error('Supabase update failed:', e);
      }
    }

    await this.logAudit('UPDATE', 'DoctorProfile', updated.id, 'Doctor', profile);
    return updated;
  }

  // --- MEDICAL SERVICES ---
  static async getServices(): Promise<MedicalService[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('services').select('*').order('created_at', { ascending: true });
        if (!error && data && data.length > 0) {
          return data.map((s: any) => ({
            id: s.id,
            title: s.title,
            description: s.description,
            durationMins: s.duration_mins,
            fee: s.fee,
            isActive: s.is_active,
          }));
        }
      } catch (e) {
        console.warn('Supabase fetch failed for services.', e);
      }
    }
    return getItem<MedicalService[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
  }

  static async saveService(service: Partial<MedicalService>): Promise<MedicalService[]> {
    const current = await this.getServices();
    let updated: MedicalService[];

    if (service.id) {
      updated = current.map(s => s.id === service.id ? { ...s, ...service } as MedicalService : s);
    } else {
      const newService: MedicalService = {
        id: `srv-${Date.now()}`,
        title: service.title || 'New Consultation Service',
        description: service.description || '',
        durationMins: service.durationMins || 30,
        fee: service.fee || 'To be configured',
        isActive: service.isActive ?? true,
      };
      updated = [...current, newService];
    }

    setItem(STORAGE_KEYS.SERVICES, updated);
    await this.logAudit(service.id ? 'UPDATE' : 'CREATE', 'Service', service.id || 'new', 'Doctor', service);
    return updated;
  }

  static async deleteService(id: string): Promise<MedicalService[]> {
    const current = await this.getServices();
    const updated = current.filter(s => s.id !== id);
    setItem(STORAGE_KEYS.SERVICES, updated);
    await this.logAudit('DELETE', 'Service', id, 'Doctor', {});
    return updated;
  }

  // --- AVAILABILITY & SCHEDULING ---
  static async getAvailability(): Promise<AvailabilitySlot[]> {
    const stored = getItem<AvailabilitySlot[]>(STORAGE_KEYS.AVAILABILITY, INITIAL_AVAILABILITY);
    // Auto-migrate if stored availability is from older 16:00 - 20:00 schedule or has no shifts
    const needsMigration = !stored || stored.length === 0 || stored.some(s => s.startTime === '16:00' || !s.shifts || s.shifts.length === 0);
    if (needsMigration) {
      setItem(STORAGE_KEYS.AVAILABILITY, INITIAL_AVAILABILITY);
      return INITIAL_AVAILABILITY;
    }
    return stored;
  }

  static async updateAvailability(slots: AvailabilitySlot[]): Promise<AvailabilitySlot[]> {
    setItem(STORAGE_KEYS.AVAILABILITY, slots);
    await this.logAudit('UPDATE', 'Availability', 'schedule', 'Doctor', { count: slots.length });
    return slots;
  }

  static async getBlockedDates(): Promise<BlockedDate[]> {
    return getItem<BlockedDate[]>(STORAGE_KEYS.BLOCKED_DATES, []);
  }

  static async toggleBlockDate(dateStr: string, reason: string): Promise<BlockedDate[]> {
    const current = await this.getBlockedDates();
    const exists = current.find(b => b.date === dateStr);
    let updated: BlockedDate[];
    if (exists) {
      updated = current.filter(b => b.date !== dateStr);
    } else {
      updated = [...current, { id: `block-${Date.now()}`, date: dateStr, reason }];
    }
    setItem(STORAGE_KEYS.BLOCKED_DATES, updated);
    return updated;
  }

  /**
   * Validates if a given time falls within the Pakistani consultation hours:
   * Morning: 08:00 AM - 02:00 PM (08:00 - 14:00)
   * Evening: 07:00 PM - 10:00 PM (19:00 - 22:00)
   */
  static isTimeInClinicHours(timeStr: string): boolean {
    if (!timeStr) return false;
    const clean = timeStr.trim().split(' ')[0];
    const [hStr, mStr] = clean.split(':');
    const h = parseInt(hStr, 10);
    const m = parseInt(mStr || '0', 10);
    if (isNaN(h) || isNaN(m)) return false;
    const totalMins = h * 60 + m;

    const morningStart = 8 * 60;   // 08:00 (8:00 AM)
    const morningEnd = 14 * 60;    // 14:00 (2:00 PM)
    const eveningStart = 19 * 60;  // 19:00 (7:00 PM)
    const eveningEnd = 22 * 60;    // 22:00 (10:00 PM)

    return (totalMins >= morningStart && totalMins <= morningEnd) ||
           (totalMins >= eveningStart && totalMins <= eveningEnd);
  }

  // --- GENERATE AVAILABLE TIME SLOTS (PKT / PST Timezone) ---
  static async getAvailableSlotsForDate(dateStr: string): Promise<string[]> {
    const blocked = await this.getBlockedDates();
    if (blocked.some(b => b.date === dateStr)) {
      return []; // Date is blocked
    }

    const [yr, mo, dy] = dateStr.split('-').map(Number);
    const dateObj = new Date(yr, mo - 1, dy);
    const dayOfWeek = dateObj.getDay(); // 0 = Sun, 1 = Mon...
    const availability = await this.getAvailability();
    const dayRule = availability.find(a => a.dayOfWeek === dayOfWeek && a.isEnabled);

    if (!dayRule) {
      return []; // Not working on this day
    }

    // Default morning & evening shifts: 8am-2pm and 7pm-10pm
    const shiftsToGenerate = (dayRule.shifts && dayRule.shifts.length > 0)
      ? dayRule.shifts
      : [
          { name: 'Morning Shift', startTime: '08:00', endTime: '14:00' },
          { name: 'Evening Shift', startTime: '19:00', endTime: '22:00' },
        ];

    const slots: string[] = [];
    const step = dayRule.slotDurationMins || 30;

    for (const shift of shiftsToGenerate) {
      const [startH, startM] = shift.startTime.split(':').map(Number);
      const [endH, endM] = shift.endTime.split(':').map(Number);

      let currentMins = startH * 60 + startM;
      const endMins = endH * 60 + endM;

      while (currentMins <= endMins) {
        const h = Math.floor(currentMins / 60);
        const m = currentMins % 60;
        const formatted = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        if (!slots.includes(formatted)) {
          slots.push(formatted);
        }
        currentMins += step;
      }
    }

    // No limited time slots: slots remain open and available so patients are never locked out
    return slots;
  }

  // --- APPOINTMENTS ---
  static async getAppointments(): Promise<Appointment[]> {
    const localApts = getItem<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, []);
    let supabaseApts: Appointment[] = [];

    // PRIMARY SOURCE: Supabase cloud database (only when configured)
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await withTimeout(supabase.from('appointments').select('*').order('created_at', { ascending: false }));
        if (!error && data) {
          supabaseApts = data.map((a: any) => ({
            id: a.id,
            referenceNo: a.reference_no,
            patientName: a.patient_name,
            patientEmail: a.patient_email,
            patientPhone: a.patient_phone,
            age: a.age,
            gender: a.gender,
            serviceId: a.service_id,
            serviceTitle: a.service_title,
            appointmentDate: a.appointment_date,
            appointmentTime: a.appointment_time,
            reason: a.reason,
            symptoms: a.symptoms,
            symptomSummary: a.symptom_summary,
            status: a.status as AppointmentStatus,
            documentUrl: a.document_url,
            createdAt: a.created_at,
            updatedAt: a.updated_at,
          }));
        } else if (error) {
          console.warn('Supabase fetch error:', error);
        }
      } catch (e) {
        console.warn('Supabase fetch failed:', e);
      }
    }

    // Merge Supabase + local by referenceNo (Supabase wins on conflicts)
    const mergedMap = new Map<string, Appointment>();
    localApts.forEach(a => mergedMap.set(a.referenceNo, a));
    supabaseApts.forEach(a => mergedMap.set(a.referenceNo, a));

    const mergedList = Array.from(mergedMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setItem(STORAGE_KEYS.APPOINTMENTS, mergedList);
    return mergedList;
  }

  static async createAppointment(input: Omit<Appointment, 'id' | 'referenceNo' | 'status' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; appointment?: Appointment; error?: string }> {
    // Check if the selected date is blocked
    const blocked = await this.getBlockedDates();
    if (blocked.some(b => b.date === input.appointmentDate)) {
      return { success: false, error: 'The clinic is closed on this selected date. Please choose another date.' };
    }

    // Validate consultation time within Pakistani clinic hours (08:00-14:00 or 19:00-22:00)
    if (!this.isTimeInClinicHours(input.appointmentTime)) {
      return { 
        success: false, 
        error: 'The selected time must be within consultation hours: 08:00 AM – 02:00 PM or 07:00 PM – 10:00 PM (PKT).' 
      };
    }

    const refNo = `SAAD-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const newAppointment: Appointment = {
      ...input,
      id: `apt-${Date.now()}`,
      referenceNo: refNo,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const current = await this.getAppointments();
    const updated = [newAppointment, ...current];
    setItem(STORAGE_KEYS.APPOINTMENTS, updated);

    // Ensure appointment_time is properly formatted as HH:MM:00 for Postgres TIME column
    let cleanTime = newAppointment.appointmentTime.trim().split(' ')[0];
    if (cleanTime.split(':').length === 2) {
      cleanTime = `${cleanTime}:00`;
    }

    // Sync to Supabase cloud database if configured
    if (isSupabaseConfigured) {
      try {
        const { error: insertError } = await withTimeout(supabase.from('appointments').insert({
          reference_no: newAppointment.referenceNo,
          patient_name: newAppointment.patientName,
          patient_email: newAppointment.patientEmail,
          patient_phone: newAppointment.patientPhone,
          age: newAppointment.age,
          gender: newAppointment.gender,
          service_id: newAppointment.serviceId,
          service_title: newAppointment.serviceTitle || 'General Consultation',
          appointment_date: newAppointment.appointmentDate,
          appointment_time: cleanTime,
          reason: newAppointment.reason,
          symptoms: newAppointment.symptoms,
          symptom_summary: newAppointment.symptomSummary,
          status: newAppointment.status,
          document_url: newAppointment.documentUrl,
        }));

        if (insertError) {
          console.warn('Supabase sync warning:', insertError);
        }
      } catch (e: any) {
        console.warn('Supabase sync exception:', e);
      }
    }

    await this.logAudit('CREATE', 'Appointment', newAppointment.referenceNo, 'Patient', { name: newAppointment.patientName });
    return { success: true, appointment: newAppointment };
  }

  static async updateAppointmentStatus(id: string, status: AppointmentStatus): Promise<Appointment[]> {
    const current = await this.getAppointments();
    const updated = current.map(a => a.id === id ? { ...a, status, updatedAt: new Date().toISOString() } : a);
    setItem(STORAGE_KEYS.APPOINTMENTS, updated);

    // Sync status change to Supabase if configured
    if (isSupabaseConfigured) {
      try {
        await withTimeout(supabase.from('appointments').update({ status, updated_at: new Date().toISOString() }).eq('id', id));
      } catch (e) {
        console.warn('Supabase status update error:', e);
      }
    }

    await this.logAudit('UPDATE_STATUS', 'Appointment', id, 'Doctor', { status });
    return updated;
  }

  static async getAppointmentByReference(refNo: string, verificationFactor?: string): Promise<Appointment | null> {
    const cleanRef = refNo.toUpperCase().trim().replace(/\s+/g, '');

    // 1. Direct Supabase Query (instant cross-device cloud lookup)
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await withTimeout(supabase
          .from('appointments')
          .select('*')
          .ilike('reference_no', cleanRef)
          .maybeSingle());

        if (!error && data) {
          const cloudAppointment: Appointment = {
            id: data.id,
            referenceNo: data.reference_no,
            patientName: data.patient_name,
            patientEmail: data.patient_email,
            patientPhone: data.patient_phone,
            age: data.age,
            gender: data.gender,
            serviceId: data.service_id,
            serviceTitle: data.service_title,
            appointmentDate: data.appointment_date,
            appointmentTime: data.appointment_time,
            reason: data.reason,
            symptoms: data.symptoms,
            symptomSummary: data.symptom_summary,
            status: data.status as AppointmentStatus,
            documentUrl: data.document_url,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          };

          // Cache in local storage for fast subsequent loads
          const localApts = getItem<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, []);
          if (!localApts.some(a => a.referenceNo === cloudAppointment.referenceNo)) {
            setItem(STORAGE_KEYS.APPOINTMENTS, [cloudAppointment, ...localApts]);
          }

          if (verificationFactor && verificationFactor.trim()) {
            const vClean = verificationFactor.toLowerCase().trim().replace(/[\s\-\+\(\)]/g, '');
            const emailMatch = cloudAppointment.patientEmail.toLowerCase().trim() === verificationFactor.toLowerCase().trim();
            const phoneClean = cloudAppointment.patientPhone.trim().replace(/[\s\-\+\(\)]/g, '');
            const phoneMatch = phoneClean.includes(vClean) || vClean.includes(phoneClean);
            if (!emailMatch && !phoneMatch) return null;
          }

          return cloudAppointment;
        }
      } catch (e) {
        console.warn('Direct Supabase appointment lookup failed, checking local store:', e);
      }
    }

    // 2. Fallback to Local Storage
    const appointments = await this.getAppointments();
    const match = appointments.find(a => a.referenceNo.toUpperCase().trim().replace(/\s+/g, '') === cleanRef);
    if (!match) return null;

    if (verificationFactor && verificationFactor.trim()) {
      const vClean = verificationFactor.toLowerCase().trim().replace(/[\s\-\+\(\)]/g, '');
      const emailMatch = match.patientEmail.toLowerCase().trim() === verificationFactor.toLowerCase().trim();
      const phoneClean = match.patientPhone.trim().replace(/[\s\-\+\(\)]/g, '');
      const phoneMatch = phoneClean.includes(vClean) || vClean.includes(phoneClean);
      if (!emailMatch && !phoneMatch) return null;
    }

    return match;
  }

  // --- PATIENT MESSAGES ---
  static async getMessages(): Promise<PatientMessage[]> {
    const localMsgs = getItem<PatientMessage[]>(STORAGE_KEYS.MESSAGES, []);
    let supabaseMsgs: PatientMessage[] = [];

    try {
      const { data, error } = await supabase.from('patient_messages').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        supabaseMsgs = data.map((m: any) => ({
          id: m.id,
          name: m.name,
          email: m.email,
          phone: m.phone,
          subject: m.subject,
          message: m.message,
          status: m.status,
          createdAt: m.created_at,
        }));
      }
    } catch (e) {
      console.warn('Supabase messages fetch failed:', e);
    }

    const mergedMap = new Map<string, PatientMessage>();
    localMsgs.forEach(m => mergedMap.set(m.id, m));
    supabaseMsgs.forEach(m => mergedMap.set(m.id, m));
    const mergedList = Array.from(mergedMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setItem(STORAGE_KEYS.MESSAGES, mergedList);
    return mergedList;
  }

  static async createMessage(input: Omit<PatientMessage, 'id' | 'status' | 'createdAt'>): Promise<PatientMessage> {
    const newMessage: PatientMessage = {
      ...input,
      id: `msg-${Date.now()}`,
      status: 'unread',
      createdAt: new Date().toISOString(),
    };
    const current = await this.getMessages();
    const updated = [newMessage, ...current];
    setItem(STORAGE_KEYS.MESSAGES, updated);

    // Save to Supabase
    try {
      await supabase.from('patient_messages').insert({
        name: newMessage.name,
        email: newMessage.email,
        phone: newMessage.phone,
        subject: newMessage.subject,
        message: newMessage.message,
        status: newMessage.status,
      });
    } catch (e) {
      console.warn('Supabase message insert error:', e);
    }

    return newMessage;
  }

  static async updateMessageStatus(id: string, status: PatientMessage['status']): Promise<PatientMessage[]> {
    const current = await this.getMessages();
    const updated = current.map(m => m.id === id ? { ...m, status } : m);
    setItem(STORAGE_KEYS.MESSAGES, updated);
    return updated;
  }

  // --- ANNOUNCEMENTS ---
  static async getAnnouncements(): Promise<Announcement[]> {
    return getItem<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
  }

  static async saveAnnouncement(ann: Partial<Announcement>): Promise<Announcement[]> {
    const current = await this.getAnnouncements();
    let updated: Announcement[];

    if (ann.id) {
      updated = current.map(a => a.id === ann.id ? { ...a, ...ann } as Announcement : a);
    } else {
      const newAnn: Announcement = {
        id: `ann-${Date.now()}`,
        title: ann.title || 'Announcement',
        message: ann.message || '',
        startDate: ann.startDate || new Date().toISOString().split('T')[0],
        expiryDate: ann.expiryDate || new Date(Date.now() + 30*86400000).toISOString().split('T')[0],
        isActive: ann.isActive ?? true,
      };
      updated = [newAnn, ...current];
    }
    setItem(STORAGE_KEYS.ANNOUNCEMENTS, updated);
    return updated;
  }

  // --- FAQS ---
  static async getFAQs(): Promise<FAQItem[]> {
    return getItem<FAQItem[]>(STORAGE_KEYS.FAQS, INITIAL_FAQS);
  }

  static async saveFAQ(faq: Partial<FAQItem>): Promise<FAQItem[]> {
    const current = await this.getFAQs();
    let updated: FAQItem[];
    if (faq.id) {
      updated = current.map(f => f.id === faq.id ? { ...f, ...faq } as FAQItem : f);
    } else {
      const newFaq: FAQItem = {
        id: `faq-${Date.now()}`,
        question: faq.question || '',
        answer: faq.answer || '',
        category: faq.category || 'general',
        keywords: faq.keywords || [],
        isActive: faq.isActive ?? true,
      };
      updated = [...current, newFaq];
    }
    setItem(STORAGE_KEYS.FAQS, updated);
    return updated;
  }

  // --- SITE CONTENT ---
  static async getSiteContent(): Promise<SiteContent> {
    return getItem<SiteContent>(STORAGE_KEYS.SITE_CONTENT, INITIAL_SITE_CONTENT);
  }

  static async updateSiteContent(content: Partial<SiteContent>): Promise<SiteContent> {
    const current = await this.getSiteContent();
    const updated = { ...current, ...content };
    setItem(STORAGE_KEYS.SITE_CONTENT, updated);
    return updated;
  }

  // --- SYMPTOM RULES ---
  static async getSymptomRules(): Promise<SymptomRule[]> {
    return getItem<SymptomRule[]>(STORAGE_KEYS.SYMPTOM_RULES, INITIAL_SYMPTOM_RULES);
  }

  static async saveSymptomRule(rule: Partial<SymptomRule>): Promise<SymptomRule[]> {
    const current = await this.getSymptomRules();
    let updated: SymptomRule[];
    if (rule.id) {
      updated = current.map(r => r.id === rule.id ? { ...r, ...rule } as SymptomRule : r);
    } else {
      const newRule: SymptomRule = {
        id: `rule-${Date.now()}`,
        conditionName: rule.conditionName || 'New Clinical Condition',
        category: rule.category || 'General',
        primarySymptoms: rule.primarySymptoms || [],
        secondarySymptoms: rule.secondarySymptoms || [],
        redFlags: rule.redFlags || [],
        urgencyLevel: rule.urgencyLevel || 'MODERATE',
        recommendedAction: rule.recommendedAction || 'Consult doctor',
        rationale: rule.rationale || '',
        isEnabled: rule.isEnabled ?? true,
      };
      updated = [...current, newRule];
    }
    setItem(STORAGE_KEYS.SYMPTOM_RULES, updated);
    return updated;
  }

  // --- AUDIT LOGGING ---
  static async logAudit(action: string, entity: string, entityId: string, actor: string, metadata?: Record<string, any>): Promise<void> {
    const logs = getItem<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, []);
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      action,
      entity,
      entityId,
      actor,
      metadata,
      createdAt: new Date().toISOString(),
    };
    setItem(STORAGE_KEYS.AUDIT_LOGS, [newLog, ...logs.slice(0, 99)]); // Keep last 100
  }

  static async getAuditLogs(): Promise<AuditLog[]> {
    return getItem<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, []);
  }
}
