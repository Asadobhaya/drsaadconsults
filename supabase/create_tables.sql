-- ====================================================================
-- DR. MUHAMMAD SAAD OBHAYA CLINIC — SUPABASE DATABASE SETUP
-- Paste this entire script into your Supabase Dashboard:
-- SQL Editor -> New Query -> Paste -> Run (Ctrl+Enter)
-- ====================================================================

-- 1. Appointments Table (Enables Cross-Device Patient Booking & Tracking)
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_no TEXT UNIQUE NOT NULL,
  patient_name TEXT NOT NULL,
  patient_email TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  age INT NOT NULL DEFAULT 18,
  gender TEXT NOT NULL DEFAULT 'other',
  service_id TEXT,
  service_title TEXT DEFAULT 'General Consultation',
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  reason TEXT NOT NULL,
  symptoms TEXT,
  symptom_summary TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  document_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for instant lookup by Reference ID
CREATE INDEX IF NOT EXISTS idx_appointments_ref ON public.appointments (reference_no);
CREATE INDEX IF NOT EXISTS idx_appointments_date_time ON public.appointments (appointment_date, appointment_time);

-- Enable Row Level Security (RLS) for Appointments
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Allow anyone (public/patient) to book an appointment
DROP POLICY IF EXISTS "Anyone can create appointment" ON public.appointments;
CREATE POLICY "Anyone can create appointment" ON public.appointments 
  FOR INSERT WITH CHECK (true);

-- Allow anyone to track their appointment by Reference ID
DROP POLICY IF EXISTS "Anyone can track appointment" ON public.appointments;
CREATE POLICY "Anyone can track appointment" ON public.appointments 
  FOR SELECT USING (true);

-- Allow status updates
DROP POLICY IF EXISTS "Anyone can update appointment" ON public.appointments;
CREATE POLICY "Anyone can update appointment" ON public.appointments 
  FOR UPDATE USING (true);

-- 2. Doctor Profiles Table
CREATE TABLE IF NOT EXISTS public.doctor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Dr. Muhammad Saad Obhaya',
  qualification TEXT NOT NULL DEFAULT 'MBBS',
  medical_school TEXT NOT NULL DEFAULT 'Tashkent State Medical Academy, Uzbekistan',
  current_position TEXT NOT NULL DEFAULT 'Medical Doctor',
  current_hospital TEXT NOT NULL DEFAULT 'Sir Ganga Ram Hospital, Lahore, Pakistan',
  phone TEXT NOT NULL DEFAULT '+923396999200',
  email TEXT NOT NULL DEFAULT 'drsaadobhaya@gmail.com',
  clinic_address TEXT DEFAULT 'Sir Ganga Ram Hospital Road, Jubilee Town, Lahore, Pakistan',
  consultation_fee TEXT DEFAULT 'To be configured',
  clinic_timings TEXT DEFAULT 'Mon - Sun: 08:00 AM - 02:00 PM & 07:00 PM - 10:00 PM (PKT)',
  bio TEXT NOT NULL DEFAULT 'Graduated with MBBS from Tashkent State Medical Academy, Uzbekistan. Serving at Sir Ganga Ram Hospital, Lahore. Dedicated to patient-centered, evidence-based care.',
  avatar_url TEXT DEFAULT '/dr-saad.jpg',
  emergency_notice TEXT DEFAULT 'For severe chest pain, extreme breathlessness, sudden weakness, or trauma, please visit the nearest Emergency Department immediately.',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.doctor_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view doctor profile" ON public.doctor_profiles;
CREATE POLICY "Public can view doctor profile" ON public.doctor_profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public can update doctor profile" ON public.doctor_profiles;
CREATE POLICY "Public can update doctor profile" ON public.doctor_profiles FOR ALL USING (true);

-- 3. Medical Services Table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  duration_mins INT NOT NULL DEFAULT 30,
  fee TEXT NOT NULL DEFAULT 'To be configured',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view services" ON public.services;
CREATE POLICY "Public can view services" ON public.services FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public can manage services" ON public.services;
CREATE POLICY "Public can manage services" ON public.services FOR ALL USING (true);

-- 4. Patient Messages Table
CREATE TABLE IF NOT EXISTS public.patient_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.patient_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can send patient message" ON public.patient_messages;
CREATE POLICY "Anyone can send patient message" ON public.patient_messages FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Anyone can view patient messages" ON public.patient_messages;
CREATE POLICY "Anyone can view patient messages" ON public.patient_messages FOR SELECT USING (true);

-- 5. Seed Initial Doctor Profile if empty
INSERT INTO public.doctor_profiles (name, qualification, clinic_timings)
SELECT 'Dr. Muhammad Saad Obhaya', 'MBBS', 'Mon - Sun: 08:00 AM - 02:00 PM & 07:00 PM - 10:00 PM (PKT)'
WHERE NOT EXISTS (SELECT 1 FROM public.doctor_profiles);
