-- Seed Data for Dr. Muhammad Saad Obhaya Medical Clinic

-- 1. Doctor Profile
INSERT INTO public.doctor_profiles (
  id, name, qualification, medical_school, current_position, current_hospital, phone, email, clinic_address, consultation_fee, clinic_timings, bio
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Dr. Muhammad Saad Obhaya',
  'MBBS',
  'Tashkent State Medical Academy, Uzbekistan',
  'Medical Doctor',
  'Sir Ganga Ram Hospital, Lahore, Pakistan',
  '+923396999200',
  'drsaadobhaya@gmail.com',
  'Sir Ganga Ram Hospital Road, Lahore, Pakistan (Location placeholder)',
  'To be configured',
  'Mon - Sat: 04:00 PM - 08:00 PM (PST)',
  'Graduated with MBBS from Tashkent State Medical Academy, Uzbekistan. Serving at Sir Ganga Ram Hospital, Lahore. Committed to compassionate, evidence-based patient evaluation and clinical guidance.'
) ON CONFLICT (id) DO NOTHING;

-- 2. Generic Medical Services
INSERT INTO public.services (id, title, description, duration_mins, fee, is_active) VALUES
  ('11111111-1111-1111-1111-111111111111', 'General Medical Consultation', 'Comprehensive physical evaluation, symptom discussion, and initial medical guidance.', 30, 'To be configured', true),
  ('22222222-2222-2222-2222-222222222222', 'Initial Symptom Assessment', 'Detailed evaluation of acute or chronic complaints to determine urgency and appropriate next steps.', 25, 'To be configured', true),
  ('33333333-3333-3333-3333-333333333333', 'Follow-Up Consultation', 'Review of ongoing treatment response, lab findings, or recovery progress.', 20, 'To be configured', true),
  ('44444444-4444-4444-4444-444444444444', 'Preventive Health Guidance', 'Personalized advice on lifestyle, diet, screening tests, and disease prevention.', 30, 'To be configured', true),
  ('55555555-5555-5555-5555-555555555555', 'Medication & Therapy Review', 'Detailed discussion of current medications, dosage schedules, potential side effects, and adjustments.', 20, 'To be configured', true),
  ('66666666-6666-6666-6666-666666666666', 'Specialist Referral Guidance', 'Evaluation to advise on whether specialist care (Cardiology, Neurology, General Surgery, etc.) is recommended.', 20, 'To be configured', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Availability Schedule (Mon - Sat: 4 PM - 8 PM PST)
INSERT INTO public.availability (day_of_week, day_name, start_time, end_time, slot_duration_mins, buffer_mins, is_enabled) VALUES
  (1, 'Monday', '16:00', '20:00', 30, 10, true),
  (2, 'Tuesday', '16:00', '20:00', 30, 10, true),
  (3, 'Wednesday', '16:00', '20:00', 30, 10, true),
  (4, 'Thursday', '16:00', '20:00', 30, 10, true),
  (5, 'Friday', '16:00', '20:00', 30, 10, true),
  (6, 'Saturday', '16:00', '20:00', 30, 10, true),
  (0, 'Sunday', '16:00', '20:00', 30, 10, false);

-- 4. Initial Active Announcement
INSERT INTO public.announcements (id, title, message, start_date, expiry_date, is_active) VALUES (
  'a1b2c3d4-0000-0000-0000-000000000001',
  'Welcome to Dr. Saad Obhaya Online Medical Portal',
  'Patients can now schedule consultations, utilize the automated symptom assessment tool, and access healthcare guidance online.',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '90 days',
  true
) ON CONFLICT (id) DO NOTHING;

-- 5. Standard Verified FAQs
INSERT INTO public.faqs (id, question, answer, category, keywords, sort_order, is_active) VALUES
  ('f1111111-0000-0000-0000-000000000001', 'How do I book an appointment with Dr. Saad?', 'You can book an appointment directly through our online booking page by selecting a service, choosing an available date and time slot, and submitting your details.', 'booking', ARRAY['book', 'appointment', 'schedule', 'timing'], 1, true),
  ('f2222222-0000-0000-0000-000000000002', 'Where is Dr. Saad currently practicing?', 'Dr. Muhammad Saad Obhaya is currently serving as a House Officer at Sir Ganga Ram Hospital in Lahore, Pakistan.', 'general', ARRAY['location', 'hospital', 'ganga ram', 'lahore', 'where'], 2, true),
  ('f3333333-0000-0000-0000-000000000003', 'What are the consultation hours?', 'Regular online consultation hours are Monday through Saturday, from 4:00 PM to 8:00 PM (Pakistan Standard Time). Exact availability can be checked on the booking page.', 'consultation', ARRAY['hours', 'timing', 'schedule', 'open'], 3, true),
  ('f4444444-0000-0000-0000-000000000004', 'What documents should I bring or upload for my consultation?', 'Please bring or upload any recent laboratory reports, previous prescriptions, hospital discharge summaries, or imaging reports related to your current health concern.', 'reports', ARRAY['documents', 'reports', 'prescription', 'upload', 'lab'], 4, true),
  ('f5555555-0000-0000-0000-000000000005', 'Does the online Symptom Assessment tool provide a final diagnosis?', 'No. The Symptom Assessment tool is an educational triage assistant designed to categorize symptom urgency and suggest questions for your doctor. It does NOT provide a confirmed medical diagnosis.', 'general', ARRAY['symptom', 'ai', 'diagnosis', 'triage', 'tool'], 5, true),
  ('f6666666-0000-0000-0000-000000000006', 'What should I do in a medical emergency?', 'If you are experiencing severe chest pain, extreme difficulty breathing, stroke symptoms (facial weakness, arm numbness, speech difficulty), severe bleeding, or trauma, do NOT wait for an online appointment. Proceed immediately to the nearest hospital Emergency Department.', 'emergency', ARRAY['emergency', 'urgent', 'chest pain', 'breathing', 'stroke', 'danger'], 6, true);
