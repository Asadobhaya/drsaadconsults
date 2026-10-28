import { DoctorProfile, MedicalService, AvailabilitySlot, Announcement, FAQItem, SiteContent } from '../types';

export const INITIAL_DOCTOR_PROFILE: DoctorProfile = {
  id: 'doc-saad-001',
  name: 'Dr. Muhammad Saad Obhaya',
  qualification: 'MBBS',
  medicalSchool: 'Tashkent State Medical Academy, Uzbekistan',
  currentPosition: 'Medical Doctor',
  currentHospital: 'Sir Ganga Ram Hospital, Lahore, Pakistan',
  phone: '+923396999200',
  email: 'drsaadobhaya@gmail.com',
  clinicAddress: 'Sir Ganga Ram Hospital Road, Jubilee Town, Lahore, Pakistan (Detail to be updated)',
  consultationFee: 'To be configured',
  clinicTimings: 'Mon - Sun: 08:00 AM - 02:00 PM & 07:00 PM - 10:00 PM (PKT)',
  bio: 'Graduated with an MBBS degree from Tashkent State Medical Academy, Uzbekistan. Serving at Sir Ganga Ram Hospital, Lahore. Committed to providing empathetic, evidence-based physical evaluation, symptom triage, and patient-centered healthcare guidance.',
  avatarUrl: '/dr-saad.jpg',
  emergencyNotice: 'For severe chest pain, sudden difficulty breathing, paralysis, or profuse bleeding, do NOT delay. Seek immediate emergency care at the nearest hospital.',
};

export const INITIAL_SERVICES: MedicalService[] = [
  {
    id: 'srv-1',
    title: 'General Medical Consultation',
    description: 'Comprehensive initial evaluation of general physical health concerns, clinical review, and patient guidance.',
    durationMins: 30,
    fee: 'To be configured',
    isActive: true,
  },
  {
    id: 'srv-2',
    title: 'Initial Symptom Assessment',
    description: 'Structured clinical discussion for new or acute symptoms to clarify urgency, potential causes, and next steps.',
    durationMins: 25,
    fee: 'To be configured',
    isActive: true,
  },
  {
    id: 'srv-3',
    title: 'Follow-Up Consultation',
    description: 'Review of ongoing recovery, lab test results, or symptom progress following a prior consultation.',
    durationMins: 20,
    fee: 'To be configured',
    isActive: true,
  },
  {
    id: 'srv-4',
    title: 'Preventive Health Guidance',
    description: 'Personalized evidence-based advice regarding lifestyle risk factors, routine health screenings, and wellness.',
    durationMins: 30,
    fee: 'To be configured',
    isActive: true,
  },
  {
    id: 'srv-5',
    title: 'Medication & Therapy Discussion',
    description: 'Review of current prescribed medications, proper usage schedules, side effect management, and adherence.',
    durationMins: 20,
    fee: 'To be configured',
    isActive: true,
  },
  {
    id: 'srv-6',
    title: 'Specialist Referral Guidance',
    description: 'Evaluation to advise whether sub-specialty consultation (Cardiology, Neurology, Surgery, etc.) is indicated.',
    durationMins: 20,
    fee: 'To be configured',
    isActive: true,
  },
];

const DEFAULT_SHIFTS = [
  { name: 'Morning Shift', startTime: '08:00', endTime: '14:00' },
  { name: 'Evening Shift', startTime: '19:00', endTime: '22:00' },
];

