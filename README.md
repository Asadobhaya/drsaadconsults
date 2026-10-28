# Dr. Muhammad Saad Obhaya Medical Clinic Web Application

A full-stack, production-quality medical clinic web application designed for **Dr. Muhammad Saad Obhaya** (MBBS, House Officer at Sir Ganga Ram Hospital, Lahore, Pakistan).

---

## 🌟 Key Features

1. **Light Medical Aesthetic**: Built with React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, and accessible design principles.
2. **Automated Symptom Assessment & Triage Engine**:
   - Rule-based clinical triage matching user inputs against verified medical rules.
   - Emergency Red-Flag detection (chest pain, stroke signs, dyspnea) immediately interrupting the workflow to direct patients to 1122 emergency care.
   - Printable Patient Symptom Summary PDF/Receipt.
   - Direct "Book Appointment using this Summary" button pre-filling booking fields.
3. **Appointment Scheduling System**:
   - Dynamic time-slot generator in Pakistan Standard Time (PST).
   - Double-booking prevention and date blocking (holidays/leaves).
   - Status tracking (`Pending`, `Confirmed`, `Rescheduled`, `Completed`, `Cancelled`, `No Show`).
   - `.ics` calendar invitation file download.
   - Secure reference lookup (`SAAD-2026-XXXXXX`).
4. **Doctor Dashboard & Live CMS ("Web3Page")**:
   - Secure Doctor Login (`drsaadobhaya@gmail.com`).
   - Overview metrics, today's schedule, pending requests.
   - Live CMS content editing (bio, phone, email, clinic address, announcements, FAQs, services, working hours).
   - Symptom rules review manager.
   - Patient contact messages inbox.
   - System audit logging.
5. **Patient Assistant Chatbot ("SaadCare Assistant")**:
   - Floating chat drawer with starter prompts.
   - Intelligent FAQ matching for administrative inquiries.
   - Strict medical disclaimers preventing pseudo-diagnosis.
6. **Zero-Cost First Deployment**:
   - Dual-mode data layer: Works immediately in browser demo/offline mode out-of-the-box.
   - Connects to Supabase PostgreSQL, Storage, RLS policies, and Resend email API when environment variables are supplied.

---

## 🏥 Doctor Profile Data

- **Doctor Name**: Dr. Muhammad Saad Obhaya
- **Qualification**: MBBS
- **Medical Education**: Tashkent State Medical Academy, Uzbekistan
- **Current Position**: House Officer, Sir Ganga Ram Hospital, Lahore, Pakistan
- **Phone**: +923096999200
- **Email**: drsaadobhaya@gmail.com

---

## 📂 Folder Structure

```
Dr Saad Project/
├── public/
│   └── favicon.svg
├── src/
│   ├── __tests__/               # Vitest unit tests (Symptom Engine & Slot Calc)
│   ├── components/
│   │   ├── chatbot/             # SaadCare Assistant Floating Chatbot
│   │   └── layout/              # Navbar, Footer, Emergency Banner
│   ├── data/
│   │   ├── initialContent.ts    # Seed data & CMS fallback
│   │   └── symptomRules.ts      # Clinical triage dataset & red flags
│   ├── features/
│   │   └── symptoms/            # Rule-based triage engine logic
│   ├── lib/
│   │   └── supabase.ts          # Supabase client & fallback detector
│   ├── pages/
│   │   ├── doctor/              # Doctor Auth & Control Dashboard
│   │   ├── AboutPage.tsx
│   │   ├── AppointmentBookingPage.tsx
│   │   ├── AppointmentConfirmationPage.tsx
│   │   ├── ContactPage.tsx
│   │   ├── DisclaimerPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── NotFoundPage.tsx
│   │   ├── PrivacyPage.tsx
│   │   ├── ResourcesPage.tsx
│   │   ├── ServicesPage.tsx
│   │   ├── SymptomAssessmentPage.tsx
│   │   ├── SymptomResultPage.tsx
│   │   └── TrackAppointmentPage.tsx
│   ├── services/
│   │   ├── dataService.ts       # Unified CRUD & appointment scheduling engine
│   │   └── emailService.ts      # Resend notification dispatcher
│   ├── types/
│   │   └── index.ts             # Domain type definitions
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql # Complete PostgreSQL schema & RLS policies
│   └── seed.sql                  # Initial database seed script
├── .env.example
├── package.json
├── README.md
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## ⚡ Quick Start (Local Development)

1. Clone or navigate to the repository directory:
   ```bash
   cd "Dr Saad Project"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run local development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. Run unit tests:
   ```bash
   npm run test
   ```

5. Build for production:
   ```bash
   npm run build
   ```

---

## 🔐 Doctor Portal Login Setup

- Navigate to `/login` or click the user icon in the top navigation bar.
- **Default Email**: `drsaadobhaya@gmail.com`
- **Demo Password**: `drsaad2026` (Works out-of-the-box in local demo mode).

---

## 🗄️ Supabase Setup (Database & Auth)

1. Create a free project on [Supabase](https://supabase.com).
2. Go to the SQL Editor in Supabase.
3. Run the contents of `supabase/migrations/001_initial_schema.sql` to create database tables and enable Row Level Security (RLS).
4. Run `supabase/seed.sql` to populate default doctor details, services, working hours, and FAQs.
5. Create a Doctor User under Supabase Auth with email `drsaadobhaya@gmail.com`.
6. Copy `Project URL` and `anon key` to your `.env` file:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

---

## ✉️ Resend Email Setup

1. Create a free account at [Resend](https://resend.com).
2. Generate an API Key.
3. Set `RESEND_API_KEY=re_123456789` in your environment variables.
4. When configured, appointment notifications will automatically dispatch emails to `drsaadobhaya@gmail.com` and the patient. If unconfigured, notifications log safely to the development console.

---

## 🚀 Cloudflare Pages Deployment

1. Push your repository to GitHub.
2. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com) -> **Workers & Pages**.
3. Click **Create Application** -> **Pages** -> **Connect to Git**.
4. Select your `dr-saad-obhaya-clinic` repository.
5. Build settings:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
6. Add Environment Variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `RESEND_API_KEY`).
7. Click **Save and Deploy**. Your site will be live on a free `.pages.dev` subdomain!

---

## 🛡️ Medical & Data Safety Standards

- **Informational Triage**: The symptom tool provides risk levels and educational questions; it does NOT diagnose patients.
- **Emergency Intercept**: Emergency symptoms (crushing chest pain, severe breathlessness, stroke signs) immediately interrupt the questionnaire with an emergency banner advising patients to call 1122.
- **Email Privacy**: Notification emails omit raw patient medical documents. Full details remain accessible only within the authenticated Doctor Dashboard.

---

## 📄 License & Ownership

Created as an official digital asset for **Dr. Muhammad Saad Obhaya**. All rights reserved.
