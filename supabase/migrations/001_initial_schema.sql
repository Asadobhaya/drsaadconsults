-- Dr. Muhammad Saad Obhaya Medical Clinic — Database Schema & RLS Policies
-- Postgres migration for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Doctor / Staff / Patients)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'patient' CHECK (role IN ('doctor', 'patient', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Doctor Profiles Table
CREATE TABLE IF NOT EXISTS public.doctor_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Dr. Muhammad Saad Obhaya',
  qualification TEXT NOT NULL DEFAULT 'MBBS',
  medical_school TEXT NOT NULL DEFAULT 'Tashkent State Medical Academy, Uzbekistan',
  current_position TEXT NOT NULL DEFAULT 'Medical Doctor',
  current_hospital TEXT NOT NULL DEFAULT 'Sir Ganga Ram Hospital, Lahore, Pakistan',
  phone TEXT NOT NULL DEFAULT '+923396999200',
  email TEXT NOT NULL DEFAULT 'drsaadobhaya@gmail.com',
  clinic_address TEXT DEFAULT 'Sir Ganga Ram Hospital Road, Jubilee Town, Lahore, Pakistan (Detail to be updated)',
  consultation_fee TEXT DEFAULT 'To be configured',
  clinic_timings TEXT DEFAULT 'Mon - Sun: 08:00 AM - 02:00 PM & 07:00 PM - 10:00 PM (PKT)',
  bio TEXT NOT NULL DEFAULT 'Graduated with MBBS from Tashkent State Medical Academy, Uzbekistan. Serving at Sir Ganga Ram Hospital, Lahore. Dedicated to patient-centered, evidence-based care.',
  avatar_url TEXT DEFAULT '',
  emergency_notice TEXT DEFAULT 'For severe chest pain, extreme breathlessness, sudden weakness, or trauma, please visit the nearest Emergency Department immediately.',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Medical Services Table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  duration_mins INT NOT NULL DEFAULT 30,
  fee TEXT NOT NULL DEFAULT 'To be configured',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Availability Schedule Table
CREATE TABLE IF NOT EXISTS public.availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  day_name TEXT NOT NULL,
  start_time TIME NOT NULL DEFAULT '16:00',
  end_time TIME NOT NULL DEFAULT '20:00',
  slot_duration_mins INT NOT NULL DEFAULT 30,
  buffer_mins INT NOT NULL DEFAULT 10,
  is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Blocked Dates Table
CREATE TABLE IF NOT EXISTS public.blocked_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE UNIQUE NOT NULL,
  reason TEXT DEFAULT 'Unavailable',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Appointments Table
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_no TEXT UNIQUE NOT NULL,
  patient_name TEXT NOT NULL,
  patient_email TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  age INT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  service_title TEXT,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  reason TEXT NOT NULL,
  symptoms TEXT,
  symptom_summary TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rescheduled', 'completed', 'cancelled', 'no_show')),
  document_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for query speed
CREATE INDEX IF NOT EXISTS idx_appointments_slot_date 
ON public.appointments (appointment_date, appointment_time);

-- 7. Patient Contact Messages
CREATE TABLE IF NOT EXISTS public.patient_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Symptom Assessment Rules
CREATE TABLE IF NOT EXISTS public.symptom_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  condition_name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  primary_symptoms TEXT[] NOT NULL DEFAULT '{}',
  secondary_symptoms TEXT[] NOT NULL DEFAULT '{}',
  red_flags TEXT[] NOT NULL DEFAULT '{}',
  urgency_level TEXT NOT NULL CHECK (urgency_level IN ('LOW', 'MODERATE', 'HIGH', 'EMERGENCY')),
  recommended_action TEXT NOT NULL,
  rationale TEXT NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Announcements
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expiry_date DATE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. FAQs
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  keywords TEXT[] NOT NULL DEFAULT '{}',
  sort_order INT DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Site Settings / CMS Content
CREATE TABLE IF NOT EXISTS public.site_content (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  actor TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

----------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
----------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptom_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES
CREATE POLICY "Public read active services" ON public.services FOR SELECT USING (is_active = true);
CREATE POLICY "Public read availability" ON public.availability FOR SELECT USING (is_enabled = true);
CREATE POLICY "Public read blocked dates" ON public.blocked_dates FOR SELECT USING (true);
CREATE POLICY "Public read announcements" ON public.announcements FOR SELECT USING (is_active = true);
CREATE POLICY "Public read FAQs" ON public.faqs FOR SELECT USING (is_active = true);
CREATE POLICY "Public read site content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Public read doctor profile" ON public.doctor_profiles FOR SELECT USING (true);

-- PUBLIC APPOINTMENT SUBMISSION POLICY (Patients can insert appointments)
CREATE POLICY "Patients can insert appointment" ON public.appointments FOR INSERT WITH CHECK (true);

-- PUBLIC APPOINTMENT TRACKING POLICY (Patients can query using reference_no)
CREATE POLICY "Patients view own appointment by ref" ON public.appointments FOR SELECT USING (true);

-- PUBLIC CONTACT MESSAGE SUBMISSION
CREATE POLICY "Patients can insert message" ON public.patient_messages FOR INSERT WITH CHECK (true);

-- DOCTOR FULL ACCESS POLICIES (AUTHENTICATED DOCTOR ROLE HAS FULL CRUD)
CREATE POLICY "Doctor full access appointments" ON public.appointments FOR ALL USING (
  auth.role() = 'authenticated'
);

CREATE POLICY "Doctor full access messages" ON public.patient_messages FOR ALL USING (
  auth.role() = 'authenticated'
);

CREATE POLICY "Doctor full access services" ON public.services FOR ALL USING (
  auth.role() = 'authenticated'
);

CREATE POLICY "Doctor full access availability" ON public.availability FOR ALL USING (
  auth.role() = 'authenticated'
);

CREATE POLICY "Doctor full access blocked_dates" ON public.blocked_dates FOR ALL USING (
  auth.role() = 'authenticated'
);

CREATE POLICY "Doctor full access symptom_rules" ON public.symptom_rules FOR ALL USING (
  auth.role() = 'authenticated'
);

CREATE POLICY "Doctor full access announcements" ON public.announcements FOR ALL USING (
  auth.role() = 'authenticated'
);

CREATE POLICY "Doctor full access faqs" ON public.faqs FOR ALL USING (
  auth.role() = 'authenticated'
);

CREATE POLICY "Doctor full access site_content" ON public.site_content FOR ALL USING (
  auth.role() = 'authenticated'
);

CREATE POLICY "Doctor full access doctor_profiles" ON public.doctor_profiles FOR ALL USING (
  auth.role() = 'authenticated'
);

CREATE POLICY "Doctor full access audit_logs" ON public.audit_logs FOR ALL USING (
  auth.role() = 'authenticated'
);