export const INITIAL_AVAILABILITY: AvailabilitySlot[] = [
  { id: 'av-1', dayOfWeek: 1, dayName: 'Monday', startTime: '08:00', endTime: '22:00', slotDurationMins: 30, bufferMins: 0, isEnabled: true, shifts: DEFAULT_SHIFTS },
  { id: 'av-2', dayOfWeek: 2, dayName: 'Tuesday', startTime: '08:00', endTime: '22:00', slotDurationMins: 30, bufferMins: 0, isEnabled: true, shifts: DEFAULT_SHIFTS },
  { id: 'av-3', dayOfWeek: 3, dayName: 'Wednesday', startTime: '08:00', endTime: '22:00', slotDurationMins: 30, bufferMins: 0, isEnabled: true, shifts: DEFAULT_SHIFTS },
  { id: 'av-4', dayOfWeek: 4, dayName: 'Thursday', startTime: '08:00', endTime: '22:00', slotDurationMins: 30, bufferMins: 0, isEnabled: true, shifts: DEFAULT_SHIFTS },
  { id: 'av-5', dayOfWeek: 5, dayName: 'Friday', startTime: '08:00', endTime: '22:00', slotDurationMins: 30, bufferMins: 0, isEnabled: true, shifts: DEFAULT_SHIFTS },
  { id: 'av-6', dayOfWeek: 6, dayName: 'Saturday', startTime: '08:00', endTime: '22:00', slotDurationMins: 30, bufferMins: 0, isEnabled: true, shifts: DEFAULT_SHIFTS },
  { id: 'av-0', dayOfWeek: 0, dayName: 'Sunday', startTime: '08:00', endTime: '22:00', slotDurationMins: 30, bufferMins: 0, isEnabled: true, shifts: DEFAULT_SHIFTS },
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Online Medical Portal Launched',
    message: 'Patients can now schedule appointments, run automated symptom assessments, and access health guidance directly on this portal.',
    startDate: '2026-08-01',
    expiryDate: '2026-12-31',
    isActive: true,
  },
];

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How do I schedule an appointment with Dr. Saad Obhaya?',
    answer: 'Select your desired service, date, and preferred time slot on our Appointment Booking page, then submit your details. A booking reference number will be generated immediately.',
    category: 'booking',
    keywords: ['book', 'appointment', 'schedule', 'time', 'slot'],
    isActive: true,
  },
  {
    id: 'faq-2',
    question: 'Where is Dr. Saad currently practicing?',
    answer: 'Dr. Muhammad Saad Obhaya is currently serving at Sir Ganga Ram Hospital, Lahore, Pakistan.',
    category: 'general',
    keywords: ['hospital', 'ganga ram', 'lahore', 'location', 'where', 'practice'],
    isActive: true,
  },
  {
    id: 'faq-3',
    question: 'What are the regular consultation timings?',
    answer: 'Regular online consultation availability is Monday through Sunday: Morning Shift from 8:00 AM to 2:00 PM and Evening Shift from 7:00 PM to 10:00 PM (Pakistan Standard Time). Patients can choose any convenient time slot during these hours.',
    category: 'consultation',
    keywords: ['hours', 'timings', 'open', 'schedule', 'time', 'slots'],
    isActive: true,
  },
  {
    id: 'faq-4',
    question: 'Can I upload prior laboratory reports or prescriptions?',
    answer: 'Yes. During the appointment booking flow, you can optionally attach relevant PDF or image files (lab results, imaging, previous discharge summaries) for Dr. Saad to review.',
    category: 'reports',
    keywords: ['report', 'upload', 'pdf', 'prescription', 'file', 'attachment'],
    isActive: true,
  },
  {
    id: 'faq-5',
    question: 'Does the Symptom Assessment tool replace an in-person medical examination?',
    answer: 'No. The Symptom Assessment tool is an educational triage engine intended to help you evaluate symptom urgency and organize questions for your doctor. It does NOT provide a final medical diagnosis.',
    category: 'general',
    keywords: ['symptom', 'assessment', 'triage', 'diagnosis', 'ai', 'tool'],
    isActive: true,
  },
  {
    id: 'faq-6',
    question: 'What should I do if I am experiencing an emergency?',
    answer: 'If you experience red-flag emergency symptoms (crushing chest pain, severe breathlessness, weakness on one side of the body, loss of consciousness, or uncontrollable bleeding), call emergency services or go directly to the nearest hospital Emergency Room.',
    category: 'emergency',
    keywords: ['emergency', 'urgent', 'chest pain', 'breathing', 'stroke', 'hospital', 'danger'],
    isActive: true,
  },
];

export const INITIAL_SITE_CONTENT: SiteContent = {
  doctorBio: INITIAL_DOCTOR_PROFILE.bio,
  heroHeadline: 'Compassionate Care. Evidence-Based Medicine.',
  heroSubheading: 'Professional medical evaluation focused on attentive listening, structured assessment, and patient-centered clinical guidance.',
  clinicAddress: INITIAL_DOCTOR_PROFILE.clinicAddress,
  consultationFee: INITIAL_DOCTOR_PROFILE.consultationFee,
  visitingHours: INITIAL_DOCTOR_PROFILE.clinicTimings,
  emergencyNotice: INITIAL_DOCTOR_PROFILE.emergencyNotice,
  whatsappEnabled: true,
  symptomEngineEnabled: true,
  maintenanceMode: false,
};
