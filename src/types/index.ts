export type Role = 'doctor' | 'patient' | 'admin';

export type AppointmentStatus = 'pending' | 'confirmed' | 'rescheduled' | 'completed' | 'cancelled' | 'no_show';

export type UrgencyLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'EMERGENCY';

export interface DoctorProfile {
  id: string;
  name: string;
  qualification: string;
  medicalSchool: string;
  currentPosition: string;
  currentHospital: string;
  phone: string;
  email: string;
  clinicAddress: string;
  consultationFee: string;
  clinicTimings: string;
  bio: string;
  avatarUrl: string;
  emergencyNotice: string;
}

export interface MedicalService {
  id: string;
  title: string;
  description: string;
  durationMins: number;
  fee: string;
  isActive: boolean;
}

export interface AvailabilityShift {
  name: string;
  startTime: string; // HH:mm format
  endTime: string;   // HH:mm format
}

export interface AvailabilitySlot {
  id: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  dayName: string;
  startTime: string; // HH:mm format
  endTime: string;   // HH:mm format
  slotDurationMins: number;
  bufferMins: number;
  isEnabled: boolean;
  shifts?: AvailabilityShift[];
}

export interface BlockedDate {
  id: string;
  date: string; // YYYY-MM-DD
  reason: string;
}

export interface Appointment {
  id: string;
  referenceNo: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  age: number;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  serviceId: string;
  serviceTitle?: string;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // HH:mm
  reason: string;
  symptoms?: string;
  symptomSummary?: string;
  status: AppointmentStatus;
  documentUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  createdAt: string;
}

export interface SymptomRule {
  id: string;
  conditionName: string;
  category: string;
  primarySymptoms: string[];
  secondarySymptoms: string[];
  redFlags: string[];
  urgencyLevel: UrgencyLevel;
  recommendedAction: string;
  rationale: string;
  isEnabled: boolean;
}

export interface SymptomAssessmentInput {
  age: number;
  gender: 'male' | 'female' | 'other';
  primaryConcern: string;
  symptoms: string[];
  duration: string;
  severity: 'mild' | 'moderate' | 'severe';
  onset: 'sudden' | 'gradual';
  existingConditions?: string;
  medications?: string;
  allergies?: string;
}

export interface SymptomAssessmentResult {
  id: string;
  input: SymptomAssessmentInput;
  urgencyLevel: UrgencyLevel;
  isEmergency: boolean;
  emergencyReason?: string;
  possibleConditions: {
    name: string;
    likelihood: 'Common possibility' | 'Possible' | 'Less likely';
    rationale: string;
  }[];
  redFlagsDetected: string[];
  recommendedAction: string;
  questionsForDoctor: string[];
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  startDate: string;
  expiryDate: string;
  isActive: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'booking' | 'consultation' | 'reports' | 'emergency';
  keywords: string[];
  isActive: boolean;
}

export interface SiteContent {
  doctorBio: string;
  heroHeadline: string;
  heroSubheading: string;
  clinicAddress: string;
  consultationFee: string;
  visitingHours: string;
  emergencyNotice: string;
  whatsappEnabled: boolean;
  symptomEngineEnabled: boolean;
  maintenanceMode: boolean;
}

export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  actor: string;
  metadata?: Record<string, any>;
  createdAt: string;
}
