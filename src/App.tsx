import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { EmergencyBanner } from './components/layout/EmergencyBanner';
import { SaadCareChatbot } from './components/chatbot/SaadCareChatbot';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { AppointmentBookingPage } from './pages/AppointmentBookingPage';
import { AppointmentConfirmationPage } from './pages/AppointmentConfirmationPage';
import { TrackAppointmentPage } from './pages/TrackAppointmentPage';
import { SymptomAssessmentPage } from './pages/SymptomAssessmentPage';
import { SymptomResultPage } from './pages/SymptomResultPage';
import { ContactPage } from './pages/ContactPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { DisclaimerPage } from './pages/DisclaimerPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Doctor Dashboard & Auth
import { DoctorLoginPage } from './pages/doctor/DoctorLoginPage';
import { DoctorDashboardPage } from './pages/doctor/DoctorDashboardPage';

const AppLayout: React.FC = () => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-medical-200 selection:text-medical-900">
      {!isDashboardRoute && <EmergencyBanner />}
      {!isDashboardRoute && <Navbar />}
      
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/book" element={<AppointmentBookingPage />} />
          <Route path="/appointment-confirmation/:ref" element={<AppointmentConfirmationPage />} />
          <Route path="/track-appointment" element={<TrackAppointmentPage />} />
          <Route path="/symptom-assessment" element={<SymptomAssessmentPage />} />
          <Route path="/symptom-result" element={<SymptomResultPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          
          {/* Doctor Portal Routes */}
          <Route path="/login" element={<DoctorLoginPage />} />
          <Route path="/dashboard" element={<DoctorDashboardPage />} />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {!isDashboardRoute && <SaadCareChatbot />}
      {!isDashboardRoute && <Footer />}
    </div>
  );
};

export function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
