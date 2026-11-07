import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface MetaConfig {
  title: string;
  description: string;
}

const ROUTE_META: Record<string, MetaConfig> = {
  '/': {
    title: 'Dr. Muhammad Saad Obhaya — MBBS | Sir Ganga Ram Hospital, Lahore',
    description: 'Official portal of Dr. Muhammad Saad Obhaya. Schedule appointments, check clinical working hours, and evaluate symptoms with medical triage guidance.',
  },
  '/about': {
    title: 'About Dr. Muhammad Saad Obhaya | Medical Credentials & Background',
    description: 'Learn about Dr. Muhammad Saad Obhaya, MBBS graduate from Tashkent State Medical Academy, currently serving at Sir Ganga Ram Hospital, Lahore.',
  },
  '/services': {
    title: 'Medical Services & Areas of Care | Dr. Muhammad Saad Obhaya',
    description: 'Explore consultation services offered by Dr. Muhammad Saad Obhaya including physical assessment, preventive medicine, and clinical evaluations.',
  },
  '/book': {
    title: 'Book an Appointment | Dr. Muhammad Saad Obhaya (PKT Schedule)',
    description: 'Reserve an in-person or online consultation slot with Dr. Muhammad Saad Obhaya during daily morning (8 AM - 2 PM) or evening (7 PM - 10 PM) shifts.',
  },
  '/track-appointment': {
    title: 'Track Your Appointment Status | Dr. Saad Obhaya Clinic',
    description: 'Verify and view real-time confirmation status for your scheduled consultation using your Reference ID and contact details.',
  },
  '/symptom-assessment': {
    title: 'Automated Symptom Assessment & Clinical Triage | Dr. Saad Clinic',
    description: 'Evaluate your symptom urgency using rule-based triage protocols before scheduling your medical consultation.',
  },
  '/contact': {
    title: 'Contact Dr. Muhammad Saad Obhaya | Sir Ganga Ram Hospital',
    description: 'Get clinic directions, telephone helpline details (+92 339 6999200), and send direct patient inquiries to Dr. Saad Obhaya.',
  },
  '/resources': {
    title: 'Patient Health Resources & Guidance | Dr. Saad Clinic',
    description: 'Read evidence-based patient guides, appointment instructions, lifestyle wellness recommendations, and FAQs.',
  },
  '/privacy': {
    title: 'Patient Privacy Policy & HIPAA/Data Protection Notice',
    description: 'Our commitment to strict medical confidentiality, encrypted record handling, and patient rights.',
  },
  '/terms': {
    title: 'Terms of Service & Clinical Care Policies | Dr. Saad Clinic',
    description: 'Review clinic consultation terms, cancellation policies, telemedicine disclaimers, and patient responsibilities.',
  },
  '/disclaimer': {
    title: 'Medical Disclaimer & Emergency Care Notice | Dr. Saad Clinic',
    description: 'Essential information regarding online health guidance, emergency red-flags, and professional medical evaluations.',
  },
  '/login': {
    title: 'Doctor Portal Secure Sign In | Dr. Muhammad Saad Obhaya',
    description: 'Authorized medical staff access for clinical schedule management, appointment triage, and patient inquiries.',
  },
  '/dashboard': {
    title: 'Clinical Management Dashboard | Dr. Muhammad Saad Obhaya',
    description: 'Doctor control center for reviewing appointments, clinical triage rules, and patient communications.',
  },
};

export const usePageMeta = () => {
  const location = useLocation();

  useEffect(() => {
    // Match exact path or dynamic prefixes
    const pathname = location.pathname;
    let meta = ROUTE_META[pathname];

    if (!meta) {
      if (pathname.startsWith('/appointment-confirmation')) {
        meta = {
          title: 'Appointment Confirmed | Dr. Muhammad Saad Obhaya',
          description: 'Your medical appointment details, reference confirmation, and downloadable calendar schedule.',
        };
      } else if (pathname.startsWith('/symptom-result')) {
        meta = {
          title: 'Symptom Triage Results | Dr. Muhammad Saad Obhaya',
          description: 'Summary of clinical triage assessment and recommended medical care urgency level.',
        };
      } else {
        meta = {
          title: 'Page Not Found (404) | Dr. Muhammad Saad Obhaya Clinic',
          description: 'The requested medical clinic page could not be located.',
        };
      }
    }

    // Set Document Title
    document.title = meta.title;

    // Update Meta Description
    let descElem = document.querySelector('meta[name="description"]');
    if (!descElem) {
      descElem = document.createElement('meta');
      descElem.setAttribute('name', 'description');
      document.head.appendChild(descElem);
    }
    descElem.setAttribute('content', meta.description);

    // Update OpenGraph Title & Description
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', meta.title);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', meta.description);

  }, [location.pathname]);
};
